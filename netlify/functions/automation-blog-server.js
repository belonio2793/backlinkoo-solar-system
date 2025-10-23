/* Netlify Function: automation-blog-server (standalone)
   Purpose: Serve blog pages under /themes/* and /posts/* directly from Netlify,
   using Supabase (DB + Storage) only as data/template sources. No fallback to
   Supabase Edge Functions.
*/

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';
const PROXY_SECRET = process.env.PROXY_SECRET || process.env.VITE_PROXY_SECRET || '';
const THEME_BUCKET = 'themes';

function buildCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

function response(body, status = 200, headers = {}) {
  return { statusCode: status, headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300', ...headers }, body };
}

function html(body, status = 200, extra = {}) {
  return response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${status}</title></head><body>${body}</body></html>`, status, { 'Content-Type': 'text/html; charset=utf-8', ...extra });
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function altThemeKeys(key) {
  const orig = String(key || '');
  const k = orig.toLowerCase();
  const variants = new Set([k, orig, k.replace(/-/g, '_'), k.replace(/_/g, '-')]);
  if (k === 'seo-optimized') variants.add('seo_optimized');
  if (k === 'tech-blog') variants.add('techblog');
  if (k === 'custom-layout') variants.add('custom_layout');
  if (k === 'elegant-editorial') { variants.add('eleganteditorial'); variants.add('elegant_editorial'); }
  if (k === 'ecommerce') variants.add('e-commerce');
  if (k === 'html') variants.add('HTML');
  return Array.from(variants);
}

async function fetchTemplate(supabaseUrl, themeKey, name) {
  const candidates = altThemeKeys(themeKey).map(k => `${supabaseUrl}/storage/v1/object/public/${THEME_BUCKET}/${encodeURIComponent(k)}/${name}`);
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok && /text\/html/i.test(res.headers.get('content-type') || '')) return await res.text();
    } catch (_) {}
  }
  // Fallback to Netlify static (in case themes are copied to /themes at build)
  for (const k of altThemeKeys(themeKey)) {
    try {
      // try new root path first (/theme/name), then legacy /themes/theme/name
      const urls = [
        `https://backlinkoo.netlify.app/${encodeURIComponent(k)}/${name}`,
        `https://backlinkoo.netlify.app/themes/${encodeURIComponent(k)}/${name}`
      ];
      for (const u of urls) {
        try {
          const res = await fetch(u, { method: 'GET' });
          if (res.ok && /text\/html/i.test(res.headers.get('content-type') || '')) return await res.text();
        } catch (_) {}
      }
    } catch (_) {}
  }
  return null;
}

async function fetchAnyTemplate(supabaseUrl, themeKey, baseName) {
  return fetchTemplate(supabaseUrl, themeKey, `${baseName}.html`);
}

function replaceTokens(tpl, tokens) {
  let out = String(tpl || '');
  for (const [k, v] of Object.entries(tokens || {})) {
    const val = v == null ? '' : String(v);
    const re = new RegExp(`\\{\\{\\s*${k}\\s*\\}}`, 'gi');
    out = out.replace(re, val);
  }
  return out;
}

function ensureInject(tpl, marker, htmlFrag) {
  let out = String(tpl || '');
  if (out.includes(marker)) return out.replace(marker, htmlFrag);
  if (out.includes('{{POSTS}}')) return out.replace(/\{\{\s*POSTS\s*\}}/gi, htmlFrag);
  if (out.includes('<div id="posts"></div>')) return out.replace('<div id="posts"></div>', htmlFrag);
  if (out.includes('</main>')) return out.replace('</main>', `${htmlFrag}</main>`);
  if (out.includes('</body>')) return out.replace('</body>', `${htmlFrag}</body>`);
  return out + htmlFrag;
}

function renderItemsList(items) {
  return `<ul class="posts">${(items||[]).map(i=>`
    <li class="post-item">
      <a href="${i.href}"><strong>${i.title}</strong></a>
      ${i.published ? `<div class="meta">${i.published}</div>` : ''}
      ${i.excerpt ? `<p>${i.excerpt}</p>` : ''}
    </li>`).join('')}
  </ul>`;
}

