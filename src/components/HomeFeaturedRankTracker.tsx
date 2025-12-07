import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PremiumCheckoutModal } from '@/components/PremiumCheckoutModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, Zap, Loader2, CheckCircle2, Lock, X } from 'lucide-react';

interface RankResult {
  success: boolean;
  report?: string;
  error?: string;
  url?: string;
  premium?: boolean;
  remaining?: string | number;
  ok?: boolean;
  saved?: boolean;
  savedCount?: number;
  savedIds?: string[];
  isDemoMode?: boolean;
  demo?: boolean;
}

function getDemoAnalysis(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const hasWWW = hostname.startsWith('www.');
    const baseDomain = hasWWW ? hostname.slice(4) : hostname;

    return `Ranking Analysis Demo for ${baseDomain}

## Current Status
Based on public data and general SEO best practices for domains similar to ${baseDomain}:

## Backlink Requirements
To rank for competitive keywords in your niche, you typically need:
- Easy Keywords (Search Volume: <1K): 20-50 quality backlinks
- Medium Keywords (Search Volume: 1K-10K): 50-150 quality backlinks
- Hard Keywords (Search Volume: 10K+): 150-300+ quality backlinks

## Recommended Keywords to Target
- Primary: "${baseDomain.split('.')[0]} services" / "${baseDomain.split('.')[0]} solutions"
- Secondary: "best ${baseDomain.split('.')[0]}" / "top rated ${baseDomain.split('.')[0]}"
- Long-tail: "how to use ${baseDomain.split('.')[0]}" / "${baseDomain.split('.')[0]} for beginners"

## Quick Wins
1. Guest posts on authority blogs in your niche (DA 40+)
2. Resource page links and niche edits
3. Broken link building on competitor sites
4. Industry directory submissions
5. Local citations (if applicable)

## Next Steps
Upgrade to Premium for real-time ranking tracking and detailed keyword analysis.

**Note**: This is a demo analysis. For full, real-time results, please upgrade to our Premium plan.`;
  } catch (e) {
    return `Ranking Analysis Demo\n\nTo get started, enter your website URL above. For complete analysis, upgrade to our Premium plan.`;
  }
}

