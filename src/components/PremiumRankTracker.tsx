import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LineChart as ReLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PremiumCheckoutModal } from '@/components/PremiumCheckoutModal';

type RankingKeywordRow = {
  keyword: string;
  ranking_position: number | null;
  ranking_page: string | null;
  ranking_page_number: number | null;
  estimated_position?: number | null;
  monthly_searches?: number | null;
  traffic_estimate?: number | null;
  notes?: string | null;
  [key: string]: unknown;
};

export default function PremiumRankTracker() {
  const { user, isPremium } = useAuth();
  const [jobUrl, setJobUrl] = useState('');
  const [jobKeyword, setJobKeyword] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsPage, setJobsPage] = useState(1);
  const jobsPageSize = 10;
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiHistory, setAiHistory] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('aiRankPremiumHistory') || '[]'); } catch { return []; }
  });
  // Research UI state
  const [kwTokens, setKwTokens] = useState<string[]>([]);
  const [kwInput, setKwInput] = useState('');
  const [researchRows, setResearchRows] = useState<any[]>([]);
  const [researchLoading, setResearchLoading] = useState(false);
  const [tableFilter, setTableFilter] = useState('');
  const [sortBy, setSortBy] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'monthly_searches', dir: 'desc' });
  // Saved datasets
  const [datasetName, setDatasetName] = useState('My Research');
  const [savedSets, setSavedSets] = useState<{ id:string; name:string; rows:any[]; ts:number }[]>(() => {
    try { return JSON.parse(localStorage.getItem('aiResearchSets') || '[]'); } catch { return []; }
  });
  const [activeTool, setActiveTool] = useState<'research' | 'ranking'>('research');
  const [rankingUrl, setRankingUrl] = useState('');
  const [showPremiumCheckout, setShowPremiumCheckout] = useState(false);

  React.useEffect(() => {
    if (!isPremium) setShowPremiumCheckout(true);
    else setShowPremiumCheckout(false);
  }, [isPremium]);
  const [rankingRows, setRankingRows] = useState<RankingKeywordRow[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [rankingRemaining, setRankingRemaining] = useState<string | number | null>(null);

  const toolNavClass = (tool: 'research' | 'ranking') =>
    [
      'w-full text-left px-2 py-1 rounded transition',
      activeTool === tool ? 'bg-muted/80 font-semibold text-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground',
    ].join(' ');

  const rankingRemainingLabel = useMemo(() => {
    if (rankingRemaining === 'unlimited') return 'Unlimited';
    if (typeof rankingRemaining === 'number') return formatNumber(rankingRemaining);
    if (typeof rankingRemaining === 'string' && rankingRemaining.trim()) return rankingRemaining;
    return null;
  }, [rankingRemaining]);

  const fnBase = (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL || '';
  const fnBaseLocal = fnBase || '';
  const premiumFnUrl = useMemo(() => (fnBaseLocal ? `${fnBaseLocal}/homeranktrackerPremium` : '/.netlify/functions/homeranktrackerPremium'), [fnBaseLocal]);
  const rankingFnUrl = useMemo(
    () => (fnBaseLocal ? `${fnBaseLocal}/homeranktrackerPremiumrankingkeywords` : '/.netlify/functions/homeranktrackerPremiumrankingkeywords'),
    [fnBaseLocal]
  );

  useEffect(() => { loadJobs(1); }, [user]);

  function normalizeUrl(v: string) {
    const t = (v || '').trim();
    if (!t) return null;
    try {
      return new URL(t).toString();
    } catch {
      try { return new URL('https://' + t).toString(); } catch { return null; }
    }
  }

  const loadJobs = async (page = 1) => {
    if (!user?.id) return;
    setJobsLoading(true);
    try {
      const from = (page - 1) * jobsPageSize;
      const to = page * jobsPageSize - 1;
      const { data, error } = await supabase.from('rank_jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).range(from, to);
      if (error) throw error;
      setJobs(data || []);
      setJobsPage(page);
    } catch (e) {
      console.error('loadJobs', e);
    } finally { setJobsLoading(false); }
  };

  const createJob = async () => {
    if (!user?.id) { alert('Please sign in or upgrade to Premium'); return; }
    const nUrl = normalizeUrl(jobUrl || '');
    const kw = (jobKeyword || '').trim();
    if (!nUrl || !kw) { alert('Enter a valid URL and keyword'); return; }
    try {
      const { data, error } = await supabase.from('rank_jobs').insert([{ user_id: user.id, url: nUrl, keyword: kw }]).select('id').maybeSingle();
      if (error) throw error;
      setJobUrl(''); setJobKeyword('');
      await loadJobs(1);
    } catch (e) { console.error('createJob', e); alert('Failed to create job'); }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this tracked job?')) return;
    try {
      const { error } = await supabase.from('rank_jobs').delete().eq('id', id);
      if (error) throw error;
      if (selectedJob?.id === id) { setSelectedJob(null); setResults([]); }
      await loadJobs(jobsPage);
    } catch (e) { console.error('deleteJob', e); alert('Delete failed'); }
  };

  const selectJob = async (j: any) => {
    setSelectedJob(j);
    setResultsLoading(true);
    try {
      const { data } = await supabase.from('rank_results').select('*').eq('job_id', j.id).order('run_at', { ascending: true }).limit(200);
      setResults(data || []);
    } catch (e) { console.error('selectJob', e); setResults([]); } finally { setResultsLoading(false); }
  };

  const manualRecheck = async (job_id: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const url = fnBaseLocal ? `${fnBaseLocal}/rankRecheck` : '/.netlify/functions/rankRecheck';
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ job_id }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { alert(json?.error || 'Manual recheck failed'); return; }
      await loadJobs(jobsPage);
      if (selectedJob?.id === job_id) await selectJob(selectedJob);
      alert('Re-check requested — results will appear shortly.');
    } catch (e) { console.error('manualRecheck', e); alert('Re-check failed'); }
  };

  const chartForResults = () => (results || []).map((r:any) => ({ label: new Date(r.run_at).toLocaleString(), rank: r.rank || null }));

  function saveAiHistory(entry:any) {
    const next = [entry, ...aiHistory].slice(0, 50);
    setAiHistory(next);
    try { localStorage.setItem('aiRankPremiumHistory', JSON.stringify(next)); } catch {}
  }

  function normalizeNumberValue(value: any) {
    if (value == null) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value));
    if (typeof value === 'string') {
      const cleaned = Number(value.replace(/[^0-9.]/g, ''));
      if (Number.isFinite(cleaned)) return Math.max(0, Math.round(cleaned));
    }
    return null;
  }

  function normalizeDifficultyValue(value: any) {
    if (!value) return null;
    const txt = String(value).toLowerCase();
    if (txt.includes('very')) return 'very hard';
    if (txt.includes('hard') && !txt.includes('very')) return 'hard';
    if (txt.includes('medium') || txt.includes('moderate')) return 'medium';
    if (txt.includes('easy') || txt.includes('low')) return 'easy';
    return null;
  }

  function normalizeCompetitorsList(value: any) {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((entry) => {
          if (!entry) return null;
          if (typeof entry === 'string') return entry.trim();
          if (typeof entry === 'object') {
            if (typeof entry.url === 'string') return entry.url.trim();
            if (typeof (entry as any).link === 'string') return (entry as any).link.trim();
            if (typeof (entry as any).href === 'string') return (entry as any).href.trim();
          }
          return null;
        })
        .filter((item): item is string => Boolean(item))
        .slice(0, 10);
    }
    if (typeof value === 'string') {
      return value
        .split(/\n|,/)
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 10);
    }
    return [];
  }

  function normalizeResearchRow(row: any) {
    if (!row) return null;
    const keyword = String(row.keyword || '').trim();
    if (!keyword) return null;
    const rankingPage = typeof row.ranking_page === 'string' && row.ranking_page.trim() ? row.ranking_page.trim() : null;
    const rankingPosition = normalizeNumberValue(row.ranking_position);
    const rankingPageNumber = normalizeNumberValue(row.ranking_page_number);
    const monthlySearches = normalizeNumberValue(row.monthly_searches);
    const dailyVisitors = (() => {
      const direct = normalizeNumberValue(row.daily_visitors);
      if (direct != null) return direct;
      if (monthlySearches != null) return Math.max(0, Math.round((monthlySearches * 0.32) / 30));
      return null;
    })();
    const topCompetitors = normalizeCompetitorsList(row.top_competitors);
    const difficulty = normalizeDifficultyValue(row.difficulty);
    return {
      keyword,
      ranking_page: rankingPage,
      ranking_position: rankingPosition,
      ranking_page_number: rankingPageNumber,
      monthly_searches: monthlySearches,
      daily_visitors: dailyVisitors,
      top_competitors: topCompetitors,
      difficulty,
    };
  }

  function normalizeRankingKeywordRow(row: any): RankingKeywordRow | null {
    if (!row) return null;
    const keyword = String(row.keyword ?? row.term ?? row.search_term ?? '').trim();
    if (!keyword) return null;
    const rankingPage = (() => {
      const candidates = [row.ranking_page, row.ranking_url, row.url, row.page];
      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) {
          return candidate.trim();
        }
      }
      return null;
    })();
    const rankingPosition = normalizeNumberValue(
      row.ranking_position ?? row.position ?? row.rank ?? row.google_rank ?? row.serp_position ?? row.estimated_position
    );
    const rankingPageNumber = normalizeNumberValue(
      row.ranking_page_number ?? row.page_number ?? row.google_page ?? row.serp_page
    );
    const monthlySearches = normalizeNumberValue(row.monthly_searches ?? row.search_volume ?? row.volume);
    const trafficEstimate = normalizeNumberValue(row.traffic_estimate ?? row.traffic ?? row.estimated_visitors);
    const estimatedPosition = normalizeNumberValue(row.estimated_position);
    const notes = typeof row.notes === 'string' ? row.notes.trim() : null;

    const normalized: RankingKeywordRow = {
      keyword,
      ranking_page: rankingPage,
      ranking_position: rankingPosition ?? null,
      ranking_page_number: rankingPageNumber ?? null,
    };

    if (monthlySearches != null) normalized.monthly_searches = monthlySearches;
    if (trafficEstimate != null) normalized.traffic_estimate = trafficEstimate;
    if (estimatedPosition != null && normalized.ranking_position == null) {
      normalized.estimated_position = estimatedPosition;
    }
    if (notes) normalized.notes = notes;

    return normalized;
  }

  function mergeResearchRows(existing: any[], incoming: any[]) {
    const combined = [...incoming, ...existing];
    const seen = new Set<string>();
    const merged: any[] = [];
    combined.forEach((row) => {
      const key = typeof row.keyword === 'string' ? row.keyword.toLowerCase() : '';
      if (!key || seen.has(key)) return;
      seen.add(key);
      merged.push(row);
    });
    return merged;
  }

  async function fetchPremiumAnalysis(targetUrl: string, keywords: string[]) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    const res = await fetch(premiumFnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url: targetUrl, keywords }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error || 'Request failed');
    }
    if (!json) {
      throw new Error('Empty response');
    }
    return json;
  }

  async function fetchRankingKeywords(targetUrl: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    const res = await fetch(rankingFnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url: targetUrl }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error || 'Request failed');
    }
    return json;
  }

  function formatNumber(value: number | null | undefined) {
    if (value == null) return '—';
    const num = Number(value);
    if (!Number.isFinite(num)) return '—';
    return num.toLocaleString?.() || num.toString();
  }

  function summarizeUrl(url?: string | null) {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      const path = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '';
      return `${parsed.hostname}${path}`;
    } catch {
      return url;
    }
  }

  function addTokenFromInput() {
    const val = (kwInput || '').trim();
    if (!val) return;
    if (!kwTokens.includes(val)) setKwTokens(prev => [...prev, val]);
    setKwInput('');
  }
  function removeToken(k:string) { setKwTokens(prev => prev.filter(x => x !== k)); }

  function compBadge(value: string | null | undefined) {
    const t = (value || '').toLowerCase();
    if (t.includes('very')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (t.includes('hard')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    if (t.includes('medium') || t.includes('moderate')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (t.includes('easy') || t.includes('low')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-muted text-foreground';
  }

  const difficultyRank: Record<string, number> = { easy: 1, medium: 2, hard: 3, 'very hard': 4 };

  function getSortValue(row: any, key: string) {
    switch (key) {
      case 'keyword':
        return (row.keyword || '').toLowerCase();
      case 'ranking_position':
        return row.ranking_position ?? Number.POSITIVE_INFINITY;
      case 'ranking_page_number':
        return row.ranking_page_number ?? Number.POSITIVE_INFINITY;
      case 'top_competitors_count':
        return Array.isArray(row.top_competitors) ? row.top_competitors.length : 0;
      case 'monthly_searches':
        return row.monthly_searches ?? 0;
      case 'daily_visitors':
        return row.daily_visitors ?? 0;
      case 'difficulty_score': {
        const keyName = typeof row.difficulty === 'string' ? row.difficulty.toLowerCase() : '';
        return difficultyRank[keyName] ?? Number.POSITIVE_INFINITY;
      }
      default:
        return row[key] ?? 0;
    }
  }

  const summary = useMemo(() => {
    const keywordCount = researchRows.length || 0;
    const totalMonthlySearches = researchRows.reduce((sum, row) => sum + (Number(row.monthly_searches) || 0), 0);
    const totalDailyVisitors = researchRows.reduce((sum, row) => sum + (Number(row.daily_visitors) || 0), 0);
    const positions = researchRows
      .map((row) => Number(row.ranking_position))
      .filter((val) => Number.isFinite(val) && val > 0);
    const averagePosition = positions.length ? Math.round(positions.reduce((sum, val) => sum + val, 0) / positions.length) : null;
    const difficultyCounts = researchRows.reduce<Record<string, number>>((acc, row) => {
      const key = typeof row.difficulty === 'string' ? row.difficulty.toLowerCase() : '';
      if (key) acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const averageDifficulty = Object.keys(difficultyCounts).length
      ? Object.entries(difficultyCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;
    return { keywordCount, totalMonthlySearches, totalDailyVisitors, averagePosition, averageDifficulty };
  }, [researchRows]);

  function renderCompetitorList(list: string[] | undefined | null) {
    if (!list || list.length === 0) {
      return <span className="text-muted-foreground">—</span>;
    }
    return (
      <ol className="space-y-1 text-xs text-muted-foreground max-w-[260px]">
        {list.map((item, idx) => (
          <li key={`${idx}-${item}`} className="truncate">
            <a
              href={item}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground block truncate"
              title={item}
            >
              {idx + 1}. {summarizeUrl(item)}
            </a>
          </li>
        ))}
      </ol>
    );
  }

  const renderResearchTable = () => (
    <div className="mt-3 overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm bg-background">
        <thead className="bg-muted/50 border-b border-border/50">
          <tr>
            <th className="text-center py-3 px-2 w-10 font-semibold text-muted-foreground">#</th>
          <th
            className="text-left px-3 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setSortBy((s) => ({ key: 'keyword', dir: s.key === 'keyword' && s.dir === 'desc' ? 'asc' : 'desc' }))}
          >
            Keyword
          </th>
          <th
            className="text-center px-3 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setSortBy((s) => ({ key: 'ranking_position', dir: s.key === 'ranking_position' && s.dir === 'desc' ? 'asc' : 'desc' }))}
          >
            Position
          </th>
          <th className="text-left px-3 py-3 font-semibold text-muted-foreground">URL</th>
          <th
            className="text-left px-3 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setSortBy((s) => ({ key: 'top_competitors_count', dir: s.key === 'top_competitors_count' && s.dir === 'desc' ? 'asc' : 'desc' }))}
          >
            Competitors
          </th>
          <th
            className="text-right px-3 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setSortBy((s) => ({ key: 'monthly_searches', dir: s.key === 'monthly_searches' && s.dir === 'desc' ? 'asc' : 'desc' }))}
          >
            Searches
          </th>
          <th
            className="text-right px-3 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setSortBy((s) => ({ key: 'daily_visitors', dir: s.key === 'daily_visitors' && s.dir === 'desc' ? 'asc' : 'desc' }))}
          >
            Visitors
          </th>
          <th
            className="text-center px-3 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setSortBy((s) => ({ key: 'difficulty_score', dir: s.key === 'difficulty_score' && s.dir === 'desc' ? 'asc' : 'desc' }))}
          >
            Difficulty
          </th>
          </tr>
        </thead>
        <tbody>
          {researchRows
            .filter((r) => !tableFilter || r.keyword.toLowerCase().includes(tableFilter.toLowerCase()))
            .sort((a, b) => {
              const av = getSortValue(a, sortBy.key);
              const bv = getSortValue(b, sortBy.key);
              if (typeof av === 'string' && typeof bv === 'string') {
                const cmp = av.localeCompare(bv);
                return sortBy.dir === 'asc' ? cmp : -cmp;
              }
              const numA = Number(av);
              const numB = Number(bv);
              if (!Number.isFinite(numA) && !Number.isFinite(numB)) return 0;
              if (!Number.isFinite(numA)) return sortBy.dir === 'asc' ? 1 : -1;
              if (!Number.isFinite(numB)) return sortBy.dir === 'asc' ? -1 : 1;
              if (numA === numB) return 0;
              return sortBy.dir === 'asc' ? numA - numB : numB - numA;
            })
            .map((r, i) => {
              const pageNumberLabel = r.ranking_page_number != null ? formatNumber(r.ranking_page_number) : '—';
              return (
                <tr key={r.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-3 text-muted-foreground text-sm">{i + 1}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-foreground break-words leading-tight">{r.keyword}</div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center leading-tight">
                      <span className="font-bold tabular-nums text-foreground">{formatNumber(r.ranking_position)}</span>
                      <span className="text-xs text-muted-foreground">{`p${pageNumberLabel}`}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {r.ranking_page ? (
                      <a
                        href={r.ranking_page}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                        title={r.ranking_page}
                      >
                        {summarizeUrl(r.ranking_page)}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top">{renderCompetitorList(r.top_competitors)}</td>
                  <td className="px-3 py-3 text-right tabular-nums font-medium">{formatNumber(r.monthly_searches)}</td>
                  <td className="px-3 py-3 text-right tabular-nums font-medium">{formatNumber(r.daily_visitors)}</td>
                  <td className="px-3 py-3 text-center">
                    {r.difficulty ? (
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${compBadge(r.difficulty)}`}>
                        {r.difficulty}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          {(!researchRows || researchRows.length === 0) && !researchLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm font-medium">No results yet</div>
                  <div className="text-xs">Add keywords and click Search to get started</div>
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );

  const renderRankingTable = () => {
    const sortedRows = [...rankingRows].sort((a, b) => {
      const aPos = a.ranking_position ?? a.estimated_position ?? Number.POSITIVE_INFINITY;
      const bPos = b.ranking_position ?? b.estimated_position ?? Number.POSITIVE_INFINITY;
      if (aPos === bPos) {
        return a.keyword.localeCompare(b.keyword);
      }
      return aPos - bPos;
    });

    return (
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm bg-background">
          <thead className="bg-muted/50 border-b border-border/50">
            <tr>
              <th className="text-center px-3 py-3 w-10 font-semibold text-muted-foreground">#</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground">Keyword</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Position</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground">URL</th>
              <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Page</th>
              <th className="text-right px-3 py-3 font-semibold text-muted-foreground">Searches</th>
              <th className="text-right px-3 py-3 font-semibold text-muted-foreground">Visitors</th>
              <th className="text-left px-3 py-3 font-semibold text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => {
              const positionValue = row.ranking_position ?? row.estimated_position ?? null;
              const showEstimated = row.ranking_position == null && row.estimated_position != null;
              const pageNumberLabel = row.ranking_page_number != null ? formatNumber(row.ranking_page_number) : '—';

              return (
                <tr key={`${row.keyword}-${index}`} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-3 text-muted-foreground text-sm">{index + 1}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-foreground break-words leading-tight">{row.keyword}</div>
                    {row.notes ? <div className="mt-1 text-xs text-muted-foreground break-words">{row.notes}</div> : null}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center leading-tight">
                      <span className="font-bold tabular-nums text-foreground">{formatNumber(positionValue)}</span>
                      {showEstimated ? <span className="text-xs text-muted-foreground">est.</span> : null}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {row.ranking_page ? (
                      <a
                        href={row.ranking_page}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                        title={row.ranking_page}
                      >
                        {summarizeUrl(row.ranking_page)}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center font-medium tabular-nums">{pageNumberLabel}</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums">{formatNumber(row.monthly_searches)}</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums">{formatNumber(row.traffic_estimate)}</td>
                  <td className="px-3 py-3 text-sm text-muted-foreground max-w-xs truncate">
                    {row.notes ? row.notes : '—'}
                  </td>
                </tr>
              );
            })}
            {sortedRows.length === 0 && !rankingLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-sm font-medium">No keywords discovered yet</div>
                    <div className="text-xs">Enter a URL above to discover ranking opportunities</div>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    );
  };

  function persistSets(next: any[]) {
    setSavedSets(next);
    try {
      localStorage.setItem('aiResearchSets', JSON.stringify(next));
    } catch {}
  }

  function saveCurrentSet() {
    if (!researchRows.length) {
      alert('Nothing to save');
      return;
    }
    const normalizedRows = researchRows
      .map((row) => normalizeResearchRow(row))
      .filter((row): row is NonNullable<ReturnType<typeof normalizeResearchRow>> => Boolean(row));
    const set = { id: String(Date.now()), name: datasetName || 'Untitled', rows: normalizedRows, ts: Date.now() };
    const next = [set, ...savedSets].slice(0, 20);
    persistSets(next);
  }

  function loadSet(id: string) {
    const found = savedSets.find((s) => s.id === id);
    if (found) {
      const normalized = (found.rows || [])
        .map((row: any) => normalizeResearchRow(row))
        .filter((row): row is NonNullable<ReturnType<typeof normalizeResearchRow>> => Boolean(row));
      setResearchRows(normalized);
      setDatasetName(found.name);
    }
  }

  function deleteSet(id: string) {
    persistSets(savedSets.filter((s) => s.id !== id));
  }

  function exportCSV() {
    const headers = ['keyword', 'ranking_page', 'ranking_position', 'ranking_page_number', 'top_competitors', 'monthly_searches', 'daily_visitors', 'difficulty'];
    const rows = researchRows.map((row) => {
      const values = [
        row.keyword,
        row.ranking_page || '',
        row.ranking_position ?? '',
        row.ranking_page_number ?? '',
        Array.isArray(row.top_competitors) ? row.top_competitors.join(' | ') : '',
        row.monthly_searches ?? '',
        row.daily_visitors ?? '',
        row.difficulty || '',
      ];
      return values
        .map((value) => {
          const v = String(value ?? '').replace(/"/g, '""');
          return '"' + v + '"';
        })
        .join(',');
    });
    const csv = [headers.join(',')].concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (datasetName || 'research') + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  async function runResearch() {
    const nUrl = normalizeUrl(jobUrl || '');
    const kws = kwTokens.length ? kwTokens : (jobKeyword ? [jobKeyword.trim()] : []);
    if (!nUrl || !kws.length) {
      alert('Enter a valid URL and at least one keyword');
      return;
    }
    setResearchLoading(true);
    try {
      const response = await fetchPremiumAnalysis(nUrl, kws);
      if (response?.success === false && (!Array.isArray(response?.rows) || response.rows.length === 0)) {
        throw new Error(response?.error || 'Unable to fetch keyword data');
      }
      const incoming = Array.isArray(response?.rows)
        ? response.rows
            .map((row: any) => normalizeResearchRow(row))
            .filter((row): row is NonNullable<ReturnType<typeof normalizeResearchRow>> => Boolean(row))
        : [];
      if (!incoming.length) {
        if (response?.errors?.length) {
          console.warn('runResearch errors', response.errors);
          alert('Keyword analysis returned no data. Please try again.');
        } else {
          alert('Keyword analysis returned no data. Please try again.');
        }
        return;
      }
      setResearchRows((prev) => mergeResearchRows(prev, incoming));
    } catch (e: any) {
      console.error('runResearch', e);
      alert(e?.message || 'Research failed');
    } finally {
      setResearchLoading(false);
    }
  }

  async function runRankingKeywords() {
    const normalizedUrl = normalizeUrl(rankingUrl || '');
    if (!normalizedUrl) {
      alert('Enter a valid URL');
      return;
    }
    setRankingLoading(true);
    setRankingError(null);
    try {
      const response = await fetchRankingKeywords(normalizedUrl);
      setRankingRemaining(response?.remaining ?? null);
      if (response?.success === false && (!Array.isArray(response?.rows) || response.rows.length === 0)) {
        throw new Error(response?.error || 'Unable to discover ranking keywords');
      }
      const incoming = Array.isArray(response?.rows)
        ? response.rows
            .map((row: any) => normalizeRankingKeywordRow(row))
            .filter((row): row is RankingKeywordRow => Boolean(row))
        : [];
      if (!incoming.length) {
        setRankingError('No ranking keywords were detected for this URL yet.');
        return;
      }
      const deduped = incoming.reduce<RankingKeywordRow[]>((acc, row) => {
        if (!acc.some((item) => item.keyword.toLowerCase() === row.keyword.toLowerCase())) {
          acc.push(row);
        }
        return acc;
      }, []);
      setRankingRows(deduped);
    } catch (e: any) {
      console.error('runRankingKeywords', e);
      setRankingError(e?.message || 'Failed to discover ranking keywords');
    } finally {
      setRankingLoading(false);
    }
  }

  async function runAiPreview() {
    const nUrl = normalizeUrl(jobUrl || '');
    const kw = (jobKeyword || '').trim();
    if (!nUrl || !kw) {
      alert('Enter a valid URL and keyword');
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetchPremiumAnalysis(nUrl, [kw]);
      if (response?.success === false && (!Array.isArray(response?.rows) || response.rows.length === 0)) {
        throw new Error(response?.error || 'Unable to analyze keyword');
      }
      const row = Array.isArray(response?.rows)
        ? response.rows
            .map((item: any) => normalizeResearchRow(item))
            .find((item): item is NonNullable<ReturnType<typeof normalizeResearchRow>> => Boolean(item))
        : null;
      if (!row) {
        if (response?.errors?.length) {
          console.warn('runAiPreview errors', response.errors);
        }
        throw new Error('No analysis returned for this keyword.');
      }
      const out = {
        url: nUrl,
        keyword: row.keyword,
        page: row.ranking_page,
        position: row.ranking_position,
        search_volume: row.monthly_searches,
        daily_visitors: row.daily_visitors,
        difficulty: row.difficulty,
        ts: Date.now(),
      };
      setAiResult(out);
      saveAiHistory(out);
      setResearchRows((prev) => mergeResearchRows(prev, [row]));
    } catch (e: any) {
      console.error('AI preview error', e);
      alert(e?.message || 'AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!isPremium && (
        <PremiumCheckoutModal
          isOpen={showPremiumCheckout}
          onClose={() => setShowPremiumCheckout(false)}
          onSuccess={() => { setShowPremiumCheckout(false); window.location.reload(); }}
        />
      )}
        {isPremium ? (
          <div>
            {/* Research panel (new UI similar to screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <aside className="md:col-span-1 p-3 md:p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Keyword Tools</div>
                <nav className="space-y-1 text-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTool('research')}
                    className={toolNavClass('research')}
                  >
                    Keyword Research
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTool('ranking')}
                    className={toolNavClass('ranking')}
                  >
                    Discover Rankings
                  </button>
                </nav>
              </aside>
              <section className="md:col-span-4 p-4">
                {activeTool === 'research' ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-muted/30 whitespace-normal break-words">
                          <div className="flex flex-wrap items-center gap-2 py-1">
                            {kwTokens.map(k => (
                              <span key={k} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs bg-background">
                                {k}
                                <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeToken(k)} aria-label={`Remove ${k}`}>×</button>
                              </span>
                            ))}
                            <input
                              className="outline-none bg-transparent text-sm min-w-[8ch]"
                              placeholder="Enter keyword here"
                              value={kwInput}
                              onChange={(e)=>setKwInput(e.target.value)}
                              onKeyDown={(e)=>{ if (e.key==='Enter' || e.key===',' || e.key==='Tab') { e.preventDefault(); addTokenFromInput(); } }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Input className="w-[260px]" placeholder="https://example.com" value={jobUrl} onChange={(e:any)=>setJobUrl(e.target.value)} />
                        <Button onClick={runResearch} disabled={researchLoading} className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-full px-5">
                          {researchLoading ? 'Searching…' : 'Search'}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
                        <div className="rounded-lg px-3 py-1.5 bg-muted/30 whitespace-normal break-words">Keywords: <span className="font-semibold">{formatNumber(summary.keywordCount)}</span></div>
                        <div className="rounded-lg px-3 py-1.5 bg-muted/30 whitespace-normal break-words">Monthly Searches: <span className="font-semibold">{formatNumber(summary.totalMonthlySearches)}</span></div>
                        <div className="rounded-lg px-3 py-1.5 bg-muted/30 whitespace-normal break-words">Daily Visitors: <span className="font-semibold">{formatNumber(summary.totalDailyVisitors)}</span></div>
                        <div className="rounded-lg px-3 py-1.5 bg-muted/30 whitespace-normal break-words">Avg Position: <span className="font-semibold">{summary.averagePosition != null ? formatNumber(summary.averagePosition) : '—'}</span></div>
                        <div className="rounded-lg px-3 py-1.5 bg-muted/30 whitespace-normal break-words">Common Difficulty: <span className="font-semibold capitalize">{summary.averageDifficulty || '—'}</span></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Input className="w-40" placeholder="Dataset name" value={datasetName} onChange={(e:any)=>setDatasetName(e.target.value)} />
                        <Button size="sm" variant="outline" onClick={saveCurrentSet}>Save</Button>
                        <Button size="sm" variant="outline" onClick={exportCSV}>Export CSV</Button>
                        <Input className="w-56" placeholder="Search table" value={tableFilter} onChange={(e:any)=>setTableFilter(e.target.value)} />
                      </div>
                    </div>

                    {renderResearchTable()}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Input
                        className="w-full sm:flex-1"
                        placeholder="https://example.com"
                        value={rankingUrl}
                        onChange={(e:any) => setRankingUrl(e.target.value)}
                        onKeyDown={(e:any) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (!rankingLoading) runRankingKeywords();
                          }
                        }}
                      />
                      <Button
                        onClick={runRankingKeywords}
                        disabled={rankingLoading}
                        className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-full px-5"
                      >
                        {rankingLoading ? 'Discovering…' : 'Discover Keywords'}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Paste a landing page or blog URL to have Backlink ∞ scan Google and list organic search terms it finds for your site.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                      {rankingRemainingLabel ? (
                        <span className="rounded-full bg-muted px-3 py-1">
                          Remaining checks today: <span className="font-medium text-foreground">{rankingRemainingLabel}</span>
                        </span>
                      ) : null}
                      {rankingRows.length ? (
                        <span className="rounded-full bg-muted px-3 py-1">
                          Keywords detected: <span className="font-medium text-foreground">{formatNumber(rankingRows.length)}</span>
                        </span>
                      ) : null}
                    </div>
                    {rankingError ? (
                      <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {rankingError}
                      </div>
                    ) : null}
                    {rankingLoading ? (
                      <div className="mt-3 text-sm text-muted-foreground">Discovering keywords…</div>
                    ) : null}
                    {renderRankingTable()}
                  </>
                )}
              </section>
            </div>

            {savedSets.length ? (
              <div className="mt-3 p-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Saved Datasets</div>
                <div className="flex flex-wrap gap-2">
                  {savedSets.map(s => (
                    <div key={s.id} className="flex items-center gap-2 rounded border px-2 py-1 text-xs bg-background">
                      <button className="underline" onClick={()=>loadSet(s.id)}>{s.name}</button>
                      <span className="text-muted-foreground">{new Date(s.ts).toLocaleDateString()}</span>
                      <button className="text-destructive" onClick={()=>deleteSet(s.id)} aria-label={`Delete ${s.name}`}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="text-muted-foreground">Create unlimited tracked (URL, keyword) pairs. We'll check them every 15 minutes and store results.</p>
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-indigo-400/20">
              <div className="flex items-center justify-between">
                <div className="font-medium">Instant AI Analysis</div>
                <Button size="sm" onClick={runAiPreview} disabled={aiLoading} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-500 hover:to-orange-600 rounded-full">
                  {aiLoading ? 'Analyzing…' : 'Run AI Analysis'}
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 mt-3">
                <Input placeholder="https://example.com/my-page" value={jobUrl} onChange={(e:any) => setJobUrl(e.target.value)} />
                <Input placeholder="target keyword" value={jobKeyword} onChange={(e:any) => setJobKeyword(e.target.value)} />
              </div>
              {aiResult ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-md p-3 bg-background">
                    <div className="text-xs text-muted-foreground">Position</div>
                    <div className="text-3xl font-semibold">{aiResult.position ?? '—'}</div>
                    <div className="text-xs truncate">{aiResult.page || aiResult.url}</div>
                  </div>
                  <div className="rounded-md p-3 bg-background">
                    <div className="text-xs text-muted-foreground">Monthly Volume</div>
                    <div className="text-3xl font-semibold">{aiResult.search_volume ?? '—'}</div>
                    <div className="mt-2 h-2 rounded bg-muted">
                      <div className="h-2 rounded bg-green-500" style={{ width: `${Math.min(100, Math.max(0, (aiResult.search_volume||0)/Math.max(1,(aiResult.search_volume||1))*100))}%` }} />
                    </div>
                  </div>
                  <div className="rounded-md p-3 bg-background">
                    <div className="text-xs text-muted-foreground">Est. Daily Visitors at #1</div>
                    <div className="text-3xl font-semibold">{aiResult.daily_visitors ?? '��'}</div>
                    <div className="text-xs capitalize">Difficulty: {aiResult.difficulty || '—'}</div>
                  </div>
                  <div className="sm:col-span-3">
                    <div className="text-sm font-medium mb-2">Position History</div>
                    <div style={{ width: '100%', height: 220 }}>
                      <ResponsiveContainer>
                        <ReLineChart data={[...aiHistory].filter(h=>h.keyword===aiResult.keyword && h.url===aiResult.url).map(h=>({ label: new Date(h.ts).toLocaleString(), rank: h.position }))} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" hide />
                          <YAxis reversed allowDecimals={false} domain={[1, 100]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="rank" stroke="#ef4444" dot={{ r: 2 }} />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <div className="text-sm font-medium mb-2">Volume vs. Visitors</div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <div className="h-24 bg-blue-500/20 rounded flex items-end"><div className="bg-blue-500 w-full rounded" style={{ height: `${Math.min(100, (aiResult.search_volume||0) ? Math.max(4, Math.log10(aiResult.search_volume+10)*20) : 4)}%` }} /></div>
                        <div className="text-xs mt-1 text-center">Monthly Volume</div>
                      </div>
                      <div className="flex-1">
                        <div className="h-24 bg-green-500/20 rounded flex items-end"><div className="bg-green-500 w-full rounded" style={{ height: `${Math.min(100, (aiResult.daily_visitors||0) ? Math.max(4, Math.log10(aiResult.daily_visitors+10)*20) : 4)}%` }} /></div>
                        <div className="text-xs mt-1 text-center">Daily Visitors</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="https://example.com/my-page" value={jobUrl} onChange={(e:any) => setJobUrl(e.target.value)} />
              <Input placeholder="target keyword" value={jobKeyword} onChange={(e:any) => setJobKeyword(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button onClick={createJob}>Add to tracking</Button>
              <Button variant="ghost" onClick={() => { setJobUrl(''); setJobKeyword(''); }}>Clear</Button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Tracked URLs</div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => loadJobs(1)}>Refresh</Button>
                </div>
              </div>
              {jobs.length === 0 ? <div className="text-sm text-muted-foreground">No tracked jobs yet.</div> : (
                <ul className="divide-y">
                  {jobs.map((j:any) => (
                    <li key={j.id} className="py-2 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{j.keyword}</div>
                        <div className="text-xs text-muted-foreground truncate">{j.url}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" onClick={() => selectJob(j)}>View</Button>
                        <Button size="sm" onClick={() => manualRecheck(j.id)}>Re-check</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteJob(j.id)}>Delete</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-muted-foreground">Page {jobsPage}</div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => loadJobs(Math.max(1, jobsPage - 1))}>Prev</Button>
                  <Button size="sm" onClick={() => loadJobs(jobsPage + 1)}>Next</Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {selectedJob ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{selectedJob.keyword} <span className="text-xs text-muted-foreground">{selectedJob.url}</span></div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => manualRecheck(selectedJob.id)}>Manual re-check</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedJob(null); setResults([]); }}>Close</Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    {results.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No results yet. Run a check to populate history.</div>
                    ) : (
                      <div style={{ width: '100%', height: 220 }}>
                        <ReLineChart data={chartForResults()} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis reversed allowDecimals={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="rank" stroke="#8884d8" dot={{ r: 3 }} />
                        </ReLineChart>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Research panel (preview) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <aside className="md:col-span-1">
                <div className="rounded-xl border border-border/50 bg-card/50  p-4 sticky top-24">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-1">Tools</div>
                  <nav className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('research')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${
                        activeTool === 'research'
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-200/50 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      Keyword Research
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTool('ranking')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${
                        activeTool === 'ranking'
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-200/50 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      Discover Rankings
                    </button>
                  </nav>
                </div>
              </aside>
              <section className="md:col-span-4 rounded-xl border border-border/50 bg-card/30  p-6">
                {activeTool === 'research' ? (
                  <>
                    <div className="space-y-4">
                      {/* Keyword and URL inputs */}
                      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Keywords</label>
                          <div className="flex items-center gap-2 rounded-lg px-4 py-3 bg-background border border-border/50 focus-within:border-blue-400/50 focus-within:ring-1 focus-within:ring-blue-400/20 transition-all">
                            <div className="flex flex-wrap items-center gap-2">
                              {kwTokens.map(k => (
                                <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
                                  {k}
                                  <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => removeToken(k)} aria-label={`Remove ${k}`}>×</button>
                                </span>
                              ))}
                              <input
                                className="outline-none bg-transparent text-sm min-w-[8ch] font-medium"
                                placeholder="Type keyword..."
                                value={kwInput}
                                onChange={(e)=>setKwInput(e.target.value)}
                                onKeyDown={(e)=>{ if (e.key==='Enter' || e.key===',' || e.key==='Tab') { e.preventDefault(); addTokenFromInput(); } }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 sm:flex-initial">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Website</label>
                            <Input className="h-10 rounded-lg" placeholder="example.com" value={jobUrl} onChange={(e:any)=>setJobUrl(e.target.value)} />
                          </div>
                          <div className="flex items-end">
                            <Button onClick={runResearch} disabled={researchLoading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg px-6 h-10 transition-all shadow-sm hover:shadow-md">
                              {researchLoading ? 'Searching…' : 'Search'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Stats display */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Keywords</div>
                          <div className="mt-1 text-lg font-bold text-foreground">{formatNumber(summary.keywordCount)}</div>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Searches/mo</div>
                          <div className="mt-1 text-lg font-bold text-foreground">{formatNumber(summary.totalMonthlySearches)}</div>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Visitors/day</div>
                          <div className="mt-1 text-lg font-bold text-foreground">{formatNumber(summary.totalDailyVisitors)}</div>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg Position</div>
                          <div className="mt-1 text-lg font-bold text-foreground">{summary.averagePosition != null ? formatNumber(summary.averagePosition) : '—'}</div>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Difficulty</div>
                          <div className="mt-1 text-lg font-bold text-foreground capitalize">{summary.averageDifficulty || '—'}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                        <div className="w-full sm:w-48">
                          <Input className="rounded-lg h-10" placeholder="Dataset name" value={datasetName} onChange={(e:any)=>setDatasetName(e.target.value)} />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button size="sm" variant="outline" onClick={saveCurrentSet} className="rounded-lg">Save Dataset</Button>
                          <Button size="sm" variant="outline" onClick={exportCSV} className="rounded-lg">Export CSV</Button>
                        </div>
                        <div className="flex-1 sm:ml-auto">
                          <Input className="rounded-lg h-10" placeholder="Filter results..." value={tableFilter} onChange={(e:any)=>setTableFilter(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      {renderResearchTable()}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      {/* URL input section */}
                      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Landing Page URL</label>
                          <Input
                            className="h-10 rounded-lg"
                            placeholder="https://example.com/your-page"
                            value={rankingUrl}
                            onChange={(e:any) => setRankingUrl(e.target.value)}
                            onKeyDown={(e:any) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (!rankingLoading) runRankingKeywords();
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={runRankingKeywords}
                          disabled={rankingLoading}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg px-6 h-10 transition-all shadow-sm hover:shadow-md"
                        >
                          {rankingLoading ? 'Discovering…' : 'Discover Keywords'}
                        </Button>
                      </div>

                      {/* Description */}
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Paste a landing page or blog URL to have Backlink ∞ scan Google and identify all organic search keywords your site ranks for.
                        </p>
                      </div>

                      {/* Stats and info */}
                      <div className="flex flex-wrap items-center gap-3">
                        {rankingRemainingLabel ? (
                          <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Remaining Today</div>
                            <div className="mt-1 text-lg font-bold text-foreground">{rankingRemainingLabel}</div>
                          </div>
                        ) : null}
                        {rankingRows.length ? (
                          <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Keywords Detected</div>
                            <div className="mt-1 text-lg font-bold text-foreground">{formatNumber(rankingRows.length)}</div>
                          </div>
                        ) : null}
                      </div>

                      {/* Errors and loading states */}
                      {rankingError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium">
                          {rankingError}
                        </div>
                      ) : null}
                      {rankingLoading ? (
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-muted-foreground border-t-foreground rounded-full" />
                          Discovering keywords from Google…
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6">
                      {renderRankingTable()}
                    </div>
                  </>
                )}
              </section>
            </div>

            {savedSets.length ? (
              <div className="rounded-lg border border-border/50 bg-card/30  p-4 mt-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Saved Datasets</div>
                <div className="flex flex-wrap gap-2">
                  {savedSets.map(s => (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background hover:border-border transition-colors px-3 py-2 text-xs">
                      <button className="font-medium text-blue-600 hover:text-blue-700 hover:underline" onClick={()=>loadSet(s.id)}>{s.name}</button>
                      <span className="text-muted-foreground">{new Date(s.ts).toLocaleDateString()}</span>
                      <button className="text-destructive hover:text-destructive/80 font-medium" onClick={()=>deleteSet(s.id)} aria-label={`Delete ${s.name}`}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

          </div>
        )}
    </div>
  );
}
