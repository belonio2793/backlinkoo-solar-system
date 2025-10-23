// Direct endpoint to process a single campaign across eligible user domains and insert into automation_posts
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

async function fetchExternalPageTitle(url) {
  try {
    const u = String(url || '').trim();
    if (!/^https?:\/\//i.test(u)) return null;
    const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutomationBot/1.0)' } });
    if (!res.ok) return null;
    const html = await res.text();
    const pick = (tag) => {
      const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${tag}["'][^>]*>`, 'i'));
      if (!m) return null;
      const c = m[0].match(/content=["']([^"']+)["']/i);
      return c ? c[1] : null;
    };
    let title = pick('og:title') || pick('twitter:title') || null;
    if (!title) {
      const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (t) title = t[1];
    }
    if (!title) {
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1) title = h1[1];
    }
    if (!title) return null;
    title = String(title).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s{2,}/g, ' ').trim();
    if (/(target|rel|noopener|noreferrer|itemprop|href|http|https)/i.test(title)) return null;
    if (/\s*=\s*['"][^'"]+['"]/i.test(title)) return null;
    if (title.length < 5 || title.split(/\s+/).length < 2) return null;
    return title.slice(0, 160);
  } catch { return null; }
}

function injectFeaturedImage(contentHtml, image, targetUrl, pageTitle) {
  if (!image?.url) return contentHtml;
  try { const html = String(contentHtml || ''); if (/class=\"featured-image\"/i.test(html) || (image.url && html.includes(String(image.url)))) { return html; } } catch {}
  const alt = image.alt || pageTitle || 'Featured image';
  const widthAttr = image.width ? ` width=\"${image.width}\"` : '';
  const heightAttr = image.height ? ` height=\"${image.height}\"` : '';
  const figCaption = image.photographer && image.photographer_url
    ? `Photo by <a href=\"${image.photographer_url}\" target=\"_blank\" rel=\"noopener nofollow\">${image.photographer}</a> on Pexels`
    : '';
  const figure = `\n<figure class=\"featured-image\" itemscope itemtype=\"https://schema.org/ImageObject\">\n  <a href=\"${targetUrl || '#'}\" target=\"_blank\" rel=\"noopener noreferrer\" itemprop=\"url\">\n    <img src=\"${image.url}\" alt=\"${alt}\" loading=\"eager\" decoding=\"async\" itemprop=\"contentUrl\"${widthAttr}${heightAttr} />\n  </a>\n  ${figCaption ? `<figcaption>${figCaption}</figcaption>` : ''}\n  ${image.width ? `<meta itemprop=\"width\" content=\"${image.width}\" />` : ''}\n  ${image.height ? `<meta itemprop=\"height\" content=\"${image.height}\" />` : ''}\n  ${image.photographer ? `<meta itemprop=\"author\" content=\"${image.photographer}\" />` : ''}\n  ${alt ? `<meta itemprop=\"caption\" content=\"${alt}\" />` : ''}\n</figure>\n`;
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

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'automation-post OK' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const payload = JSON.parse(event.body || '{}');
    const campaignId = payload.campaign_id || payload.campaignId || payload.id;

    if (!campaignId) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Missing campaign_id' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Supabase service role configuration missing' }) };
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Load campaign
    let { data: campaignRow, error: campaignErr } = await sb
      .from('automation_campaigns')
      .select('*')
      .eq('id', campaignId)
      .maybeSingle();

    if (campaignErr) {
      // Fallback: legacy table
      const { data: legacyRow, error: legacyErr } = await sb.from('automation').select('*').eq('id', campaignId).maybeSingle();
      if (legacyErr) {
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: `Failed to load campaign: ${campaignErr.message || campaignErr}` }) };
      }
      campaignRow = legacyRow || null;
    }
    if (!campaignRow) return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Campaign not found' }) };

    const campaign = {
      id: String(campaignRow.id),
      user_id: String(campaignRow.user_id || ''),
      target_url: String(campaignRow.target_url || campaignRow.targetUrl || campaignRow.target || ''),
      keyword: String(campaignRow.keyword || (Array.isArray(campaignRow.keywords) ? campaignRow.keywords[0] : '') || campaignRow.search_keyword || ''),
      anchor_text: String(campaignRow.anchor_text || (Array.isArray(campaignRow.anchor_texts) ? campaignRow.anchor_texts[0] : '') || ''),
      keywords: Array.isArray(campaignRow.keywords) ? campaignRow.keywords.filter(Boolean).map(String) : (campaignRow.keyword ? [String(campaignRow.keyword)] : []),
      anchor_texts: Array.isArray(campaignRow.anchor_texts) ? campaignRow.anchor_texts.filter(Boolean).map(String) : (campaignRow.anchor_text ? [String(campaignRow.anchor_text)] : []),
    };

    // Fetch eligible domains
    const { data: domainsRaw, error: dErr } = await sb
      .from('domains')
      .select('id, domain, selected_theme, blog_theme_template_key, user_id, dns_verified')
      .eq('user_id', campaign.user_id)
      .eq('dns_verified', true)
      .eq('netlify_verified', true)
      .order('created_at', { ascending: false });
    if (dErr) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: dErr.message }) };

    // Deduplicate domains by id to avoid double-posting
    const domains = Array.isArray(domainsRaw) ? Array.from(new Map(domainsRaw.map(d => [String(d.id), d])).values()) : [];

    const results = [];
    const publishedUrls = [];

    const slugify = (t) => String(t).toLowerCase().trim().replace(/[^a-z0-9-_ ]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    const getTitleFromContent = (html, fallback) => { try { const m = String(html).match(/<h1[^>]*>(.*?)<\/h1>/i); return m ? m[1].trim() : fallback; } catch { return fallback; } };

    // Generate content: only use the local in-process generator and return its content (no HTTP or edge fallbacks)
    async function generateContent(keyword, anchorText, url) {
      try {
        const gen = require('./automation-generate-openai');
        const ev = { httpMethod: 'POST', body: JSON.stringify({ keyword, url, anchorText }) };
        const res = await gen.handler(ev, {});
        if (res && res.statusCode === 200) {
          const body = JSON.parse(res.body || '{}');
          if (body && body.content) return String(body.content);
        }
        // If generator did not return content, log and return empty string
        console.warn('generate-openai returned no content');
        return '';
      } catch (err) {
        console.warn('generateContent error:', err && (err.message || err));
        return '';
      }
    }

    for (const d of (domains || [])) {
      try {
        // Skip if already posted for this campaign+domain
        const { data: existing } = await sb
          .from('automation_posts')
          .select('id, url')
          .eq('automation_id', campaign.id)
          .eq('domain_id', d.id)
          .maybeSingle();
        if (existing) { results.push({ domain: d.domain, action: 'skip_existing', url: existing.url }); continue; }

        // Generate content and derive title
        let contentHtml = await generateContent(campaign.keyword || 'blog post', campaign.anchor_text || campaign.keyword, campaign.target_url);

        // Rendering now relies on Supabase theme post.html templates; no local cleaner/css.
        let cleanedTitle = null;

        let extTitle = null;
        try { extTitle = await fetchExternalPageTitle(campaign.target_url); } catch {}
        const fallbackTitle = `${campaign.keyword} — ${new URL(campaign.target_url).hostname}`.slice(0, 120);
        const detectedTitle = cleanedTitle;
        const title = extTitle || detectedTitle || getTitleFromContent(contentHtml, fallbackTitle);

        // Use local publish-domain-post to ensure slug uniqueness and store url/arrays/theme
        const publish = require('./automation-publish-post');
        const pubEvent = { httpMethod: 'POST', body: JSON.stringify({ automation_id: campaign.id, domain_id: d.id, user_id: campaign.user_id, title, content: contentHtml, keywords: campaign.keywords, anchor_texts: campaign.anchor_texts }) };
        const pubRes = await publish.handler(pubEvent, {});
        let post = null;
        try { post = JSON.parse(pubRes.body || '{}').post || null; } catch {}

        if (pubRes.statusCode !== 200 || !post) {
          // Fallback: direct insert (ensures themed slug and url)
          const themeKey = normalizeThemeKey(d.blog_theme_template_key || d.selected_theme || 'minimal');
          const baseSlug = `${slugify(campaign.keyword || title).split('-').filter(Boolean).slice(0,4).join('-')}-${Math.random().toString(36).slice(2,6)}`;
          let slug = `${baseSlug}`;
          const host = String(d.domain).replace(/^https?:\/\//,'').replace(/\/$/,'');
          const url = `https://${host}/${slug}`;

          const insertPayload = {
            automation_id: campaign.id,
            domain_id: d.id,
            user_id: campaign.user_id,
            slug,
            title,
            content: contentHtml,
            url,
            status: 'published',
            blog_theme: themeKey,
            keywords: campaign.keywords,
            anchor_texts: campaign.anchor_texts,
          };
          // safe insert with fallback
          let ins = null;
          try {
            const res = await sb.from('automation_posts').insert(insertPayload).select().maybeSingle();
            if (res.error) throw res.error;
            ins = res.data;
          } catch (e) {
            const msg = String(e.message || e).toLowerCase();
            const clean = { ...insertPayload };
            if (msg.includes('column') && msg.includes('blog_theme')) delete clean.blog_theme;
            if (msg.includes('column') && msg.includes('keywords')) delete clean.keywords;
            if (msg.includes('column') && msg.includes('anchor_texts')) delete clean.anchor_texts;
            if (msg.includes('column') && msg.includes('blog_theme_id')) delete clean.blog_theme_id;
            const retry = await sb.from('automation_posts').insert(clean).select().maybeSingle();
            if (retry.error) throw retry.error;
            ins = retry.data;
          }
          post = ins;
        }

        if (post && post.url) {
          if (!publishedUrls.includes(post.url)) publishedUrls.push(post.url);
        }
        results.push({ domain: d.domain, action: 'published', url: post?.url || null });

        // Random theme automation disabled to preserve raw HTML; no CSS/HTML injections

        // Record link for Links tab (dedupe per campaign+platform)
        try {
          const nowIso = new Date().toISOString();
          const platformId = String(d.domain || 'domain').toLowerCase();
          const { data: existing } = await sb
            .from('automation_published_links')
            .select('id, published_url')
            .eq('campaign_id', campaign.id)
            .eq('platform', platformId)
            .maybeSingle();

          if (existing) {
            if (post?.url && existing.published_url !== String(post.url)) {
              await sb
                .from('automation_published_links')
                .update({ published_url: String(post.url), status: 'published', keyword: campaign.keyword, anchor_text: campaign.anchor_text, target_url: campaign.target_url, published_at: nowIso })
                .eq('id', existing.id);
            }
          } else {
            await sb.from('automation_published_links').insert({
              campaign_id: campaign.id,
              platform: platformId,
              published_url: String(post?.url || ''),
              status: 'published',
              keyword: campaign.keyword,
              anchor_text: campaign.anchor_text,
              target_url: campaign.target_url,
              created_at: nowIso,
              published_at: nowIso
            });
          }
        } catch {}
      } catch (e) {
        results.push({ domain: d.domain, action: 'error', error: e.message || String(e) });
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, results, publishedUrls }) };
  } catch (err) {
    console.error('automation-post function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message || String(err) }) };
  }
};
