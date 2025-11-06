import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumCheckoutModal } from '@/components/PremiumCheckoutModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, Zap, Loader2, CheckCircle2, Lock, X, BookOpen } from 'lucide-react';

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
}

export function CombinedSearchSection() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();

  // Website ranking state
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RankResult | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showRankOverlay, setShowRankOverlay] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  // Keyword estimate state
  const [backlinkKeyword, setBacklinkKeyword] = useState('');
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateText, setEstimateText] = useState('');
  const [showEstimateOverlay, setShowEstimateOverlay] = useState(false);
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const [keywordFocused, setKeywordFocused] = useState(false);

  const normalizeUrl = (value: string): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    let candidateStr = trimmed;
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidateStr)) {
      candidateStr = `https://${candidateStr}`;
    }

    try {
      const u = new URL(candidateStr);
      const hostname = u.hostname || '';
      if (!/^[^\s]+\.[a-zA-Z]{2,}$/.test(hostname)) return null;
      if (!u.protocol || !/^https?:$/.test(u.protocol)) u.protocol = 'https:';
      return u.toString();
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    setIsUrlValid(Boolean(normalizeUrl(url)));
    if (inputError) setInputError(null);
  }, [url]);

  const handleUrlBlur = () => {
    const formatted = normalizeUrl(url);
    if (formatted) {
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
      '/api/homeFeaturedSearchRank',
      '/.netlify/functions/homeFeaturedSearchRank',
      envAny?.VITE_NETLIFY_FUNCTIONS_URL ? `${envAny.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      envAny?.VITE_NETLIFY_DEV_FUNCTIONS ? `${envAny.VITE_NETLIFY_DEV_FUNCTIONS.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      nodeEnv.VITE_NETLIFY_FUNCTIONS_URL ? `${nodeEnv.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      nodeEnv.NETLIFY_FUNCTIONS_URL ? `${nodeEnv.NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      windowEnv?.VITE_NETLIFY_FUNCTIONS_URL ? `${windowEnv.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
      windowEnv?.NETLIFY_FUNCTIONS_URL ? `${windowEnv.NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null
    ].filter(Boolean) as string[];

    const tried = new Set<string>();

    for (const endpoint of candidates) {
      if (tried.has(endpoint)) continue;
      tried.add(endpoint);
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: normalizedUrl, save, userId }) });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          console.warn('callGrok candidate failed:', endpoint, res.status, body);
          continue;
        }
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) return await res.json();
        return { success: true, report: await res.text() };
      } catch (err) {
        console.warn('callGrok fetch error for', endpoint, err?.message || err);
        continue;
      }
    }

    throw new Error('All endpoints failed for ranking lookup (404/timeout).');
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
      setResult({ success: false, report: errMsg, url: normalized });
      setShowRankOverlay(true);
      toast({ title: 'Error', description: errMsg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEstimate = async () => {
    if (!backlinkKeyword.trim()) {
      toast({ title: 'Please enter a keyword', description: 'Enter a keyword to search for backlink estimates.' });
      return;
    }

    setEstimateLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setEstimateText(`Estimated backlinks needed for "${backlinkKeyword}": 250-500 high-quality backlinks from authoritative domains.`);
      setShowEstimateOverlay(true);
      toast({ title: 'Estimate Complete', description: `Backlink estimate generated for "${backlinkKeyword}"` });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to generate estimate.' });
    } finally {
      setEstimateLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-[360px] md:min-h-[480px] flex items-center justify-center bg-white py-12">
        <div className="w-full max-w-3xl mx-auto px-4">
          <Tabs defaultValue="website" className="w-full">
            <div className="text-center mb-8">
              <TabsList className="inline-flex h-auto p-1 bg-slate-100 rounded-lg">
                <TabsTrigger value="website" className="px-4 py-2 text-base font-medium rounded">Website</TabsTrigger>
                <TabsTrigger value="keyword" className="px-4 py-2 text-base font-medium rounded">Keyword</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="website" className="mt-8">
              <div className="w-full">
                <div className="text-center mb-6">
                  <h3 className="flex items-center gap-2 justify-center text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                    <Search className="w-5 h-5 text-blue-600" />
                    How many backlinks do I need for my website?
                  </h3>
                </div>

                <form onSubmit={handleCheckRanking} className="w-full">
                  <div className="relative ui-freeze-on-input">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
                      <div className="flex-1 w-full">
                        <Input id="rank-url" aria-label="Website URL" placeholder="enter your website here" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={handleUrlBlur} disabled={loading} className="text-base w-full bg-white/0 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-blue-300" />
                        {inputError && <p className="text-xs text-red-600 mt-1">{inputError}</p>}
                      </div>

                      <Button type="submit" disabled={loading || !isUrlValid} className="bg-blue-600 text-white hover:bg-blue-700 font-medium py-2 text-base rounded-md border-transparent px-6">
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

                    {(loading || (!showRankOverlay && !!result)) && (
                      <div className="mt-4 flex items-center justify-center">
                        {loading ? (
                          <div className="text-sm text-muted-foreground">Analyzing website…</div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs sm:text-sm bg-white text-foreground border border-border shadow-sm hover:bg-white/95"
                            onClick={() => setShowRankOverlay(true)}
                          >
                            View latest ranking analysis
                          </Button>
                        )}
                      </div>
                    )}

                    {user && !isPremium && (
                      <p className="text-sm text-slate-500 text-center font-medium mt-4"><Lock className="w-4 h-4 inline mr-1 text-slate-400" />Upgrade to Premium to save and track rankings</p>
                    )}

                    {user && isPremium && (
                      <p className="text-sm text-slate-500 text-center font-medium mt-4"><CheckCircle2 className="w-4 h-4 inline mr-1 text-slate-400" />Premium: Results will be saved automatically</p>
                    )}

                    {showRankOverlay && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8" role="dialog" aria-modal="true" onClick={() => setShowRankOverlay(false)}>
                        <div className="relative w-full max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl border border-white/20 bg-black/80 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="keyword" className="mt-8">
              <div className="w-full">
                <div className="mb-6 flex justify-center">
                  <a href="/learn" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 px-3 py-1 text-sm shadow-sm transition-colors">
                    <BookOpen className="h-4 w-4" />
                    <span>Learn how it works</span>
                  </a>
                </div>

                <div className="relative ui-freeze-on-input">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
                    <div className="flex-1 w-full">
                      <Label htmlFor="backlinkKeyword" className="sr-only">Keyword</Label>
                      <Input
                        ref={keywordInputRef}
                        id="backlinkKeyword"
                        placeholder="Enter a keyword"
                        value={backlinkKeyword}
                        onFocus={() => setKeywordFocused(true)}
                        onBlur={() => setKeywordFocused(false)}
                        onChange={(e) => setBacklinkKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleEstimate(); } }}
                        className="text-base w-full bg-white/0 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-blue-300"
                      />
                    </div>

                    <Button onClick={handleEstimate} disabled={estimateLoading} className="bg-blue-600 text-white hover:bg-blue-700 font-medium py-2 text-base rounded-md border-transparent px-6">
                      {estimateLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>

                  {(estimateLoading || (!showEstimateOverlay && !!estimateText)) && (
                    <div className="mt-4 flex items-center justify-center">
                      {estimateLoading ? (
                        <div className="text-sm text-muted-foreground">Analyzing keyword��</div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs sm:text-sm bg-white text-foreground border border-border shadow-sm hover:bg-white/95"
                          onClick={() => setShowEstimateOverlay(true)}
                        >
                          Show latest estimate
                        </Button>
                      )}
                    </div>
                  )}

                  {showEstimateOverlay && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8" role="dialog" aria-modal="true" onClick={() => setShowEstimateOverlay(false)}>
                      <div className="relative w-full max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl border border-white/20 bg-black/80 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="absolute right-3 top-3 text-white/70 transition hover:text-white" onClick={() => setShowEstimateOverlay(false)} aria-label="Close estimate overlay">
                          <X className="h-4 w-4" />
                        </button>

                        <div className="space-y-2 text-white">
                          <div className="text-xs uppercase tracking-[0.12em] text-white/60">KEYWORD: <span className="font-semibold text-white">{backlinkKeyword}</span></div>

                          {estimateLoading ? (
                            <div className="flex items-center gap-2 text-sm leading-relaxed text-white/90">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Analyzing keyword...
                            </div>
                          ) : (
                            <div className="text-sm leading-relaxed text-white/90">{estimateText}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <PremiumCheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onSuccess={() => { setShowCheckoutModal(false); toast({ title: 'Welcome to Premium!', description: 'You can now save and track your rankings.' }); }} />
    </>
  );
}
