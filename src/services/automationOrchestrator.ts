export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  target_url: string;
  keywords: string[];
  anchor_texts: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'pending' | 'generating' | 'publishing' | 'failed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
  keyword?: string;
  anchor_text?: string;
}

interface PublishedLink {
  id: string;
  campaign_id: string;
  published_url: string;
  platform: string;
  created_at?: string;
  published_at?: string;
}

import { normalizeContent as formatNormalize, titleCase as formatTitleCase, extractTitleFromContent } from '../lib/autoPostFormatter';

export class AutomationOrchestrator {
  private progressListeners: Map<string, Set<(progress: any) => void>> = new Map();
  private activityLogsCache: Map<string, Array<any>> = new Map();
  private async getClient() {
    const { supabase } = await import('@/integrations/supabase/client');
    return supabase;
  }

  private async getAdminClientIfAvailable() {
    try {
      // Support multiple env var names: prefer VITE_SERVICE_ROLE_KEY (explicit), fall back to SUPABASE_SERVICE_ROLE_KEY
      const env: any = (typeof process !== 'undefined' && (process as any).env) || (import.meta as any)?.env || {};
      const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL || env.VITE_SUPABASE_URL;
      const key = env.VITE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

      if (url && key) {
        const { createClient } = await import('@supabase/supabase-js');
        return createClient(url, key, { auth: { persistSession: false } });
      }
    } catch (err) {
      console.warn('getAdminClientIfAvailable error:', err);
    }
    return null as any;
  }

