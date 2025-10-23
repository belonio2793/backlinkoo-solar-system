import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X } from "lucide-react";
import { getErrorMessage } from '@/utils/errorFormatter';
import { calculateBalance } from '@/utils/creditsCalculation';

interface CampaignFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CampaignForm = ({ onSuccess, onCancel }: CampaignFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    targetUrls: [""],
    keywords: [""],
    linksRequested: 5
  });
  const { toast } = useToast();

  const normalizeUrl = (url: string): string => {
    let normalized = url.trim();
    
    // If it doesn't start with http:// or https://, add https://
    if (!normalized.match(/^https?:\/\//)) {
      // Remove www. if it's at the beginning
      if (normalized.startsWith('www.')) {
        normalized = normalized.substring(4);
      }
      normalized = `https://${normalized}`;
    }
    
    return normalized;
  };

  const addTargetUrl = () => {
    if (formData.targetUrls.length < 10) {
      setFormData({ ...formData, targetUrls: [...formData.targetUrls, ""] });
    }
  };

  const removeTargetUrl = (index: number) => {
    const newUrls = formData.targetUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, targetUrls: newUrls });
  };

  const updateTargetUrl = (index: number, value: string) => {
    const newUrls = [...formData.targetUrls];
    newUrls[index] = value;
    setFormData({ ...formData, targetUrls: newUrls });
  };

  const addKeyword = () => {
    if (formData.keywords.length < 5) {
      setFormData({ ...formData, keywords: [...formData.keywords, ""] });
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData({ ...formData, keywords: newKeywords });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({ ...formData, keywords: newKeywords });
  };

  const withTimeout = async <T,>(p: Promise<T>, ms = 45000): Promise<T> => {
    return Promise.race([
      p,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms))
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user }, error: authError } = await withTimeout(supabase.auth.getUser(), 45000);
      if (authError || !user) {
        throw new Error("Please log in to create a campaign");
      }

      // Validate and normalize URLs
      const validUrls = formData.targetUrls
        .filter(url => url.trim())
        .map(url => normalizeUrl(url));

      if (validUrls.length === 0) {
        throw new Error("Please provide at least one target URL");
      }

      // Filter out empty keywords
      const keywordsArray = formData.keywords
        .map(k => k.trim())
        .filter(k => k.length > 0);
      const safeKeywords = keywordsArray.length ? keywordsArray : [];

      // Try Edge Function first (fast, atomic). Fallback to direct DB ops if the function is unreachable.
      let createdCount = 0;
      let edgeInvocationFailed = false;
      try {
        const { data, error } = await supabase.functions.invoke('create-campaigns', {
          body: {
            targetUrls: validUrls,
            keywords: safeKeywords,
            linksRequested: formData.linksRequested
          }
        });
        if (error) {
          edgeInvocationFailed = true;
          // Only fallback on transport/invoke errors
          if (!/Failed to send a request|Not Found|404|ECONN|ENOTFOUND/i.test(String(error.message || error))) {
            throw error;
          }
        } else if ((data as any)?.error) {
          // Application-level error from function (e.g., insufficient credits) -> surface it
          throw new Error((data as any).error);
        } else {
          createdCount = Number((data as any)?.created ?? validUrls.length);
        }
      } catch (edgeErr) {
        if (!edgeInvocationFailed) {
          // Real error from function; rethrow (don’t fallback)
          throw edgeErr;
        }
      }

      if (edgeInvocationFailed) {
        // Fallback path: validate credits, batch insert campaigns, deduct credits, record transaction
        const totalNeeded = formData.linksRequested * validUrls.length;
        const { data: creditsData, error: creditsError } = await withTimeout(
          supabase
            .from('credits')
            .select('amount, bonus, total_used')
            .eq('user_id', user.id)
            .single(),
          45000
        );
        if (creditsError) throw new Error('Error checking credits');
        const available = calculateBalance(creditsData as any);
        if (available < totalNeeded) {
          throw new Error(`Insufficient credits. Need ${totalNeeded}, available ${available}`);
        }

        const nowIso = new Date().toISOString();
        const rows = validUrls.map(url => ({
          user_id: user.id,
          name: `Campaign for ${url}`,
          target_url: url,
          keywords: safeKeywords,
          links_requested: formData.linksRequested,
          credits_used: formData.linksRequested,
          created_at: nowIso
        }));

        const { data: inserted, error: insErr } = await withTimeout(
          supabase.from('campaigns').insert(rows).select('id'),
          45000
        );
        if (insErr) throw insErr;
        createdCount = inserted?.length || 0;

        const { data: curr } = await withTimeout(
          supabase.from('credits').select('amount, bonus, total_used').eq('user_id', user.id).single(),
          45000
        );
        const newAmount = Math.max(0, Number(curr?.amount || 0) - totalNeeded);
        const newTotalUsed = Number(curr?.total_used || 0) + totalNeeded;
        const { error: updErr } = await supabase
          .from('credits')
          .update({ amount: newAmount, total_used: newTotalUsed, updated_at: nowIso })
          .eq('user_id', user.id);
        if (updErr) throw updErr;

        await withTimeout(
          supabase.from('credit_transactions').insert({
            user_id: user.id,
            amount: -totalNeeded,
            type: 'campaign_creation',
            description: `Campaigns for ${validUrls.length} URL(s)`,
            created_at: nowIso
          }),
          45000
        );
      }

      try { window.dispatchEvent(new Event('credits:changed')); } catch {}

      toast({
        title: "Campaign(s) Created",
        description: `${createdCount} campaign(s) created successfully.`,
      });

      setFormData({
        targetUrls: [""],
        keywords: [""],
        linksRequested: 5
      });

      onSuccess?.();
    } catch (error: any) {
      const errMsg = getErrorMessage(error, 'Unable to create campaign');
      console.error('Campaign creation error:', errMsg, error);
      toast({
        title: "Campaign creation failed",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Campaign
          </span>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Target URLs</Label>
            {formData.targetUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateTargetUrl(index, e.target.value)}
                  placeholder="example.com, www.example.com, https://example.com"
                  required={index === 0}
                  className="flex-1"
                />
                {formData.targetUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTargetUrl(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTargetUrl}
              className="w-full"
              disabled={formData.targetUrls.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another URL ({formData.targetUrls.length}/10)
            </Button>
            <p className="text-xs text-muted-foreground">
              The pages you want to build backlinks to. All URL formats accepted. Maximum 10 URLs.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Target Keywords</Label>
            {formData.keywords.map((keyword, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => updateKeyword(index, e.target.value)}
                  placeholder="enter keyword here"
                  required={index === 0}
                  className="flex-1"
                />
                {formData.keywords.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyword(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addKeyword}
              className="w-full"
              disabled={formData.keywords.length >= 5}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Keyword ({formData.keywords.length}/5)
            </Button>
            <p className="text-xs text-muted-foreground">
              Keywords will be used as anchor text. Maximum 5 keywords per campaign.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linksRequested">Number of Backlinks</Label>
            <Input
              id="linksRequested"
              type="number"
              min="1"
                            value={formData.linksRequested}
              onChange={(e) => setFormData({ ...formData, linksRequested: parseInt(e.target.value) || 5 })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Each backlink costs 1 credit.
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  Create Campaign ({formData.linksRequested * formData.targetUrls.filter(url => url.trim()).length} credits)
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
