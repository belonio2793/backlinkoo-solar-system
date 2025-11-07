import RankHeader from '@/components/RankHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PremiumCheckoutModal } from '@/components/PremiumCheckoutModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Search, History, Crown, Loader2, X, TrendingUp, Globe, Lightbulb, ChevronDown } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
  Bar,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface HistoryItem { keyword: string; estimate: number | null; ts: number }
interface TimelinePoint { ts: number; estimate: number }
type TimelineMap = Record<string, TimelinePoint[]>;

interface KeywordIdea {
  keyword: string;
  searchVolume: number | null;
  difficulty: number | null;
  difficultyLabel?: string | null;
  intent?: string | null;
  notes?: string | null;
}

interface SavedUrlAnalysis {
  url: string;
  generatedAt: number;
  keywords: KeywordIdea[];
  raw?: string;
}

interface SavedKeywordList {
  keyword: string;
  generatedAt: number;
  keywords: KeywordIdea[];
  raw?: string;
}

const URL_STORAGE_KEY = 'kr:urlResults';
const FINDER_STORAGE_KEY = 'kr:finderResults';
const SAVED_LIMIT = 15;

const KR_LIMIT = 5;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function loadTimeline(): TimelineMap {
  try {
    const raw = localStorage.getItem('kr:timeline');
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TimelineMap;
    const safe: TimelineMap = {};
    Object.keys(parsed || {}).forEach((k) => {
      const list = Array.isArray(parsed[k]) ? parsed[k] : [];
      safe[k] = list
        .filter((p) => typeof p?.ts === 'number' && typeof p?.estimate === 'number' && Number.isFinite(p.estimate))
        .sort((a, b) => a.ts - b.ts);
    });
    return safe;
  } catch {
    return {};
  }
}

function saveTimeline(map: TimelineMap) {
  try { localStorage.setItem('kr:timeline', JSON.stringify(map)); } catch {}
}

function dayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

function upsertTimeline(map: TimelineMap, keyword: string, estimate: number, now: number): TimelineMap {
  const current = { ...(map || {}) } as TimelineMap;
  const list = Array.isArray(current[keyword]) ? [...current[keyword]] : [];
  const last = list.length > 0 ? list[list.length - 1] : null;
  if (last && now - last.ts < WEEK_MS) {
    if (last.estimate !== estimate) {
      list[list.length - 1] = { ts: now, estimate };
    }
  } else {
    list.push({ ts: now, estimate });
  }
  current[keyword] = list.sort((a, b) => a.ts - b.ts);
  return current;
}

function previousEstimateBefore(map: TimelineMap, keyword: string, beforeTs: number): number | null {
  const list = map[keyword] || [];
  let prev: TimelinePoint | null = null;
  for (let i = 0; i < list.length; i++) {
    if (list[i].ts < beforeTs) prev = list[i];
    else break;
  }
  return prev ? prev.estimate : null;
}