  /**
   * Smart resume/re-run: ensure a post exists on every eligible domain for this campaign.
   * - Fetch eligible domains for the campaign owner (dns_verified + netlify_verified)
   * - Skip domains that already have automation_posts for this campaign
   * - For missing ones: generate content via edge function (if available) or fallback
   * - Publish via automation-blog edge function to handle slug uniqueness and theme
   */
  async smartResumeCampaign(campaignId: string): Promise<{ success: boolean; message: string; published: number; skipped: number; errors: number; details: any[] }>{
    const supabase = await this.getClient();
    const details: any[] = [];
    try {
      // Load campaign
      const { data: rawCampaign, error: cErr } = await supabase
        .from('automation_campaigns')
        .select('*')
        .eq('id', campaignId)
        .maybeSingle();
      if (cErr || !rawCampaign) {
        return { success: false, message: 'Campaign not found', published: 0, skipped: 0, errors: 1, details: [{ error: cErr?.message || 'Not found' }] };
      }
      const campaign = this.normalizeCampaign(rawCampaign);

      // Determine domain owner (allow shared admin account via localStorage flag)
      let domainOwnerId: string = String(campaign.user_id || '');
      try {
        const anyWin: any = (typeof window !== 'undefined') ? window : {};
        const ownerId = (anyWin?.localStorage?.getItem('shared_domain_owner_id')) as string | null;
        const ownerEmail = (anyWin?.localStorage?.getItem('shared_domain_owner_email')) as string | null;
        if (!ownerId && ownerEmail) {
          try {
            const { data: prof } = await supabase.from('profiles').select('user_id').eq('email', ownerEmail).maybeSingle();
            if (prof?.user_id) {
              domainOwnerId = String(prof.user_id);
              try { anyWin?.localStorage?.setItem('shared_domain_owner_id', domainOwnerId); } catch {}
            }
          } catch {}
        } else if (ownerId) {
          domainOwnerId = String(ownerId);
        }
      } catch {}

      // Eligible domains (fetched for domainOwnerId)
      const { data: domains, error: dErr } = await supabase
        .from('domains')
        .select('id, domain, selected_theme, user_id, dns_verified')
        .eq('user_id', domainOwnerId)
        .eq('dns_verified', true)
        .order('created_at', { ascending: false });
      if (dErr) return { success: false, message: 'Failed to fetch domains', published: 0, skipped: 0, errors: 1, details: [{ error: dErr.message }] };

      const domainRows = (domains || []).filter(Boolean);
      if (!domainRows.length) return { success: false, message: 'No eligible domains found', published: 0, skipped: 0, errors: 0, details };

      let published = 0, skipped = 0, errors = 0;

      for (const d of domainRows) {
        try {
          // Check if already has a post for this campaign on this domain
          const { data: existing } = await supabase
            .from('automation_posts')
            .select('id')
            .eq('automation_id', campaign.id)
            .eq('domain_id', (d as any).id)
            .maybeSingle();
          if (existing) { skipped++; details.push({ domain: d.domain, action: 'skip_existing' }); continue; }

          // Generate content via edge function
          const keyword = campaign.keywords?.[0] || campaign.keyword || campaign.name || 'blog post';
          const anchor = campaign.anchor_texts?.[0] || campaign.anchor_text || keyword;
          const targetUrl = campaign.target_url;

          let title = `${keyword} — ${new URL(targetUrl).hostname}`.slice(0, 80);
          let contentHtml = '';
          try {
            const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
            const { data: gen, error: genErr } = await netlifyInvoker.invoke('generate-content-openai', {
              body: { keyword, anchorText: anchor, url: targetUrl, wordCount: 900, contentType: 'comprehensive', tone: 'professional' }
            });
            if (genErr) throw genErr;
            const c = (gen as any)?.content || (gen as any)?.data || '';
            if (c && String(c).trim().length > 80) {
              contentHtml = String(c);
              try {
                const m = contentHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
                if (m) title = m[1].trim();
              } catch {}
            }
          } catch (e) {
            // Try Netlify function fallback first (uses dev server/Netlify env)
            try {
              const w: any = (typeof window !== 'undefined') ? window : {};
              const rawBase = ((import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL as string | undefined)
                || w?.NETLIFY_FUNCTIONS_URL
                || w?.ENV?.VITE_NETLIFY_FUNCTIONS_URL;

              // Avoid cross-origin netlify.app when on a custom domain (preflight + 301 causes CORS failure)
              let base = rawBase ? String(rawBase).replace(/\/$/, '') : '';
              try {
                if (base) {
                  const curHost = typeof window !== 'undefined' ? window.location.hostname : '';
                  const onCustom = curHost && !/localhost|127\.|::1|netlify\.app$/.test(curHost);
                  const host = new URL(base).hostname;
                  if (onCustom && /netlify\.app$/.test(host)) base = '';
                }
              } catch {}

              const hasFunctionsSuffix = base ? /\/\.netlify\/functions\/?$/.test(base) : false;
              const urlFn = base ? (hasFunctionsSuffix ? `${base}/automation-generate-openai` : `${base}/.netlify/functions/automation-generate-openai`) : '/.netlify/functions/automation-generate-openai';
              const res = await fetch(urlFn, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword, url: targetUrl, anchorText: anchor, wordCount: 900, contentType: 'comprehensive', tone: 'professional' })
              });
              if (res.ok) {
                const j = await res.json();
                const c = j?.content || '';
                if (c && String(c).trim().length > 80) {
                  contentHtml = String(c);
                  try { const m = contentHtml.match(/<h1[^>]*>(.*?)<\/h1>/i); if (m) title = m[1].trim(); } catch {}
                }
              }
            } catch (nfErr: any) {
              details.push({ domain: (d as any)?.domain, action: 'automation-generate-openai-netlify-exception', error: nfErr?.message || String(nfErr) });
            }
            // Final fallback minimal static HTML (still valid content)
            if (!contentHtml) {
              let themeKey = String((d as any).selected_theme || (d as any).blog_theme || 'minimal').toLowerCase();
              if (themeKey === 'random-ai-generated') themeKey = 'random';
              contentHtml = `<article class="${themeKey}"><h1>${title}</h1><p><a href="${targetUrl}" target="_blank" rel="noopener noreferrer">${anchor}</a></p></article>`;
            }
          }

          // Do not modify raw HTML with images or any injections

          // Pre-normalize title/content
          const finalTitleForPublish = formatTitleCase(extractTitleFromContent(contentHtml) || title);
          const finalContentForPublish = formatNormalize(finalTitleForPublish, contentHtml);

          // Publish via Netlify function (dynamic only)
          const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
          const { data: postRes, error: pubErr } = await netlifyInvoker.invoke('automation-blog', {
            body: {
              automation_id: campaign.id,
              domain_id: (d as any).id,
              user_id: campaign.user_id,
              title: finalTitleForPublish,
              content: finalContentForPublish
            }
          });

          let finalPost: any = (postRes as any)?.post || null;
          if (pubErr || !(postRes as any)?.success || !finalPost) {
            // Fallback: insert using service role if available (bypasses RLS) or authenticated client
            const admin = await this.getAdminClientIfAvailable();
            try {
              let themeKey = String((d as any).selected_theme || (d as any).blog_theme || 'minimal').toLowerCase();
              if (themeKey === 'random-ai-generated') themeKey = 'random';
              const baseSlug = (title || `post-${Date.now()}`).toLowerCase().replace(/[^a-z0-9\-\_ ]/g, '').replace(/\s+/g, '-').replace(/\-+/g, '-').replace(/^\-+|\-+$/g, '');
              const slug = `${baseSlug}-${Math.random().toString(36).slice(2,7)}`;
              const url = `https://${String((d as any).domain).replace(/^https?:\/\//,'').replace(/\/$/,'')}/${slug}`;
              const client = admin || supabase;
              const { data: inserted, error: insErr } = await client
                .from('automation_posts')
                .insert({ automation_id: campaign.id, domain_id: (d as any).id, user_id: campaign.user_id, slug, title: finalTitleForPublish, content: finalContentForPublish, url, status: 'published', blog_theme: themeKey, keywords: (Array.isArray(campaign.keywords) ? campaign.keywords : (campaign.keyword ? [String(campaign.keyword)] : [])), anchor_texts: (Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts : (campaign.anchor_text ? [String(campaign.anchor_text)] : [])) })
                .select()
                .maybeSingle();
              if (insErr) throw insErr;
              finalPost = inserted;
            } catch (insEx: any) {
              errors++; details.push({ domain: d.domain, action: 'direct-insert-exception', error: insEx?.message || String(insEx) });
              continue;
            }
          } else {
            // Normalize slug if function returned non-themed slug
            try {
              let themeKey = String((d as any).selected_theme || (d as any).blog_theme || 'minimal').toLowerCase();
              if (themeKey === 'random-ai-generated') themeKey = 'random';
              const raw = String(finalPost.slug || '').replace(/^\/+/, '').replace(/^themes\//i, '');
              if (raw && !raw.includes('/')) {
                const inner = raw.toLowerCase().replace(/[^a-z0-9\-\_ ]+/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
                let candidate = `${inner}`;
                let attempt = 0;
                // ensure uniqueness in domain scope
                while (true) {
                  const [{ data: a }, { data: b }] = await Promise.all([
                    supabase.from('automation_posts').select('id').eq('domain_id', (d as any).id).eq('slug', candidate).maybeSingle(),
                    supabase.from('blog_posts').select('id').eq('domain_id', (d as any).id).eq('slug', candidate).maybeSingle(),
                  ]);
                  if ((!a || a.id === finalPost.id) && !b) break;
                  attempt++;
                  candidate = `${inner}-${attempt}`;
                  if (attempt > 10) { candidate = `${themeKey}/${inner}-${Date.now().toString(36)}`; break; }
                }
                const host = String((d as any).domain).replace(/^https?:\/\//,'').replace(/\/$/,'');
                const newUrl = host ? `https://${host}/${candidate}` : null;
                const { data: updated } = await supabase.from('automation_posts').update({ slug: candidate, ...(newUrl ? { url: newUrl } : {}) }).eq('id', finalPost.id).select().maybeSingle();
                if (updated) finalPost = updated;
              }
            } catch {}
          }

          published++; details.push({ domain: d.domain, action: 'published', post: finalPost });

          // Attempt to upload rendered HTML to themes storage so the /themes/{theme}/{slug} path serves a static HTML
          try {
            // Only perform upload in server-side contexts where a service role key is available.
            const isServer = typeof window === 'undefined';
            const env: any = (typeof process !== 'undefined' && (process as any).env) || (import.meta as any)?.env || {};
            const hasServiceKey = Boolean(env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
            if (!isServer || !hasServiceKey) {
              // Skip client-side attempts to upload static HTML to avoid runtime "process is not defined" and 404 noise.
            } else {
              let themeKey = String((d as any).selected_theme || (d as any).blog_theme || 'minimal').toLowerCase();
              if (themeKey === 'random-ai-generated') themeKey = 'random';
              const rawSlug = String(finalPost?.slug || '').replace(/^\/+/, '').replace(/^themes\//i, '');
              // If slug includes theme prefix, remove it
              const parts = rawSlug.split('/').filter(Boolean);
              let innerSlug = rawSlug;
              if (parts.length > 1 && parts[0].toLowerCase() === themeKey) {
                innerSlug = parts.slice(1).join('/');
              }

              // Dynamically import publishing service and try to upload
              try {
                const { publishPostToTheme } = await import('@/services/postPublishingService');
                // publishPostToTheme will use service role credentials; ensure errors are caught
                await publishPostToTheme({ domainId: (d as any).id, themeKey, slug: innerSlug, title: finalPost?.title || finalTitleForPublish, contentHtml: finalPost?.content || finalContentForPublish, publishedAt: finalPost?.published_at || new Date().toISOString(), automationId: campaign.id });
              } catch (pubErr) {
                // Not fatal; log for debugging
                try { console.warn('Failed to upload post HTML to themes storage for', d.domain, pubErr && (pubErr.message || pubErr)); } catch(e){}
              }
            }
          } catch (e) {}

          // Record link for Links tab (dedupe per campaign+platform)
          try {
            const nowIso = new Date().toISOString();
            const platformId = String((d as any).domain || 'domain').toLowerCase();
            const { data: exists } = await supabase
              .from('automation_published_links')
              .select('id, published_url')
              .eq('campaign_id', campaign.id)
              .eq('platform', platformId)
              .maybeSingle();

            if (exists) {
              if (finalPost?.url && exists.published_url !== String(finalPost.url)) {
                await supabase
                  .from('automation_published_links')
                  .update({ published_url: String(finalPost.url), status: 'published', keyword, anchor_text: anchor, target_url: targetUrl, published_at: nowIso })
                  .eq('id', exists.id);
              }
            } else {
              await supabase.from('automation_published_links').insert({
                campaign_id: campaign.id,
                platform: platformId,
                published_url: String(finalPost?.url || ''),
                status: 'published',
                keyword,
                anchor_text: anchor,
                target_url: targetUrl,
                created_at: nowIso,
                published_at: nowIso
              });
            }
          } catch {}

          // Emit feed event
          try {
            const { realTimeFeedService } = await import('./realTimeFeedService');
            realTimeFeedService.emitUrlPublished(finalPost?.url || '', campaign.id, campaign.keyword || campaign.name, 'domain');
          } catch {}
        } catch (e: any) {
          errors++; details.push({ domain: (d as any)?.domain, action: 'exception', error: e?.message || String(e) });
        }
      }

      const message = `Published ${published}, skipped ${skipped}, errors ${errors} across ${domainRows.length} domain(s)`;
      // Update campaign status to active if previously paused/completed
      try { await supabase.from('automation_campaigns').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', campaignId); } catch {}
      return { success: errors === 0, message, published, skipped, errors, details };
    } catch (err: any) {
      return { success: false, message: err?.message || 'smartResumeCampaign error', published: 0, skipped: 0, errors: 1, details };
    }
  }

  private normalizeCampaign(row: any): Campaign {
    const kwArray = Array.isArray(row.keywords)
      ? row.keywords
      : [row.keyword].filter(Boolean);
    const anchorArray = Array.isArray(row.anchor_texts)
      ? row.anchor_texts
      : [row.anchor_text].filter(Boolean);

    return {
      id: String(row.id),
      user_id: String(row.user_id || ''),
      name: String(row.name || row.keyword || ''),
      target_url: String(row.target_url || ''),
      keywords: kwArray || [],
      anchor_texts: anchorArray || [],
      status: row.status || 'draft',
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || row.created_at || new Date().toISOString(),
      completed_at: row.completed_at,
      error_message: row.error_message || row.last_error,
      keyword: row.keyword,
      anchor_text: row.anchor_text,
    } as Campaign;
  }

  async createCampaign(payload: any): Promise<Campaign> {
    try {
      const { id } = payload || {};
      if (!id) throw new Error('Missing campaign id');

      // Invoke background Netlify function to start posting once per eligible domain
    try {
      const supabase = await this.getClient();
      const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
      await netlifyInvoker.invoke('automation-post', {
        body: { campaign_id: id }
      });

      // Allow background job to enqueue, then check if any posts were created
      await new Promise((r) => setTimeout(r, 1500));
      let createdCount = 0;
      try {
        const { count } = await supabase
          .from('automation_posts')
          .select('*', { head: true, count: 'exact' })
          .eq('automation_id', id);
        createdCount = typeof count === 'number' ? count : 0;
      } catch {}

      // If none created yet (background not available), run safe one-per-domain resume
      if (createdCount === 0) {
        try {
          await this.smartResumeCampaign(id);
        } catch (resumeErr) {
          console.warn('smartResumeCampaign fallback failed:', resumeErr);
        }
      }
    } catch (invokeErr) {
      console.warn('automation-post invoke failed; running smart resume:', invokeErr);
      try {
        await this.smartResumeCampaign(id);
      } catch (resumeErr) {
        console.warn('smartResumeCampaign fallback failed:', resumeErr);
      }
    }

      const result: Campaign = {
        id: String(payload.id),
        user_id: String(payload.user_id || ''),
        name: String(payload.name || payload.keyword || ''),
        target_url: String(payload.target_url || payload.targetUrl || ''),
        keywords: Array.isArray(payload.keywords)
          ? payload.keywords
          : [String(payload.keyword || '')].filter(Boolean),
        anchor_texts: Array.isArray(payload.anchor_texts)
          ? payload.anchor_texts
          : [String(payload.anchor_text || payload.anchorText || '')].filter(Boolean),
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        keyword: payload.keyword,
        anchor_text: payload.anchor_text || payload.anchorText,
      } as Campaign;

      return result;
    } catch (err) {
      console.error('AutomationOrchestrator.createCampaign error:', err);
      throw err;
    }
  }

  async getUserCampaigns(): Promise<Campaign[]> {
    try {
      const supabase = await this.getClient();

      // Ensure users only see their own campaigns (extra safety beyond RLS)
      let uid: string | null = null;
      try {
        const { data: authData } = await supabase.auth.getUser();
        uid = authData?.user?.id || null;
      } catch {}

      let query = supabase
        .from('automation_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) as any;

      if (uid) {
        query = query.eq('user_id', uid);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((row: any) => this.normalizeCampaign(row));
    } catch (e) {
      console.warn('getUserCampaigns fallback:', e);
      return [];
    }
  }

  async getCampaign(id?: string): Promise<Campaign | null> {
    if (!id) return null;
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from('automation_campaigns')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? this.normalizeCampaign(data) : null;
    } catch (e) {
      console.warn('getCampaign failed:', e);
      return null;
    }
  }

  async getCampaignWithLinks(id: string): Promise<(Campaign & { automation_published_links: PublishedLink[] }) | null> {
    if (!id) return null;
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from('automation_campaigns')
        .select('*, automation_published_links(*), automation_posts(id, url, domain_id, published_at, created_at)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const normalized = this.normalizeCampaign(data);
        const directLinks = (data as any).automation_published_links || [];
        if (Array.isArray(directLinks) && directLinks.length > 0) {
          return { ...normalized, automation_published_links: directLinks } as any;
        }
        const posts: Array<{ id: string; url: string | null; domain_id: string | null; published_at?: string; created_at?: string }> = (data as any).automation_posts || [];
        if (posts.length > 0) {
          const domainIds = Array.from(new Set(posts.map(p => p.domain_id).filter(Boolean))) as string[];
          let domainsMap: Record<string, string> = {};
          if (domainIds.length) {
            const { data: domains } = await supabase.from('domains').select('id, domain').in('id', domainIds);
            domainsMap = (domains || []).reduce((acc: any, d: any) => ({ ...acc, [d.id]: d.domain }), {});
          }
          const synthesized: PublishedLink[] = posts
            .filter(p => !!p.url)
            .map(p => ({
              id: String(p.id),
              published_url: String(p.url),
              platform: domainsMap[String(p.domain_id)] || 'domain',
              published_at: p.published_at || p.created_at || new Date().toISOString(),
            }));
          return { ...normalized, automation_published_links: synthesized } as any;
        }
        return { ...normalized, automation_published_links: [] } as any;
      }

      // Fallback: query separately and combine
      const [{ data: campaign }, { data: legacyLinks }, { data: posts }] = await Promise.all([
        supabase.from('automation_campaigns').select('*').eq('id', id).maybeSingle(),
        supabase.from('automation_published_links').select('*').eq('campaign_id', id),
        supabase.from('automation_posts').select('id, url, domain_id, published_at, created_at').eq('automation_id', id)
      ]);
      if (!campaign) return null;
      const normalized = this.normalizeCampaign(campaign);
      let links: PublishedLink[] = (legacyLinks || []) as any;
      if (!links.length && posts && posts.length) {
        const domainIds = Array.from(new Set(posts.map((p:any) => p.domain_id).filter(Boolean)));
        let domainsMap: Record<string, string> = {};
        if (domainIds.length) {
          const { data: domains } = await supabase.from('domains').select('id, domain').in('id', domainIds as any);
          domainsMap = (domains || []).reduce((acc: any, d: any) => ({ ...acc, [d.id]: d.domain }), {});
        }
        links = (posts as any[]).filter(p => !!p.url).map((p: any) => ({
          id: String(p.id),
          published_url: String(p.url),
          platform: domainsMap[String(p.domain_id)] || 'domain',
          published_at: p.published_at || p.created_at || new Date().toISOString(),
        }));
      }
      return { ...normalized, automation_published_links: links } as any;
    } catch (e) {
      console.warn('getCampaignWithLinks failed:', e);
      return null;
    }
  }

  getCampaignStatusSummary(campaignId: string) {
    // Lightweight, in-memory summary derived from published links count
    const unique = new Set<string>();
    const summary = {
      totalPlatforms: 0,
      platformsCompleted: 0,
      completedPlatforms: [] as string[],
      nextPlatform: undefined as string | undefined,
      isFullyCompleted: false,
    };
    // Try to enrich from cached links via window (if available from other components)
    try {
      const anyWin = window as any;
      const campaigns = anyWin?.__automationCampaignCache as Array<{ id: string; automation_published_links?: PublishedLink[] }> | undefined;
      const c = campaigns?.find(x => x.id === campaignId);
      const links = c?.automation_published_links || [];
      links.forEach(l => unique.add((l.platform || '').toLowerCase()));
      summary.totalPlatforms = Math.max(unique.size, links.length);
      summary.platformsCompleted = unique.size;
      summary.completedPlatforms = Array.from(unique);
      summary.isFullyCompleted = summary.platformsCompleted > 0 && summary.platformsCompleted === summary.totalPlatforms;
    } catch {}
    return summary;
  }

  getCampaignProgress(campaignId: string) {
    const now = new Date();
    return {
      campaignId,
      campaignName: 'Automation Campaign',
      targetUrl: '',
      keyword: '',
      anchorText: '',
      steps: [
        { id: 'prepare', title: 'Prepare Content', description: 'Generating content', status: 'completed', timestamp: now },
        { id: 'post', title: 'Publish to Platforms', description: 'Posting across platforms', status: 'in_progress', timestamp: now },
        { id: 'finish', title: 'Finalize', description: 'Wrapping up', status: 'pending' },
      ],
      currentStep: 2,
      isComplete: false,
      isError: false,
      publishedUrls: [],
      startTime: now,
    };
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    try {
      const supabase = await this.getClient();
      await supabase.from('automation_campaigns').update({ status: 'paused', updated_at: new Date().toISOString() }).eq('id', campaignId);
    } catch (e) {
      console.warn('pauseCampaign fallback:', e);
    }
  }

  async resumeCampaign(campaignId: string): Promise<{ success: boolean; message: string }> {
    try {
      const supabase = await this.getClient();
      const { data: campaign } = await supabase.from('automation_campaigns').select('status').eq('id', campaignId).maybeSingle();
      if (campaign?.status === 'completed') {
        return { success: false, message: 'Campaign already completed.' };
      }
      await supabase.from('automation_campaigns').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', campaignId);
      return { success: true, message: 'Campaign resumed.' };
    } catch (e) {
      console.warn('resumeCampaign fallback:', e);
      return { success: false, message: 'Unable to resume campaign right now.' };
    }
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    try {
      const supabase = await this.getClient();
      await supabase.from('automation_published_links').delete().eq('campaign_id', campaignId);
      await supabase.from('automation_campaigns').delete().eq('id', campaignId);
    } catch (e) {
      console.warn('deleteCampaign fallback:', e);
    }
  }

  /**
   * Subscribe to progress updates for a campaign. Returns an unsubscribe function.
   */
  subscribeToProgress(campaignId: string, cb: (progress: any) => void): () => void {
    if (!this.progressListeners.has(campaignId)) {
      this.progressListeners.set(campaignId, new Set());
    }
    const set = this.progressListeners.get(campaignId)!;
    set.add(cb);
    return () => {
      set.delete(cb);
      if (set.size === 0) this.progressListeners.delete(campaignId);
    };
  }

  /**
   * Emit progress update to subscribers
   */
  emitProgress(campaignId: string, progress: any) {
    const set = this.progressListeners.get(campaignId);
    if (set) {
      for (const cb of Array.from(set)) {
        try { cb(progress); } catch (e) { console.error('Progress listener error', e); }
      }
    }
  }

  /**
   * Log activity for a campaign (persists to automation_logs table if available)
   */
  async logActivity(campaignId: string, level: 'info'|'warning'|'error', message: string, details?: any) {
    try {
      const supabase = await this.getClient();
      const payload = {
        campaign_id: campaignId,
        log_level: level,
        message,
        details: details ? JSON.stringify(details) : null,
        created_at: new Date().toISOString()
      } as any;

      // Insert into automation_logs if table exists, but don't fail if it doesn't
      try {
        const { error } = await supabase.from('automation_logs').insert(payload);
        if (error) {
          // If table doesn't exist, swallow error but cache locally
          console.warn('logActivity insert error, caching locally:', error.message || error);
          const arr = this.activityLogsCache.get(campaignId) || [];
          arr.unshift({ ...payload });
          this.activityLogsCache.set(campaignId, arr);
        } else {
          // Clear any cached logs for this campaign
          this.activityLogsCache.delete(campaignId);
        }
      } catch (e) {
        const arr = this.activityLogsCache.get(campaignId) || [];
        arr.unshift({ ...payload });
        this.activityLogsCache.set(campaignId, arr);
      }

    } catch (e) {
      console.warn('logActivity overall failure:', e);
    }
  }

  async getCampaignLogs(campaignId: string): Promise<Array<{ id: string; log_level: 'info'|'warning'|'error'; message: string; created_at: string; details?: any }>> {
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      // Fallback to empty logs so UI still renders
      console.warn('getCampaignLogs fallback:', e);
      return [];
    }
  }
}

export function getOrchestrator(): AutomationOrchestrator {
  return new AutomationOrchestrator();
}
