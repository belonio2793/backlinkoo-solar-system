import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, Globe, Server, ShieldCheck, Activity, CloudLightning, FileText, Wifi, RefreshCw } from 'lucide-react';

interface CheckResult { name: string; ok: boolean; detail?: string; link?: string; }

async function safeFetch(url: string, opts?: RequestInit & { timeout?: number }): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), opts?.timeout ?? 4000);
    const res = await fetch(url, { ...opts, signal: controller.signal, cache: 'no-store' });
    clearTimeout(t);
    return res;
  } catch {
    return null;
  }
}

export default function SystemStatus() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<CheckResult[]>([]);
  const startedAt = useMemo(() => new Date(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const checks: CheckResult[] = [];

      // Network
      checks.push({ name: 'Browser Online', ok: navigator.onLine, detail: navigator.onLine ? 'Online' : 'Offline' });

      // App endpoints
      const sitemap = await safeFetch('/sitemap.xml', { method: 'GET', timeout: 4000 });
      checks.push({ name: 'Sitemap Accessible', ok: !!sitemap && sitemap.ok, detail: sitemap ? `${sitemap.status}` : 'No response', link: '/sitemap.xml' });

      const robots = await safeFetch('/robots.txt', { method: 'GET', timeout: 4000 });
      checks.push({ name: 'Robots.txt Accessible', ok: !!robots && robots.ok, detail: robots ? `${robots.status}` : 'No response', link: '/robots.txt' });

      // Serverless function (Netlify)
      const apiStatus = await safeFetch('/.netlify/functions/api-status', { method: 'GET', timeout: 5000 });
      checks.push({ name: 'API Status Function', ok: !!apiStatus && apiStatus.ok, detail: apiStatus ? `${apiStatus.status}` : 'No response', link: '/.netlify/functions/api-status' });

      // Security basics
      const isSecureContext = window.isSecureContext;
      checks.push({ name: 'Secure Context (HTTPS)', ok: !!isSecureContext, detail: isSecureContext ? 'Secure' : 'Non‑secure' });

      // Storage
      try {
        localStorage.setItem('__status_test', '1');
        const ok = localStorage.getItem('__status_test') === '1';
        localStorage.removeItem('__status_test');
        checks.push({ name: 'Local Storage', ok, detail: ok ? 'Writable' : 'Blocked' });
      } catch {
        checks.push({ name: 'Local Storage', ok: false, detail: 'Blocked' });
      }

      // Cookies
      try {
        document.cookie = 'status_cookie=ok; path=/';
        const ok = document.cookie.includes('status_cookie=ok');
        checks.push({ name: 'Cookies Enabled', ok, detail: ok ? 'Present' : 'Disabled' });
      } catch {
        checks.push({ name: 'Cookies Enabled', ok: false, detail: 'Disabled' });
      }

      if (!mounted) return;
      setResults(checks);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const okCount = results.filter(r => r.ok).length;

  return (
    <main className="container mx-auto px-6 py-10">
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">System Status</h1>
        <p className="text-muted-foreground">Live checks for critical endpoints and browser capabilities.</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <Badge>{okCount}/{results.length} OK</Badge>
          <Badge variant={navigator.onLine ? 'secondary' : 'destructive'} className="flex items-center gap-1"><Wifi className="h-3 w-3" /> {navigator.onLine ? 'Online' : 'Offline'}</Badge>
          <Badge variant="secondary" className="flex items-center gap-1"><Activity className="h-3 w-3" /> {startedAt.toLocaleString()}</Badge>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-4 w-4" /> Core Endpoints</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {results.filter(r => ['Sitemap Accessible','Robots.txt Accessible','API Status Function'].includes(r.name)).map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={r.ok ? 'secondary' : 'destructive'}>{r.ok ? 'OK' : 'Fail'}</Badge>
                  <span className="text-sm">{r.name}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{r.detail}</span>
                  {r.link && <a href={r.link} className="text-primary inline-flex items-center gap-1" target={r.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer"><ExternalLink className="h-3 w-3" />Open</a>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Browser & Security</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {results.filter(r => ['Secure Context (HTTPS)','Local Storage','Cookies Enabled','Browser Online'].includes(r.name)).map(r => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={r.ok ? 'secondary' : 'destructive'}>{r.ok ? 'OK' : 'Fail'}</Badge>
                  <span className="text-sm">{r.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.detail}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="max-w-5xl mx-auto mt-8 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> Useful Links</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <a className="block text-primary hover:underline" href="/sitemap.xml">Sitemap</a>
            <a className="block text-primary hover:underline" href="/robots.txt">Robots.txt</a>
            <a className="block text-primary hover:underline" href="/privacy-policy">Privacy Policy</a>
            <a className="block text-primary hover:underline" href="/terms-of-service">Terms of Service</a>
            <a className="block text-primary hover:underline" href="/help">Help Center</a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CloudLightning className="h-4 w-4" /> Serverless</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This dashboard pings public endpoints only and does not expose secrets. For deeper diagnostics, use your admin tools.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" /> Incident Reporting</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            If you notice degraded performance, contact support with timestamps and the failing URL. Include screenshots and console errors when available.
          </CardContent>
        </Card>
      </section>

      <div className="max-w-5xl mx-auto mt-8">
        <Alert>
          <AlertTitle className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Refresh checks</AlertTitle>
          <AlertDescription className="mt-2">Reload this page to re‑run status checks. Results are not cached.</AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
