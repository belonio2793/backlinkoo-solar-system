import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
  Info,
  Server,
  Cloud,
} from 'lucide-react';
import { safeFetch } from '@/utils/fullstoryWorkaround';

type StatusLevel = 'online' | 'offline' | 'limited' | 'unknown' | 'missing';

interface CheckResult {
  status: StatusLevel;
  message?: string;
  detail?: string;
}

interface StatusSnapshot {
  netlifyApi: CheckResult;
  supabase: CheckResult;
  lastChecked: number | null;
}

const withTimeout = async <T,>(ms: number, promise: Promise<T>): Promise<T> => {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), ms);
  try {
    // @ts-ignore - propagate signal if fetch provided
    const res = await promise;
    return res as T;
  } finally {
    clearTimeout(tid);
  }
};

export default function ApiConnectivityStatus() {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [snapshot, setSnapshot] = useState<StatusSnapshot>({
    netlifyApi: { status: 'unknown' },
    supabase: { status: 'unknown' },
    lastChecked: null,
  });

  const env = {
    supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '',
    supabaseAnon: (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '',
    netlifyFunctionsUrl: (import.meta.env.VITE_NETLIFY_FUNCTIONS_URL as string | undefined) || '',
    netlifySiteId: (import.meta.env.VITE_NETLIFY_SITE_ID as string | undefined) || '',
    useNetlifyProbe: false,
    stripeKey: (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) || '',
  };

  const isNetlifyHost = useMemo(() => typeof window !== 'undefined' && /\.netlify\.app$/.test(window.location.hostname), []);


  const runChecks = async () => {
    setLoading(true);
    try {
      const results: StatusSnapshot = {
        netlifyApi: { status: 'unknown' },
        supabase: { status: 'unknown' },
        lastChecked: Date.now(),
      };

      // Netlify API: check server-side function health (no client secrets)
      if (env.netlifyFunctionsUrl) {
        try {
          const u = env.netlifyFunctionsUrl.replace(/\/$/, '') + '/netlify-debug?action=test_config';
          const res = await withTimeout(6000, safeFetch(u));
          results.netlifyApi = res.ok ? { status: 'online', message: 'Server configured' } : { status: 'limited', message: `HTTP ${res.status}` };
        } catch (e: any) {
          results.netlifyApi = { status: 'limited', message: 'Probe failed', detail: e?.message || String(e) };
        }
      } else {
        results.netlifyApi = { status: 'missing', message: 'Functions URL not configured' };
      }


      // Supabase (DB check only)
      if (env.supabaseUrl && env.supabaseAnon) {
        try {
          const restUrl = env.supabaseUrl.replace(/\/$/, '') + '/rest/v1/domains?select=id&limit=1';
          const res = await withTimeout(6000, safeFetch(restUrl, {
            method: 'GET',
            headers: { apikey: env.supabaseAnon, Authorization: `Bearer ${env.supabaseAnon}` },
          }));
          // Treat 409 as limited (conflict) rather than crash
          if (res.status === 409) {
            results.supabase.status = 'limited';
            results.supabase.message = 'Conflict (409)';
          } else {
            results.supabase.status = res.ok ? 'online' : 'limited';
            results.supabase.message = res.ok ? 'DB reachable' : `HTTP ${res.status}`;
          }
        } catch (e: any) {
          results.supabase = { status: 'limited', message: 'Probe failed', detail: e?.message || String(e) };
        }
      } else {
        results.supabase = { status: 'missing', message: 'Supabase URL/Anon key missing' };
      }

      setSnapshot(results);

      // Toast hints
      if (results.netlifyApi.status === 'online' && results.supabase.status === 'online') {
        toast.success('All core services responding');
      } else if (
        results.supabase.status === 'offline'
      ) {
        toast.error('Some functions are offline');
      } else if (
        results.netlifyApi.status === 'limited' ||
        results.supabase.status === 'limited'
      ) {
        toast.warning('Limited connectivity detected');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(runChecks, 800);
    return () => clearTimeout(t);
  }, []);

  const overallLabel = () => {
    const s = snapshot;
    if (loading) return 'Checking...';
    const anyOffline = [s.supabase].some(x => x.status === 'offline');
    if (anyOffline) return 'Services Offline';
    const anyLimited = [s.netlifyApi, s.supabase].some(x => x.status === 'limited');
    if (anyLimited) return 'Partial Connectivity';
    const allOnline = [s.netlifyApi, s.supabase].every(x => x.status === 'online');
    return allOnline ? 'Online' : 'Monitoring';
  };

  const iconFor = (r: CheckResult) => {
    if (loading) return <Loader2 className="h-3 w-3 animate-spin" />;
    switch (r.status) {
      case 'online':
        return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      case 'limited':
        return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
      case 'offline':
      case 'missing':
        return <XCircle className="h-3 w-3 text-red-600" />;
      default:
        return <AlertTriangle className="h-3 w-3 text-gray-400" />;
    }
  };

  const colorFor = (r: CheckResult) => {
    switch (r.status) {
      case 'online':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'limited':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'offline':
      case 'missing':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const errors: string[] = [];
  // Only include critical connectivity errors here
  // Netlify functions probe optional; no critical error push in Supabase-only mode
  if (snapshot.netlifyApi.status === 'limited' || snapshot.netlifyApi.status === 'offline') errors.push('Netlify API access appears blocked or returned errors');

  return (
    <div className="w-full">
      <div className="w-full border rounded-lg bg-white p-3">
        <div className="flex items-center gap-2">
          <Badge className={`gap-1 ${colorFor({ status: errors.length ? 'limited' : 'online' })}`}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : (overallLabel() === 'Monitoring' ? <Cloud className="h-3 w-3" /> : <Server className="h-3 w-3" />)}
            {overallLabel()}
          </Badge>
          <div className="ml-2 flex flex-wrap gap-2">
            <Badge className={`gap-1 ${colorFor(snapshot.netlifyApi)}`} title={snapshot.netlifyApi.detail || snapshot.netlifyApi.message || ''}>
              {iconFor(snapshot.netlifyApi)} Host Connection
            </Badge>
            <Badge className={`gap-1 ${colorFor(snapshot.supabase)}`} title={snapshot.supabase.detail || snapshot.supabase.message || ''}>
              {iconFor(snapshot.supabase)} Database Connection
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={runChecks} disabled={loading} className="h-6 w-6 p-0" title="Refresh">
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(v => !v)} className="h-6 w-6 p-0" title="Details">
              <Info className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {expanded && (
          <div className="mt-3 text-sm">
            {errors.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="font-medium text-red-800 mb-2">Connectivity Errors:</div>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" /> All systems look good
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-2 rounded border bg-gray-50">
                <div className="text-xs font-medium mb-1">Detected Environment</div>
                <div className="text-xs space-y-1">
                  <div>SUPABASE_URL: {env.supabaseUrl ? 'present' : 'missing'}</div>
                  <div>SUPABASE_ANON_KEY: {env.supabaseAnon ? 'present' : 'missing'}</div>
                  <div>NETLIFY_ACCESS_TOKEN: {env.netlifyToken ? 'present' : 'missing'}</div>
                  <div>NETLIFY_SITE_ID: {env.netlifySiteId ? 'present' : 'missing'}</div>
                </div>
              </div>
              <div className="p-2 rounded border bg-gray-50">
                <div className="text-xs font-medium mb-1">Tips</div>
                <ul className="text-xs list-disc list-inside space-y-1">
                  <li>Ensure Supabase Edge Function is deployed (domains)</li>
                  {(!env.stripeKey) && (
                    <li>Optional: VITE_STRIPE_PUBLISHABLE_KEY not detected in client build; payments may be disabled in UI</li>
                  )}
                </ul>
              </div>
            </div>
            {snapshot.lastChecked && (
              <div className="text-xs text-gray-500 mt-2">Last checked: {new Date(snapshot.lastChecked).toLocaleTimeString()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
