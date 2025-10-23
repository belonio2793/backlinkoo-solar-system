import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RefreshCw } from 'lucide-react';

interface Row {
  id: string;
  target_url: string;
  links_requested: number;
  credits_used?: number | null;
  status: string;
  created_at: string;
  delivered?: number;
}

export default function UserCampaignsReport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<Row | null>(null);
  const [linkItems, setLinkItems] = useState<{ url: string; status?: string | null; created_at?: string | null }[]>([]);
  const [details, setDetails] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) return;

      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('id, target_url, links_requested, credits_used, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const ids = (campaigns || []).map((c: any) => c.id);
      let counts: Record<string, number> = {};
      if (ids.length) {
        const { data: urlCounts } = await (supabase as any)
          .from('campaign_urls')
          .select('campaign_id, id', { count: 'exact' })
          .in('campaign_id', ids);
        // Supabase doesn't return grouped count with select head/count, so fetch and reduce
        (urlCounts || []).forEach((r: any) => {
          counts[r.campaign_id] = (counts[r.campaign_id] || 0) + 1;
        });
      }

      const mapped: Row[] = (campaigns || []).map((c: any) => ({
        id: c.id,
        target_url: c.target_url,
        links_requested: c.links_requested,
        credits_used: c.credits_used,
        status: c.status,
        created_at: c.created_at,
        delivered: counts[c.id] || 0,
      }));

      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openView = async (row: Row) => {
    setActiveCampaign(row);
    setViewOpen(true);
    try {
      const { data: camp } = await supabase
        .from('campaigns')
        .select('id, name, target_url, keywords, links_requested, credits_used, status, created_at, updated_at')
        .eq('id', row.id)
        .maybeSingle();
      setDetails(camp || null);

      const { data } = await (supabase as any)
        .from('campaign_urls')
        .select('url, status, created_at')
        .eq('campaign_id', row.id)
        .order('created_at', { ascending: false });

      let links: { url: string; status?: string | null; created_at?: string | null }[] =
        (data || []).map((r: any) => ({ url: r.url, status: r.status, created_at: r.created_at }));

      if (!links.length) {
        try {
          const { data: apl } = await (supabase as any)
            .from('automation_published_links')
            .select('published_url, status, published_at, created_at')
            .eq('campaign_id', row.id)
            .order('published_at', { ascending: false });
          if (apl && apl.length) {
            links = apl.map((r: any) => ({
              url: r.published_url,
              status: r.status,
              created_at: r.published_at || r.created_at || null,
            }));
          }
        } catch {}
      }

      if (!links.length) {
        try {
          const { data: pl } = await (supabase as any)
            .from('published_links')
            .select('url, status, created_at')
            .eq('campaign_id', row.id)
            .order('created_at', { ascending: false });
          if (pl && pl.length) {
            links = pl.map((r: any) => ({ url: r.url, status: r.status, created_at: r.created_at }));
          }
        } catch {}
      }

      if (!links.length) {
        try {
          const { data: campWithUrls } = await (supabase as any)
            .from('campaigns')
            .select('published_urls')
            .eq('id', row.id)
            .maybeSingle();
          const arr = (campWithUrls?.published_urls || []) as string[];
          if (Array.isArray(arr) && arr.length) {
            links = arr.map((u: string) => ({ url: u, status: 'published', created_at: null }));
          }
        } catch {}
      }

      setLinkItems(links);
    } catch {
      setDetails(null);
      setLinkItems([]);
    }
  };

  useEffect(() => {
    const ch1 = supabase
      .channel('rt:campa')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => load())
      .subscribe();
    const ch2 = (supabase as any)
      .channel('rt:curl')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_urls' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch1); (supabase as any).removeChannel(ch2); };
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(r => r.target_url.toLowerCase().includes(q) || r.id.includes(q));
  }, [rows, query]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Your Campaigns</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search by URL or ID" value={query} onChange={e => setQuery(e.target.value)} className="w-64" />
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell w-24">ID</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead className="w-28">Requested</TableHead>
                <TableHead className="w-28">Delivered</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="hidden lg:table-cell w-48">Created</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const target = r.credits_used && r.credits_used > 0 ? r.credits_used : r.links_requested;
                const delivered = r.delivered || 0;
                const derived = delivered >= target ? 'completed' : 'pending';
                return (
                  <TableRow key={r.id}>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{r.id.slice(0,8)}…</TableCell>
                    <TableCell className="max-w-[420px] break-all">
                      <a href={r.target_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{r.target_url}</a>
                    </TableCell>
                    <TableCell>{target}</TableCell>
                    <TableCell>{delivered}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={derived === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}>
                        {derived}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => openView(r)}>View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No campaigns found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{details?.id || activeCampaign?.id}</span></div>
            <div><span className="text-muted-foreground">Status:</span> {details?.status || activeCampaign?.status}</div>
            <div className="col-span-1 sm:col-span-2 break-all">
              <span className="text-muted-foreground">Target URL:</span> <a href={details?.target_url || activeCampaign?.target_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{details?.target_url || activeCampaign?.target_url}</a>
            </div>
            <div><span className="text-muted-foreground">Requested:</span> {details?.links_requested ?? activeCampaign?.links_requested}</div>
            <div><span className="text-muted-foreground">Credits Used:</span> {details?.credits_used ?? activeCampaign?.credits_used ?? activeCampaign?.links_requested}</div>
            <div className="col-span-1 sm:col-span-2"><span className="text-muted-foreground">Keywords:</span> {(details?.keywords || []).join(', ')}</div>
            <div><span className="text-muted-foreground">Created:</span> {details?.created_at ? new Date(details.created_at).toLocaleString() : (activeCampaign ? new Date(activeCampaign.created_at).toLocaleString() : '')}</div>
            {details?.updated_at && (<div><span className="text-muted-foreground">Updated:</span> {new Date(details.updated_at).toLocaleString()}</div>)}
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-auto">
            {linkItems.length === 0 ? (
              <div className="text-sm text-muted-foreground">No URLs yet.</div>
            ) : (
              <ul className="space-y-2">
                {linkItems.map((l, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-sm">
                    <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all flex-1">{l.url}</a>
                    <span className="text-xs text-muted-foreground">{l.status || ''}</span>
                    {l.created_at && <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
