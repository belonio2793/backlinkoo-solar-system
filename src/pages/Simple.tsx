import React, { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function idFromUrl(u: string) { return `u-${Math.abs(String(u).split('').reduce((a,c)=>a*31 + c.charCodeAt(0),0))}-${Date.now()}`; }

export default function SimplePage() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [report, setReport] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  async function api(action: string, body: any = {}) {
    try {
      const res = await fetch('/.netlify/functions/homeSimple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      });
      const json = await res.json().catch(() => ({}));
      return json;
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  const fetchReport = async (cid: string | null) => {
    if (!cid) return;
    const json = await api('report', { campaign_id: cid });
    if (json?.success && Array.isArray(json.events)) {
      // parse events payload
      const events = json.events.map((e: any) => {
        let payload = e.payload;
        try { payload = typeof payload === 'string' ? JSON.parse(payload) : payload; } catch { }
        return { id: e.id, type: e.event_type, payload, createdAt: new Date(e.created_at).getTime() };
      });
      setReport(events);
    }
  };

  const startScan = async () => {
    if (!url.trim()) { toast({ title: 'Enter a URL first', message: 'Please provide a URL to scan.', type: 'error' }); return; }
    setScanning(true);
    toast({ title: 'Scanning started', message: `Scanning ${url} for link opportunities...`, type: 'info' });

    const json = await api('start_scan', { url });
    setScanning(false);

    if (!json?.success) {
      toast({ title: 'Scan failed', message: json?.error || 'Unknown error during scan', type: 'error' });
      return;
    }

    // If a campaign was created on the server we'll receive campaign_id
    if (json.campaign_id) setCampaignId(json.campaign_id);

    // If server returned discovered pages use them
    const discovered = Array.isArray(json.discovered) ? json.discovered : [];
    if (discovered.length > 0) {
      const entries = discovered.map((d: any, i: number) => ({ id: idFromUrl(d.url || `${d.domain}-${i}`), domain: d.domain || '', page: d.url || '', status: 'discovered', createdAt: Date.now() - i*1000 }));
      setReport((prev) => [...entries, ...prev].slice(0,200));
      toast({ title: 'Scan complete', message: `Found ${entries.length} pages to target.`, type: 'success' });
    } else {
      toast({ title: 'Scan complete', message: 'No pages discovered.', type: 'info' });
    }
  };

  const startCampaign = async () => {
    if (!url.trim()) { toast({ title: 'Enter a URL first', message: 'Please provide a URL.', type: 'error' }); return; }
    if (campaignRunning) return;

    // If we don't have a campaignId, attempt to start one (some scans create campaign_id)
    if (!campaignId) {
      // start a scan which will create a campaign record server-side
      const s = await api('start_scan', { url });
      if (s?.campaign_id) setCampaignId(s.campaign_id);
      // Also merge discovered if provided
      const discovered = Array.isArray(s.discovered) ? s.discovered : [];
      if (discovered.length > 0) {
        const entries = discovered.map((d: any, i: number) => ({ id: idFromUrl(d.url || `${d.domain}-${i}`), domain: d.domain || '', page: d.url || '', status: 'discovered', createdAt: Date.now() - i*1000 }));
        setReport((prev) => [...entries, ...prev].slice(0,200));
      }
    }

    if (campaignId) {
      const res = await api('start_campaign', { campaign_id: campaignId });
      if (!res?.success) {
        toast({ title: 'Unable to start', message: res?.error || 'Server failed to start campaign', type: 'error' });
        return;
      }
    }

    setCampaignRunning(true);
    toast({ title: 'Campaign started', message: 'Backlink campaign is now running.', type: 'success' });

    // Kick off server-side simulated backlink creation by creating events periodically
    intervalRef.current = window.setInterval(async () => {
      // choose a target from discovered or fallback
      const target = report.length ? report[Math.floor(Math.random()*report.length)] : { page: `${url.replace(/\/$/, '')}/`, domain: new URL(url).hostname.replace(/^www\./,'') };
      const payload = { page: target.page || target.page, domain: target.domain || target.domain, notes: 'automated backlink (simulated)' };

      if (campaignId) {
        await api('create_event', { campaign_id: campaignId, event_type: 'backlink_created', payload });
        // fetch updated report
        await fetchReport(campaignId);
      } else {
        // fallback to local report update when DB not available
        const newItem = { id: idFromUrl(JSON.stringify(payload)), type: 'backlink_created', payload, createdAt: Date.now() };
        setReport((prev) => [newItem, ...prev].slice(0,200));
      }
    }, 3000);

    // Also poll server-side events every 5s if campaignId present
    if (campaignId && pollRef.current == null) {
      pollRef.current = window.setInterval(() => fetchReport(campaignId), 5000);
    }
  };

  const pauseCampaign = async () => {
    if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
    if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
    if (campaignId) await api('pause_campaign', { campaign_id: campaignId });
    setCampaignRunning(false);
    toast({ title: 'Campaign paused', message: 'Backlink campaign paused.', type: 'info' });
  };

  const clearReport = () => {
    setReport([]);
    toast({ title: 'Report cleared', message: 'All reporting entries were removed.', type: 'info' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 rainbow-hover-scope">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Simple Campaign Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Enter a URL and scan your site. Then start a simple simulated backlink campaign with Start / Pause controls and basic reporting. This implementation persists events to the database when Supabase service role is configured.</p>
            <div className="flex gap-3">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
              <Button onClick={startScan} disabled={scanning}>{scanning ? 'Scanning...' : 'Scan'}</Button>
              <Button onClick={startCampaign} disabled={campaignRunning || report.length===0}>Start</Button>
              <Button onClick={pauseCampaign} disabled={!campaignRunning}>Pause</Button>
              <Button variant="ghost" onClick={clearReport}>Clear</Button>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">Campaign ID: {campaignId ?? 'none'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-sm text-muted-foreground">Status: {campaignRunning ? 'Running' : 'Stopped'} · Entries: {report.length}</div>
            {report.length === 0 ? (
              <div className="text-sm text-muted-foreground">No activity yet. Run a scan and start the campaign to generate activity.</div>
            ) : (
              <ul className="space-y-2 max-h-[60vh] overflow-auto">
                {report.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 border rounded-md px-3 py-2 bg-card">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.payload?.domain || r.domain}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.payload?.page || r.page}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleTimeString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