export default function KeywordResearch() {
  const { isPremium } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [showPremium, setShowPremium] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [serverPremium, setServerPremium] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState('');

  const [timeline, setTimeline] = useState<TimelineMap>({});

  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlActive, setUrlActive] = useState<SavedUrlAnalysis | null>(null);
  const [urlSaved, setUrlSaved] = useState<SavedUrlAnalysis[]>([]);

  const [finderInput, setFinderInput] = useState('');
  const [finderLoading, setFinderLoading] = useState(false);
  const [finderError, setFinderError] = useState<string | null>(null);
  const [finderActive, setFinderActive] = useState<SavedKeywordList | null>(null);
  const [finderSaved, setFinderSaved] = useState<SavedKeywordList[]>([]);

  const [navValue, setNavValue] = useState<'keyword-research' | 'url' | 'finder' | 'trends' | 'history'>('keyword-research');

  const todayKey = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10);
    return `kr:count:${d}`;
  }, []);

  const [usedCount, setUsedCount] = useState<number>(() => {
    try {
      if (typeof window === 'undefined') return 0;
      const stored = Number(localStorage.getItem(todayKey) || '0');
      if (!Number.isFinite(stored)) return 0;
      return Math.max(0, Math.min(KR_LIMIT, stored));
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setTimeline(loadTimeline());
    try {
      const savedUrlRaw = localStorage.getItem(URL_STORAGE_KEY);
      if (savedUrlRaw) setUrlSaved(JSON.parse(savedUrlRaw));
    } catch {}
    try {
      const savedFinderRaw = localStorage.getItem(FINDER_STORAGE_KEY);
      if (savedFinderRaw) setFinderSaved(JSON.parse(savedFinderRaw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isPremium || serverPremium) {
      if (isPremium && !serverPremium) {
        setServerPremium(true);
      }
      setUsedCount(0);
      try {
        localStorage.removeItem(todayKey);
      } catch {}
      return;
    }

    try {
      const stored = Number(localStorage.getItem(todayKey) || '0');
      if (Number.isFinite(stored)) {
        setUsedCount(Math.max(0, Math.min(KR_LIMIT, stored)));
      } else {
        setUsedCount(0);
      }
    } catch {
      setUsedCount(0);
    }
  }, [isPremium, serverPremium, todayKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || isPremium) return;
    let cancelled = false;
    supabase.auth.getSession()
      .then(({ data }) => {
        if (!cancelled && !data.session) {
          setServerPremium(false);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isPremium]);

  const premiumAccess = isPremium || serverPremium;
  const freeSearchesLeft = premiumAccess ? null : Math.max(0, KR_LIMIT - usedCount);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('kr:history');
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const saveHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const lastSameIdx = prev.findIndex((p) => p.keyword === item.keyword);
      let next = prev.slice();
      if (lastSameIdx !== -1 && (prev[lastSameIdx].ts > Date.now() - WEEK_MS)) {
        next[lastSameIdx] = { ...prev[lastSameIdx], estimate: item.estimate, ts: item.ts };
      } else {
        next = [item, ...prev];
      }
      next = next.slice(0, 50);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kr:history', JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const deleteHistoryIndex = (index: number) => {
    setHistory((prev) => {
      const next = prev.filter((_, i) => i !== index);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kr:history', JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem('kr:history'); } catch {}
    }
    setHistory([]);
  };

  const sanitizeKeywordIdeas = (items: any): KeywordIdea[] => {
    if (!Array.isArray(items)) return [];
    return items
      .map((entry) => {
        const keyword = typeof entry?.keyword === 'string' ? entry.keyword.trim() : '';
        if (!keyword) return null;
        const volumeValue = entry?.searchVolume;
        const difficultyValue = entry?.difficulty;
        const difficulty = typeof difficultyValue === 'number' && Number.isFinite(difficultyValue)
          ? Math.max(0, Math.min(100, Math.round(difficultyValue)))
          : null;
        const searchVolume = typeof volumeValue === 'number' && Number.isFinite(volumeValue)
          ? Math.max(0, Math.round(volumeValue))
          : null;
        const difficultyLabel = typeof entry?.difficultyLabel === 'string' && entry.difficultyLabel.trim()
          ? entry.difficultyLabel.trim()
          : null;
        const intent = typeof entry?.intent === 'string' && entry.intent.trim() ? entry.intent.trim() : null;
        const notes = typeof entry?.notes === 'string' && entry.notes.trim() ? entry.notes.trim() : null;
        return {
          keyword,
          searchVolume,
          difficulty,
          difficultyLabel,
          intent,
          notes,
        } satisfies KeywordIdea;
      })
      .filter((entry): entry is KeywordIdea => Boolean(entry && entry.keyword));
  };

  const persistUrlSaved = (items: SavedUrlAnalysis[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(URL_STORAGE_KEY, JSON.stringify(items.slice(0, SAVED_LIMIT)));
    } catch {}
  };

  const persistFinderSaved = (items: SavedKeywordList[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(FINDER_STORAGE_KEY, JSON.stringify(items.slice(0, SAVED_LIMIT)));
    } catch {}
  };

  const updateUsageCounters = (response: any) => {
    const isPremiumResponse = Boolean(response?.premium);
    setServerPremium(isPremiumResponse);
    if (isPremiumResponse) {
      setUsedCount(0);
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem(todayKey); } catch {}
      }
      return;
    }

    if (premiumAccess) {
      return;
    }

    if (typeof response?.remaining === 'number') {
      const safeRemaining = Math.max(0, Math.min(KR_LIMIT, response.remaining));
      const used = KR_LIMIT - safeRemaining;
      setUsedCount(used);
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(todayKey, String(used)); } catch {}
      }
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = Number(localStorage.getItem(todayKey) || '0');
        const safeStored = Number.isFinite(stored) ? stored : 0;
        const nextUsed = Math.min(KR_LIMIT, safeStored + 1);
        setUsedCount(nextUsed);
        localStorage.setItem(todayKey, String(nextUsed));
      } catch {
        setUsedCount((prev) => Math.min(KR_LIMIT, prev + 1));
      }
    } else {
      setUsedCount((prev) => Math.min(KR_LIMIT, prev + 1));
    }
  };

  const typeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (estimate == null) { setTyped(''); return; }
    if (typeTimer.current) window.clearInterval(typeTimer.current);
    const str = estimate.toLocaleString();
    let i = 0;
    setTyped('');
    typeTimer.current = window.setInterval(() => {
      i += 1;
      setTyped(str.slice(0, i));
      if (i >= str.length && typeTimer.current) {
        window.clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    }, 40);
    return () => { if (typeTimer.current) { window.clearInterval(typeTimer.current); typeTimer.current = null; } };
  }, [estimate]);

  const runSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setKeyword(trimmed);

    if (!premiumAccess) {
      try {
        const stored = Number(localStorage.getItem(todayKey) || '0');
        const safeUsed = Number.isFinite(stored) ? stored : 0;
        if (safeUsed >= KR_LIMIT) {
          setUsedCount(Math.max(0, Math.min(KR_LIMIT, safeUsed)));
          setShowOverlay(false);
          setShowPremium(true);
          return;
        }
      } catch {}
    }

    setCurrentKeyword(trimmed);
    setRawResponse('');
    setLoading(true);
    setEstimate(null);
    setTyped('');
    setShowOverlay(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch('/.netlify/functions/homekeywordResearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ keyword: trimmed })
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 429 && !premiumAccess) {
        setShowOverlay(false);
        setShowPremium(true);
        setUsedCount(KR_LIMIT);
        try { localStorage.setItem(todayKey, String(KR_LIMIT)); } catch {}
        return;
      }

      const isPremiumResponse = Boolean(json?.premium);
      setServerPremium(isPremiumResponse);

      if (isPremiumResponse) {
        setUsedCount(0);
        try { localStorage.removeItem(todayKey); } catch {}
      }

      const value: number | null = typeof json?.estimate === 'number' ? json.estimate : null;
      setEstimate(value);
      setRawResponse(typeof json?.raw === 'string' ? json.raw : '');

      if (!isPremiumResponse) {
        if (typeof json?.remaining === 'number') {
          const safeRemaining = Math.max(0, Math.min(KR_LIMIT, json.remaining));
          const used = KR_LIMIT - safeRemaining;
          setUsedCount(used);
          try { localStorage.setItem(todayKey, String(used)); } catch {}
        } else if (!premiumAccess) {
          try {
            const stored = Number(localStorage.getItem(todayKey) || '0');
            const safeStored = Number.isFinite(stored) ? stored : 0;
            const nextUsed = Math.min(KR_LIMIT, safeStored + 1);
            setUsedCount(nextUsed);
            localStorage.setItem(todayKey, String(nextUsed));
          } catch {
            setUsedCount((prev) => Math.min(KR_LIMIT, prev + 1));
          }
        }
      }

      saveHistory({ keyword: trimmed, estimate: value, ts: Date.now() });

      if (value != null && Number.isFinite(value)) {
        const now = Date.now();
        setTimeline((prev) => {
          const next = upsertTimeline(prev, trimmed, value, now);
          saveTimeline(next);
          return next;
        });
      }
    } catch (e) {
      setEstimate(null);
      setRawResponse('');
      setShowOverlay(false);
    } finally {
      setLoading(false);
    }
  };

  const runUrlAnalysis = async () => {
    const target = urlInput.trim();
    if (!target) return;
    setUrlLoading(true);
    setUrlError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch('/.netlify/functions/homeurlKeywordresearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: target })
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setShowPremium(true);
        updateUsageCounters({ remaining: 0, premium: json?.premium });
        setUrlLoading(false);
        return;
      }
      updateUsageCounters(json);
      if (json?.success && Array.isArray(json?.keywords)) {
        const ideas = sanitizeKeywordIdeas(json.keywords);
        if (ideas.length === 0) {
          setUrlError('No keywords found for this URL. Try another page.');
          setUrlActive(null);
        } else {
          const metaUrl = typeof json?.metadata?.url === 'string' && json.metadata.url.trim() ? json.metadata.url.trim() : target;
          setUrlActive({ url: metaUrl, generatedAt: Date.now(), keywords: ideas, raw: typeof json?.raw === 'string' ? json.raw : '' });
        }
      } else {
        setUrlError(typeof json?.error === 'string' ? json.error : 'Failed to analyze URL.');
        setUrlActive(null);
      }
    } catch (e) {
      setUrlError('Network error while analyzing the URL.');
      setUrlActive(null);
    } finally {
      setUrlLoading(false);
    }
  };

  const runFinder = async () => {
    const seed = finderInput.trim();
    if (!seed) return;
    setFinderLoading(true);
    setFinderError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch('/.netlify/functions/homeFinderkeywordresearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ keyword: seed })
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setShowPremium(true);
        updateUsageCounters({ remaining: 0, premium: json?.premium });
        setFinderLoading(false);
        return;
      }
      updateUsageCounters(json);
      if (json?.success && Array.isArray(json?.keywords)) {
        const ideas = sanitizeKeywordIdeas(json.keywords);
        if (ideas.length === 0) {
          setFinderError('No related keywords found. Try a different seed.');
          setFinderActive(null);
        } else {
          const seedKey = typeof json?.metadata?.keyword === 'string' && json.metadata.keyword.trim() ? json.metadata.keyword.trim() : seed;
          setFinderActive({ keyword: seedKey, generatedAt: Date.now(), keywords: ideas, raw: typeof json?.raw === 'string' ? json.raw : '' });
        }
      } else {
        setFinderError(typeof json?.error === 'string' ? json.error : 'Failed to generate keyword ideas.');
        setFinderActive(null);
      }
    } catch (e) {
      setFinderError('Network error while generating keyword ideas.');
      setFinderActive(null);
    } finally {
      setFinderLoading(false);
    }
  };

  useEffect(() => {
    if (!showOverlay) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowOverlay(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOverlay]);

  const recentKeywords = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const h of history) {
      if (!seen.has(h.keyword)) {
        seen.add(h.keyword);
        order.push(h.keyword);
      }
      if (order.length >= 4) break;
    }
    return order.reverse();
  }, [history]);

  const chartColors = useMemo(() => {
    const baseHues = [220, 160, 280, 340, 30, 120];
    const map: Record<string, string> = {};
    recentKeywords.forEach((kw, i) => {
      const hue = baseHues[i % baseHues.length];
      map[kw] = `hsl(${hue} 75% 50%)`;
    });
    return map;
  }, [recentKeywords]);

  const chartConfig: ChartConfig = useMemo(() => {
    const cfg: ChartConfig = {};
    recentKeywords.forEach((kw) => {
      cfg[kw] = { label: kw, color: chartColors[kw] };
    });
    return cfg;
  }, [recentKeywords, chartColors]);

  const chartData = useMemo(() => {
    const days = new Set<string>();
    recentKeywords.forEach((kw) => {
      (timeline[kw] || []).forEach((p) => days.add(dayKey(p.ts)));
    });
    const sortedDays = Array.from(days).sort();
    const rows = sortedDays.map((d) => {
      const row: Record<string, any> = { date: d };
      recentKeywords.forEach((kw) => {
        const value = (timeline[kw] || [])
          .filter((p) => dayKey(p.ts) === d)
          .slice(-1)[0]?.estimate;
        row[kw] = typeof value === 'number' ? value : undefined;
      });
      return row;
    });
    return rows;
  }, [timeline, recentKeywords]);

  return (
    <div className="bg-white">
      <RankHeader showTabs={false} ctaMode="navigation" />
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden md:fixed md:left-0 md:top-14 sm:md:top-16 md:h-auto md:w-64 md:flex md:flex-col md:border md:border-border/50 md:bg-slate-50 md:backdrop-blur-sm md:z-[9999] md:p-4 md:space-y-4 md:overflow-y-auto md:rounded-lg">
          <Tabs
            value={navValue}
            onValueChange={(v) => setNavValue(v as typeof navValue)}
            className="flex flex-col w-full"
          >
            <TabsList className="flex flex-col h-auto gap-1 bg-slate-50 p-2 rounded-md">
              <TabsTrigger value="keyword-research" className="w-full justify-start gap-2 text-left data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Search className="h-4 w-4" /> Research
              </TabsTrigger>
              <TabsTrigger value="url" className="w-full justify-start gap-2 text-left data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Globe className="h-4 w-4" /> Website
                {urlActive && <Badge variant="secondary" className="ml-auto text-xs">{urlActive.keywords.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="finder" className="w-full justify-start gap-2 text-left data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Lightbulb className="h-4 w-4" /> Finder
                {finderActive && <Badge variant="secondary" className="ml-auto text-xs">{finderActive.keywords.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="trends" className="w-full justify-start gap-2 text-left data-[state=active]:bg-background data-[state=active]:text-foreground">
                <TrendingUp className="h-4 w-4" /> Trends
              </TabsTrigger>
              <TabsTrigger value="history" className="w-full justify-start gap-2 text-left data-[state=active]:bg-background data-[state=active]:text-foreground">
                <History className="h-4 w-4" /> History
                {history.length > 0 && <Badge variant="secondary" className="ml-auto text-xs">{history.length}</Badge>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <main className="flex-1 container mx-auto px-4 pt-4 pb-40 w-full">
        <Card className="rainbow-hover-target border-0 bg-white mx-auto max-w-5xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl mb-4">
              <Search className="h-6 w-6" />
              Keyword Research Tools
            </CardTitle>
          </CardHeader>

          <Tabs value={navValue} onValueChange={(v) => setNavValue(v as typeof navValue)} className="w-full">
            <div className="px-6 pb-4">
              <TabsList className="inline-flex w-full gap-2 bg-slate-50 p-2 h-auto min-w-full justify-start sm:justify-center rounded-md">
                <TabsTrigger value="keyword-research" className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Research</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Website</span>
                  {urlActive && <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">{urlActive.keywords.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="finder" className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Finder</span>
                  {finderActive && <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">{finderActive.keywords.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Trends</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                  {history.length > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">{history.length}</Badge>}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Keyword Research Tab */}
            <TabsContent value="keyword-research" className="mt-0">
              <CardContent className="space-y-4">
                <div className="rounded-3xl p-4 border-0 bg-slate-50">
                  <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="enter your keyword, search term or phrase"
                    onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                  />
                  <Button onClick={runSearch} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Submit'}
                  </Button>
                </div>
                {premiumAccess ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                    Unlimited searches available.
                  </div>
                ) : freeSearchesLeft !== null ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {freeSearchesLeft} free searches remaining today.
                  </div>
                ) : null}
                </div>
              </CardContent>
            </TabsContent>

            {/* URL Analysis Tab */}
            <TabsContent value="url" className="mt-0">
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://your-site.com"
                    onKeyDown={(e) => { if (e.key === 'Enter') void runUrlAnalysis(); }}
                  />
                  <Button onClick={() => void runUrlAnalysis()} disabled={urlLoading}>
                    {urlLoading ? 'Analyzing...' : 'Get Ideas'}
                  </Button>
                  {urlActive ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const next: SavedUrlAnalysis = {
                          url: urlActive.url,
                          generatedAt: Date.now(),
                          keywords: urlActive.keywords,
                          raw: urlActive.raw,
                        };
                        setUrlSaved((prev) => {
                          const filtered = prev.filter((p) => p.url !== next.url);
                          const updated = [next, ...filtered].slice(0, SAVED_LIMIT);
                          persistUrlSaved(updated);
                          return updated;
                        });
                      }}
                    >
                      Save
                    </Button>
                  ) : null}
                </div>
                {urlError ? <div className="text-sm text-destructive">{urlError}</div> : null}

                {urlActive ? (
                  <div className="space-y-4">
                    <div className="text-xs text-muted-foreground">Source: {urlActive.url}</div>
                    <ChartContainer
                      config={{
                        volume: { label: 'Search Volume', color: 'hsl(var(--primary))' },
                        difficulty: { label: 'Difficulty', color: 'hsl(var(--secondary))' },
                      }}
                      className="w-full"
                    >
                      <ComposedChart
                        data={urlActive.keywords.map((k) => ({
                          name: k.keyword,
                          volume: typeof k.searchVolume === 'number' ? k.searchVolume : 0,
                          difficulty: typeof k.difficulty === 'number' ? k.difficulty : 0,
                        }))}
                        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-20} height={60} textAnchor="end" />
                        <YAxis yAxisId="left" tickLine={false} axisLine={false} width={60} />
                        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                        <Line yAxisId="right" type="monotone" dataKey="difficulty" stroke="hsl(var(--secondary))" dot={false} strokeWidth={2} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </ComposedChart>
                    </ChartContainer>

                    <div className="grid gap-2">
                      {urlActive.keywords.map((k) => (
                        <div key={k.keyword} className="flex items-center justify-between text-sm border rounded-md px-3 py-2 bg-card">
                          <div className="min-w-0">
                            <div className="font-medium truncate" title={k.keyword}>{k.keyword}</div>
                            {k.intent || k.notes ? (
                              <div className="text-xs text-muted-foreground truncate">{[k.intent, k.notes].filter(Boolean).join(' • ')}</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-4 whitespace-nowrap">
                            <span title="Search Volume">{k.searchVolume != null ? k.searchVolume.toLocaleString() : '—'}</span>
                            <span title="Difficulty">{k.difficulty != null ? `${k.difficulty}/100` : '—'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {urlSaved.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground mt-4">Saved Analyses</div>
                    <div className="space-y-2">
                      {urlSaved.map((s, i) => (
                        <div key={`${s.url}-${s.generatedAt}`} className="flex items-center justify-between gap-2 text-sm">
                          <button
                            className="text-left underline truncate text-foreground hover:text-foreground/80 transition-colors"
                            onClick={() => setUrlActive(s)}
                            title={`Load ${s.url}`}
                          >
                            {s.url}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(s.generatedAt).toLocaleString()}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                setUrlSaved((prev) => {
                                  const next = prev.filter((_, idx) => idx !== i);
                                  persistUrlSaved(next);
                                  return next;
                                });
                              }}
                              aria-label="Delete saved URL analysis"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </TabsContent>

            {/* Keyword Finder Tab */}
            <TabsContent value="finder" className="mt-0">
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={finderInput}
                    onChange={(e) => setFinderInput(e.target.value)}
                    placeholder="Enter a seed keyword"
                    onKeyDown={(e) => { if (e.key === 'Enter') void runFinder(); }}
                  />
                  <Button onClick={() => void runFinder()} disabled={finderLoading}>
                    {finderLoading ? 'Generating...' : 'Generate'}
                  </Button>
                  {finderActive ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const next: SavedKeywordList = {
                          keyword: finderActive.keyword,
                          generatedAt: Date.now(),
                          keywords: finderActive.keywords,
                          raw: finderActive.raw,
                        };
                        setFinderSaved((prev) => {
                          const filtered = prev.filter((p) => p.keyword !== next.keyword);
                          const updated = [next, ...filtered].slice(0, SAVED_LIMIT);
                          persistFinderSaved(updated);
                          return updated;
                        });
                      }}
                    >
                      Save
                    </Button>
                  ) : null}
                </div>
                {finderError ? <div className="text-sm text-destructive">{finderError}</div> : null}

                {finderActive ? (
                  <div className="space-y-4">
                    <div className="text-xs text-muted-foreground">Seed: {finderActive.keyword}</div>
                    <ChartContainer
                      config={{
                        volume: { label: 'Search Volume', color: 'hsl(var(--primary))' },
                        difficulty: { label: 'Difficulty', color: 'hsl(var(--secondary))' },
                      }}
                      className="w-full"
                    >
                      <ComposedChart
                        data={finderActive.keywords.map((k) => ({
                          name: k.keyword,
                          volume: typeof k.searchVolume === 'number' ? k.searchVolume : 0,
                          difficulty: typeof k.difficulty === 'number' ? k.difficulty : 0,
                        }))}
                        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-20} height={60} textAnchor="end" />
                        <YAxis yAxisId="left" tickLine={false} axisLine={false} width={60} />
                        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                        <Line yAxisId="right" type="monotone" dataKey="difficulty" stroke="hsl(var(--secondary))" dot={false} strokeWidth={2} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </ComposedChart>
                    </ChartContainer>

                    <div className="grid gap-2">
                      {finderActive.keywords.map((k) => (
                        <div key={k.keyword} className="flex items-center justify-between text-sm border rounded-md px-3 py-2 bg-card">
                          <div className="min-w-0">
                            <div className="font-medium truncate" title={k.keyword}>{k.keyword}</div>
                            {k.intent || k.notes ? (
                              <div className="text-xs text-muted-foreground truncate">{[k.intent, k.notes].filter(Boolean).join(' • ')}</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-4 whitespace-nowrap">
                            <span title="Search Volume">{k.searchVolume != null ? k.searchVolume.toLocaleString() : '—'}</span>
                            <span title="Difficulty">{k.difficulty != null ? `${k.difficulty}/100` : '—'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {finderSaved.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground mt-4">Saved Keyword Lists</div>
                    <div className="space-y-2">
                      {finderSaved.map((s, i) => (
                        <div key={`${s.keyword}-${s.generatedAt}`} className="flex items-center justify-between gap-2 text-sm">
                          <button
                            className="text-left underline truncate text-foreground hover:text-foreground/80 transition-colors"
                            onClick={() => setFinderActive(s)}
                            title={`Load ${s.keyword}`}
                          >
                            {s.keyword}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(s.generatedAt).toLocaleString()}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                setFinderSaved((prev) => {
                                  const next = prev.filter((_, idx) => idx !== i);
                                  persistFinderSaved(next);
                                  return next;
                                });
                              }}
                              aria-label="Delete saved keyword list"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="mt-0">
              <CardContent>
                {chartData.length === 0 || recentKeywords.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No trend data yet. Run a few searches to see changes over time. Duplicate searches within 7 days are merged.</div>
                ) : (
                  <ChartContainer config={chartConfig} className="w-full">
                    <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} width={60} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {recentKeywords.map((kw) => (
                        <Line
                          key={kw}
                          type="monotone"
                          dataKey={kw}
                          stroke={chartColors[kw]}
                          dot={false}
                          strokeWidth={2}
                          isAnimationActive={false}
                          connectNulls
                        />
                      ))}
                      <ChartLegend content={<ChartLegendContent />} />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-0">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Your Recent Searches</h3>
                  {history.length > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const confirmClear = window.confirm('Clear all saved keyword searches?');
                        if (confirmClear) clearHistory();
                      }}
                    >
                      Clear All
                    </Button>
                  ) : null}
                </div>
                {history.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No searches yet.</div>
                ) : (
                  <ul className="divide-y">
                    {history.map((h, i) => {
                      const prev = h.estimate != null ? previousEstimateBefore(timeline, h.keyword, h.ts) : null;
                      const delta = prev != null && h.estimate != null ? h.estimate - prev : null;
                      const pct = prev && h.estimate != null && prev !== 0 ? ((h.estimate - prev) / prev) * 100 : null;
                      return (
                        <li key={`${h.keyword}-${h.ts}`} className="py-2 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate" title={h.keyword}>{h.keyword}</div>
                            <div className="text-xs text-muted-foreground">{new Date(h.ts).toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold whitespace-nowrap">
                              {h.estimate != null ? h.estimate.toLocaleString() : '—'}
                            </div>
                            {delta != null ? (
                              <span className={`text-xs font-medium ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {delta >= 0 ? '+' : ''}{delta.toLocaleString()} {pct != null ? `(${pct.toFixed(1)}%)` : ''}
                              </span>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              aria-label={`Delete search ${h.keyword}`}
                              onClick={() => {
                                const confirmDelete = window.confirm('Delete this search from history?');
                                if (confirmDelete) deleteHistoryIndex(i);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      </div>

      <PremiumCheckoutModal
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
        onSuccess={() => setShowPremium(false)}
      />

      <Footer />

      {showOverlay && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 backdrop-blur-sm px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={() => { if (!loading) setShowOverlay(false); }}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-black/85 p-6 shadow-2xl text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 text-white/70 transition hover:text-white"
              onClick={() => setShowOverlay(false)}
              aria-label="Close keyword estimate overlay"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-5 pt-2">
              {currentKeyword ? (
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Keyword: <span className="font-semibold text-white">{currentKeyword}</span>
                </div>
              ) : null}

              {loading ? (
                <div className="flex items-center gap-3 text-white/80">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Analyzing keyword...</span>
                </div>
              ) : estimate != null ? (
                <div className="space-y-2">
                  <div className="text-4xl font-semibold tracking-tight">
                    {typed}
                    <span aria-hidden="true" className="animate-pulse">|</span>
                  </div>
                  {(() => {
                    const prev = currentKeyword && estimate != null ? previousEstimateBefore(timeline, currentKeyword, Date.now()) : null;
                    if (prev == null || estimate == null) return null;
                    const d = estimate - prev;
                    const p = prev !== 0 ? (d / prev) * 100 : null;
                    return (
                      <div className={`text-sm ${d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {d >= 0 ? '+' : ''}{d.toLocaleString()} {p != null ? `(${p.toFixed(1)}%) since last` : ''}
                      </div>
                    );
                  })()}
                </div>
              ) : rawResponse ? (
                <p className="text-base font-light leading-relaxed text-white/90">{rawResponse}</p>
              ) : (
                <p className="text-base font-light leading-relaxed text-white/90">No estimate available. Try refining the keyword.</p>
              )}

              {premiumAccess && (
                <div className="text-xs text-white/60">Unlimited premium access active.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
