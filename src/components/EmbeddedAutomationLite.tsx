import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Target, FileText, Globe, Info } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { useCampaignFormPersistence } from '@/hooks/useCampaignFormPersistence';
import { useSmartCampaignFlow } from '@/hooks/useSmartCampaignFlow';
import { useAuthModal } from '@/contexts/ModalContext';
import { getOrchestrator } from '@/services/automationOrchestrator';
import AutomationPostsList from '@/components/AutomationPostsList';
import InlineFeedMonitor from '@/components/InlineFeedMonitor';
import CampaignManagerTabbed from '@/components/CampaignManagerTabbed';
import { supabase } from '@/integrations/supabase/client';

export function EmbeddedAutomationLite() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuthState();
  const { savedFormData, saveFormData, clearFormData, hasValidSavedData } = useCampaignFormPersistence();
  const smartFlow = useSmartCampaignFlow();
  const { openLoginModal, openSignupModal } = useAuthModal();
  const orchestrator = getOrchestrator();

  const [formData, setFormData] = useState({ name: '', targetUrl: '', keyword: '', anchorText: '', model: 'gpt-3.5-turbo', theme: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);

  // Set shared domain owner to support account (used by orchestrator) without exposing UI identity
  useEffect(() => {
    try { localStorage.setItem('shared_domain_owner_email', 'support@backlinkoo.com'); } catch {}
  }, []);

  // Restore saved campaign
  useEffect(() => {
    if (hasValidSavedData(savedFormData)) {
      setFormData(savedFormData);
      smartFlow.updateFlowState(savedFormData);
    }
  }, [savedFormData, hasValidSavedData, smartFlow]);

  useEffect(() => { smartFlow.updateFlowState(formData); }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const campaigns = await orchestrator.getUserCampaigns();
        setActiveCampaigns(campaigns.filter(c => c.status === 'active'));
      } catch {}
    })();
  }, [isAuthenticated]);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value } as any;
    setFormData(newFormData);
    smartFlow.updateFlowState(newFormData);
  };

  const handleCreate = async () => {
    if (!isAuthenticated) {
      saveFormData(formData);
      openLoginModal({ onAuthSuccess: handleAuthSuccess, pendingAction: `your ${formData.keyword || 'link building'} campaign` });
      return;
    }
    await createCampaign();
  };

  const createCampaign = async () => {
    setIsCreating(true);
    try {
      const formattedUrl = smartFlow.autoFormatUrl(formData.targetUrl);
      if (formattedUrl !== formData.targetUrl) setFormData(prev => ({ ...prev, targetUrl: formattedUrl }));

      // Determine premium flag at DB level (via SQL RPC), fallback to profiles.subscription_tier
      let premiumFlag = false;
      try {
        if (user?.id && user?.email !== 'support@backlinkoo.com') {
          const { data: isPremiumRpc } = await supabase.rpc('is_premium_user', { user_uuid: user.id });
          if (typeof isPremiumRpc === 'boolean') {
            premiumFlag = isPremiumRpc;
          } else {
            const { data: profile } = await supabase
              .from('profiles')
              .select('subscription_tier')
              .eq('user_id', user.id)
              .single();
            premiumFlag = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'monthly';
          }
        }
      } catch {}

      const insertPayload: any = {
        user_id: user?.id || null,
        name: formData.name || formData.keyword,
        target_url: formattedUrl,
        keywords: formData.keyword ? [formData.keyword] : [],
        anchor_texts: formData.anchorText ? [formData.anchorText] : [],
        status: 'active',
        premium_user: premiumFlag
      };
      const { data: created, error } = await supabase.from('automation_campaigns').insert(insertPayload).select().single();
      if (error) throw error;

      const campaign = await orchestrator.createCampaign({
        id: created.id,
        target_url: formattedUrl,
        keyword: formData.keyword,
        anchor_text: formData.anchorText,
      });

      try { window.dispatchEvent(new Event('automation:campaign:created')); } catch {}
      clearFormData();
      setFormData({ name: '', targetUrl: '', keyword: '', anchorText: '', model: 'gpt-3.5-turbo', theme: '' });
    } catch (e) {
      console.error('EmbeddedAutomationLite create error:', e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAuthSuccess = async (_user: any) => {
    setTimeout(async () => { await createCampaign(); }, 500);
  };

  if (authLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Minimal header (no email displayed) */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Link Building Automation</h2>
        <p className="text-sm text-muted-foreground">Start campaigns and track results in real time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create / Status / Posts */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3 pb-1">
              <TabsTrigger value="create">Create Campaign</TabsTrigger>
              <TabsTrigger value="posts">Live Links</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Target className="w-4 h-4" />New Campaign</CardTitle>
                  <CardDescription>Automated content and backlink creation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetUrl">Target URL *</Label>
                    <Input id="targetUrl" value={formData.targetUrl} onChange={(e) => handleInputChange('targetUrl', e.target.value)} placeholder="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyword">Keyword *</Label>
                    <Input id="keyword" value={formData.keyword} onChange={(e) => handleInputChange('keyword', e.target.value)} placeholder="digital marketing" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anchor">Anchor Text *</Label>
                    <Input id="anchor" value={formData.anchorText} onChange={(e) => handleInputChange('anchorText', e.target.value)} placeholder="best digital marketing tools" />
                  </div>
                  <Button className="w-full" onClick={handleCreate} disabled={isCreating || !smartFlow.hasValidForm(formData)}>
                    {isCreating ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</>) : 'Create Campaign'}
                  </Button>
                  {!isAuthenticated && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>Sign in is required to start campaigns. Your form will be saved.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="space-y-4">
              <AutomationPostsList />
            </TabsContent>
          </Tabs>
        </div>

        {/* Activity Monitor */}
        <CampaignManagerTabbed onStatusUpdate={() => {}} />
      </div>
      <div className="w-full mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-4 h-4" />Live Monitor</CardTitle>
            <CardDescription>Real-time campaign reporting</CardDescription>
          </CardHeader>
          <CardContent>
            <InlineFeedMonitor activeCampaigns={activeCampaigns} isVisible={true} />
          </CardContent>
        </Card>
      </div>
      <div className="sr-only">
        <Globe className="w-4 h-4" /> Domains are managed by shared account
      </div>
    </div>
  );
}
