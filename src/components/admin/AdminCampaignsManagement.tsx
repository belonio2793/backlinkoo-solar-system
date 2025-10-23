import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Search, Download, ExternalLink, Link as LinkIcon, Eye, Trash2 } from 'lucide-react';

interface CampaignRow {
  id: string;
  user_id: string;
  name: string | null;
  target_url: string;
  keywords?: string[] | string | null;
  links_requested: number;
  links_delivered?: number | null;
  credits_used?: number | null;
  status: string;
  created_at: string;
}

export default function AdminCampaignsManagement() {
  const [rows, setRows] = useState<CampaignRow[]>([]);
  const [userMap, setUserMap] = useState<Record<string, { email: string; display_name: string | null }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  const { toast } = useToast();

  // Paste URLs dialog
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [activeCampaign, setActiveCampaign] = useState<CampaignRow | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [linkItems, setLinkItems] = useState<{ id?: string; url: string; platform?: string | null; status?: string | null; created_at?: string | null }[]>([]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      let qb: any = supabase
        .from('campaigns')
        .select('id, user_id, name, target_url, keywords, links_requested, links_delivered, credits_used, status, created_at', { count: 'exact' });

      if (status !== 'all') qb = qb.eq('status', status);
      const q = query.trim();
      if (q) {
        const like = `%${q}%`;
        qb = qb.or(`id.ilike.${like},name.ilike.${like},target_url.ilike.${like}`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await qb
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      setRows(data as CampaignRow[]);
      setTotalCount(count || 0);

      // Fetch user details (email, display_name) for all user_ids
      const ids = Array.from(new Set((data || []).map((r: any) => r.user_id))).filter(Boolean);
      if (ids.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, email, display_name')
          .in('user_id', ids);
        const map: Record<string, { email: string; display_name: string | null }> = {};
        (profs || []).forEach((p: any) => { map[p.user_id] = { email: p.email, display_name: p.display_name }; });
        setUserMap(map);
      } else {
        setUserMap({});
      }


    } catch (e: any) {
      setError(e?.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const openPaste = (row: CampaignRow) => { setActiveCampaign(row); setPasteText(''); setPasteOpen(true); };


  const refreshDeliveredCount = async (campaignId: string) => {
    try {
      const { count } = await (supabase as any)
        .from('campaign_urls')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', campaignId);
      setRows(prev => {
        const next = prev.map(r => r.id === campaignId ? { ...r, links_delivered: count ?? 0 } : r);
        const row = next.find(r => r.id === campaignId);
        if (row) {
          const target = (row.credits_used && row.credits_used > 0) ? row.credits_used : row.links_requested;
          const shouldComplete = (row.links_delivered ?? 0) >= target;
          const desired = shouldComplete ? 'completed' : 'pending';
          if (row.status !== desired) {
            supabase.from('campaigns')
              .update({ status: desired as any, updated_at: new Date().toISOString() })
              .eq('id', campaignId)
              .then(() => {})
              .catch(() => {});
            return next.map(r => r.id === campaignId ? { ...r, status: desired } : r);
          }
        }
        return next;
      });
    } catch {}
  };

  const openDetails = async (row: CampaignRow) => {
    setActiveCampaign(row);
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError(null);
    setLinkItems([]);
    try {
      // Preferred source: campaign_urls table
      let links: { id?: string; url: string; platform?: string | null; status?: string | null; created_at?: string | null }[] = [];
      try {
        const { data: curlRows, error: curlErr } = await (supabase as any)
          .from('campaign_urls')
          .select('id, url, status, created_at')
          .eq('campaign_id', row.id)
          .order('created_at', { ascending: false });
        if (!curlErr && Array.isArray(curlRows)) {
          links = curlRows;
        }
      } catch {}

      // No fallback; source of truth is campaign_urls
      setLinkItems(links);
      refreshDeliveredCount(row.id);
    } catch (e: any) {
      setDetailsError(e?.message || 'Failed to load campaign details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const deleteLinkAt = async (index: number) => {
    if (activeCampaign == null) return;
    const confirmed = window.confirm('Remove this URL from the campaign?');
    if (!confirmed) return;
    try {
      const item = linkItems[index];
      let updated = [...linkItems];

      let deletedFromRows = false;
      if (item?.id) {
        const { error: delErr } = await (supabase as any)
          .from('campaign_urls')
          .delete()
          .eq('id', item.id)
          .eq('campaign_id', activeCampaign.id);
        if (!delErr) {
          deletedFromRows = true;
          updated = updated.filter((_, i) => i !== index);
        }
      }

      if (!deletedFromRows) {
        updated = updated.filter((_, i) => i !== index);
      }

      setLinkItems(updated);
      await refreshDeliveredCount(activeCampaign.id);
      toast({ title: 'URL removed', description: 'The URL was removed and the campaign updated.' });
    } catch (e: any) {
      toast({ title: 'Remove failed', description: e?.message || 'Unable to remove URL', variant: 'destructive' });
    }
  };

  const savePastedUrls = async () => {
    if (!activeCampaign) return;
    const raw = pasteText.split(/\r?\n|,|\s+/).map(u => u.trim()).filter(Boolean);
    if (!raw.length) { toast({ title: 'No URLs', description: 'Paste one or more URLs', variant: 'destructive' }); return; }
    const norm = raw.map((u) => {
      let v = u;
      if (!/^https?:\/\//i.test(v)) v = `https://${v.replace(/^www\./i,'')}`;
      return v;
    });
    try {
      const nowIso = new Date().toISOString();
      const candidateRows = norm.map(u => ({
        campaign_id: activeCampaign.id,
        user_id: activeCampaign.user_id,
        url: u,
        status: 'active',
        created_at: nowIso,
        updated_at: nowIso,
      }));

      // Dedupe by existing rows
      let existingSet = new Set<string>();
      try {
        const { data: existing } = await (supabase as any)
          .from('campaign_urls')
          .select('url')
          .eq('campaign_id', activeCampaign.id);
        (existing || []).forEach((r: any) => existingSet.add(String(r.url)));
      } catch {}

      const toInsert = candidateRows.filter(r => !existingSet.has(r.url));
      if (toInsert.length === 0) {
        toast({ title: 'No new URLs', description: 'All pasted URLs already exist', variant: 'destructive' });
        return;
      }

      // Insert into campaign_urls
      await (supabase as any)
        .from('campaign_urls')
        .upsert(toInsert, { onConflict: 'campaign_id,url' });


      // Update counts accurately from DB
      await refreshDeliveredCount(activeCampaign.id);

      toast({ title: 'Links saved', description: `${toInsert.length} URLs added` });
      setPasteOpen(false);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e?.message || 'Unable to save URLs', variant: 'destructive' });
    }
  };

  useEffect(() => { load(); }, [page, status]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 300);
    return () => clearTimeout(t);
  }, [query]);
  useEffect(() => { setPage(1); }, [status]);

  // Server-side filtered/paginated; keep current rows
  const filtered = rows;
  const paginated = rows;

  const updateStatus = async (row: CampaignRow, newStatus: string) => {
    try {
      // Optimistic UI update
      setRows(prev => prev.map(r => (r.id === row.id ? { ...r, status: newStatus } : r)));
      // Update campaigns table only
      await supabase
        .from('campaigns')
        .update({ status: newStatus as any, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      toast({ title: 'Status Updated', description: `${row.id} → ${newStatus}` });
    } catch (e: any) {
      toast({ title: 'Update Failed', description: e?.message || 'Unable to update status', variant: 'destructive' });
    }
  };

  const exportCsv = () => {
    const csv = [
      ['id', 'user_id', 'name', 'target_url', 'links_requested', 'links_delivered', 'status', 'created_at'],
      ...filtered.map(r => [r.id, r.user_id, r.name || '', r.target_url, r.links_requested, r.links_delivered ?? '', r.status, r.created_at])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaigns_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Realtime updates for campaigns table
  useEffect(() => {
    const channel = supabase
      .channel('realtime:campaigns')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, (payload) => {
        const r: any = payload.new;
        if (!r) return;
        if (payload.eventType === 'INSERT') {
          setRows(prev => [{
            id: r.id,
            user_id: r.user_id,
            name: r.name,
            target_url: r.target_url,
            links_requested: r.links_requested,
            links_delivered: r.links_delivered,
            status: r.status,
            created_at: r.created_at
          }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setRows(prev => prev.map(x => x.id === r.id ? { ...x, ...r } : x));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Campaigns Management</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2"/>Export</Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}/>Refresh</Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>
        )}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by ID, name, or URL" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-[180px]"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-x-hidden">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell w-24">ID</TableHead>
                <TableHead className="min-w-[180px]">User</TableHead>
                <TableHead className="min-w-[220px]">Target URL</TableHead>
                <TableHead className="w-24">Requested</TableHead>
                <TableHead className="hidden sm:table-cell w-24">Delivered</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="hidden lg:table-cell w-[180px]">Created</TableHead>
                <TableHead className="text-right w-[340px] md:w-[300px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="hidden md:table-cell font-mono text-xs">{r.id.slice(0,8)}…</TableCell>
                  <TableCell>
                    <div className="text-xs break-words">
                      <div className="font-medium break-all">{userMap[r.user_id]?.email || '—'}</div>
                      <div className="text-muted-foreground">{userMap[r.user_id]?.display_name || ''}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[420px]">
                      <a href={r.target_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 break-all">
                        {r.target_url}
                        <ExternalLink className="h-3 w-3"/>
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{r.links_requested}</TableCell>
                  <TableCell className="hidden sm:table-cell">{r.links_delivered ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      r.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{new Date(r.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openPaste(r)}><LinkIcon className="h-3 w-3 mr-1"/>Add URLs</Button>
                      <Button size="sm" variant="outline" onClick={() => openDetails(r)}><Eye className="h-3 w-3 mr-1"/>View</Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          const confirmed = window.confirm('Delete this campaign? This will remove the campaign and all its URLs.');
                          if (!confirmed) return;
                          try {
                            // Remove child URLs first
                            await (supabase as any)
                              .from('campaign_urls')
                              .delete()
                              .eq('campaign_id', r.id);
                            // Delete campaign row
                            const { error: delErr } = await supabase
                              .from('campaigns')
                              .delete()
                              .eq('id', r.id);
                            if (delErr) throw delErr;
                            setRows(prev => prev.filter(x => x.id !== r.id));
                            toast({ title: 'Campaign Deleted', description: `${r.id.slice(0,8)}… removed` });
                          } catch (e: any) {
                            toast({ title: 'Delete Failed', description: e?.message || 'Unable to delete campaign', variant: 'destructive' });
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1"/>Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No campaigns found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-muted-foreground">Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize, totalCount)} of {totalCount}</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prev</Button>
            <div className="text-sm">Page {page} / {Math.max(1, Math.ceil(totalCount / pageSize))}</div>
            <Button size="sm" variant="outline" onClick={() => setPage(p => p+1)} disabled={page*pageSize >= totalCount}>Next</Button>
          </div>
        </div>

        {/* Paste URLs Dialog */}
        <Dialog open={pasteOpen} onOpenChange={setPasteOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Published URLs</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Campaign: <span className="font-mono">{activeCampaign?.id?.slice(0,8)}…</span> • {activeCampaign?.target_url}</div>
              {activeCampaign?.keywords && (
                <div className="flex flex-wrap gap-1 text-xs">
                  {Array.isArray(activeCampaign.keywords) ? (
                    (activeCampaign.keywords as string[]).map((k, i) => (
                      <Badge key={i} variant="outline">{k}</Badge>
                    ))
                  ) : (
                    String(activeCampaign.keywords).split(',').map((k, i) => (
                      <Badge key={i} variant="outline">{k.trim()}</Badge>
                    ))
                  )}
                </div>
              )}
              <Textarea value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder="Paste URLs here (newline or comma separated)" rows={8} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPasteOpen(false)}>Cancel</Button>
              <Button onClick={savePastedUrls}>Save URLs</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Campaign Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Campaign Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Campaign: <span className="font-mono">{activeCampaign?.id?.slice(0,8)}…</span> • {activeCampaign?.target_url}</div>
              {activeCampaign?.keywords && (
                <div className="flex flex-wrap gap-1 text-xs">
                  {Array.isArray(activeCampaign.keywords) ? (
                    (activeCampaign.keywords as string[]).map((k, i) => (
                      <Badge key={i} variant="outline">{k}</Badge>
                    ))
                  ) : (
                    String(activeCampaign.keywords).split(',').map((k, i) => (
                      <Badge key={i} variant="outline">{k.trim()}</Badge>
                    ))
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">Requested: {activeCampaign?.links_requested ?? 0}</Badge>
                <Badge variant="outline">Delivered: {(linkItems?.length || 0) || (activeCampaign?.links_delivered ?? 0)}</Badge>
                <Badge variant="outline">Status: {activeCampaign?.status}</Badge>
                <Badge variant="outline">Created: {activeCampaign ? new Date(activeCampaign.created_at).toLocaleString() : ''}</Badge>
              </div>

              {detailsLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading links…</div>
              )}
              {detailsError && (
                <Alert variant="destructive"><AlertDescription>{detailsError}</AlertDescription></Alert>
              )}

              {!detailsLoading && !detailsError && (
                <div className="border rounded p-2 max-h-[60vh] overflow-auto">
                  {linkItems.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No links have been added to this campaign yet.</div>
                  ) : (
                    <ul className="space-y-2">
                      {linkItems.map((l, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-3">
                          <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all flex-1 flex items-center gap-1">
                            {l.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                            {l.platform && <span className="rounded border px-1 py-0.5">{l.platform}</span>}
                            {l.status && <span className="rounded border px-1 py-0.5">{l.status}</span>}
                            {l.created_at && <span>{new Date(l.created_at).toLocaleString()}</span>}
                            <Button size="icon" variant="ghost" aria-label="Delete URL" onClick={() => deleteLinkAt(idx)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}