export function HomeFeaturedRankTracker() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RankResult | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showRankOverlay, setShowRankOverlay] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string | null>(null);

  const normalizeUrl = (value: string): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Add https:// if scheme missing
    let candidateStr = trimmed;
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidateStr)) {
      candidateStr = `https://${candidateStr}`;
    }

    try {
      const u = new URL(candidateStr);
      const hostname = u.hostname || '';
      // Simple hostname validation: must contain a dot and a 2+ letter TLD
      if (!/^[^\s]+\.[a-zA-Z]{2,}$/.test(hostname)) return null;
      // Normalize: ensure https protocol
      if (!u.protocol || !/^https?:$/.test(u.protocol)) u.protocol = 'https:';
      return u.toString();
    } catch (e) {
      return null;
    }
  };

  const [inputError, setInputError] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  useEffect(() => {
    setIsUrlValid(Boolean(normalizeUrl(url)));
    if (inputError) setInputError(null);
  }, [url]);

  const handleUrlBlur = () => {
    const formatted = normalizeUrl(url);
    if (formatted) {
      // Only update if formatted differs to avoid cursor jumps while typing
      if (formatted !== url) setUrl(formatted);
      setInputError(null);
    } else {
      setInputError('Please enter a valid domain or URL, like example.com');
    }
  };

  const callGrok = async (normalizedUrl: string, save: boolean, userId?: string) => {
    const envAny: any = (import.meta as any)?.env || {};
    const nodeEnv = typeof process !== 'undefined' ? (process as any).env || {} : {};
    const windowEnv = typeof window !== 'undefined' ? (window as any) : {};

    const candidates = [
      // Local relative paths (for same-origin deployments)
      '/api/homeFeaturedSearchRank',
      '/.netlify/functions/homeFeaturedSearchRank',

      // Environment-configured endpoints (for cross-origin deployments)
      envAny?.VITE_NETLIFY_FUNCTIONS_URL ? `${envAny.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      envAny?.VITE_NETLIFY_DEV_FUNCTIONS ? `${envAny.VITE_NETLIFY_DEV_FUNCTIONS.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      nodeEnv.VITE_NETLIFY_FUNCTIONS_URL ? `${nodeEnv.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      nodeEnv.NETLIFY_FUNCTIONS_URL ? `${nodeEnv.NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,

      // Fallback to known Netlify site if available
      envAny?.VITE_NETLIFY_SITE_ID ? `https://backlinkoo.netlify.app/.netlify/functions/homeFeaturedSearchRank` : null,

      // Window environment variables
      windowEnv?.VITE_NETLIFY_FUNCTIONS_URL ? `${windowEnv.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      windowEnv?.NETLIFY_FUNCTIONS_URL ? `${windowEnv.NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null
    ].filter(Boolean) as string[];

    const tried = new Set<string>();
    const errors: string[] = [];
    let lastStatusCode = 0;

    for (const endpoint of candidates) {
      if (tried.has(endpoint)) continue;
      tried.add(endpoint);
      try {
        console.log('[RankTracker] Attempting endpoint:', endpoint);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: normalizedUrl, save, userId }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        lastStatusCode = res.status;

        if (!res.ok) {
          const body = await res.text().catch(() => '');
          const errorDetail = `${endpoint}: ${res.status}`;
          errors.push(errorDetail);
          console.warn('[RankTracker] Endpoint failed:', endpoint, res.status);

          // If we get a 503, the service is not configured
          if (res.status === 503) {
            try {
              const errData = JSON.parse(body);
              throw new Error(errData.error || 'Service not configured');
            } catch (e) {
              throw new Error('Ranking service is not properly configured. Please try again later.');
            }
          }
          // If it's HTML (404), skip to next candidate
          if (body.includes('<html') || body.includes('<!DOCTYPE')) {
            console.warn('[RankTracker] Got HTML response (likely 404), trying next endpoint');
            continue;
          }
          continue;
        }

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) return await res.json();
        return { success: true, report: await res.text() };
      } catch (err: any) {
        const errorMsg = err?.message || String(err);

        // Re-throw configuration errors immediately
        if (errorMsg.includes('Service not configured') || errorMsg.includes('not properly configured')) {
          throw err;
        }

        // Skip timeout errors and continue
        if (errorMsg.includes('abort') || errorMsg.includes('timeout')) {
          console.warn('[RankTracker] Request timeout for:', endpoint);
          errors.push(`${endpoint}: timeout`);
          continue;
        }

        console.warn('[RankTracker] Fetch error for', endpoint, errorMsg);
        errors.push(`${endpoint}: ${errorMsg}`);
        continue;
      }
    }

    // Provide more specific error message based on what failed
    if (lastStatusCode === 404 || errors.some(e => e.includes('404'))) {
      throw new Error('The ranking service endpoint is not available. Make sure to run "netlify dev" for local testing, or check your deployment.');
    }

    throw new Error('Unable to reach the ranking analysis service. All endpoints failed. Please ensure your connection is stable and try again.');
  };

  const handleCheckRanking = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      toast({ title: 'Invalid URL', description: 'Please enter a valid website URL.', variant: 'destructive' });
      return;
    }

    setShowRankOverlay(true);
    setAnalyzingUrl(normalized);
    setLoading(true);
    setResult(null);

    try {
      const data = await callGrok(normalized, Boolean(user && isPremium), user?.id);
      if (data && typeof data === 'object' && 'ok' in data) {
        if (!data.ok) throw new Error((data as any).error || 'Request failed');
        const r: RankResult = {
          success: true,
          ok: true,
          report: JSON.stringify((data as any).data ?? data, null, 2),
          url: normalized,
          saved: Boolean((data as any).saved),
          savedCount: (data as any).savedCount || 0,
          savedIds: (data as any).savedIds || []
        };
        setResult(r);
        setShowRankOverlay(true);
        const msg = r.saved ? `Saved ${r.savedCount} results` : 'Analysis generated';
        toast({ title: 'Ranking Analysis Complete', description: `${msg} for ${normalized}` });
      } else {
        const parsed: RankResult = typeof data === 'object' && data !== null ? ({
          success: Boolean((data as any).success ?? true),
          report: (data as any).report ?? (typeof data === 'string' ? data : JSON.stringify(data)),
          url: normalized,
        } as RankResult) : { success: true, report: String(data), url: normalized };
        if (!parsed.success) throw new Error(parsed.error || 'Analysis failed');
        setResult(parsed);
        setShowRankOverlay(true);
        toast({ title: 'Ranking Analysis Complete', description: `Analysis generated for ${normalized}` });
      }
    } catch (err: any) {
      console.error('Ranking check error:', err);

      const errMsg = err?.message || 'Failed to analyze ranking. Please try again.';

      // Provide more helpful error messages
      let userFriendlyMsg = errMsg;
      if (errMsg.includes('not properly configured')) {
        userFriendlyMsg = 'The ranking service is currently unavailable. Please try again in a few moments.';
      } else if (errMsg.includes('endpoints failed') || errMsg.includes('404')) {
        userFriendlyMsg = 'Unable to connect to the ranking service. Please check your internet connection and try again.';
      } else if (errMsg.includes('timeout')) {
        userFriendlyMsg = 'The ranking analysis took too long. Please try again.';
      }

      setResult({ success: false, report: userFriendlyMsg, url: normalized });
      setShowRankOverlay(true);
      toast({ title: 'Analysis Failed', description: userFriendlyMsg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-[360px] md:min-h-[480px] flex items-center justify-center bg-background">
        <div className="w-full max-w-3xl mx-auto px-4">
          <Card className="w-full bg-transparent border-0 shadow-none">
            <CardHeader className="pb-0 text-center">
              <CardTitle onClick={() => setShowRankOverlay(true)} className="flex items-center gap-2 justify-center text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 cursor-pointer select-none">
                <Search className="w-5 h-5 text-blue-600" />
                How many backlinks do I need for my website?
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 text-center">
              <form onSubmit={handleCheckRanking} className="space-y-3 w-full flex flex-col items-center">
                <div className="w-full max-w-md mx-auto space-y-3">
                  <div className="space-y-2">
                    <Input id="rank-url" aria-label="Website URL" placeholder="enter your website here" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={handleUrlBlur} disabled={loading} className="text-base w-full bg-white/0 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-blue-300" />
                    {inputError && <p className="text-xs text-red-600 mt-1">{inputError}</p>}
                  </div>

                  <Button type="submit" disabled={loading || !isUrlValid} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium py-2 text-base rounded-md border-transparent">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Rankings...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" /> Analyze Rankings
                      </>
                    )}
                  </Button>
                </div>

                {user && !isPremium && (
                  <p className="text-sm text-slate-500 text-center font-light"><Lock className="w-4 h-4 inline mr-1 text-slate-400" />Upgrade to Premium to save and track rankings</p>
                )}

                {user && isPremium && (
                  <p className="text-sm text-slate-500 text-center font-medium"><CheckCircle2 className="w-4 h-4 inline mr-1 text-slate-400" />Premium: Results will be saved automatically</p>
                )}

                {result && (
                  <>
                    <div className="mt-6">
                      <div className="flex items-center justify-center">
                        <Button variant="ghost" size="sm" onClick={() => setShowRankOverlay(true)} className="h-8 px-3 text-xs sm:text-sm bg-white text-foreground border border-border shadow-sm hover:bg-white">
                          View latest ranking analysis
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {showRankOverlay && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50  px-4 py-8" role="dialog" aria-modal="true" onClick={() => setShowRankOverlay(false)}>
                    <div className="relative w-full max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl border border-white/20 bg-black/80 p-6 " onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="absolute right-3 top-3 text-white/70 transition hover:text-white" onClick={() => setShowRankOverlay(false)} aria-label="Close ranking overlay">
                        <X className="h-4 w-4" />
                      </button>

                      <div className="space-y-2 text-white">
                        <div className="text-xs uppercase tracking-[0.12em] text-white/60">URL: <span className="font-semibold text-white">{(result?.url || analyzingUrl || (normalizeUrl(url) || url))}</span></div>

                        {loading ? (
                          <div className="flex items-center gap-2 text-sm leading-relaxed text-white/90">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing rankings...
                          </div>
                        ) : (
                          <div className="text-sm leading-relaxed text-white/90">{result?.report ? result.report.split('\n').slice(0,3).join(' ') : 'Ranking analysis generated.'}</div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            {result?.premium && (
                              <Badge className="bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300"><Zap className="w-3 h-3 mr-1" />Premium</Badge>
                            )}
                          </div>
                          <div className="text-xs text-white/60">{result?.saved ? `Saved ${result.savedCount || 0}` : ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <PremiumCheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onSuccess={() => { setShowCheckoutModal(false); toast({ title: 'Welcome to Premium!', description: 'You can now save and track your rankings.' }); }} />
    </>
  );
}
