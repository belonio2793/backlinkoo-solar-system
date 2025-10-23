import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderIndex, renderPost } from "./templates.ts";
import { normalizeContent, extractTitleFromContent, titleCase } from "../_shared/format-post.ts";

function html(status: number, body: string, extraHeaders: Record<string, string> = {}) {
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${status}</title></head><body>${body}</body></html>`, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders,
    },
  });
}

function cors(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  } as Record<string, string>;
}

function esc(s: string | null | undefined) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const THEME_BUCKET = 'themes';

function altThemeKeys(key: string): string[] {
  const orig = String(key || '');
  const k = orig.toLowerCase();
  const variants = new Set<string>([k, orig]);
  variants.add(k.replace(/-/g, '_'));
  variants.add(k.replace(/_/g, '-'));
  if (k === 'seo-optimized') variants.add('seo_optimized');
  if (k === 'tech-blog') variants.add('techblog');
  if (k === 'custom-layout') variants.add('custom_layout');
  if (k === 'elegant-editorial') { variants.add('eleganteditorial'); variants.add('elegant_editorial'); }
  if (k === 'ecommerce') variants.add('e-commerce');
  if (k === 'html') variants.add('HTML');
  return Array.from(variants);
}

async function fetchTemplate(supabaseUrl: string, themeKey: string, name: 'index.html' | 'post.html'): Promise<string | null> {
  const candidates = altThemeKeys(themeKey).map(k => `${supabaseUrl}/storage/v1/object/public/${THEME_BUCKET}/${encodeURIComponent(k)}/${name}`);
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok && /text\/html/i.test(res.headers.get('content-type') || '')) {
        return await res.text();
      }
    } catch (_) {}
  }
  return null;
}

async function fetchAnyTemplate(supabaseUrl: string, themeKey: string, baseName: string): Promise<string | null> {
  const name = `${baseName}.html`;
  const candidates = altThemeKeys(themeKey).map(k => `${supabaseUrl}/storage/v1/object/public/${THEME_BUCKET}/${encodeURIComponent(k)}/${name}`);
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok && /text\/html/i.test(res.headers.get('content-type') || '')) {
        return await res.text();
      }
    } catch (_) {}
  }
  return null;
}

function replaceTokens(tpl: string, tokens: Record<string, string | null | undefined>): string {
  let out = tpl;
  for (const [k, v] of Object.entries(tokens)) {
    const val = v == null ? '' : String(v);
    const re = new RegExp(`\\{\\{\\s*${k}\\s*\\}}`, 'gi');
    out = out.replace(re, val);
  }
  return out;
}

function ensureInject(tpl: string, marker: string, htmlFrag: string): string {
  if (tpl.includes(marker)) return tpl.replace(marker, htmlFrag);
  if (tpl.includes('{{POSTS}}')) return tpl.replace(/\{\{\s*POSTS\s*\}\}/gi, htmlFrag);
  if (tpl.includes('<div id="posts"></div>')) return tpl.replace('<div id="posts"></div>', htmlFrag);
  if (tpl.includes('</main>')) return tpl.replace('</main>', `${htmlFrag}</main>`);
  if (tpl.includes('</body>')) return tpl.replace('</body>', `${htmlFrag}</body>`);
  return tpl + htmlFrag;
}

function renderItemsList(items: Array<{ title: string; href: string; published?: string | null; excerpt?: string | null; }>): string {
  return `<ul class="posts">${items.map(i => `
    <li class="post-item">
      <a href="${i.href}"><strong>${i.title}</strong></a>
      ${i.published ? `<div class="meta">${i.published}</div>` : ''}
      ${i.excerpt ? `<p>${i.excerpt}</p>` : ''}
    </li>`).join('')}
  </ul>`;
}

function renderPagination(themeKey: string, page: number, totalPages: number): string {
  if (totalPages <= 1) return '';
  const hrefFor = (n: number) => n <= 1 ? '/' : `/page/${n}`;
  const items: string[] = [];
  const maxButtons = 5;
  const start = Math.max(1, Math.min(page - 2, totalPages - (maxButtons - 1)));
  const end = Math.min(totalPages, start + (maxButtons - 1));
  items.push(`<a class="page prev${page===1?' disabled':''}" href="${page===1?'#':hrefFor(page-1)}" aria-label="Previous">‹</a>`);
  for (let n = start; n <= end; n++) {
    items.push(n === page
      ? `<span class="page current" aria-current="page">${n}</span>`
      : `<a class="page" href="${hrefFor(n)}">${n}</a>`);
  }
  items.push(`<a class="page next${page===totalPages?' disabled':''}" href="${page===totalPages?'#':hrefFor(page+1)}" aria-label="Next">›</a>`);
  return `<nav class="pagination" role="navigation" aria-label="Pagination">${items.join('')}</nav>`;
}

// Content formatting and sanitization for automation_posts
function _stripDangerous(html: string): string {
  if (!html) return "";
  let out = String(html);
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  out = out.replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "");
  out = out.replace(/href\s*=\s*"\s*javascript:[^"]*"/gi, 'href="#"');
  out = out.replace(/href\s*=\s*'\s*javascript:[^']*'/gi, "href='#'");
  return out;
}

function _extractBlocks(html: string, tag: string) {
  const blocks: string[] = [];
  let out = html;
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  out = out.replace(re, (m) => {
    const key = `%%BLOCK_${tag.toUpperCase()}_${blocks.length}%%`;
    blocks.push(m);
    return key;
  });
  return { out, blocks };
}

function _restoreBlocks(html: string, tag: string, blocks: string[]) {
  let out = html;
  blocks.forEach((b, i) => {
    const key = new RegExp(`%%BLOCK_${tag.toUpperCase()}_${i}%%`, 'g');
    out = out.replace(key, b);
  });
  return out;
}

function _normalizeWhitespace(html: string): string {
  let out = html.replace(/[\u00A0\t]+/g, ' ');
  out = out.replace(/\s{3,}/g, '  ');
  out = out.replace(/(?:<br\s*\/?>\s*){2,}/gi, '</p><p>');
  return out;
}

function _fixPunctuation(text: string): string {
  let t = text
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,.;:!?])(?!\s|$)/g, '$1 ')
    .replace(/([,.;:!?])\s{2,}/g, '$1 ')
    .replace(/[!?]{3,}/g, '!!')
    .replace(/\.{4,}/g, '...')
    .replace(/\s*--\s*/g, ' — ')
    .replace(/\s+"/g, ' "')
    .replace(/\s+\'/g, " '");
  t = t.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  return t;
}

function _wrapPlainText(html: string): string {
  const hasBlock = /<(p|h\d|ul|ol|li|table|blockquote|pre|code|section|article|div)[^>]*>/i.test(html);
  if (hasBlock) return html;
  const parts = html.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) return `<p>${html.trim()}</p>`;
  return parts.map(p => `<p>${p}</p>`).join('');
}

function formatPostHtml(title: string, input: string): string {
  if (!input) return '';
  // Prefer the shared normalizer which handles markdown/asterisks and removes visible markers
  const normalized = normalizeContent(title || '', String(input));
  if (normalized) return normalized.trim();
  // Fallback legacy sanitizer
  let html = _stripDangerous(String(input));
  const pre = _extractBlocks(html, 'pre');
  const code = _extractBlocks(pre.out, 'code');
  let work = code.out;
  work = _normalizeWhitespace(work);
  work = work.replace(/>([^<]+)</g, (m, txt) => '>' + _fixPunctuation(txt) + '<');
  work = _wrapPlainText(work);
  work = _restoreBlocks(work, 'code', code.blocks);
  work = _restoreBlocks(work, 'pre', pre.blocks);
  return work.trim();
}

// Structured content (JSONB) -> minimal HTML for normalization/excerpt
function buildHtmlFromStructured(c: any): string {
  try {
    if (!c || typeof c !== 'object') return '';
    const h2 = Array.isArray(c.headlines) ? c.headlines.filter(Boolean).slice(0, 6) : [];
    const paras = Array.isArray(c.paragraphs) ? c.paragraphs.filter(Boolean) : [];
    const faq = Array.isArray(c.faq) ? c.faq : [];
    const parts: string[] = [];
    if (c.introduction) parts.push(`<p>${esc(String(c.introduction))}</p>`);
    for (const t of h2) parts.push(`<h2>${esc(String(t))}</h2>`);
    for (const ptxt of paras) parts.push(`<p>${esc(String(ptxt))}</p>`);
    if (c.summary) parts.push(`<p>${esc(String(c.summary))}</p>`);
    if (c.conclusion) parts.push(`<p>${esc(String(c.conclusion))}</p>`);
    for (const f of faq) {
      const q = f?.q ? esc(String(f.q)) : null;
      const a = f?.a ? esc(String(f.a)) : null;
      if (q) parts.push(`<h3>${q}</h3>`);
      if (a) parts.push(`<p>${a}</p>`);
    }
    return parts.join('\n');
  } catch { return ''; }
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = cors(origin);
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || Deno.env.get("PROJECT_URL") || Deno.env.get("VITE_SUPABASE_URL") || "";
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY") || "";
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return html(500, `<h1>Server misconfiguration</h1><p>Supabase not configured.</p>`);
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  try {
    const url = new URL(req.url);
    const ref = req.headers.get("referer") || "";
    let candidateHost = req.headers.get("x-forwarded-host")
      || req.headers.get("x-original-host")
      || req.headers.get("x-real-host")
      || req.headers.get("x-forwarded-server")
      || (ref ? (new URL(ref)).host : "")
      || req.headers.get("host")
      || "";

    // Allow explicitly overriding the target domain via query param or header (useful when calling via proxy)
    const overrideDomain = (url.searchParams.get('domain') || req.headers.get('x-supabase-domain') || "").toString();

    let host = candidateHost.replace(/^https?:\/\//, "").replace(/^www\./, "").split(":")[0];
    if (overrideDomain) {
      host = String(overrideDomain).replace(/^https?:\/\//, "").replace(/^www\./, "").split(":")[0];
    }
    const rawPath = url.pathname;

    // If request ends with .html, redirect to canonical extensionless path first
    try {
      if (/\.html(\/?$)/i.test(rawPath)) {
        const target = rawPath.replace(/\.html(\/?$)/i, '');
        const dest = `${url.protocol}//${candidateHost}${target || '/'}${url.search || ''}`;
        return new Response('', { status: 301, headers: { ...headers, Location: dest } });
      }
    } catch (rErr) {
      // ignore and continue
    }

    // Netlify app subdomain should not serve domain blog; redirect to primary custom domain.
    if (host === 'backlinkoo.netlify.app') {
      const dest = `https://backlinkoo.com${rawPath || '/'}`;
      return new Response('', { status: 302, headers: { ...headers, Location: dest } });
    }
    let path = rawPath.replace(/.*\/domain-blog-server/i, "").replace(/\/+$/g, "");

    // Serve theme assets like /themes/<theme>/style.css, images, fonts, etc.
    try {
      const assetMatch = path.match(/^\/themes\/([^\/]+)\/([^?#]+)$/i);
      if (assetMatch) {
        const reqTheme = assetMatch[1];
        const filename = assetMatch[2];
        if (/\.(css|js|png|jpe?g|svg|webp|ico|woff2?|ttf|eot|gif|mp4|webm)$/i.test(filename)) {
          const candidates = altThemeKeys(reqTheme);
          for (const k of candidates) {
            // 1) Try Supabase Storage bucket first
            const u1 = `${SUPABASE_URL}/storage/v1/object/public/${THEME_BUCKET}/${encodeURIComponent(k)}/${filename}`;
            try {
              const r1 = await fetch(u1, { method: 'GET' });
              if (r1.ok) {
                const ctype = r1.headers.get('content-type') || '';
                const buf = await r1.arrayBuffer();
                return new Response(buf, { status: 200, headers: { ...headers, 'Content-Type': ctype || (filename.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/octet-stream'), 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
              }
            } catch {}
            // 2) Fallback to Netlify static if available
            try {
              const u2 = `https://backlinkoo.netlify.app/themes/${encodeURIComponent(k)}/${filename}`;
              const r2 = await fetch(u2, { method: 'GET' });
              if (r2.ok) {
                const ctype = r2.headers.get('content-type') || '';
                const buf = await r2.arrayBuffer();
                return new Response(buf, { status: 200, headers: { ...headers, 'Content-Type': ctype || (filename.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/octet-stream'), 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
              }
            } catch {}
          }
          return new Response('Not found', { status: 404, headers });
        }
      }
    } catch {}

    // POST: update meta fields
    if (req.method === "POST") {
      try {
        const body = await req.json().catch(() => ({} as any));
        const targetDomain = (body.domain || host || "").toString().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(":")[0];
        if (!targetDomain) {
          return new Response(JSON.stringify({ error: "Missing domain" }), { status: 400, headers: { ...headers, "Content-Type": "application/json" } });
        }
        const { data: domainRow, error: domainErr } = await sb
          .from("domains")
          .select("id, domain")
          .eq("domain", targetDomain)
          .maybeSingle();
        if (domainErr) return new Response(JSON.stringify({ error: domainErr.message }), { status: 500, headers: { ...headers, "Content-Type": "application/json" } });
        if (!domainRow) return new Response(JSON.stringify({ error: "Domain not found" }), { status: 404, headers: { ...headers, "Content-Type": "application/json" } });

        const allowed = ["meta_title","meta_description","meta_keywords","og_title","og_description","og_image","theme_name","selected_theme"] as const;
        const update: Record<string, any> = {};
        for (const k of allowed) if (k in body) update[k] = (body as any)[k];
        // Backward-compat: accept legacy "theme" and map it to selected_theme
        if (!update.selected_theme && (body as any)?.theme) update.selected_theme = (body as any).theme;
        // Never write a non-existent "theme" column
        if ("theme" in update) delete (update as any).theme;
        if (Object.keys(update).length === 0) {
          return new Response(JSON.stringify({ error: "No valid fields to update" }), { status: 400, headers: { ...headers, "Content-Type": "application/json" } });
        }
        update.updated_at = new Date().toISOString();
        const { data, error } = await sb.from("domains").update(update).eq("id", domainRow.id).select("id, domain").maybeSingle();
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...headers, "Content-Type": "application/json" } });

        try {
          const { data: settings } = await sb.from("domain_blog_settings").select("id, meta_tags").eq("domain_id", domainRow.id).maybeSingle();
          const merged = { ...(settings?.meta_tags || {}), ...update };
          if (settings?.id) await sb.from("domain_blog_settings").update({ meta_tags: merged, updated_at: new Date().toISOString() }).eq("id", settings.id);
          else await sb.from("domain_blog_settings").insert({ domain_id: domainRow.id, blog_title: "Blog", blog_description: "Latest articles and updates", meta_tags: merged });
        } catch {}

        return new Response(JSON.stringify({ success: true, id: data?.id, domain: targetDomain }), { status: 200, headers: { ...headers, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...headers, "Content-Type": "application/json" } });
      }
    }

    if (req.method !== "GET") return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...headers, "Content-Type": "application/json" } });

    // Legacy /sites normalization
    if (path.startsWith('/sites/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length > 1) {
        const maybeDomain = parts[1].replace(/^www\./, "");
        if (maybeDomain === host) {
          parts.splice(0, 2);
        } else {
          parts.splice(0, 1);
        }
      } else {
        parts.splice(0, 1);
      }
      path = '/' + parts.join('/');
    }

    // Load domain row first (fixes earlier ordering bug)
    let domainRow: any = null;
    let domainErr: any = null;
    {
      const { data: base, error: baseErr } = await sb
        .from("domains")
        .select("id, domain, blog_enabled, selected_theme, theme_name, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, dns_verified")
        .eq("domain", host)
        .maybeSingle();
      if (baseErr) domainErr = baseErr;
      if (base) domainRow = { ...base };
      if (!domainErr && domainRow) {
        try {
          const { data: settings } = await sb
            .from("domain_blog_settings")
            .select("meta_tags")
            .eq("domain_id", domainRow.id)
            .maybeSingle();
          const tags: any = (settings as any)?.meta_tags || null;
          if (tags) {
            if (!domainRow.meta_title && tags.meta_title) domainRow.meta_title = tags.meta_title;
            if (!domainRow.meta_description && tags.meta_description) domainRow.meta_description = tags.meta_description;
            if (!domainRow.meta_keywords && tags.meta_keywords) domainRow.meta_keywords = tags.meta_keywords;
            if (!domainRow.og_title && tags.og_title) domainRow.og_title = tags.og_title;
            if (!domainRow.og_description && tags.og_description) domainRow.og_description = tags.og_description;
            if (!domainRow.og_image && (tags.og_image || tags.og_image_url)) domainRow.og_image = tags.og_image || tags.og_image_url;
          }
        } catch {}
      }
    }

    if (domainErr) return html(500, `<h1>Supabase error</h1><pre>${esc(domainErr.message)}</pre>`);
    // If the request targets a primary host (served by the SPA), redirect to the main site to allow SPA handling instead of rendering via this function
    const PRIMARY_HOSTS = (Deno.env.get('PRIMARY_HOSTS') || 'backlinkoo.com,www.backlinkoo.com').split(',').map(h=>String(h||'').trim().toLowerCase().replace(/^www\./,''));
    const isPrimary = PRIMARY_HOSTS.includes(host);
    if (!domainRow) {
      if (isPrimary) {
        return new Response('', { status: 302, headers: { ...headers, Location: `https://${host}${rawPath || '/'}` } });
      }
      return html(200, `<h1>${esc(host)}</h1><p>Site is connected, but no domain record exists yet.</p><p>Visit the admin to finish setup or add a post under /blog/.</p>`);
    }
    if (domainRow.dns_verified === false) {
      if (isPrimary) {
        return new Response('', { status: 302, headers: { ...headers, Location: `https://${host}${rawPath || '/'}` } });
      }
      return html(200, `<h1>${esc(host)}</h1><p>DNS not verified yet. Please complete DNS setup for this domain.</p>`);
    }
    if (domainRow.blog_enabled === false) {
      try {
        const update: Record<string, any> = { blog_enabled: true, updated_at: new Date().toISOString() };
        if (!domainRow.selected_theme) { update.selected_theme = 'HTML'; update.theme_name = domainRow.theme_name || 'HTML'; }
        const { error: upErr } = await sb.from('domains').update(update).eq('id', domainRow.id);
        if (upErr) {
          console.warn('Auto-enable blog (Supabase fn) failed:', upErr.message || upErr);
        } else {
          domainRow.blog_enabled = true;
          domainRow.selected_theme = domainRow.selected_theme || 'minimal';
          domainRow.theme_name = domainRow.theme_name || 'Minimal Clean';
        }
      } catch (e) {
        console.warn('Auto-enable blog (Supabase fn) threw:', (e as any)?.message || String(e));
      }
      // Continue rendering even if update failed
    }

    const themeKey = String(domainRow.selected_theme || 'HTML');

    // Static pages: privacy-policy, terms-and-conditions, contact-us, index
    {
      const normalized = path.replace(/\/+$/g, '') || '/';
      const staticMap: Record<string, string> = {
        '/privacy-policy': 'privacy-policy',
        '/terms-and-conditions': 'terms-and-conditions',
        '/contact-us': 'contact-us',
        '/index': 'index'
      };
      if (normalized in staticMap) {
        const tpl = await fetchAnyTemplate(SUPABASE_URL, themeKey, staticMap[normalized]);
        if (tpl) return new Response(tpl, { status: 200, headers });
      }
      if (normalized === '/blog') {
        // Render empty list page using index.html with no posts
        const tpl = await fetchTemplate(SUPABASE_URL, themeKey, 'index.html');
        if (tpl) return new Response(tpl, { status: 200, headers });
      }
    }

    // Root and paginated listing
    if (path === '' || path === '/' || /^\/page\/\d+\/?$/.test(path)) {
      const pageMatch = path.match(/^\/page\/(\d+)\/?$/);
      const qp = Number(new URL(req.url).searchParams.get('page') || '1');
      const page = pageMatch ? Math.max(1, parseInt(pageMatch[1])) : (isFinite(qp) && qp > 0 ? Math.floor(qp) : 1);

      const sizeMap: Record<string, number> = { 'elegant-editorial': 10, 'lifestyle': 10 };
      const pageSize = sizeMap[themeKey] || 12;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: posts, error: postsErr, count } = await sb
        .from('automation_posts')
        .select('id, title, slug, published_at, content', { count: 'exact' })
        .eq('domain_id', domainRow.id)
        .order('published_at', { ascending: false })
        .range(start, end);
      if (postsErr) return html(500, `<h1>Error</h1><pre>${esc(postsErr.message)}</pre>`);

      const totalCount = typeof count === 'number' ? count : (posts?.length || 0);
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      const meta = {
        siteTitle: esc(domainRow.meta_title || domainRow.theme_name || domainRow.domain),
        description: domainRow.meta_description ? esc(domainRow.meta_description) : null,
        keywords: domainRow.meta_keywords ? esc(domainRow.meta_keywords) : null,
        ogTitle: domainRow.og_title ? esc(domainRow.og_title) : null,
        ogDescription: domainRow.og_description ? esc(domainRow.og_description) : null,
        ogImage: domainRow.og_image ? esc(domainRow.og_image) : null,
        favicon: domainRow.favicon ? esc(domainRow.favicon) : null,
        canonicalUrl: page > 1 ? `/page/${page}` : '/',
        themeKey: themeKey
      } as const;

      const items = (posts || []).map((p: any) => {
        const title = String((p as any).title || '');
        const raw = String((p as any).content || '');
        const normalized = formatPostHtml(title, raw) as string;
        const text = normalized.replace(/<[^>]+>/g, '').replace(/External post:\s*https?:\/\/\S+/gi, '').trim();
        const excerpt = text ? esc(text.slice(0, 180) + (text.length > 180 ? '…' : '')) : null;
        const published = (p as any).published_at ? new Date((p as any).published_at).toLocaleString() : null;
        const slug = String((p as any).slug || '');
        return { title: esc(title || slug), slug, href: `/${encodeURIComponent(slug)}`, published, excerpt };
      });

      const tpl = await fetchTemplate(SUPABASE_URL, themeKey, 'index.html');
      if (tpl) {
        const listHtml = renderItemsList(items);
        const base = replaceTokens(tpl, {
          SITE_TITLE: meta.siteTitle,
          TITLE: meta.siteTitle,
          DESCRIPTION: meta.description || '',
          KEYWORDS: meta.keywords || '',
          OG_TITLE: meta.ogTitle || '',
          OG_DESCRIPTION: meta.ogDescription || '',
          OG_IMAGE: meta.ogImage || '',
          FAVICON: meta.favicon || '',
          CANONICAL: meta.canonicalUrl || '/'
        });
        const withPosts = ensureInject(base, '<!-- POSTS -->', listHtml);
        const paginationHtml = renderPagination(themeKey, page, totalPages);
        const out = ensureInject(withPosts, '<!-- PAGINATION -->', paginationHtml);
        return new Response(out, { status: 200, headers });
      }

      const out = renderIndex(meta, items);
      return new Response(out, { status: 200, headers });
    }

    // If a request hits blog domain with an admin route like /automation, bounce to the main app
    const APP_URL = Deno.env.get("APP_URL") || Deno.env.get("VITE_APP_URL") || null;
    if (path.startsWith('/automation')) {
      if (APP_URL) {
        const dest = APP_URL.replace(/\/$/, '') + path;
        return new Response(null, { status: 302, headers: { ...headers, Location: dest } });
      }
      return html(404, `<h1>Not available here</h1><p>The automation dashboard is only available on the main app. Please open your app domain and visit <code>/automation</code>.</p>`);
    }

    // Listing: /posts and paginated variants (alias to theme-based blog)
    if (path === '/posts' || path === '/posts/' || /^\/posts\/page\/\d+\/?$/.test(path)) {
      const pageMatch = path.match(/^\/posts\/page\/(\d+)\/?$/);
      const qp = Number(new URL(req.url).searchParams.get('page') || '1');
      const page = pageMatch ? Math.max(1, parseInt(pageMatch[1])) : (isFinite(qp) && qp > 0 ? Math.floor(qp) : 1);

      const sizeMap: Record<string, number> = { 'elegant-editorial': 10, 'lifestyle': 10 };
      const pageSize = sizeMap[themeKey] || 12;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: posts, error: postsErr, count } = await sb
        .from('automation_posts')
        .select('id, title, slug, published_at, content', { count: 'exact' })
        .eq('domain_id', domainRow.id)
        .order('published_at', { ascending: false })
        .range(start, end);
      if (postsErr) return html(500, `<h1>Error</h1><pre>${esc(postsErr.message)}</pre>`);

      const totalCount = typeof count === 'number' ? count : (posts?.length || 0);
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      const meta = {
        siteTitle: esc(domainRow.meta_title || domainRow.theme_name || domainRow.domain),
        description: domainRow.meta_description ? esc(domainRow.meta_description) : null,
        keywords: domainRow.meta_keywords ? esc(domainRow.meta_keywords) : null,
        ogTitle: domainRow.og_title ? esc(domainRow.og_title) : null,
        ogDescription: domainRow.og_description ? esc(domainRow.og_description) : null,
        ogImage: domainRow.og_image ? esc(domainRow.og_image) : null,
        favicon: domainRow.favicon ? esc(domainRow.favicon) : null,
        canonicalUrl: page > 1 ? `/posts/page/${page}` : '/posts/',
        themeKey: themeKey
      } as const;

      const items = (posts || []).map((p: any) => {
        const title = String((p as any).title || '');
        const raw = String((p as any).content || '');
        const normalized = formatPostHtml(title, raw) as string;
        const text = normalized.replace(/<[^>]+>/g, '').replace(/External post:\s*https?:\/\/\S+/gi, '').trim();
        const excerpt = text ? esc(text.slice(0, 180) + (text.length > 180 ? '…' : '')) : null;
        const published = (p as any).published_at ? new Date((p as any).published_at).toLocaleString() : null;
        const slug = String((p as any).slug || '');
        const inner = slug.includes('/') ? slug.split('/').slice(1).join('/') : slug;
        return { title: esc(title || inner), slug, href: `/posts/${encodeURIComponent(inner)}`, published, excerpt };
      });

      const tpl = await fetchTemplate(SUPABASE_URL, themeKey, 'index.html');
      if (tpl) {
        const listHtml = renderItemsList(items);
        const base = replaceTokens(tpl, {
          SITE_TITLE: meta.siteTitle,
          TITLE: meta.siteTitle,
          DESCRIPTION: meta.description || '',
          KEYWORDS: meta.keywords || '',
          OG_TITLE: meta.ogTitle || '',
          OG_DESCRIPTION: meta.ogDescription || '',
          OG_IMAGE: meta.ogImage || '',
          FAVICON: meta.favicon || '',
          CANONICAL: meta.canonicalUrl || '/posts/'
        });
        const withPosts = ensureInject(base, '<!-- POSTS -->', listHtml);
        const paginationHtml = renderPagination(themeKey, page, totalPages);
        const out = ensureInject(withPosts, '<!-- PAGINATION -->', paginationHtml);
        return new Response(out, { status: 200, headers });
      }

      const out = renderIndex(meta, items);
      return new Response(out, { status: 200, headers });
    }

    // Listing: /blog and paginated variants (kept for backward compatibility)
    if (path === '/blog' || path === '/blog/' || /^\/blog\/page\/\d+\/?$/.test(path)) {
      const pageMatch = path.match(/^\/blog\/page\/(\d+)\/?$/);
      const qp = Number(new URL(req.url).searchParams.get('page') || '1');
      const page = pageMatch ? Math.max(1, parseInt(pageMatch[1])) : (isFinite(qp) && qp > 0 ? Math.floor(qp) : 1);

      const sizeMap: Record<string, number> = { 'elegant-editorial': 10, 'lifestyle': 10 };
      const pageSize = sizeMap[themeKey] || 12;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: posts, error: postsErr, count } = await sb
        .from('automation_posts')
        .select('id, title, slug, published_at, content', { count: 'exact' })
        .eq('domain_id', domainRow.id)
        .order('published_at', { ascending: false })
        .range(start, end);
      if (postsErr) return html(500, `<h1>Error</h1><pre>${esc(postsErr.message)}</pre>`);

      const totalCount = typeof count === 'number' ? count : (posts?.length || 0);
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      const meta = {
        siteTitle: esc(domainRow.meta_title || domainRow.theme_name || domainRow.domain),
        description: domainRow.meta_description ? esc(domainRow.meta_description) : null,
        keywords: domainRow.meta_keywords ? esc(domainRow.meta_keywords) : null,
        ogTitle: domainRow.og_title ? esc(domainRow.og_title) : null,
        ogDescription: domainRow.og_description ? esc(domainRow.og_description) : null,
        ogImage: domainRow.og_image ? esc(domainRow.og_image) : null,
        favicon: domainRow.favicon ? esc(domainRow.favicon) : null,
        canonicalUrl: page > 1 ? `/blog/page/${page}` : '/blog/',
        themeKey: themeKey
      } as const;

      const items = (posts || []).map((p: any) => {
        const title = String((p as any).title || '');
        const raw = String((p as any).content || '');
        const normalized = formatPostHtml(title, raw) as string;
        const text = normalized.replace(/<[^>]+>/g, '').replace(/External post:\s*https?:\/\/\S+/gi, '').trim();
        const excerpt = text ? esc(text.slice(0, 180) + (text.length > 180 ? '…' : '')) : null;
        const published = (p as any).published_at ? new Date((p as any).published_at).toLocaleString() : null;
        const slug = String((p as any).slug || '');
        return { title: esc(title || slug), slug, href: `/${encodeURIComponent(slug)}`, published, excerpt };
      });

      const tpl = await fetchTemplate(SUPABASE_URL, themeKey, 'index.html');
      if (tpl) {
        const listHtml = renderItemsList(items);
        const base = replaceTokens(tpl, {
          SITE_TITLE: meta.siteTitle,
          TITLE: meta.siteTitle,
          DESCRIPTION: meta.description || '',
          KEYWORDS: meta.keywords || '',
          OG_TITLE: meta.ogTitle || '',
          OG_DESCRIPTION: meta.ogDescription || '',
          OG_IMAGE: meta.ogImage || '',
          FAVICON: meta.favicon || '',
          CANONICAL: meta.canonicalUrl || '/blog/'
        });
        const withPosts = ensureInject(base, '<!-- POSTS -->', listHtml);
        const paginationHtml = renderPagination(themeKey, page, totalPages);
        const out = ensureInject(withPosts, '<!-- PAGINATION -->', paginationHtml);
        return new Response(out, { status: 200, headers });
      }

      const out = renderIndex(meta, items);
      return new Response(out, { status: 200, headers });
    }

    // Determine slug and optional theme override from path
    const parts = path.split('/').filter(Boolean);
    let themeFromPath: string | null = null;
    let slugSimple = '';
    if (parts[0] === 'themes') {
      if (parts.length >= 3) {
        themeFromPath = parts[1];
        slugSimple = parts.slice(2).join('/').replace(/\.html$/i, '');
      }
    } else if (parts[0] === 'blog') {
      if (parts.length >= 3) {
        themeFromPath = parts[1];
        slugSimple = parts.slice(2).join('/');
      } else {
        slugSimple = parts.slice(1).join('/');
      }
    } else if (parts[0] === 'posts') {
      // Alias: /posts/<slug> resolves using the domain's selected_theme
      themeFromPath = String(domainRow.selected_theme || 'minimal');
      slugSimple = parts.slice(1).join('/').replace(/\.html$/i, '');
    } else {
      if (parts.length >= 2) {
        themeFromPath = parts[0];
        slugSimple = parts.slice(1).join('/');
      } else {
        slugSimple = parts.join('/');
      }
    }
    const slugWithTheme = themeFromPath ? `${themeFromPath}/${slugSimple}` : slugSimple;

    // Theme-scoped static pages like /themes/<theme>/(privacy-policy|terms-and-conditions|contact-us|index)
    if (themeFromPath && slugSimple && !slugSimple.includes('/')) {
      const staticKey = slugSimple.replace(/\/+$/g, '').toLowerCase();
      if (['privacy-policy','terms-and-conditions','contact-us','index'].includes(staticKey)) {
        const tpl = await fetchAnyTemplate(SUPABASE_URL, themeFromPath, staticKey);
        if (tpl) return new Response(tpl, { status: 200, headers });
      }
    }

    // Try blog_posts then automation_posts with multiple slug variants and fallbacks
    let post: any = null;
    const triedCandidates: string[] = [];

    // Build candidates: theme-prefixed, simple, decoded forms, with/without .html
    const rawCandidates = [slugWithTheme, slugSimple].filter(Boolean).map(s => String(s));
    const expanded: string[] = [];
    for (const r of rawCandidates) {
      const decoded = (() => {
        try { return decodeURIComponent(r); } catch { return r; }
      })();
      const lower = decoded.toLowerCase();
      expanded.push(lower);
      if (!lower.endsWith('.html')) expanded.push(`${lower}.html`);
      if (lower.endsWith('.html')) expanded.push(lower.replace(/\.html$/i, ''));
    }

    // dedupe
    const slugCandidates = Array.from(new Set(expanded));

    for (const s of slugCandidates) {
      triedCandidates.push(s);
      if (post) break;
      try {
        const { data: d1, error: e1 } = await sb
          .from('blog_posts')
          .select('id, title, slug, content, url, published_at')
          .eq('domain_id', domainRow.id)
          .eq('slug', s)
          .maybeSingle();
        if (e1) {
          console.warn('blog_posts query error for slug', s, e1.message || e1);
        }
        if (d1) { post = d1; break; }

        const { data: d2, error: e2 } = await sb
          .from('automation_posts')
          .select('id, title, slug, content, url, published_at')
          .eq('domain_id', domainRow.id)
          .eq('slug', s)
          .maybeSingle();
        if (e2) {
          console.warn('automation_posts query error for slug', s, e2.message || e2);
        }
        if (d2) { post = d2; break; }
      } catch (qErr) {
        console.warn('Slug lookup exception', qErr && (qErr.message || qErr));
      }
    }

    // If still not found, try lookup by URL ending (posts may store full 'url' referencing themes path)
    if (!post) {
      try {
        const simple = (slugSimple || '').replace(/^\/+/, '');
        if (simple) {
          // Try matching URL containing the slug under both new root path and legacy /themes/ paths
          const candidates = [`%/${simple}%`, `%/themes/%${simple}%`];
          for (const pattern of candidates) {
            const { data: byUrlAuto } = await sb.from('automation_posts').select('id, title, slug, content, url, published_at').ilike('url', pattern).eq('domain_id', domainRow.id).limit(1).maybeSingle();
            if (byUrlAuto) { post = byUrlAuto; break; }
            const { data: byUrlBlog } = await sb.from('blog_posts').select('id, title, slug, content, url, published_at').ilike('url', pattern).eq('domain_id', domainRow.id).limit(1).maybeSingle();
            if (byUrlBlog) { post = byUrlBlog; break; }
          }
        }
      } catch (urlErr) {
        console.warn('URL-based slug lookup failed', urlErr && (urlErr.message || urlErr));
      }
    }

    if (!post) {
      const triedHtml = triedCandidates.map(esc).map(s => `<li>${s}</li>`).join('');
      return html(404, `<h1>404</h1><p>No post for slug: ${esc(slugSimple || slugWithTheme)}</p><p>Attempted slugs:</p><ul>${triedHtml}</ul>`);
    }

    const published = post.published_at ? new Date(post.published_at).toLocaleString() : 'Draft';
    const siteTitle = esc(domainRow.meta_title || domainRow.theme_name || domainRow.domain);
    const effectiveTheme = String(themeFromPath || domainRow.selected_theme || 'minimal');
    const meta = {
      siteTitle,
      description: domainRow.meta_description ? esc(domainRow.meta_description) : null,
      keywords: domainRow.meta_keywords ? esc(domainRow.meta_keywords) : null,
      ogTitle: domainRow.og_title ? esc(domainRow.og_title) : null,
      ogDescription: domainRow.og_description ? esc(domainRow.og_description) : null,
      ogImage: domainRow.og_image ? esc(domainRow.og_image) : null,
      canonicalUrl: (parts[0] === 'posts'
        ? `/posts/${encodeURIComponent(slugSimple)}`
        : `/${encodeURIComponent(slugSimple || String(post.slug || '').replace(/^.*\//, ''))}`
      ),
      themeKey: effectiveTheme,
    } as const;

    let raw = String(post.content || '');
    if (!raw && post.url) raw = `[External post](${post.url})`;
    // If content is a full HTML document, serve as-is (bypass templates)
    if (/<!doctype|<html[^>]*>|<head[^>]*>|<body[^>]*>/i.test(raw)) {
      return new Response(raw, { status: 200, headers });
    }
    let contentHtml = formatPostHtml(String(post.title || ''), raw);
    if (!contentHtml) contentHtml = "<p>No content</p>";

    const tplPost = await fetchTemplate(SUPABASE_URL, effectiveTheme, 'post.html');
    if (tplPost) {
      // Replace common tokens used across themes
      const contentForTemplate = (() => {
        let inner = String(contentHtml || '');
        // Unwrap outer <article> wrapper if present
        inner = inner.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');
        // Remove leading H1 to avoid duplicate titles (template renders post_title)
        inner = inner.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
        // Strip any remaining nested <article> tags inside the content
        inner = inner.replace(/<\/?article[^>]*>/gi, '');
        return inner.trim();
      })();
      const derivedTitleRaw = (post.title && String(post.title).trim()) || extractTitleFromContent(contentHtml) || post.slug;
      const displayTitle = esc(titleCase(derivedTitleRaw));
      let base = replaceTokens(tplPost, {
        // Generic tokens
        SITE_TITLE: meta.siteTitle,
        TITLE: displayTitle,
        DESCRIPTION: meta.description || '',
        KEYWORDS: meta.keywords || '',
        OG_TITLE: meta.ogTitle || '',
        OG_DESCRIPTION: meta.ogDescription || '',
        OG_IMAGE: meta.ogImage || '',
        CANONICAL: meta.canonicalUrl || `/themes/${encodeURIComponent(post.slug)}`,
        PUBLISHED: published,
        CONTENT: contentForTemplate,
        // Theme file specific tokens (as used in local theme templates)
        post_title: displayTitle,
        domain: host,
        published_at: published
      });
      // Ensure HTML content is injected even if template uses a comment marker placeholder
      base = ensureInject(base, '<!--POST_CONTENT-->', contentForTemplate);
      base = ensureInject(base, '<!-- POST_CONTENT -->', contentForTemplate);
      return new Response(base, { status: 200, headers });
    }

    const fallbackDisplayTitle = esc(titleCase(extractTitleFromContent(contentHtml) || post.title || post.slug));
    const page = renderPost(meta, { title: fallbackDisplayTitle, contentHtml, published, slug: post.slug, canonicalUrl: meta.canonicalUrl });
    return new Response(page, { status: 200, headers });
  } catch (e) {
    return html(500, `<h1>Internal Error</h1><pre>${esc(String(e))}</pre>`);
  }
});