function renderPagination(themeKey, page, totalPages) {
  if (totalPages <= 1) return '';
  const hrefFor = (n) => n <= 1 ? '/' : `/page/${n}`;
  const items = [];
  const maxButtons = 5;
  const start = Math.max(1, Math.min(page - 2, totalPages - (maxButtons - 1)));
  const end = Math.min(totalPages, start + (maxButtons - 1));
  items.push(`<a class="page prev${page===1?' disabled':''}" href="${page===1?'#':hrefFor(page-1)}" aria-label="Previous">‹</a>`);
  for (let n = start; n <= end; n++) items.push(n===page?`<span class="page current" aria-current="page">${n}</span>`:`<a class="page" href="${hrefFor(n)}">${n}</a>`);
  items.push(`<a class="page next${page===totalPages?' disabled':''}" href="${page===totalPages?'#':hrefFor(page+1)}" aria-label="Next">›</a>`);
  return `<nav class="pagination" role="navigation" aria-label="Pagination">${items.join('')}</nav>`;
}

// Lightweight formatter (safe, no external deps)
function _stripDangerous(html) {
  let out = String(html||'');
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  out = out.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  out = out.replace(/href\s*=\s*"\s*javascript:[^"]*"/gi, 'href="#"');
  out = out.replace(/href\s*=\s*'\s*javascript:[^']*'/gi, "href='#'");
  return out;
}
function _extractBlocks(html, tag) {
  const blocks = []; let out = String(html||'');
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  out = out.replace(re, (m)=>{ const key = `%%BLOCK_${tag.toUpperCase()}_${blocks.length}%%`; blocks.push(m); return key; });
  return { out, blocks };
}
function _restoreBlocks(html, tag, blocks) {
  let out = String(html||'');
  blocks.forEach((b,i)=>{ const key = new RegExp(`%%BLOCK_${tag.toUpperCase()}_${i}%%`, 'g'); out = out.replace(key, b); });
  return out;
}
function _normalizeWhitespace(html) {
  let out = String(html||'').replace(/[\u00A0\t]+/g, ' ');
  out = out.replace(/\s{3,}/g, '  ');
  out = out.replace(/(?:<br\s*\/?>(?:\s|\n)*){2,}/gi, '</p><p>');
  return out;
}
function _fixPunctuation(text) {
  let t = String(text||'')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,.;:!?])(?!\s|$)/g, '$1 ')
    .replace(/([,.;:!?])\s{2,}/g, '$1 ')
    .replace(/[!?]{3,}/g, '!!')
    .replace(/\.{4,}/g, '...')
    .replace(/\s*--\s*/g, ' — ')
    .replace(/\s+\"/g, ' "')
    .replace(/\s+\'/g, " '");
  t = t.replace(/(^|[.!?]\s+)([a-z])/g, (m,p1,p2)=> p1 + p2.toUpperCase());
  return t;
}
function _wrapPlainText(html) {
  const hasBlock = /<(p|h\d|ul|ol|li|table|blockquote|pre|code|section|article|div)[^>]*>/i.test(String(html||''));
  if (hasBlock) return html;
  const parts = String(html||'').split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  if (parts.length <= 1) return `<p>${String(html||'').trim()}</p>`;
  return parts.map(p=>`<p>${p}</p>`).join('');
}
function formatPostHtml(title, input) {
  if (!input) return '';
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

// Convert JSONB structured content to HTML safely
function contentJsonToHtml(obj) {
  try {
    if (!obj || typeof obj !== 'object') return '';
    // Common shapes: direct fields or nested under "structured"/"content"
    const c = (obj && (obj.structured || obj.content || obj)) || {};
    const headlines = Array.isArray(c.headlines) ? c.headlines : [];
    const introduction = typeof c.introduction === 'string' ? c.introduction : '';
    const paragraphs = Array.isArray(c.paragraphs) ? c.paragraphs : [];
    const summary = typeof c.summary === 'string' ? c.summary : '';
    const conclusion = typeof c.conclusion === 'string' ? c.conclusion : '';
    const notes = typeof c.notes === 'string' ? c.notes : '';
    const faq = Array.isArray(c.faq) ? c.faq : [];

    const lines = [];

    // Headlines as secondary headings (avoid h1, template provides title)
    for (const h of headlines) {
      const txt = esc(typeof h === 'string' ? h : (h && h.text) || '');
      if (txt) lines.push(`<h2>${txt}</h2>`);
    }

    if (introduction) lines.push(`<p>${esc(introduction)}</p>`);
    for (const p of paragraphs) {
      const txt = typeof p === 'string' ? p : (p && p.text) || '';
      if (txt) lines.push(`<p>${esc(txt)}</p>`);
    }

    if (summary) {
      lines.push('<h2>Summary</h2>');
      lines.push(`<p>${esc(summary)}</p>`);
    }

    if (conclusion) {
      lines.push('<h2>Conclusion</h2>');
      lines.push(`<p>${esc(conclusion)}</p>`);
    }

    if (faq.length) {
      lines.push('<section class="faq"><h2>FAQ</h2>');
      for (const qa of faq) {
        const q = esc(typeof qa?.q === 'string' ? qa.q : (qa && qa.question) || '');
        const a = esc(typeof qa?.a === 'string' ? qa.a : (qa && qa.answer) || '');
        if (q) {
          lines.push(`<details><summary>${q}</summary>${a ? `<div><p>${a}</p></div>` : ''}</details>`);
        }
      }
      lines.push('</section>');
    }

    if (notes) lines.push(`<blockquote class="notes">${esc(notes)}</blockquote>`);

    return lines.join('\n');
  } catch { return ''; }
}

function contentToHtml(content, title, externalUrl) {
  // If already HTML string
  if (typeof content === 'string') return content;
  // If JSON structured content
  if (content && typeof content === 'object') {
    const html = contentJsonToHtml(content);
    if (html) return html;
  }
  // Fallback: external URL or empty
  if (externalUrl) return `<p>External post: <a href="${esc(externalUrl)}">${esc(externalUrl)}</a></p>`;
  return '';
}

function htmlToText(h) {
  return String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function cleanPathCandidate(value) {
  if (!value) return '';
  let s = String(value).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      s = u.pathname || '';
    } catch (_) {}
  }
  const hashIndex = s.indexOf('#');
  if (hashIndex >= 0) s = s.slice(0, hashIndex);
  const queryIndex = s.indexOf('?');
  if (queryIndex >= 0) s = s.slice(0, queryIndex);
  if (!s) return '';
  if (!s.startsWith('/')) s = `/${s}`;
  return s;
}

function finalizePath(value) {
  if (!value) return '';
  let out = String(value);
  if (out !== '/') out = out.replace(/\/+$/g, '');
  if (out === '/' || out === '') return '';
  return out;
}

function resolveRequestedPath(event, headers, rawPath) {
  const headerOrder = [
    'x-nf-original-path',
    'x-nf-original-request-uri',
    'x-original-path',
    'x-original-uri',
    'x-forwarded-uri',
    'x-forwarded-path',
    'x-rewrite-url',
    'x-request-uri',
    'x-rewrite-path',
    'x-amz-original-uri',
    'x-amzn-original-url'
  ];
  for (const name of headerOrder) {
    const source = headers ? headers[name] : undefined;
    const candidate = cleanPathCandidate(source);
    if (candidate && !/\/\.netlify\/functions\//i.test(candidate)) {
      const resolved = finalizePath(candidate);
      if (resolved || resolved === '') return resolved;
    }
  }

  if (event && event.rawUrl) {
    try {
      const url = new URL(event.rawUrl);
      if (url.pathname && !/\/\.netlify\/functions\//i.test(url.pathname)) {
        const resolved = finalizePath(cleanPathCandidate(url.pathname));
        if (resolved || resolved === '') return resolved;
      }
      const segments = url.pathname.split('/').filter(Boolean);
      const fnIdx = segments.findIndex((segment) => segment === 'functions');
      if (fnIdx >= 0 && segments.length > fnIdx + 2) {
        const rest = '/' + segments.slice(fnIdx + 2).join('/');
        const resolved = finalizePath(cleanPathCandidate(rest));
        if (resolved || resolved === '') return resolved;
      }
    } catch (_) {}
  }

  const fallbackCandidate = cleanPathCandidate(rawPath);
  const withoutFunction = fallbackCandidate.replace(/.*\/(?:automation-blog-server|domain-blog-server)/i, '');
  return finalizePath(withoutFunction);
}

exports.handler = async (event) => {
  try {
    const headers = Object.entries(event.headers || {}).reduce((acc, [key, value]) => {
      acc[String(key).toLowerCase()] = value;
      return acc;
    }, {});

    const origin = headers.origin || '*';
    const cors = buildCorsHeaders(origin);
    if (event.httpMethod === 'OPTIONS') return response('ok', 200, cors);

    if (!SUPABASE_URL || !SERVICE_ROLE) return html('<h1>Server misconfiguration</h1><p>Supabase not configured.</p>', 500, cors);
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    const urlProto = headers['x-forwarded-proto'] || 'https';
    const referer = headers.referer || headers['referrer'] || '';
    let hostHeader = headers.host || '';
    if (PROXY_SECRET) {
      const providedSecret = (headers['x-proxy-secret'] || '').trim();
      if (providedSecret && providedSecret === PROXY_SECRET) {
        const overrideHost = (headers['x-proxy-host'] || '').trim();
        if (overrideHost) hostHeader = overrideHost;
      }
    }
    const candidateHost = hostHeader || (referer ? (() => { try { return new URL(referer).host; } catch { return ''; } })() : '');
    const host = String(candidateHost).replace(/^https?:\/\//, '').replace(/^www\./, '').split(':')[0];

    const rawPath = String(event.path || '/');
    let path = resolveRequestedPath(event, headers, rawPath);

    // Redirect .html to extensionless canonical
    try {
      if (/\.html(\/?$)/i.test(path)) {
        const target = path.replace(/\.html(\/?$)/i, '');
        const dest = `${urlProto}://${hostHeader}${target || '/'}${event.rawQuery ? `?${event.rawQuery}` : ''}`;
        return { statusCode: 301, headers: { ...cors, Location: dest }, body: '' };
      }
    } catch {}

    // Serve theme assets: /themes/<theme>/<file>
    try {
      const assetMatch = path.match(/^\/themes\/([^\/]+)\/([^?#]+)$/i);
      if (assetMatch) {
        const reqTheme = assetMatch[1];
        const filename = assetMatch[2];
        if (/\.(css|js|png|jpe?g|svg|webp|ico|woff2?|ttf|eot|gif|mp4|webm)$/i.test(filename)) {
          for (const k of altThemeKeys(reqTheme)) {
            // Supabase Storage first
            try {
              const u1 = `${SUPABASE_URL}/storage/v1/object/public/${THEME_BUCKET}/${encodeURIComponent(k)}/${filename}`;
              const r1 = await fetch(u1, { method: 'GET' });
              if (r1.ok) {
                const ctype = r1.headers.get('content-type') || '';
                const buf = await r1.arrayBuffer();
                return { statusCode: 200, headers: { ...cors, 'Content-Type': ctype || (filename.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/octet-stream'), 'Cache-Control': 'public, max-age=3600, s-maxage=3600' }, body: Buffer.from(buf).toString('base64'), isBase64Encoded: true };
              }
            } catch {}
            // Netlify static fallback
            try {
              const u2 = `https://backlinkoo.netlify.app/themes/${encodeURIComponent(k)}/${filename}`;
              const r2 = await fetch(u2, { method: 'GET' });
              if (r2.ok) {
                const ctype = r2.headers.get('content-type') || '';
                const buf = await r2.arrayBuffer();
                return { statusCode: 200, headers: { ...cors, 'Content-Type': ctype || (filename.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/octet-stream'), 'Cache-Control': 'public, max-age=3600, s-maxage=3600' }, body: Buffer.from(buf).toString('base64'), isBase64Encoded: true };
              }
            } catch {}
          }
          return response('Not found', 404, cors);
        }
      }
    } catch {}

    // Legacy /sites normalization
    if (path.startsWith('/sites/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length > 1) {
        const maybeDomain = parts[1].replace(/^www\./, '');
        if (maybeDomain === host) parts.splice(0, 2); else parts.splice(0, 1);
      } else { parts.splice(0, 1); }
      path = '/' + parts.join('/');
    }

    // Fetch domain row + merged settings
    const { data: base, error: baseErr } = await sb
      .from('domains')
      .select('id, domain, blog_enabled, selected_theme, theme_name, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, favicon, dns_verified')
      .eq('domain', host)
      .maybeSingle();
    if (baseErr) return html(`<h1>Supabase error</h1><pre>${esc(baseErr.message)}</pre>`, 500, cors);
    // If primary host, redirect to main site so SPA serves the route instead of this function
    const PRIMARY_HOSTS = (process.env.PRIMARY_HOSTS || 'backlinkoo.com,www.backlinkoo.com').split(',').map(h => String(h || '').trim().toLowerCase().replace(/^www\./, ''));
    const isPrimaryHost = PRIMARY_HOSTS.includes(host);
    if (!base) {
      if (isPrimaryHost) return { statusCode: 302, headers: { ...cors, Location: `https://${host}${path || '/'}` }, body: '' };
      return html(`<h1>${esc(host)}</h1><p>Site is connected, but no domain record exists yet.</p>`, 200, cors);
    }

    const domainRow = { ...base };
    if (domainRow && domainRow.dns_verified === false) {
      if (isPrimaryHost) return { statusCode: 302, headers: { ...cors, Location: `https://${host}${path || '/'}` }, body: '' };
      return html(`<h1>${esc(host)}</h1><p>DNS not verified yet. Please complete DNS setup for this domain.</p>`, 200, cors);
    }
    try {
      const { data: settings } = await sb.from('domain_blog_settings').select('meta_tags').eq('domain_id', domainRow.id).maybeSingle();
      const tags = (settings && settings.meta_tags) || null;
      if (tags) {
        if (!domainRow.meta_title && tags.meta_title) domainRow.meta_title = tags.meta_title;
        if (!domainRow.meta_description && tags.meta_description) domainRow.meta_description = tags.meta_description;
        if (!domainRow.meta_keywords && tags.meta_keywords) domainRow.meta_keywords = tags.meta_keywords;
        if (!domainRow.og_title && tags.og_title) domainRow.og_title = tags.og_title;
        if (!domainRow.og_description && tags.og_description) domainRow.og_description = tags.og_description;
        if (!domainRow.og_image && (tags.og_image || tags.og_image_url)) domainRow.og_image = tags.og_image || tags.og_image_url;
      }
    } catch {}

    const themeKey = String(domainRow.selected_theme || 'minimal');

    // Static pages
    {
      const normalized = path.replace(/\/+$/g, '') || '/';
      const staticMap = { '/privacy-policy': 'privacy-policy', '/terms-and-conditions': 'terms-and-conditions', '/contact-us': 'contact-us', '/index': 'index' };
      if (normalized in staticMap) {
        const tpl = await fetchAnyTemplate(SUPABASE_URL, themeKey, staticMap[normalized]);
        if (tpl) return response(tpl, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
      }
      if (normalized === '/blog') {
        const tpl = await fetchTemplate(SUPABASE_URL, themeKey, 'index.html');
        if (tpl) return response(tpl, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
      }
    }

    // Root and paginated listing
    if (path === '' || path === '/' || /^\/page\/\d+\/?$/.test(path)) {
      const pageMatch = path.match(/^\/page\/(\d+)\/?$/);
      const qp = Number(event.queryStringParameters && event.queryStringParameters.page || '1');
      const page = pageMatch ? Math.max(1, parseInt(pageMatch[1])) : (isFinite(qp) && qp > 0 ? Math.floor(qp) : 1);

      const sizeMap = { 'elegant-editorial': 10, 'lifestyle': 10 };
      const pageSize = sizeMap[themeKey] || 12;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: posts, error: postsErr, count } = await sb
        .from('automation_posts')
        .select('id, title, slug, published_at, content', { count: 'exact' })
        .eq('domain_id', domainRow.id)
        .order('published_at', { ascending: false })
        .range(start, end);
      if (postsErr) return html(`<h1>Error</h1><pre>${esc(postsErr.message)}</pre>`, 500, cors);

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
      };

      const items = (posts || []).map((p) => {
        const sourceHtml = contentToHtml(p.content, p.title);
        const raw = formatPostHtml(String(p.title || ''), sourceHtml);
        const text = htmlToText(raw);
        const excerpt = text ? esc(text.slice(0, 180) + (text.length > 180 ? '…' : '')) : null;
        const published = p.published_at ? new Date(p.published_at).toLocaleString() : null;
        const slug = String(p.slug || '');
        return { title: esc(p.title || slug), slug, href: `/${encodeURIComponent(slug)}`, published, excerpt };
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
        const baseWithCss = base.includes("</head>") ? base.replace("</head>", "<link rel=\"stylesheet\" href=\"/automation-posts.css\"></head>") : ("<link rel=\"stylesheet\" href=\"/automation-posts.css\">" + base);
        const withPosts = ensureInject(baseWithCss, '<!-- POSTS -->', listHtml);
        const paginationHtml = renderPagination(themeKey, page, totalPages);
        const out = ensureInject(withPosts, '<!-- PAGINATION -->', paginationHtml);
        return response(out, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
      }

      // Minimal fallback index (no CSS)
      const out = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/automation-posts.css"><title>${meta.siteTitle}</title></head><body><h1>${meta.siteTitle}</h1>${renderItemsList(items)}${renderPagination(themeKey, page, totalPages)}</body></html>`;
      return response(out, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
    }

    // Theme-scoped static pages under /themes/<theme>/(...)
    {
      const parts = path.split('/').filter(Boolean);
      if (parts[0] === 'themes' && parts.length === 3) {
        const t = parts[1];
        const leaf = parts[2].replace(/\/+$/g, '').toLowerCase();
        if ([ 'privacy-policy', 'terms-and-conditions', 'contact-us', 'index' ].includes(leaf)) {
          const tpl = await fetchAnyTemplate(SUPABASE_URL, t, leaf);
          if (tpl) return response(tpl, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
        }
      }
    }

    // Listing aliases under /posts and /blog (kept)
    if (path === '/posts' || path === '/posts/' || /^\/posts\/page\/\d+\/?$/.test(path) || path === '/blog' || path === '/blog/' || /^\/blog\/page\/\d+\/?$/.test(path)) {
      const isPosts = path.startsWith('/posts');
      const pageMatch = path.match(/^\/(?:posts|blog)\/page\/(\d+)\/?$/);
      const qp = Number(event.queryStringParameters && event.queryStringParameters.page || '1');
      const page = pageMatch ? Math.max(1, parseInt(pageMatch[1])) : (isFinite(qp) && qp > 0 ? Math.floor(qp) : 1);

      const sizeMap = { 'elegant-editorial': 10, 'lifestyle': 10 };
      const pageSize = sizeMap[themeKey] || 12;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: posts, error: postsErr, count } = await sb
        .from('automation_posts')
        .select('id, title, slug, published_at, content', { count: 'exact' })
        .eq('domain_id', domainRow.id)
        .order('published_at', { ascending: false })
        .range(start, end);
      if (postsErr) return html(`<h1>Error</h1><pre>${esc(postsErr.message)}</pre>`, 500, cors);

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
        canonicalUrl: page > 1 ? `/${isPosts?'posts':'blog'}/page/${page}` : `/${isPosts?'posts':'blog'}/`,
        themeKey: themeKey
      };

      const items = (posts || []).map((p) => {
        const sourceHtml = contentToHtml(p.content, p.title);
        const raw = formatPostHtml(String(p.title || ''), sourceHtml);
        const text = htmlToText(raw);
        const excerpt = text ? esc(text.slice(0, 180) + (text.length > 180 ? '…' : '')) : null;
        const published = p.published_at ? new Date(p.published_at).toLocaleString() : null;
        const slug = String(p.slug || '');
        const inner = slug.includes('/') ? slug.split('/').slice(1).join('/') : slug;
        return { title: esc(p.title || inner), slug, href: isPosts?`/posts/${encodeURIComponent(inner)}`:`/${encodeURIComponent(slug)}`, published, excerpt };
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
          CANONICAL: meta.canonicalUrl || (isPosts?'/posts/':'/blog/')
        });
        const baseWithCss = base.includes("</head>") ? base.replace("</head>", "<link rel=\"stylesheet\" href=\"/automation-posts.css\"></head>") : ("<link rel=\"stylesheet\" href=\"/automation-posts.css\">" + base);
        const withPosts = ensureInject(baseWithCss, '<!-- POSTS -->', listHtml);
        const paginationHtml = renderPagination(themeKey, page, totalPages);
        const out = ensureInject(withPosts, '<!-- PAGINATION -->', paginationHtml);
        return response(out, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
      }

      const out = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/automation-posts.css"><title>${meta.siteTitle}</title></head><body><h1>${meta.siteTitle}</h1>${renderItemsList(items)}${renderPagination(themeKey, page, totalPages)}</body></html>`;
      return response(out, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
    }

    // Determine slug and optional theme override from path
    const parts = path.split('/').filter(Boolean);
    let themeFromPath = null; let slugSimple = '';
    if (parts[0] === 'themes') {
      if (parts.length >= 3) { themeFromPath = parts[1]; slugSimple = parts.slice(2).join('/').replace(/\.html$/i, ''); }
    } else if (parts[0] === 'blog') {
      if (parts.length >= 3) { themeFromPath = parts[1]; slugSimple = parts.slice(2).join('/'); } else { slugSimple = parts.slice(1).join('/'); }
    } else if (parts[0] === 'posts') {
      themeFromPath = String(domainRow.selected_theme || 'minimal');
      slugSimple = parts.slice(1).join('/').replace(/\.html$/i, '');
    } else {
      if (parts.length >= 2) { themeFromPath = parts[0]; slugSimple = parts.slice(1).join('/'); } else { slugSimple = parts.join('/'); }
    }
    const slugWithTheme = themeFromPath ? `${themeFromPath}/${slugSimple}` : slugSimple;

    // Try blog_posts then automation_posts with multiple candidates
    let post = null; const triedCandidates = [];
    const rawCandidates = [slugWithTheme, slugSimple].filter(Boolean).map(String);
    const expanded = [];
    for (const r of rawCandidates) {
      let decoded = r; try { decoded = decodeURIComponent(r); } catch {}
      const lower = decoded.toLowerCase();
      expanded.push(lower);
      if (!lower.endsWith('.html')) expanded.push(`${lower}.html`);
      if (lower.endsWith('.html')) expanded.push(lower.replace(/\.html$/i, ''));
    }
    const slugCandidates = Array.from(new Set(expanded));

    for (const s of slugCandidates) {
      triedCandidates.push(s); if (post) break;
      try {
        const { data: a, error: ea } = await sb.from('automation_posts').select('id, title, slug, content, url, published_at').eq('domain_id', domainRow.id).eq('slug', s).maybeSingle();
        if (ea) console.warn('automation_posts error', s, ea.message || ea);
        if (a) { post = a; break; }
      } catch (e) { console.warn('slug lookup exception', e && (e.message || e)); }
    }

    if (!post) {
    }

    if (!post) {
      const triedHtml = triedCandidates.map(esc).map(s => `<li>${s}</li>`).join('');
      return html(`<h1>404</h1><p>No post for slug: ${esc(slugSimple || slugWithTheme)}</p><ul>${triedHtml}</ul>`, 404, cors);
    }

    const published = post.published_at ? new Date(post.published_at).toLocaleString() : 'Draft';
    const siteTitle = esc(domainRow.meta_title || domainRow.theme_name || domainRow.domain);
    const effectiveTheme = String(themeFromPath || domainRow.selected_theme || 'minimal');
    const canonicalUrl = (parts[0] === 'posts' ? `/posts/${encodeURIComponent(slugSimple)}` : `/${encodeURIComponent(slugSimple || String((post.slug || '')).replace(/^.*\//, ''))}`);
    const meta = {
      siteTitle,
      description: domainRow.meta_description ? esc(domainRow.meta_description) : null,
      keywords: domainRow.meta_keywords ? esc(domainRow.meta_keywords) : null,
      ogTitle: domainRow.og_title ? esc(domainRow.og_title) : null,
      ogDescription: domainRow.og_description ? esc(domainRow.og_description) : null,
      ogImage: domainRow.og_image ? esc(domainRow.og_image) : null,
      favicon: domainRow.favicon ? esc(domainRow.favicon) : null,
      canonicalUrl,
      themeKey: effectiveTheme,
    };

    let contentHtml = contentToHtml(post.content, post.title, post.url);
    if (!contentHtml) contentHtml = '';

    // Try theme post.html wrapper first (e.g., themes/HTML/post.html)
    try {
      const templateUrl = `${SUPABASE_URL}/storage/v1/object/public/${THEME_BUCKET}/HTML/post.html`;
      const tRes = await fetch(templateUrl, { method: 'GET' });
      if (tRes.ok && /text\/html/i.test(tRes.headers.get('content-type') || '')) {
        const tpl = await tRes.text();
        const raw = String(contentHtml || '');
        let base = tpl;
        if (base.includes('<!--POST_CONTENT-->') || base.includes('<!-- POST_CONTENT -->')) {
          base = ensureInject(base, '<!--POST_CONTENT-->', raw);
          base = ensureInject(base, '<!-- POST_CONTENT -->', raw);
          return response(base, 200, { ...cors, 'Content-Type': 'text/html; charset=utf-8' });
        }
      }
    } catch (_) {}

    return html('<h1>Template missing</h1><p>themes/HTML/post.html not found in storage.</p>', 500, cors);
  } catch (e) {
    const msg = (e && (e.message || String(e))) || 'Unknown error';
    return html(`<h1>Internal Error</h1><pre>${esc(msg)}</pre>`, 500, buildCorsHeaders('*'));
  }
};
