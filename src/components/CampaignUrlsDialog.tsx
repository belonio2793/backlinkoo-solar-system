import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Props {
  campaignId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LinkItem { url: string; status?: string | null; created_at?: string | null }

export default function CampaignUrlsDialog({ campaignId, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    if (!open || !campaignId) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data: camp } = await supabase
          .from('campaigns')
          .select('id, name, target_url, links_requested, credits_used, status, created_at, updated_at')
          .eq('id', campaignId)
          .maybeSingle();
        setDetails(camp || null);

        const { data } = await (supabase as any)
          .from('campaign_urls')
          .select('url, status, created_at')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });

        let links: LinkItem[] = (data || []).map((r: any) => ({ url: r.url, status: r.status, created_at: r.created_at }));

        if (!links.length) {
          try {
            const { data: apl } = await (supabase as any)
              .from('automation_published_links')
              .select('published_url, status, published_at, created_at')
              .eq('campaign_id', campaignId)
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
              .eq('campaign_id', campaignId)
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
              .eq('id', campaignId)
              .maybeSingle();
            const arr = (campWithUrls?.published_urls || []) as string[];
            if (Array.isArray(arr) && arr.length) {
              links = arr.map((u: string) => ({ url: u, status: 'published', created_at: null }));
            }
          } catch {}
        }

        setLinks(links);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, campaignId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Campaign Links</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{details?.id || campaignId}</span></div>
          <div><span className="text-muted-foreground">Status:</span> {details?.status && (<Badge variant="outline" className="ml-1">{details.status}</Badge>)}</div>
          <div className="col-span-1 sm:col-span-2 break-all">
            <span className="text-muted-foreground">Target URL:</span> {details?.target_url && (<a href={details.target_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{details.target_url}</a>)}
          </div>
          <div><span className="text-muted-foreground">Requested:</span> {details?.links_requested ?? ''}</div>
          <div><span className="text-muted-foreground">Credits Used:</span> {details?.credits_used ?? details?.links_requested ?? ''}</div>
          {details?.created_at && (<div><span className="text-muted-foreground">Created:</span> {new Date(details.created_at).toLocaleString()}</div>)}
          {details?.updated_at && (<div><span className="text-muted-foreground">Updated:</span> {new Date(details.updated_at).toLocaleString()}</div>)}
        </div>
        <div className="space-y-2 max-h-[50vh] overflow-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading links…</div>
          ) : links.length === 0 ? (
            <div className="text-sm text-muted-foreground">No URLs yet.</div>
          ) : (
            <ul className="space-y-2">
              {links.map((l, i) => (
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
  );
}
