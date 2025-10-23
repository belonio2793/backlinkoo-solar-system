import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PremiumCheckoutModal } from '@/components/PremiumCheckoutModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Search, History, Crown, Link as LinkIcon, Loader2, X, TrendingUp, Download, Infinity, Star, Menu, Home, BookOpen, LineChart } from 'lucide-react';
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
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ComposedChart,
  Bar,
  Tooltip,
  Legend,
} from 'recharts';
import HomeRankTrackerCompetition from '@/components/HomeRankTrackerCompetition';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

interface HistoryItem {
  url: string;
  keyword: string;
  formatted: string;
  page: number | null;
  position: number | null;
  ts: number;
}

// Timeline point for a specific (url, keyword)
interface RankPoint {
  ts: number;
  rank: number; // lower is better (1 = top)
  page?: number | null;
  position?: number | null;
}

const RT_LIMIT = 5;

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const candidate = new URL(trimmed);
    if (!['http:', 'https:'].includes(candidate.protocol)) return null;
    return candidate.toString();
  } catch {
    try {
      const fallback = new URL(`https://${trimmed}`);
      if (!['http:', 'https:'].includes(fallback.protocol)) return null;
      return fallback.toString();
    } catch {
      return null;
    }
  }
}

export default function RankTracker() {
  const { isPremium, user } = useAuth();
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formatted, setFormatted] = useState('');
  const [typedNumber, setTypedNumber] = useState('');
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [serverPremium, setServerPremium] = useState(false);
  const [error, setError] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<'rank' | 'wizard' | null>(null);
  const [currentQuery, setCurrentQuery] = useState<{ url: string; keyword: string } | null>(null);
  const [rawResponse, setRawResponse] = useState('');

  // Optional Netlify Functions base URL for hosted environments
  const fnBase = (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL || "";

  // Premium rank tracker is implemented in a separate component (PremiumRankTracker)

  // Wizard state
  const [wizardUrl, setWizardUrl] = useState('');
  const [wizardLoading, setWizardLoading] = useState(false);
  const [wizardReport, setWizardReport] = useState('');
  const [wizardTyped, setWizardTyped] = useState('');
  const [wizardError, setWizardError] = useState('');
  const [wizardRemaining, setWizardRemaining] = useState<string | number | null>(null);
  const wizardTimer = useRef<number | null>(null);

  // Sticky nav / collapsible controls
  const location = useLocation();
  const navigate = useNavigate();
  const premiumTabDefault = useMemo(() => (location.pathname.endsWith('/premium') ? 'premium' : 'rank'), [location.pathname]);
  const [premiumTab, setPremiumTab] = useState<string>(premiumTabDefault);

  const [navValue, setNavValue] = useState<'wizard'|'rank'|'competition'|'history'>('wizard');
  const [wizardOpen, setWizardOpen] = useState(true);
  const [rankOpen, setRankOpen] = useState(true);
  const [competitionOpen, setCompetitionOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const wizardRef = useRef<HTMLDivElement | null>(null);
  const rankRef = useRef<HTMLDivElement | null>(null);
  const competitionRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);

  function scrollTo(ref: React.MutableRefObject<HTMLDivElement | null> | HTMLDivElement | null) {
    const r: any = (ref && (ref as any).current) ? (ref as any).current : ref;
    if (r && typeof r.scrollIntoView === 'function') r.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openOnly(val: typeof navValue) {
    setWizardOpen(val === 'wizard');
    setRankOpen(val === 'rank');
    setCompetitionOpen(val === 'competition');
    setHistoryOpen(val === 'history');
  }

  function expandAll() {
    setWizardOpen(true); setRankOpen(true); setCompetitionOpen(true); setHistoryOpen(true);
  }
  function collapseAll() {
    setWizardOpen(false); setRankOpen(false); setCompetitionOpen(false); setHistoryOpen(false);
  }

  useEffect(() => {
    setPremiumTab(premiumTabDefault);
  }, [premiumTabDefault]);

  // Optional Netlify Functions base URL for hosted environments (moved earlier)

  // Offline sample content used by "Try Example" to avoid network dependency
  const SAMPLE_WIZARD_REPORT = `# URL: http://harrypotter.com/

Current Keyword Rankings (sample):
- Harry Potter — Position 1 (Homepage)
- Harry Potter books — Position 2 (Books page)
- JK Rowling — Position 3 (About page)
- Hogwarts — Position 4 (School page)

Opportunities:
- Long-tail ideas: "harry potter house quiz", "harry potter characters list", "who is voldemort backstory"
- Suggested content upgrades: add FAQ schema, internal links to top houses, richer meta descriptions

Estimated Daily Visitors From Top Keywords (sample):
- "harry potter" ~ 10,000/day (global), top-1 CTR ~ 25–30%
- "harry potter books" ~ 3,000/day, top-2 CTR ~ 18–22%

Actions:
1) Add internal links from homepage to Houses, Spells, Characters hubs
2) Add FAQ schema on the Houses hub page
3) Publish guide: "Harry Potter Houses: Complete Sorting Guide"
`;

  const SAMPLE_RANK_FORMATTED = `Page 1 • Position 3\nLikely visible above the fold. Consider improving title clarity and adding FAQ schema to capture more clicks.`;

  // timeline derived and persisted
  const [timelineMap, setTimelineMap] = useState<Record<string, RankPoint[]>>({});

  const todayKey = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10);
    return `rt:count:${d}`;
  }, []);

  // User-scoped storage keys (fallback to legacy keys if not present)
  const storageKeys = useMemo(() => {
    const uid = user?.id || 'anon';
    return {
      history: `rt:history:${uid}`,
      timeline: `rt:timeline:${uid}`,
      legacyHistory: 'rt:history',
      legacyTimeline: 'rt:timeline',
    };
  }, [user?.id]);

  function computeDomain(u: string): string {
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; }
  }

  function computeRankIndex(item: { page: number | null; position: number | null }): number | null {
    const p = item.page; const pos = item.position;
    if (typeof p === 'number' && typeof pos === 'number' && Number.isFinite(p) && Number.isFinite(pos) && p >= 1 && pos >= 1) {
      return (p - 1) * 10 + pos; // 1..100
    }
    return null;
  }

  const [usedCount, setUsedCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = Number(localStorage.getItem(todayKey) || '0');
      if (Number.isFinite(stored)) {
        return Math.max(0, Math.min(RT_LIMIT, stored));
      }
    } catch {}
    return 0;
  });

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
        setUsedCount(Math.max(0, Math.min(RT_LIMIT, stored)));
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
  const freeSearchesLeft = premiumAccess ? null : Math.max(0, RT_LIMIT - usedCount);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKeys.history) || localStorage.getItem(storageKeys.legacyHistory);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
    try {
      const rawTimeline = localStorage.getItem(storageKeys.timeline) || localStorage.getItem(storageKeys.legacyTimeline);
      if (rawTimeline) setTimelineMap(JSON.parse(rawTimeline));
    } catch {}
  }, [storageKeys.history, storageKeys.timeline, storageKeys.legacyHistory, storageKeys.legacyTimeline]);

  const saveHistory = (entry: HistoryItem) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKeys.history, JSON.stringify(next));
          localStorage.setItem(storageKeys.legacyHistory, JSON.stringify(next)); // keep legacy in sync
        }
      } catch {}
      return next;
    });

    // Update timeline for this (url, keyword)
    const seriesKey = `${normalizeUrl(entry.url) || entry.url}__${entry.keyword}`;
    const rankIndex = computeRankIndex(entry);
    if (rankIndex != null) {
      setTimelineMap((prev) => {
        const list = Array.isArray(prev[seriesKey]) ? [...prev[seriesKey]] : [];
        list.push({ ts: entry.ts, rank: rankIndex, page: entry.page, position: entry.position });
        const deduped = list
          .sort((a, b) => a.ts - b.ts)
          .filter((p, i, arr) => i === 0 || p.ts !== arr[i - 1].ts);
        const next = { ...prev, [seriesKey]: deduped };
        try {
          localStorage.setItem(storageKeys.timeline, JSON.stringify(next));
          localStorage.setItem(storageKeys.legacyTimeline, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  const deleteHistoryIndex = (index: number) => {
    setHistory((prev) => {
      const next = prev.filter((_, i) => i !== index);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKeys.history, JSON.stringify(next));
          localStorage.setItem(storageKeys.legacyHistory, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    setTimelineMap({});
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKeys.history);
        localStorage.removeItem(storageKeys.legacyHistory);
        localStorage.removeItem(storageKeys.timeline);
        localStorage.removeItem(storageKeys.legacyTimeline);
      } catch {}
    }
  };

  const typeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (displayNumber == null) {
      setTypedNumber('');
      return;
    }
    if (typeTimer.current) window.clearInterval(typeTimer.current);
    const str = String(displayNumber);
    let index = 0;
    setTypedNumber('');
    typeTimer.current = window.setInterval(() => {
      index += 1;
      setTypedNumber(str.slice(0, index));
      if (index >= str.length && typeTimer.current) {
        window.clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    }, 50);
    return () => {
      if (typeTimer.current) {
        window.clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    };
  }, [displayNumber]);

  useEffect(() => {
    if (!showOverlay) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowOverlay(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOverlay]);

  // Wizard typewriter effect
  useEffect(() => {
    if (!wizardReport) { setWizardTyped(''); return; }
    if (wizardTimer.current) window.clearInterval(wizardTimer.current);
    let i = 0;
    setWizardTyped('');
    const step = Math.max(1, Math.floor(wizardReport.length / 1200));
    wizardTimer.current = window.setInterval(() => {
      i += step;
      setWizardTyped(wizardReport.slice(0, Math.min(i, wizardReport.length)));
      if (i >= wizardReport.length && wizardTimer.current) {
        window.clearInterval(wizardTimer.current);
        wizardTimer.current = null;
      }
    }, 8);
    return () => {
      if (wizardTimer.current) {
        window.clearInterval(wizardTimer.current);
        wizardTimer.current = null;
      }
    };
  }, [wizardReport]);

  // Lightweight markdown/link renderer for wizard output
  function renderWizardMarkdown(text: string): string {
    if (!text) return '';

    const escapeHtml = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const cleaned = normalizeText(text);

    let html = escapeHtml(cleaned);

    // Headings (#, ##, ### ...) rendered as bold block lines with a break after
    html = html.replace(/^###\s+(.+)$/gm, '<strong class="block font-semibold mt-3 mb-1">$1</strong><br/>' );
    html = html.replace(/^##\s+(.+)$/gm,  '<strong class="block font-semibold mt-3 mb-1">$1</strong><br/>' );
    html = html.replace(/^#\s+(.+)$/gm,   '<strong class="block font-semibold mt-3 mb-1">$1</strong><br/>' );

    // Bold **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Markdown links [text](url) - force white text color in overlay
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, p1, p2) => {
      const label = p1;
      const href = p2;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="underline text-white hover:text-white">${label}</a>`;
    });

    // Bare URLs (including www.) - force white text color in overlay
    html = html.replace(/(^|[\s(>])((?:https?:\/\/|www\.)[^\s<)]+)(?=$|[\s<)])/g, (_m, pre, url) => {
      const href = url.startsWith('http') ? url : `https://${url}`;
      return `${pre}<a href="${href}" target="_blank" rel="noopener noreferrer" class="underline text-white hover:text-white break-words">${url}</a>`;
    });

    // Convert newlines to HTML line breaks for better readability
    html = html.replace(/\n{2,}/g, '<br/><br/>').replace(/\n/g, '<br/>' );

    // Do not inject vendor recommendations into wizard output
    return html;
  }

  function replaceVendorsWithPreferred(inputHtml: string): string {
    if (!inputHtml) return inputHtml;
    const vendors = [
      'semrush', 'moz', 'ahrefs', 'google keyword planner', 'google keywords planner', 'google keywordplanner',
      'the hoth', 'authority builders', 'loganix', 'fatjoe', 'page one power', 'outreach monks', 'haro',
      'searcharoo', 'authority hacker', 'linksmanagement', 'get me links', 'rankclub', 'logrocket'
    ];

    // Build regex that matches vendor names as whole words (case-insensitive)
    const pattern = new RegExp(`\\b(${vendors.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

    // Replacement link HTML
    const replacement = `<a href="https://backlinkoo.com" target="_blank" rel="noopener noreferrer" class="font-semibold underline">Backlink ∞</a>`;

    // Replace occurrences; keep originals in parentheses after recommended label
    return inputHtml.replace(pattern, (match) => {
      // If already contains Backlink ∞, skip to avoid recursion
      if (/backlink\s*∞|backlinkoo/i.test(match)) return match;
      return `${replacement} <span class="text-xs text-white">(recommended instead of ${escapeHtml(match)})</span>`;
    });
  }

  // escapeHtml is used earlier; ensure accessible here
  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Normalize content by removing '#', collapsing multiple blank lines, and trimming
  function normalizeText(s: string): string {
    if (!s) return s;
    const unified = s.replace(/\r\n/g, '\n');
    const noHashes = unified.replace(/#/g, '');
    const collapsed = noHashes.replace(/\n\s*\n+/g, '\n');
    return collapsed.trim();
  }

  // Build recent unique series (by URL+keyword exact match)
  const recentSeries = useMemo(() => {
    const seen = new Set<string>();
    const order: { key: string; label: string }[] = [];
    for (const h of history) {
      const norm = normalizeUrl(h.url) || h.url;
      const key = `${norm}__${h.keyword}`;
      if (!seen.has(key)) {
        const domain = computeDomain(norm);
        const label = `${domain} • ${h.keyword}`;
        seen.add(key);
        order.push({ key, label });
      }
      if (order.length >= 5) break;
    }
    return order.reverse();
  }, [history]);

  // Chart colors for series
  const chartColors = useMemo(() => {
    const baseHues = [220, 160, 280, 340, 30, 120];
    const map: Record<string, string> = {};
    recentSeries.forEach((s, i) => {
      const hue = baseHues[i % baseHues.length];
      map[s.key] = `hsl(${hue} 75% 50%)`;
    });
    return map;
  }, [recentSeries]);

  const chartConfig: ChartConfig = useMemo(() => {
    const cfg: ChartConfig = {};
    recentSeries.forEach((s) => {
      cfg[s.key] = { label: s.label, color: chartColors[s.key] };
    });
    return cfg;
  }, [recentSeries, chartColors]);

  // Build daily rows and also carry deltas for marker coloring
  function dayKey(ts: number) { return new Date(ts).toISOString().slice(0, 10); }

  const chartData = useMemo(() => {
    const days = new Set<string>();
    recentSeries.forEach((s) => {
      (timelineMap[s.key] || []).forEach((p) => days.add(dayKey(p.ts)));
    });
    const sortedDays = Array.from(days).sort();

    // Prepare last value tracking per series for deltas
    const lastValue: Record<string, number | undefined> = {};

    return sortedDays.map((d) => {
      const row: Record<string, any> = { date: d };
      recentSeries.forEach((s) => {
        const points = (timelineMap[s.key] || []).filter((p) => dayKey(p.ts) === d);
        const value = points.length > 0 ? points[points.length - 1].rank : undefined;
        row[s.key] = value;
        const prev = lastValue[s.key];
        row[`${s.key}__delta`] = prev != null && value != null ? value - prev : undefined; // positive = worse
        if (value != null) lastValue[s.key] = value;
      });
      return row;
    });
  }, [timelineMap, recentSeries]);

  const runLookup = async () => {
    const trimmedKeyword = keyword.trim();
    const normalizedUrl = normalizeUrl(url);
    setError('');

    if (!trimmedKeyword || !normalizedUrl) {
      setError('Enter a valid URL and keyword to continue.');
      return;
    }

    const premiumNow = premiumAccess;

    if (!premiumNow) {
      try {
        const stored = Number(localStorage.getItem(todayKey) || '0');
        const safeUsed = Number.isFinite(stored) ? stored : 0;
        if (safeUsed >= RT_LIMIT) {
          setUsedCount(Math.max(0, Math.min(RT_LIMIT, safeUsed)));
          setShowPremium(true);
          setShowOverlay(false);
          return;
        }
      } catch {}
    }

    setLoading(true);
    setOverlayType('rank');
    setShowOverlay(true);
    setCurrentQuery({ url: normalizedUrl, keyword: trimmedKeyword });
    setFormatted('');
    setRawResponse('');
    setDisplayNumber(null);
    setTypedNumber('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch(fnBase ? `${fnBase}/homerankTracker` : '/.netlify/functions/homerankTracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url: normalizedUrl, keyword: trimmedKeyword }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 429 && !premiumNow) {
        setShowOverlay(false);
        setShowPremium(true);
        setUsedCount(RT_LIMIT);
        try {
          localStorage.setItem(todayKey, String(RT_LIMIT));
        } catch {}
        return;
      }

      if (!res.ok || json?.success !== true) {
        setShowOverlay(false);
        setError(json?.error || 'Unable to retrieve ranking information.');
        return;
      }

      const isPremiumResponse = Boolean(json?.premium);
      setServerPremium(isPremiumResponse);

      if (isPremiumResponse) {
        setUsedCount(0);
        try { localStorage.removeItem(todayKey); } catch {}
      }

      const numeric = typeof json?.numeric === 'number' && Number.isFinite(json.numeric) ? json.numeric : null;
      const page = typeof json?.page === 'number' && Number.isFinite(json.page) ? json.page : null;
      const position = typeof json?.position === 'number' && Number.isFinite(json.position) ? json.position : null;

      setFormatted(typeof json?.formatted === 'string' ? normalizeText(json.formatted) : '');
      setRawResponse(typeof json?.raw === 'string' ? json.raw : '');
      setDisplayNumber(numeric);

      if (!isPremiumResponse) {
        if (typeof json?.remaining === 'number') {
          const safeRemaining = Math.max(0, Math.min(RT_LIMIT, json.remaining));
          const used = RT_LIMIT - safeRemaining;
          setUsedCount(used);
          try { localStorage.setItem(todayKey, String(used)); } catch {}
        } else if (json?.remaining === 'unlimited') {
          setUsedCount(0);
          try { localStorage.removeItem(todayKey); } catch {}
        } else if (!premiumNow) {
          try {
            const stored = Number(localStorage.getItem(todayKey) || '0');
            const safeStored = Number.isFinite(stored) ? stored : 0;
            const nextUsed = Math.min(RT_LIMIT, safeStored + 1);
            setUsedCount(nextUsed);
            localStorage.setItem(todayKey, String(nextUsed));
          } catch {
            setUsedCount((prev) => Math.min(RT_LIMIT, prev + 1));
          }
        }
      }

      saveHistory({
        url: normalizedUrl,
        keyword: trimmedKeyword,
        formatted: typeof json?.formatted === 'string' ? json.formatted : '',
        page,
        position,
        ts: Date.now(),
      });
    } catch (err) {
      console.error('rank tracker fetch error', err);
      setError('Something went wrong while contacting the ranking service.');
      setShowOverlay(false);
    } finally {
      setLoading(false);
    }
  };

  const runWizard = async () => {
    const normalizedUrl = normalizeUrl(wizardUrl);
    setWizardError('');
    setWizardReport('');
    setWizardTyped('');
    setWizardRemaining(null);
    if (!normalizedUrl) {
      setWizardError('Enter a valid URL.');
      return;
    }
    setWizardLoading(true);
    setOverlayType('wizard');
    setShowOverlay(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch(fnBase ? `${fnBase}/homeranktrackerWizard` : '/.netlify/functions/homeranktrackerWizard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url: normalizedUrl })
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setShowPremium(true);
        setShowOverlay(false);
        setOverlayType(null);
        return;
      }

      if (!res.ok || json?.success !== true) {
        setWizardError(json?.error || 'Unable to fetch wizard report.');
        return;
      }

      if (json?.premium) setServerPremium(true);
      setWizardRemaining(json?.remaining ?? null);
      setWizardReport(typeof json?.report === 'string' ? json.report : '');
    } catch (e) {
      console.error('wizard error', e);
      setWizardError('Something went wrong while contacting the wizard service.');
    } finally {
      setWizardLoading(false);
    }
  };

  const runWizardExample = () => {
    const exampleUrl = 'https://harrypotter.com/';
    setWizardUrl(exampleUrl);
    setOverlayType('wizard');
    setShowOverlay(true);
    setWizardLoading(false);
    setWizardError('');
    setWizardRemaining('unlimited');
    setWizardReport(SAMPLE_WIZARD_REPORT);
  };

  const runRankExample = () => {
    const exampleUrl = 'https://harrypotter.com/';
    const exampleKeyword = 'Harry Potter';
    setUrl(exampleUrl);
    setKeyword(exampleKeyword);
    setOverlayType('rank');
    setShowOverlay(true);
    setLoading(false);
    setError('');
    setCurrentQuery({ url: exampleUrl, keyword: exampleKeyword });
    setFormatted(normalizeText(SAMPLE_RANK_FORMATTED));
    setRawResponse('');
    setDisplayNumber(3);
    setTypedNumber('');
    saveHistory({ url: exampleUrl, keyword: exampleKeyword, formatted: SAMPLE_RANK_FORMATTED, page: 1, position: 3, ts: Date.now() });
  };

  const openWizardPdf = () => {
    if (!wizardReport) return;
    // Build a printable HTML report and open in a new window. User can save as PDF via browser print.
    const cleanedHtml = renderWizardMarkdown(wizardReport);
    const title = 'Rank Wizard Report';
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111;padding:24px}
      h1{font-size:20px;margin:0 0 8px}
      .meta{font-size:12px;color:#666;margin-bottom:12px}
      .content{font-size:14px;line-height:1.5;white-space:pre-wrap}
      a{color:#0366d6}
      .section{margin-bottom:16px}
    </style></head><body>
      <h1>${title}</h1>
      <div class="meta">URL: ${escapeHtml(wizardUrl || '')} • Generated: ${new Date().toLocaleString()}</div>
      <div class="section content">${cleanedHtml}</div>
    </body></html>`;
    const w = window.open('','_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Give the browser a moment to render then trigger print so user can save as PDF
    setTimeout(() => {
      try { w.focus(); w.print(); } catch (e) { console.error('print failed', e); }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/10 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                onClick={() => navigate('/')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
                className="flex items-center gap-3"
              >
                <div className="p-1.5 rounded-lg">
                  <Infinity className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Backlink ∞</h1>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <Tabs value={premiumTab} onValueChange={(value) => {
                setPremiumTab(value);
                if (value === 'rank') {
                  navigate('/rank-tracker');
                } else {
                  navigate('/rank-tracker/premium');
                }
              }}>
                <TabsList className="bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="rank" className="data-[state=active]:bg-background">Rank Tracker</TabsTrigger>
                  <TabsTrigger value="premium" className="data-[state=active]:bg-background">Premium</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/rank-tracker/premium')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Star className="h-4 w-4" />
                <span className="hidden md:inline">Go Premium</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigation</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/') }>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/rank-tracker/premium')}>
                    <Star className="mr-2 h-4 w-4" />
                    Go Premium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Infinity className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/blog')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Blog
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/keyword-research')}>
                    <Search className="mr-2 h-4 w-4" />
                    Keyword Research
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/rank-tracker')}>
                    <LineChart className="mr-2 h-4 w-4" />
                    Rank Tracker
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="hidden md:fixed md:left-0 md:top-[73px] md:h-auto md:w-64 md:flex md:flex-col md:border md:border-border/50 md:bg-background/40 md:backdrop-blur-sm md:z-[9999] md:p-4 md:space-y-4 md:overflow-y-auto md:rounded-lg">
          <Tabs
            value={navValue}
            onValueChange={(v) => {
              const val = v as typeof navValue;
              setNavValue(val);
              openOnly(val);
              if (val === 'wizard') scrollTo(wizardRef);
              else if (val === 'rank') scrollTo(rankRef);
              else if (val === 'competition') scrollTo(competitionRef);
              else scrollTo(historyRef);
            }}
            className="flex flex-col w-full"
          >
            <TabsList className="flex flex-col h-auto gap-1 bg-transparent p-0">
              <TabsTrigger value="wizard" className="w-full justify-start gap-2 text-left">Wizard</TabsTrigger>
              <TabsTrigger value="rank" className="w-full justify-start gap-2 text-left"><Search className="h-4 w-4" /> Rank</TabsTrigger>
              <TabsTrigger value="competition" className="w-full justify-start gap-2 text-left"><TrendingUp className="h-4 w-4" /> Competition</TabsTrigger>
              <TabsTrigger value="history" className="w-full justify-start gap-2 text-left"><History className="h-4 w-4" /> History</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col items-stretch gap-2 pt-4 border-t border-border/30">
            <Button variant="outline" size="sm" onClick={expandAll} className="w-full justify-center">Expand all</Button>
            <Button variant="ghost" size="sm" onClick={collapseAll} className="w-full justify-center">Collapse all</Button>
          </div>
        </div>

        <main className="flex-1 px-4 py-4 w-full md:ml-64 overflow-hidden">
          <div className="md:hidden sticky top-[73px] left-0 right-0 z-[10000] bg-white/95 backdrop-blur-sm p-3 border-b border-border/50 rounded-lg">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Tabs
                value={navValue}
                onValueChange={(v) => {
                  const val = v as typeof navValue;
                  setNavValue(val);
                  openOnly(val);
                  if (val === 'wizard') scrollTo(wizardRef);
                  else if (val === 'rank') scrollTo(rankRef);
                  else if (val === 'competition') scrollTo(competitionRef);
                  else scrollTo(historyRef);
                }}
              >
                <TabsList>
                  <TabsTrigger value="wizard" className="gap-2">Wizard</TabsTrigger>
                  <TabsTrigger value="rank" className="gap-2"><Search className="h-4 w-4" /> Rank</TabsTrigger>
                  <TabsTrigger value="competition" className="gap-2"><TrendingUp className="h-4 w-4" /> Competition</TabsTrigger>
                  <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /> History</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-1 w-full justify-center mt-2">
                <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">Expand all</Button>
                <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">Collapse all</Button>
              </div>
            </div>
          </div>

        <section className="pt-4 pb-40 w-full mx-auto" style={{ maxWidth: '90%' }}>

          <Card className="rainbow-hover-target">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl mb-4">
                <Search className="h-6 w-6" />
                Rank Tracker Tools
              </CardTitle>
            </CardHeader>

            <Tabs value={navValue} onValueChange={(v) => setNavValue(v as typeof navValue)} className="w-full">
              <div className="px-6 pb-4 overflow-x-auto">
                <TabsList className="inline-flex w-full gap-2 bg-transparent p-0 h-auto min-w-full justify-start sm:justify-center">
                  <TabsTrigger value="wizard" className="flex items-center gap-2 text-sm">
                    <span className="hidden sm:inline">Wizard</span>
                    <span className="sm:hidden">W</span>
                  </TabsTrigger>
                  <TabsTrigger value="rank" className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Rank</span>
                  </TabsTrigger>
                  <TabsTrigger value="competition" className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Competition</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2 text-sm">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Wizard Tab */}
              <TabsContent value="wizard" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="rounded-3xl p-4 border-0 bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 ring-1 ring-purple-200">
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-3 text-lg font-semibold">
                        <span>Wizard</span>
                        <span className="text-sm text-muted-foreground">(discover keywords & opportunities)</span>
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                        <Input
                          value={wizardUrl}
                          onChange={(e) => setWizardUrl(e.target.value)}
                          placeholder="https://example.com"
                          onKeyDown={(e) => { if (e.key === 'Enter') runWizard(); }}
                          inputMode="url"
                          className="ring-1 ring-purple-100 shadow-none"
                        />
                        <div className="flex gap-2">
                          <Button onClick={runWizard} disabled={wizardLoading} className="sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full px-5 py-2 hover:scale-105 transform transition-all">
                            {wizardLoading ? 'Starting...' : 'Start'}
                          </Button>
                        </div>
                      </div>
                      {wizardError ? (
                        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{wizardError}</div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              {/* Rank Tracker Tab */}
              <TabsContent value="rank" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1" htmlFor="rank-url">
                        <LinkIcon className="h-3.5 w-3.5" />
                        Page URL
                      </label>
                      <Input
                        id="rank-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/my-page"
                        onKeyDown={(e) => { if (e.key === 'Enter') runLookup(); }}
                        inputMode="url"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1" htmlFor="rank-keyword">
                        <Search className="h-3.5 w-3.5" />
                        Keyword
                      </label>
                      <Input
                        id="rank-keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="best backlink software"
                        onKeyDown={(e) => { if (e.key === 'Enter') runLookup(); }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button onClick={runLookup} disabled={loading} className="sm:w-auto">
                        {loading ? 'Checking...' : 'Check Ranking'}
                      </Button>
                    </div>
                    {premiumAccess ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                        Unlimited searches active.
                      </div>
                    ) : null}
                  </div>
                  {error ? <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div> : null}
                </CardContent>
              </TabsContent>

              {/* Competition Tab */}
              <TabsContent value="competition" className="mt-0">
                <CardContent>
                  <HomeRankTrackerCompetition fnBase={fnBase} />
                </CardContent>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0">
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Ranking History
                    </h3>
                    {history.length > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const confirmClear = window.confirm('Clear all saved ranking checks?');
                          if (confirmClear) clearHistory();
                        }}
                      >
                        Clear All
                      </Button>
                    ) : null}
                  </div>

                  {/* Ranking Performance Graph */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                      <TrendingUp className="h-4 w-4" />
                      Ranking Performance (lower is better)
                    </div>
                    {chartData.length === 0 || recentSeries.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No graph data yet. Run a few checks to see changes over time.</div>
                    ) : (
                      <ChartContainer config={chartConfig} className="w-full">
                        <ReLineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} width={60} reversed domain={[1, 'auto']} allowDecimals={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ReferenceLine y={10} stroke="#16a34a" strokeDasharray="4 4" label={{ value: 'Top 10', position: 'right', fill: '#16a34a' }} />
                          <ReferenceLine y={20} stroke="#0ea5e9" strokeDasharray="4 4" label={{ value: 'Top 20', position: 'right', fill: '#0ea5e9' }} />
                          <ReferenceLine y={50} stroke="#a3a3a3" strokeDasharray="4 4" label={{ value: 'Top 50', position: 'right', fill: '#a3a3a3' }} />
                          {recentSeries.map((s) => (
                            <Line
                              key={s.key}
                              type="monotone"
                              dataKey={s.key}
                              stroke={chartColors[s.key]}
                              strokeWidth={2}
                              isAnimationActive={false}
                              connectNulls
                              dot={(props: any) => {
                                const { cx, cy, value, payload } = props;
                                const delta = payload?.[`${s.key}__delta`];
                                const fill = delta == null ? '#8884d8' : delta < 0 ? '#10b981' : delta > 0 ? '#ef4444' : '#a3a3a3';
                                if (value == null) return null;
                                return <circle cx={cx} cy={cy} r={3} fill={fill} stroke="white" strokeWidth={1} />;
                              }}
                            />
                          ))}
                          <ChartLegend content={<ChartLegendContent />} />
                        </ReLineChart>
                      </ChartContainer>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No ranking checks yet.</div>
                  ) : (
                    <ul className="divide-y">
                      {history.map((item, index) => (
                        <li key={`${item.url}-${item.keyword}-${item.ts}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate" title={item.keyword}>{item.keyword}</div>
                            <div className="text-xs text-muted-foreground truncate" title={item.url}>{item.url}</div>
                            <div className="text-xs text-muted-foreground">{new Date(item.ts).toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold whitespace-nowrap">
                              {item.formatted || '—'}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              aria-label={`Delete history item ${item.keyword}`}
                              onClick={() => {
                                const confirmDelete = window.confirm('Delete this ranking check?');
                                if (confirmDelete) deleteHistoryIndex(index);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </section>
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
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={() => { if (!loading) { setShowOverlay(false); setOverlayType(null); } }}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-white/15 bg-black/85 p-6 text-white shadow-2xl rt-overlay"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 text-white transition hover:text-white"
              onClick={() => { setShowOverlay(false); setOverlayType(null); }}
              aria-label="Close ranking overlay"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-5 pt-2">
              {overlayType === 'rank' ? (
                <>
                  {currentQuery ? (
                    <div className="space-y-1 text-xs uppercase tracking-[0.2em] text-white">
                      <div>URL: <span className="font-semibold text-white">{currentQuery.url}</span></div>
                      <div>Keyword: <span className="font-semibold text-white">{currentQuery.keyword}</span></div>
                    </div>
                  ) : null}

                  {loading ? (
                    <div className="flex items-center gap-3 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-sm">Checking Google ranking...</span>
                    </div>
                  ) : formatted ? (
                    <div className="space-y-4">
                      {displayNumber != null ? (
                        <div className="text-4xl font-semibold tracking-tight">
                          {typedNumber}
                          <span aria-hidden="true" className="animate-pulse">|</span>
                        </div>
                      ) : null}
                      <div className="whitespace-pre-line text-sm text-white">{formatted}</div>
                    </div>
                  ) : rawResponse ? (
                    <p className="text-base font-light leading-relaxed text-white">{rawResponse}</p>
                  ) : (
                    <p className="text-base font-light leading-relaxed text-white">No ranking data returned. Try refining your keyword or URL.</p>
                  )}

                  {premiumAccess && (
                    <div className="text-xs text-white">Unlimited premium access active.</div>
                  )}
                </>
              ) : overlayType === 'wizard' ? (
                <>
                  <div className="text-xs uppercase tracking-[0.2em] text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Wizard</span>
                      <span className="text-xs text-white/80">(<button type="button" onClick={() => setShowPremium(true)} className="underline">upgrade to Premium for Wizard Pro</button>)</span>
                    </div>
                  </div>

                  {wizardLoading ? (
                    <div className="flex items-center gap-3 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-sm">Analyzing site...</span>
                    </div>
                  ) : wizardReport ? (
                    <div className="space-y-3">
                      <div className="max-h-[60vh] overflow-auto text-sm text-white">
                        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-a:text-white prose-ul:text-white prose-ol:text-white prose-li:text-white prose-li:marker:text-white" dangerouslySetInnerHTML={{ __html: renderWizardMarkdown(wizardTyped) }} />
                        <span aria-hidden="true" className="animate-pulse">|</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                        {!premiumAccess ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-500 hover:to-orange-600 always-rainbow glare-button rounded-full px-4 py-2"
                              onClick={() => setShowPremium(true)}
                            >
                              <Crown className="h-4 w-4 mr-2" /> Upgrade to Premium — $29/mo
                            </Button>
                            <span className="text-xs text-white/80">Unlock SEO automation & keyword rankings</span>
                          </div>
                        ) : <div />}
                        <div className="flex flex-col items-end gap-2">
                          <div className="w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 border-white" onClick={openWizardPdf}><Download className="h-4 w-4 mr-2" />Download PDF</Button>
                          </div>
                          {wizardRemaining != null && !premiumAccess ? (
                            <span className="text-xs text-white">Remaining today: {wizardRemaining === 'unlimited' ? 'unlimited' : wizardRemaining}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : wizardError ? (
                    <div className="text-sm text-red-300">{wizardError}</div>
                  ) : (
                    <p className="text-base font-light leading-relaxed text-white">No report generated. Try another URL.</p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
