import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { normalizeContent as formatNormalize, titleCase as formatTitleCase, extractTitleFromContent } from '@/lib/autoPostFormatter';
import { useAuthState } from '@/hooks/useAuthState';
import DeleteCampaignDialog from '@/components/campaigns/DeleteCampaignDialog';
import { useState } from 'react';

const formatDate = (d: string | null) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
};

const AutomationCampaignList: React.FC = () => {
  const { user, isAuthenticated } = useAuthState();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<any | null>(null);

  const loadCampaigns = async () => {
    if (!user?.id) {
      setCampaigns([]);
      return;
    }
    setLoading(true);
    try {
      // Try the newer automation_campaigns table first to pull exact arrays
      let base: any[] = [];
      try {
        const { data, error } = await supabase
          .from('automation_campaigns')
          .select('id, user_id, name, target_url, keywords, anchor_texts, status, created_at')
          .eq('user_id', user.id)
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });
        if (error) throw error;
        base = (data || []).map((r: any) => ({
          ...r,
          // normalize for older UI expectations
          keyword: Array.isArray(r.keywords) ? r.keywords[0] : r.keywords || null,
          anchor_text: Array.isArray(r.anchor_texts) ? r.anchor_texts[0] : r.anchor_texts || null
        }));
      } catch (err) {
        // Fallback to legacy automation table
        const { data, error } = await supabase
          .from('automation')
          .select('id, user_id, name, target_url, keyword, anchor_text, status, last_posted_at, created_at')
          .eq('user_id', user.id)
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });
        if (error) throw error;
        base = data || [];
      }

      const ids = base.map((c: any) => c.id);
      let latestByCampaign: Record<string, { slug?: string; url?: string; published_at?: string }> = {};
      if (ids.length) {
        const { data: posts } = await supabase
          .from('automation_posts')
          .select('automation_id, slug, url, published_at')
          .in('automation_id', ids)
          .order('published_at', { ascending: false });
        (posts || []).forEach((p: any) => {
          if (!latestByCampaign[p.automation_id]) latestByCampaign[p.automation_id] = p;
        });
      }
      setCampaigns(base.map((c: any) => ({ ...c, _latest_post: latestByCampaign[c.id] })));
    } catch (e) {
      console.error('Failed to load campaigns', e);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
    const onCreated = () => loadCampaigns();
    try { window.addEventListener('automation:campaign:created', onCreated); } catch {}
    return () => {
      try { window.removeEventListener('automation:campaign:created', onCreated); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const updateStatus = async (id: string, status: string) => {
    try {
      try {
        await supabase.from('automation_campaigns').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (e) {
        await supabase.from('automation').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      }
      await loadCampaigns();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      // Call server-side Netlify function to perform deletion with service role
      // Try multiple candidate function endpoints (NETLIFY_FUNCTIONS_URL, VITE_NETLIFY_FUNCTIONS_URL, VITE_NETLIFY_DEV_URL, local fallback)
      const w: any = typeof window !== 'undefined' ? window : {};
      const candidatesRaw = [
        w?.NETLIFY_FUNCTIONS_URL || '',
        (import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL || ''
      ].map((s: string) => String(s || '').trim()).filter(Boolean);

      const candidates: string[] = [];

      const isFlyHost = typeof window !== 'undefined' && typeof window.location !== 'undefined' && String(window.location.host || '').includes('fly.dev');
      const netlifyEnv = (import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL || (typeof window !== 'undefined' ? (window as any)?.NETLIFY_FUNCTIONS_URL : '') || '';

      if (isFlyHost && netlifyEnv) {
        const n = String(netlifyEnv).replace(/\/$/, '');
        if (n.includes('/.netlify/functions')) {
          candidates.push(n + '/deleteAutomationCampaign');
          const hostOnly = n.replace(/\/\.netlify\/functions.*$/, '');
          if (hostOnly) candidates.push(hostOnly + '/api/deleteAutomationCampaign');
        } else {
          candidates.push(n + '/.netlify/functions/deleteAutomationCampaign');
          candidates.push(n + '/api/deleteAutomationCampaign');
        }
      }

      for (const baseRaw of candidatesRaw) {
        const base = String(baseRaw).replace(/\/$/, '');
        if (!base) continue;
        if (netlifyEnv && base === String(netlifyEnv).replace(/\/$/, '')) continue;
        if (base.includes('/.netlify/functions')) {
          candidates.push(base.replace(/\/$/, '') + '/deleteAutomationCampaign');
          const hostOnly = base.replace(/\/\.netlify\/functions.*$/, '');
          if (hostOnly) candidates.push(hostOnly + '/api/deleteAutomationCampaign');
        } else {
          candidates.push(base + '/.netlify/functions/deleteAutomationCampaign');
          candidates.push(base + '/api/deleteAutomationCampaign');
        }
      }

      // Always try relative API and functions paths last
      candidates.push('/api/deleteAutomationCampaign');
      candidates.push('/.netlify/functions/deleteAutomationCampaign');

      let lastError: any = null;
      for (const fnUrl of candidates) {
        try {
          const res = await fetch(fnUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });

          if (!res.ok) {
            const text = await res.text().catch(() => '');
            let parsed = null;
            try { parsed = text ? JSON.parse(text) : null; } catch {}
            lastError = `(${res.status}) ${res.statusText} - ${parsed ? JSON.stringify(parsed) : text}`;
            console.warn('Delete attempt failed for', fnUrl, lastError);
            continue;
          }

          const body = await res.json().catch(() => ({}));
          if (body && body.success) {
            await loadCampaigns();
            return;
          }

          lastError = `No success confirmation from ${fnUrl}`;
        } catch (e) {
          lastError = e?.message || String(e);
          console.warn('Delete attempt error for', fnUrl, lastError);
          // try next candidate
        }
      }

      // If all function endpoints failed, attempt client-side deletion as a fallback
      console.warn('All function endpoints failed: ' + String(lastError) + '. Attempting client-side deletion fallback.');
      try {
        await Promise.allSettled([
          supabase.from('automation_published_links').delete().eq('campaign_id', id),
          supabase.from('automation_campaigns').delete().eq('id', id),
          supabase.from('automation').delete().eq('id', id)
        ]);
        await loadCampaigns();
        return;
      } catch (e) {
        console.error('Fallback client delete failed', e);
        // If client-side deletion also fails, throw the original aggregated error
        throw new Error('All function endpoints and client-side deletion failed: ' + String(lastError) + ' / ' + String(e));
      }
    } catch (e) {
      console.error('Failed to delete campaign', e);
      alert('Delete failed. Please try again.');
    }
  };

  const startCampaign = async (id: string) => {
    try {
      setGeneratingId(id);

      // Fetch campaign from automation_campaigns if available, fallback to legacy automation
      let campaign: any = null;
      try {
        const { data: campData, error: campErr } = await supabase
          .from('automation_campaigns')
          .select('id, user_id, name, target_url, keywords, anchor_texts, status, last_posted_at, created_at')
          .eq('id', id)
          .single();
        if (campErr) throw campErr;
        campaign = campData;
        // ensure arrays
        campaign.keywords = Array.isArray(campaign.keywords) ? campaign.keywords : (campaign.keywords ? [campaign.keywords] : []);
        campaign.anchor_texts = Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts : (campaign.anchor_texts ? [campaign.anchor_texts] : []);
      } catch (e) {
        const { data: legacy, error: legacyErr } = await supabase
          .from('automation')
          .select('id, user_id, name, target_url, keyword, anchor_text, status, last_posted_at, created_at')
          .eq('id', id)
          .single();
        if (legacyErr) throw legacyErr;
        campaign = {
          ...legacy,
          keywords: legacy.keyword ? [legacy.keyword] : [],
          anchor_texts: legacy.anchor_text ? [legacy.anchor_text] : []
        };
      }

      if (!campaign) throw new Error('Campaign not found');

      // load verified domains for user
      const { data: domains, error: domErr } = await supabase
        .from('domains')
        .select('id, domain, dns_verified, netlify_verified')
        .eq('user_id', campaign.user_id)
        .eq('dns_verified', true)
        .order('created_at', { ascending: false });
      if (domErr) throw domErr;
      const domainRows = (domains || []).filter(Boolean);
      if (!domainRows.length) {
        alert('No verified domains available. Please configure domains first.');
        return;
      }

      // Try to get domain assignments via local logic (no Supabase Edge dependency)
      let assignments: any[] | null = null;
      try {
        // Prefer simple round-robin across verified domains locally
        assignments = domainRows.map((d: any) => ({ domain_id: d.id }));
      } catch (e) {
        console.warn('Local assignment failed, proceeding with per-domain publishing', e);
      }

      // Generate content once via Netlify function (no Supabase Edge dependency)
      const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
      const { data: genData, error: genErr } = await netlifyInvoker.invoke('generate-content-openai', {
        body: {
          keyword: campaign.keywords?.[0] || '',
          anchorText: campaign.anchor_texts?.[0] || '',
          url: campaign.target_url,
          wordCount: 800,
          contentType: 'comprehensive',
          tone: 'professional'
        }
      });

      let content: string | null = null;
      let title = '';

      if (genErr) {
        console.warn('generate-content-openai returned error:', genErr);
      } else if (!genData) {
        console.warn('generate-content-openai returned no data');
      } else {
        // Edge function may return { success, content, title } or nested shapes
        const maybe = genData as any;
        if (maybe.success === false) {
          console.warn('generate-content-openai indicated failure:', maybe.error || maybe);
        } else if (typeof maybe === 'string') {
          content = maybe;
        } else if (maybe.content) {
          content = maybe.content;
          title = maybe.title || '';
        } else if (maybe.data && (maybe.data.content || maybe.data.html)) {
          content = maybe.data.content || maybe.data.html;
          title = maybe.data.title || '';
        } else if (maybe.html) {
          content = maybe.html;
        } else if (maybe.result) {
          content = maybe.result;
        } else if (maybe.message) {
          // some functions return message
          content = maybe.message;
        }
      }

      if (!content || String(content).trim().length < 50) {
        console.warn('Generated content appears empty or too short, attempting Netlify single-campaign publish');
        try {
          const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
          const { data: single, error: singleErr } = await netlifyInvoker.invoke('automation-post', {
            body: {
              keyword: campaign.keywords?.[0] || '',
              anchorText: campaign.anchor_texts?.[0] || '',
              targetUrl: campaign.target_url,
              campaignId: id
            }
          });
          if (singleErr) throw singleErr;
          const published = (single as any)?.publishedUrls || (single as any)?.published_url ? [ (single as any)?.published_url ] : [];
          const firstUrl = published[0];
          const slug = firstUrl ? String(firstUrl).split('/').filter(Boolean).pop() : null;
          if (firstUrl) {
            try {
              // If content is available, normalize before inserting; otherwise insert metadata only
              let payload: any = {
                automation_id: id,
                domain_id: null,
                user_id: campaign.user_id,
                slug: slug || null,
                url: firstUrl || null,
                published_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              };
              if (content && String(content).trim().length > 0) {
                try {
                  const bestTitle = formatTitleCase(extractTitleFromContent(String(content)) || title || '');
                  payload.title = bestTitle;
                  payload.content = formatNormalize(bestTitle, String(content));
                } catch (e) { /* ignore formatting errors and insert raw */ }
              }

              await supabase.from('automation_posts').insert(payload);
            } catch (insertErr) {
              console.warn('Failed to save fallback automation_posts record', insertErr);
            }
            alert('Published 1 post (Netlify fallback).');
            try { window.dispatchEvent(new Event('automation:posts:updated')); } catch {}
            await loadCampaigns();
            return;
          }
          throw new Error('Netlify single publish did not return a URL');
        } catch (fallbackErr) {
          console.error('Netlify fallback publish failed:', fallbackErr);
          throw new Error('Generated content is empty');
        }
      }

      // Extract title from content if not provided
      const h1 = String(title || content).match(/<h1>(.*?)<\/h1>/i);
      if (h1) title = h1[1].trim();
      if (!title) title = String(content).split('\n').find((l: string) => l.trim().length > 0)?.replace(/<[^>]+>/g, '')?.slice(0, 80) || 'New Post';

      const results: { domain: string; url?: string; slug?: string; error?: string }[] = [];

      const workList = assignments && assignments.length ? assignments.map((a: any) => {
        // map assignment to domain row if necessary
        return domainRows.find(d => d.id === a.domain_id) || null;
      }).filter(Boolean) : domainRows;

      for (const d of workList) {
        try {
          const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
          const { data: pub, error: pubErr } = await netlifyInvoker.invoke('automation-blog', {
            body: {
              automation_id: id,
              domain_id: d.id,
              user_id: campaign.user_id,
              title,
              content
            }
          });
          if (pubErr) throw pubErr;
          const post = (pub as any)?.post || (pub as any);
          const url = post?.url || post?.published_url || post?.link || null;
          const slug = post?.slug || (url ? url.split('/').filter(Boolean).pop() : null);

          // Save post record
          try {
            const payload: any = {
              automation_id: id,
              domain_id: d.id,
              user_id: campaign.user_id,
              slug: slug || null,
              url: url || null,
              published_at: url ? new Date().toISOString() : null,
              created_at: new Date().toISOString()
            };
            // If the returned post contains content, normalize it first
            if (post && post.content) {
              try {
                const bestTitle = formatTitleCase(extractTitleFromContent(String(post.content)) || title || '');
                payload.title = bestTitle;
                payload.content = formatNormalize(bestTitle, String(post.content));
              } catch (e) { /* ignore formatting errors */ }
            } else if (content && String(content).trim().length > 0) {
              try {
                const bestTitle = formatTitleCase(extractTitleFromContent(String(content)) || title || '');
                payload.title = bestTitle;
                payload.content = formatNormalize(bestTitle, String(content));
              } catch (e) { }
            }

            await supabase.from('automation_posts').insert(payload);
          } catch (saveErr) {
            console.warn('Failed to save automation_posts record', saveErr);
          }

          results.push({ domain: d.domain, url, slug });
        } catch (e: any) {
          results.push({ domain: d.domain, error: e?.message || String(e) });
        }
      }

      const ok = results.filter(r => r.url).length;
      const failed = results.filter(r => !r.url).length;
      alert(`Published ${ok} posts${failed ? `, ${failed} failed` : ''}.`);
      try { window.dispatchEvent(new Event('automation:posts:updated')); } catch {}

      // Update campaign last_posted_at timestamp in automation_campaigns if table exists
      try {
        await supabase.from('automation_campaigns').update({ last_posted_at: new Date().toISOString() }).eq('id', id);
      } catch (e) {
        // ignore
      }

      await loadCampaigns();
    } catch (e) {
      console.error('Generate post error:', e);
      alert('An unexpected error occurred generating the post.');
    } finally {
      setGeneratingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-6 p-4 border rounded-lg bg-gray-50 border-gray-200 text-center">
        <div className="text-sm text-gray-600">Sign in to view your campaigns</div>
      </div>
    );
  }

  const counts = campaigns.reduce(
    (acc, c) => {
      const s = (c.status || '').toLowerCase();
      if (s === 'active') acc.active += 1;
      else if (s === 'paused') acc.paused += 1;
      else if (s === 'failed' || s === 'error') acc.failed += 1;
      else acc.other += 1;
      return acc;
    },
    { active: 0, paused: 0, failed: 0, other: 0 }
  );

  return (
    <div className="mt-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Campaigns</h3>
            <p className="text-xs text-muted-foreground">Manage your automation campaigns</p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="px-2 py-1 rounded bg-green-100 text-green-700">Active: {counts.active}</span>
            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">Paused: {counts.paused}</span>
            <span className="px-2 py-1 rounded bg-red-100 text-red-700">Failed: {counts.failed}</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Target URL</th>
                <th className="px-4 py-2">Keyword(s)</th>
                <th className="px-4 py-2">Anchor</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Last Posted</th>
                <th className="px-4 py-2">Latest Post</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              )}

              {!loading && campaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-sm text-gray-500">No campaigns found</td>
                </tr>
              )}

              {campaigns.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2 align-top">
                    <div className="font-medium">{c.name || '-'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Campaign ID: {c.id}</div>
                  </td>
                  <td className="px-4 py-2 align-top max-w-xs truncate">{c.target_url}</td>
                  <td className="px-4 py-2 align-top">
                    {Array.isArray(c.keywords) && c.keywords.length ? (
                      <span className="text-xs text-gray-700">{c.keywords.join(', ')}</span>
                    ) : (c.keyword ? <span className="text-xs text-gray-700">{c.keyword}</span> : <span className="text-gray-400">—</span>)}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {Array.isArray(c.anchor_texts) && c.anchor_texts.length ? (
                      <span className="text-xs text-gray-700">{c.anchor_texts.join(', ')}</span>
                    ) : (c.anchor_text ? <span className="text-xs text-gray-700">{c.anchor_text}</span> : <span className="text-gray-400">—</span>)}
                  </td>
                  <td className="px-4 py-2 align-top">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      c.status === 'active' ? 'bg-green-100 text-green-700' :
                      c.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      c.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>{c.status || '-'}</span>
                  </td>
                  <td className="px-4 py-2 align-top">{formatDate(c.last_posted_at)}</td>
                  <td className="px-4 py-2 align-top">
                    {c._latest_post?.slug ? (
                      c._latest_post?.url ? (
                        <a href={c._latest_post.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{c._latest_post.slug}</a>
                      ) : (
                        <span>{c._latest_post.slug}</span>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 align-top text-right">
                    <Button
                      size="sm"
                      variant="default"
                      className="mr-2"
                      onClick={() => startCampaign(c.id)}
                      disabled={generatingId === c.id}
                      title="Start link building campaign"
                    >
                      {generatingId === c.id ? 'Starting…' : 'Start Link Building Campaign'}
                    </Button>
                    {c.status !== 'paused' ? (
                      <Button size="sm" variant="outline" className="mr-2" onClick={() => updateStatus(c.id, 'paused')}>Pause</Button>
                    ) : (
                      <Button size="sm" variant="default" className="mr-2" onClick={() => updateStatus(c.id, 'active')}>Resume</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => { setSelectedForDelete(c); setDeleteDialogOpen(true); }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteCampaignDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedForDelete(null);
        }}
        campaign={selectedForDelete}
        isDeleting={false}
        onDelete={async (campaignId: string) => {
          await deleteCampaign(campaignId);
        }}
      />
    </div>
  );
};

export default AutomationCampaignList;
