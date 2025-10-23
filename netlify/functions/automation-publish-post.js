/**
 * Netlify Function: publish-domain-post
 * Creates a dynamic post row for a specific domain using Supabase service role
 * - Ensures unique, themed slug per domain
 * - Computes and stores url (https://{domain}/themes/{slug})
 * - Persists campaign context: keywords[], anchor_texts[], and blog_theme (template key)
 */
async function fetchPexelsImage(keyword) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey || !keyword) return null;
  const q = encodeURIComponent(String(keyword));
  const res = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=1&orientation=landscape`, {
    headers: { Authorization: apiKey }
  });
  if (!res.ok) return null;
  const j = await res.json().catch(() => null);
  const p = j?.photos?.[0];
  if (!p) return null;
  const src = p.src?.large2x || p.src?.large || p.src?.medium || p.src?.original || null;
  if (!src) return null;
  return {
    url: src,
    alt: p.alt || keyword,
    width: p.width,
    height: p.height,
    avg_color: p.avg_color || null,
    photographer: p.photographer || null,
    photographer_url: p.photographer_url || null,
    pexels_url: p.url || null,
    source: 'pexels'
  };
}

function injectFeaturedImage(contentHtml, image, targetUrl, pageTitle) {
  if (!image?.url) return contentHtml;
  try { const html = String(contentHtml || ''); if (/class=\"featured-image\"/i.test(html) || (image.url && html.includes(String(image.url)))) { return html; } } catch {}
  const alt = image.alt || pageTitle || 'Featured image';
  const widthAttr = image.width ? ` width="${image.width}"` : '';
  const heightAttr = image.height ? ` height="${image.height}"` : '';
  const figCaption = image.photographer && image.photographer_url
    ? `Photo by <a href="${image.photographer_url}" target="_blank" rel="noopener nofollow">${image.photographer}</a> on Pexels`
    : '';
  const figure = `\n<figure class="featured-image" itemscope itemtype="https://schema.org/ImageObject">\n  <a href="${targetUrl || '#'}" target="_blank" rel="noopener noreferrer" itemprop="url">\n    <img src="${image.url}" alt="${alt}" loading="eager" decoding="async" itemprop="contentUrl"${widthAttr}${heightAttr} />\n  </a>\n  ${figCaption ? `<figcaption>${figCaption}</figcaption>` : ''}\n  ${image.width ? `<meta itemprop=\"width\" content=\"${image.width}\" />` : ''}\n  ${image.height ? `<meta itemprop=\"height\" content=\"${image.height}\" />` : ''}\n  ${image.photographer ? `<meta itemprop=\"author\" content=\"${image.photographer}\" />` : ''}\n  ${alt ? `<meta itemprop=\"caption\" content=\"${alt}\" />` : ''}\n</figure>\n`;
  try {
    const m = String(contentHtml || '').match(/<h2[^>]*>[^<]*<\/h2>/i);
    if (m) {
      const idx = contentHtml.indexOf(m[0]) + m[0].length;
      return contentHtml.slice(0, idx) + figure + contentHtml.slice(idx);
    }
  } catch {}
  return figure + (contentHtml || '');
}

// Theme key normalization for renamed themes
function normalizeThemeKey(k) {
  const s = String(k || '').toLowerCase().replace(/_/g, '-').trim();
  if (s === 'custom-layout') return 'custom';
  if (s === 'elegant-editorial') return 'elegant';
  if (s === 'seo-optimized') return 'seo';
  if (s === 'random-ai-generated') return 'random';
  return s;
}

// Basic Markdown to HTML converter (safe, dependency-free)
function convertBasicMarkdown(md) {
  if (!md) return '';
  return String(md)
    .replace(/\r\n/g, '\n')
    .replace(/^### (.+)$/gm, '<h3>$1<\/h3>')
    .replace(/^## (.+)$/gm, '<h2>$1<\/h2>')
    .replace(/^# (.+)$/gm, '<h1>$1<\/h1>')
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1<\/strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1<\/em>')
    .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">$1<\/a>');
}
function wrapInParagraphs(htmlOrMd) {
  if (!htmlOrMd) return '';
  const hasTags = /<[^>]+>/.test(htmlOrMd);
  if (hasTags) return htmlOrMd;
  const paras = String(htmlOrMd).split(/\n\s*\n/);
  const out = [];
  for (const p of paras) {
    const t = p.trim();
    if (!t) continue;
    if (/^(#{1,3}|<h\d|<ul|<ol|<blockquote)/i.test(t)) { out.push(t); continue; }
    if (/^\d+\.\s/.test(t)) { // ordered list
      const items = [];
      const lines = t.split(/\n/);
      for (const line of lines) {
        const m = line.trim().match(/^\d+\.\s+(.*)$/);
        if (m && m[1]) items.push(`  <li>${m[1]}<\/li>`);
      }
      if (items.length) out.push(`<ol>\n${items.join('\n')}\n<\/ol>`);
      continue;
    }
    if (/^[*\-+]\s/.test(t)) { // unordered list
      const items = [];
      const lines = t.split(/\n/);
      for (const line of lines) {
        const m = line.trim().match(/^[*\-+]\s+(.*)$/);
        if (m && m[1]) items.push(`  <li>${m[1]}<\/li>`);
      }
      if (items.length) out.push(`<ul>\n${items.join('\n')}\n<\/ul>`);
      continue;
    }
    out.push(`<p>${t}<\/p>`);
  }
  return out.join('\n\n');
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Allow simple GET for health checks
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'publish-domain-post OK' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const body = JSON.parse(event.body || '{}');
    const { automation_id, domain_id, user_id, title, content, slug: providedSlug, static_only } = body || {};

    if (!automation_id || !domain_id || !user_id || !title || !content) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Missing required fields' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Supabase not configured' }) };
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Load campaign arrays and target_url if not provided in body
    let keywords = Array.isArray(body.keywords) ? body.keywords.filter(Boolean).map(String) : null;
    let anchor_texts = Array.isArray(body.anchor_texts) ? body.anchor_texts.filter(Boolean).map(String) : null;
    let target_url = typeof body.target_url === 'string' ? body.target_url : null;
    if (!keywords || !anchor_texts || !target_url) {
      try {
        const { data: camp } = await sb
          .from('automation_campaigns')
          .select('keywords, anchor_texts, target_url')
          .eq('id', automation_id)
          .maybeSingle();
        if (camp) {
          if (!keywords && Array.isArray(camp.keywords)) keywords = camp.keywords.filter(Boolean).map(String);
          if (!anchor_texts && Array.isArray(camp.anchor_texts)) anchor_texts = camp.anchor_texts.filter(Boolean).map(String);
          if (!target_url && typeof camp.target_url === 'string') target_url = camp.target_url;
        }
      } catch {}
    }
    // Fallback singles -> arrays
    if (!keywords) keywords = [String(body.keyword || title).trim()].filter(Boolean);
    if (!anchor_texts) anchor_texts = [String(body.anchor_text || body.anchor || title).trim()].filter(Boolean);

    // Fetch domain for URL construction and theme
    const { data: domainRow, error: domainErr } = await sb
      .from('domains')
      .select('id, domain, blog_theme_template_key, selected_theme')
      .eq('id', domain_id)
      .maybeSingle();
    if (domainErr || !domainRow) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Domain not found' }) };
    }

    // Slugify WITHOUT theme segment (or use provided slug when static_only)
    const themeKey = normalizeThemeKey(domainRow.blog_theme_template_key || domainRow.selected_theme || 'minimal');
    let baseSlug = `${String(((Array.isArray(keywords) && keywords[0]) ? keywords[0] : title)).toLowerCase().trim().replace(/<[^>]+>/g,'').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'').split('-').filter(Boolean).slice(0,4).join('-')}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
    let slug = providedSlug ? String(providedSlug).replace(/^\/+/, '').replace(/^themes\//i, '') : baseSlug;

    if (!static_only) {
      // Ensure uniqueness across automation_posts + blog_posts for this domain
      let attempt = 0;
      while (true) {
        const [{ data: a }, { data: b }] = await Promise.all([
          sb.from('automation_posts').select('id').eq('domain_id', domain_id).eq('slug', slug).maybeSingle(),
          sb.from('blog_posts').select('id').eq('domain_id', domain_id).eq('slug', slug).maybeSingle()
        ]);
        if (!a && !b) break;
        attempt += 1;
        const suffix = attempt <= 10 ? `-${attempt}` : `-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
        slug = `${baseSlug}${suffix}`;
        if (attempt > 20) break;
      }
    }

    const host = String(domainRow.domain).replace(/^https?:\/\//, '').replace(/\/$/, '');
    const url = `https://${host}/${slug}`;

    // Use raw OpenAI HTML as-is (no normalization/sanitization)
    const storedContent = String(content || '');

    // Prepare insert payload with campaign and theme context
    const insertBase = {
      automation_id,
      domain_id,
      user_id,
      slug,
      title,
      content: storedContent,
      url,
      status: 'published',
      blog_theme_id: domainRow.blog_theme_id,
      blog_theme: themeKey,
      keywords,
      anchor_texts,
    };

    // Attempt insert, retry without unknown columns if schema lacks them
    async function insertWithFallback(payload) {
      try {
        const res = await sb.from('automation_posts').insert(payload).select().maybeSingle();
        if (res.error) throw res.error;
        return res.data;
      } catch (e) {
        const msg = String(e.message || e).toLowerCase();
        // Remove fields that may not exist on older schemas
        const clean = { ...payload };
        if (msg.includes('column') && msg.includes('blog_theme')) delete clean.blog_theme;
        if (msg.includes('column') && msg.includes('keywords')) delete clean.keywords;
        if (msg.includes('column') && msg.includes('anchor_texts')) delete clean.anchor_texts;
        if (msg.includes('column') && msg.includes('blog_theme_id')) delete clean.blog_theme_id;
        if (JSON.stringify(clean) !== JSON.stringify(payload)) {
          const retry = await sb.from('automation_posts').insert(clean).select().maybeSingle();
          if (retry.error) throw retry.error;
          return retry.data;
        }
        throw e;
      }
    }

    const inserted = await insertWithFallback(insertBase);

    // Static site deployment intentionally disabled; dynamic rendering via automation_posts is the source of truth
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, post: inserted }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message || String(e) }) };
  }
};
