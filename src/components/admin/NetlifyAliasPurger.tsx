import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import NetlifyApiService from '@/services/netlifyApiService';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';
import { Trash2, Globe, RefreshCw, CheckCircle2, AlertTriangle, X } from 'lucide-react';

function normalizeDomain(d: string): string {
  return String(d || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

interface NetlifyDomainItem {
  id?: string;
  domain?: string;
  name?: string;
  hostname?: string;
  host?: string;
  custom_domain?: string;
  ssl_status?: string;
  state?: string;
  [key: string]: any;
}

export default function NetlifyAliasPurger() {
  const { isAdmin } = usePremium();
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<NetlifyDomainItem[]>([]);
  const [unverified, setUnverified] = useState<NetlifyDomainItem[]>([]);
  const [removing, setRemoving] = useState(false);
  const [results, setResults] = useState<{ domain: string; ok: boolean; message?: string }[]>([]);

  const [siteId, setSiteId] = useState<string>('');

  const isAllowed = isAdmin;

  // Initialize Site ID from env/localStorage and expose to window.ENV for NetlifyApiService
  useEffect(() => {
    const envSite = (import.meta as any).env?.VITE_NETLIFY_SITE_ID || '';
    const saved = (typeof window !== 'undefined' ? window.localStorage.getItem('admin.siteId') : '') || '';
    const initial = saved || envSite;
    setSiteId(initial);
    if (typeof window !== 'undefined') {
      (window as any).ENV = { ...(window as any).ENV, NETLIFY_SITE_ID: initial, VITE_NETLIFY_SITE_ID: initial };
    }
  }, []);

  const applySiteId = useCallback(() => {
    const clean = String(siteId || '').trim();
    if (!clean) {
      toast.error('Enter a Site ID');
      return;
    }
    if (typeof window !== 'undefined') {
      (window as any).ENV = { ...(window as any).ENV, NETLIFY_SITE_ID: clean, VITE_NETLIFY_SITE_ID: clean };
      window.localStorage.setItem('admin.siteId', clean);
    }
    toast.success('Site ID applied');
  }, [siteId]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await NetlifyApiService.getDomains();
      const items: NetlifyDomainItem[] = (res?.data?.domains as any[]) || [];

      // Fallback to site info alias list if domains endpoint empty
      if (!items.length) {
        const siteInfo = await NetlifyApiService.getSiteInfo();
        const aliases: string[] = Array.isArray(siteInfo?.data?.domain_aliases) ? siteInfo.data.domain_aliases.map(normalizeDomain) : [];
        const mapped = aliases.map((d) => ({ domain: d, ssl_status: 'unknown' }));
        setDomains(mapped);
        setUnverified(mapped);
        toast.success(`Loaded ${mapped.length} aliases; ${mapped.length} unverified (no status available).`);
        return;
      }

      // Normalize domain + status
      const normalized: NetlifyDomainItem[] = items.map((d) => {
        const domain = normalizeDomain(d?.domain || d?.name || d?.hostname || d?.host || d?.custom_domain || '');
        const status = d?.ssl_status || d?.certificate?.state || d?.state || 'unknown';
        return { ...d, domain, ssl_status: status };
      }).filter((d) => !!d.domain);

      const unverified = normalized.filter((d) => String(d.ssl_status || '').toLowerCase() !== 'dns_verified');

      setDomains(normalized);
      setUnverified(unverified);
      toast.success(`Loaded ${normalized.length} aliases; ${unverified.length} unverified.`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load Netlify domains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isAllowed) { refreshData(); } }, [isAllowed, refreshData]);

  const purge = useCallback(async () => {
    if (!unverified.length) {
      toast.info('No unverified aliases to remove');
      return;
    }
    setRemoving(true);
    setResults([]);
    try {
      const outcomes: { domain: string; ok: boolean; message?: string }[] = [];
      for (const item of unverified) {
        const domain = item.domain as string;
        try {
          const res = await NetlifyApiService.removeDomainAlias(domain);
          const ok = !!res?.success;
          const msg = res?.message || res?.error;
          outcomes.push({ domain, ok, message: msg });
        } catch (err: any) {
          outcomes.push({ domain, ok: false, message: err?.message || 'request failed' });
        }
      }
      setResults(outcomes);
      const success = outcomes.filter(o => o.ok).length;
      const failed = outcomes.length - success;
      if (failed === 0) toast.success(`Removed ${success} aliases`);
      else toast.warning(`Removed ${success}, failed ${failed}`);
      await refreshData();
    } finally {
      setRemoving(false);
    }
  }, [unverified, refreshData]);

  const removeOne = useCallback(async (domain: string) => {
    setRemoving(true);
    try {
      const res = await NetlifyApiService.removeDomainAlias(domain);
      if (res?.success) toast.success(`Removed ${domain}`);
      else toast.error(res?.error || `Failed removing ${domain}`);
      await refreshData();
    } finally {
      setRemoving(false);
    }
  }, [refreshData]);

  if (!isAllowed) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Netlify Alias Purger (Unverified DNS)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Aliases: {domains.length}</Badge>
          <Badge variant={unverified.length ? 'destructive' : 'default'}>Unverified: {unverified.length}</Badge>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="destructive" onClick={purge} disabled={removing || unverified.length === 0} className="flex items-center gap-2">
            {removing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Purge Unverified
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Netlify Site ID"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="max-w-xs"
          />
          <Button size="sm" variant="outline" onClick={applySiteId}>Apply</Button>
        </div>

        {domains.length > 0 && (
          <div className="text-sm">
            <div className="font-medium mb-1">Current Netlify Aliases</div>
            <div className="text-xs text-muted-foreground mb-2">{domains.length} total</div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {domains.map((d) => (
                <div key={d.domain} className="px-2 py-1 rounded border bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{d.domain}</span>
                    {String(d.ssl_status || '').toLowerCase() !== 'dns_verified' ? (
                      <Badge variant="destructive">{d.ssl_status || 'unknown'}</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">dns_verified</Badge>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeOne(d.domain!)} title={`Remove ${d.domain}`}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Results</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.map((r) => (
                <div key={r.domain} className={`px-2 py-1 rounded border flex items-center gap-2 ${r.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                  {r.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span className="font-mono">{r.domain}</span>
                  {r.message && <span className="text-xs opacity-80">— {r.message}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Netlify aliases are fetched from your Site ID and unverified (non-dns_verified) items can be purged.
        </div>
      </CardContent>
    </Card>
  );
}
