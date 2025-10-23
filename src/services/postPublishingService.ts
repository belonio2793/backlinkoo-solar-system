import { createClient } from '@supabase/supabase-js';
import { BlogThemesService } from './blogThemesService';

const THEME_BUCKET = process.env.SUPABASE_NEWS_BUCKET || process.env.SUPABASE_THEMES_BUCKET || 'themes';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || (typeof (import.meta as any) !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : undefined);
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || (typeof (import.meta as any) !== 'undefined' ? (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY : undefined);

function getServiceClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    throw new Error('Missing Supabase service role configuration (SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
}

async function fetchTemplateFromStorage(themeKey: string, name: 'post.html'): Promise<string | null> {
  try {
    if (!SUPABASE_URL) return null;
    const candidates = [themeKey];
    // try variants similar to domain-blog-server
    for (const k of candidates) {
      const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${THEME_BUCKET}/${encodeURIComponent(k)}/${name}`;
      try {
        const res = await fetch(url);
        if (res.ok && /text\/html/i.test(res.headers.get('content-type') || '')) {
          return await res.text();
        }
      } catch (e) {
        // ignore and try next
      }
    }
  } catch (e) {}
  return null;
}

function replaceTokens(tpl: string, tokens: Record<string, string | null | undefined>) {
  let out = String(tpl);
  for (const [k, v] of Object.entries(tokens)) {
    const val = v == null ? '' : String(v);
    const re = new RegExp(`\\{\\{\\s*${k}\\s*\\}}`, 'gi');
    out = out.replace(re, val);
  }
  return out;
}

export async function renderPostHtml(themeKey: string, title: string, contentHtml: string, published?: string) : Promise<string> {
  // Always normalize before rendering to ensure paragraphs/headings and a safe title
  const bestTitle = (() => {
    try {
      const t = extractTitleFromContent(String(contentHtml || '')) || title || '';
      return formatTitleCase(t);
    } catch { return title; }
  })();
  const normalizedArticle = (() => {
    try { return formatNormalize(bestTitle, String(contentHtml || '')); } catch { return String(contentHtml || ''); }
  })();
  const contentForTemplate = (() => {
    let inner = String(normalizedArticle || '');
    inner = inner.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');
    inner = inner.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
    return inner.trim();
  })();


  // Fallback to in-memory theme renderer
  const theme = BlogThemesService.getThemeById(themeKey) || BlogThemesService.getDefaultTheme();
  return BlogThemesService.generateThemedBlogPost(contentForTemplate, bestTitle, theme);
}

export async function uploadPostFiles(themeKey: string, slug: string, html: string): Promise<{ paths: string[] }> {
  const client = getServiceClient();
  const bucket = THEME_BUCKET;
  // Upload as {themeKey}/{slug}/post.html for permalink, plus index.html and a top-level slug.html fallback
  const keyPost = `${themeKey}/${slug}/post.html`;
  const keyIndex = `${themeKey}/${slug}/index.html`;
  const keyTop = `${themeKey}/${slug}.html`;
  const buffer = Buffer.from(html, 'utf8');

  const results: string[] = [];

  try {
    const { error: err1 } = await client.storage.from(bucket).upload(keyPost, buffer, { contentType: 'text/html; charset=utf-8', upsert: true, cacheControl: '3600' });
    if (err1) throw err1;
    results.push(keyPost);
  } catch (e) {
    throw new Error('Failed to upload HTML file (post.html): ' + (e && (e as any).message ? (e as any).message : String(e)));
  }

  try {
    const { error: err2 } = await client.storage.from(bucket).upload(keyIndex, buffer, { contentType: 'text/html; charset=utf-8', upsert: true, cacheControl: '3600' });
    if (!err2) results.push(keyIndex);
    else console.warn('Failed to upload index.html variant:', err2);
  } catch (e) {
    console.warn('Failed to upload index.html variant (exception):', e);
  }

  try {
    const { error: err3 } = await client.storage.from(bucket).upload(keyTop, buffer, { contentType: 'text/html; charset=utf-8', upsert: true, cacheControl: '3600' });
    if (!err3) results.push(keyTop);
    else console.warn('Failed to upload top-level slug.html variant:', err3);
  } catch (e) {
    console.warn('Failed to upload top-level slug.html variant (exception):', e);
  }

  return { paths: results };
}

import { normalizeContent as formatNormalize, titleCase as formatTitleCase, extractTitleFromContent } from '../lib/autoPostFormatter';

export async function publishPostToTheme(options: {
  domainId: string;
  themeKey: string;
  slug: string;
  title: string;
  contentHtml: string;
  publishedAt?: string;
  automationId?: string;
}) {
  const { domainId, themeKey, slug, title, contentHtml, publishedAt, automationId } = options;
  // render
  const html = await renderPostHtml(themeKey, title, contentHtml, publishedAt || new Date().toISOString());
  // upload
  const uploadRes = await uploadPostFiles(themeKey, slug, html);

  // insert into automation_posts table for dynamic serving
  const client = getServiceClient();
  const publishedTime = publishedAt || new Date().toISOString();

  const finalTitle = formatTitleCase(extractTitleFromContent(contentHtml) || title);
  const finalContent = formatNormalize(finalTitle, contentHtml);

  // Determine public storage path and friendly permalink (#slug)
  const publicBase = SUPABASE_URL ? `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${THEME_BUCKET}` : '';
  const publicPath = `${publicBase}/${encodeURIComponent(themeKey)}/${encodeURIComponent(slug)}/post.html`;

  // Try to fetch domain hostname to build #slug permalink
  let domainHost = '';
  try {
    const { data: domainRow } = await client.from('domains').select('domain').eq('id', domainId).maybeSingle();
    domainHost = domainRow?.domain || '';
    domainHost = String(domainHost).replace(/^https?:\/\//, '').replace(/\/$/, '');
  } catch (e) { domainHost = ''; }

  // Prefer domain-root permalink (https://domain/<slug>) when domain exists, else fall back to public storage path
  let permalink = publicPath;
  try {
    if (domainId) {
      const { data: domainRow } = await client.from('domains').select('domain').eq('id', domainId).maybeSingle();
      const domainHost = domainRow?.domain ? String(domainRow.domain).replace(/\/$/, '') : null;
      if (domainHost) {
        permalink = `https://${domainHost}/${encodeURIComponent(slug)}`;
      }
    }
  } catch (e) {}

  const insertPayload: any = {
    domain_id: domainId,
    title: finalTitle,
    slug,
    content: finalContent,
    published_at: publishedTime,
    url: permalink
  };
  if (automationId) insertPayload.automation_id = automationId;

  // Enforce one post per (automation_id, domain_id): check first to avoid duplicates
  if (insertPayload.automation_id) {
    try {
      const { data: existing } = await client
        .from('automation_posts')
        .select('*')
        .eq('automation_id', insertPayload.automation_id)
        .eq('domain_id', insertPayload.domain_id)
        .maybeSingle();
      if (existing) {
        return {
          uploaded: uploadRes.paths,
          automationPost: existing,
          publicPath
        };
      }
    } catch (_) {}
  }

  let { data, error } = await client.from('automation_posts').insert(insertPayload).select('id').maybeSingle();

  let automationPost: any = null;

  if (error) {
    const msg = String(error.message || error).toLowerCase();
    console.warn('Failed inserting automation_posts row:', error.message || error);

    // If this failed due to unique/duplicate constraint, try to fetch existing row and return it
    try {
      if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('constraint')) {
        if (insertPayload && insertPayload.automation_id && insertPayload.domain_id) {
          try {
            const { data: existing, error: existingErr } = await client.from('automation_posts').select('*').eq('automation_id', insertPayload.automation_id).eq('domain_id', insertPayload.domain_id).maybeSingle();
            if (!existingErr && existing) {
              automationPost = existing;
            }
          } catch (fetchErr) {}
        }
      }
    } catch (e) {}

    // If automation_id is required, create a lightweight automation_campaign for this domain
    if (!automationPost && (msg.includes('automation_id') || msg.includes('null value in column') || msg.includes('not-null'))) {
      try {
        // fetch domain owner
        const { data: domainRow } = await client.from('domains').select('id, domain, user_id').eq('id', domainId).maybeSingle();
        const owner = domainRow?.user_id || null;
        const campaignPayload: any = {
          user_id: owner,
          name: `auto-generated-${Date.now()}`,
          target_url: '/',
          status: 'draft'
        };
        // Try create campaign
        const { data: campData, error: campErr } = await client.from('automation_campaigns').insert(campaignPayload).select('id').maybeSingle();
        if (!campErr && campData && campData.id) {
          insertPayload.automation_id = campData.id;
          // retry insert
          const retry = await client.from('automation_posts').insert(insertPayload).select('id').maybeSingle();
          if (!retry.error) {
            automationPost = retry.data;
          } else {
            console.warn('Retry automation_posts insert failed:', retry.error.message || retry.error);
            // If retry failed due to duplicate, try fetch existing
            const retryMsg = String((retry.error as any).message || retry.error).toLowerCase();
            if ((retryMsg.includes('duplicate') || retryMsg.includes('unique') || retryMsg.includes('constraint')) && insertPayload.automation_id && insertPayload.domain_id) {
              try {
                const { data: existing2, error: existingErr2 } = await client.from('automation_posts').select('*').eq('automation_id', insertPayload.automation_id).eq('domain_id', insertPayload.domain_id).maybeSingle();
                if (!existingErr2 && existing2) automationPost = existing2;
              } catch (_) {}
            }
          }
        } else {
          console.warn('Could not create fallback automation_campaign:', campErr && (campErr.message || campErr));
        }
      } catch (campEx) {
        console.warn('Exception creating fallback automation_campaign:', campEx);
      }
    }

    // If still no automationPost, attempt fallback table
    if (!automationPost) {
      try {
        const { data: dbp, error: dbpErr } = await client.from('domain_blog_posts').insert({
          domain_id: domainId,
          title: finalTitle,
          slug,
          content: finalContent,
          published_at: publishedTime,
          status: 'published'
        }).select('id').maybeSingle();
        if (dbpErr) {
          console.warn('Fallback to domain_blog_posts failed:', dbpErr.message || dbpErr);
        } else {
          automationPost = dbp;
        }
      } catch (fbErr) {
        console.warn('Fallback domain_blog_posts insert exception:', fbErr);
      }
    }

  } else {
    automationPost = data;
  }

  return {
    uploaded: uploadRes.paths,
    automationPost: automationPost || null,
    publicPath // primary public path (..../<themeKey>/<slug>/post.html)
  };
}
