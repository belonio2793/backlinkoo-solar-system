#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const IMAGES_BUCKET = process.env.SUPABASE_IMAGES_BUCKET || 'images';

function argVal(name, def = '') {
  const idx = process.argv.findIndex(a => a === `--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return def;
}

function getEnv(name) {
  return process.env[name] || process.env[`VITE_${name}`];
}

const SUPABASE_URL = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || process.env.VITE_PEXELS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

async function ensureImagesBucket(client) {
  try {
    const { data: buckets } = await client.storage.listBuckets();
    const exists = (buckets || []).some(b => b.name === IMAGES_BUCKET);
    if (!exists) {
      await client.storage.createBucket(IMAGES_BUCKET, { public: true });
    } else {
      try { await client.storage.updateBucket(IMAGES_BUCKET, { public: true }); } catch {}
    }
  } catch {}
}

async function fetchPexels(keyword) {
  if (!PEXELS_API_KEY) return null;
  const u = new URL('https://api.pexels.com/v1/search');
  u.searchParams.set('query', keyword);
  u.searchParams.set('orientation', 'landscape');
  u.searchParams.set('per_page', '1');
  u.searchParams.set('size', 'large');
  const res = await fetch(u.toString(), { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) return null;
  const j = await res.json();
  const photo = j?.photos?.[0];
  if (!photo) return null;
  const src = photo.src || {};
  const url = src.large2x || src.large || src.original || src.medium || src.landscape;
  if (!url) return null;
  const imgRes = await fetch(url);
  if (!imgRes.ok) return null;
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
  const meta = { alt: photo.alt || keyword, width: photo.width, height: photo.height, photographer: photo.photographer, photographer_url: photo.photographer_url };
  return { buffer: buf, contentType, meta };
}

async function generateOpenAI(keyword) {
  if (!OPENAI_API_KEY) return null;
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const prompt = `High-quality editorial photograph illustrating: ${keyword}. Style: realistic, professional blog hero image, landscape orientation, subtle depth of field, clear subject, balanced composition, natural lighting.`;
  const img = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x768', quality: 'high', response_format: 'b64_json' });
  const b64 = img.data?.[0]?.b64_json;
  if (!b64) return null;
  const buf = Buffer.from(b64, 'base64');
  return { buffer: buf, contentType: 'image/jpeg', meta: { alt: `${keyword} — editorial hero image`, width: 1024, height: 768 } };
}

function buildFigureHtml(publicUrl, targetUrl, meta, title) {
  const alt = meta?.alt || title || 'Featured image';
  const widthAttr = meta?.width ? ` width="${meta.width}"` : '';
  const heightAttr = meta?.height ? ` height="${meta.height}"` : '';
  const figCaption = meta?.photographer && meta?.photographer_url ? `Photo by <a href="${meta.photographer_url}" target="_blank" rel="noopener nofollow">${meta.photographer}</a>` : '';
  return `\n<figure class="featured-image" itemscope itemtype="https://schema.org/ImageObject">\n  <a href="${targetUrl}" target="_blank" rel="noopener noreferrer" itemprop="url">\n    <img src="${publicUrl}" alt="${alt}" loading="eager" decoding="async" itemprop="contentUrl"${widthAttr}${heightAttr} />\n  </a>\n  ${figCaption ? `<figcaption>${figCaption}</figcaption>` : ''}\n  ${meta?.width ? `<meta itemprop="width" content="${meta.width}" />` : ''}\n  ${meta?.height ? `<meta itemprop="height" content="${meta.height}" />` : ''}\n  ${alt ? `<meta itemprop="caption" content="${alt}" />` : ''}\n</figure>\n`;
}

function injectIntoContent(html, figure) {
  try {
    const m = html.match(/<h2[^>]*>[^<]*<\/h2>/i);
    if (m) {
      const idx = html.indexOf(m[0]) + m[0].length;
      return html.slice(0, idx) + figure + html.slice(idx);
    }
  } catch {}
  return figure + html;
}

async function main() {
  const domain = argVal('domain');
  let slug = argVal('slug');
  let keyword = argVal('keyword');

  if (!domain || !slug) {
    console.error('Usage: node scripts/inject-image-automation-post.mjs --domain <domain> --slug <theme/slug> [--keyword "..."]');
    process.exit(1);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env');
    process.exit(1);
  }

  const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  await ensureImagesBucket(client);

  // Normalize slug (strip leading themes/ if present)
  slug = slug.replace(/^themes\//i, '').replace(/^\/+/, '');

  const { data: domainRow, error: dErr } = await client
    .from('domains')
    .select('id, domain')
    .or(`domain.eq.${domain},domain.eq.www.${domain}`)
    .maybeSingle();
  if (dErr || !domainRow) {
    console.error('Domain not found', dErr?.message);
    process.exit(1);
  }

  const { data: postRow, error: pErr } = await client
    .from('automation_posts')
    .select('id, title, content, url')
    .eq('domain_id', domainRow.id)
    .eq('slug', slug)
    .maybeSingle();
  if (pErr || !postRow) {
    console.error('Post not found', pErr?.message);
    process.exit(1);
  }

  const title = postRow.title || slug;
  if (!keyword) keyword = String(title).replace(/<[^>]*>/g, '').replace(/[-_]+/g, ' ').trim();

  let image = await fetchPexels(keyword);
  if (!image) image = await generateOpenAI(keyword);
  if (!image) {
    console.error('Failed to get image from Pexels and OpenAI');
    process.exit(1);
  }

  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9\-\/_ ]+/g, '').replace(/\s+/g, '-');
  const ext = image.contentType.includes('png') ? '.png' : '.jpg';
  const key = `posts/${safeSlug}/featured${ext}`;

  const { error: upErr } = await client.storage.from(IMAGES_BUCKET).upload(key, image.buffer, { contentType: image.contentType, upsert: true, cacheControl: '3600' });
  if (upErr) {
    console.error('Upload failed:', upErr.message);
    process.exit(1);
  }

  const { data: pub } = client.storage.from(IMAGES_BUCKET).getPublicUrl(key);
  const publicUrl = pub?.publicUrl;
  const targetUrl = postRow.url || `https://${String(domainRow.domain).replace(/^https?:\/\//,'')}/`;
  const figure = buildFigureHtml(publicUrl, targetUrl, image.meta, title);
  const updatedHtml = injectIntoContent(String(postRow.content || ''), figure);

  const { error: updErr } = await client
    .from('automation_posts')
    .update({ content: updatedHtml })
    .eq('id', postRow.id);
  if (updErr) {
    console.error('Update failed:', updErr.message);
    process.exit(1);
  }

  console.log('✅ Injected image into automation post');
  console.log('Image URL:', publicUrl);
}

main().catch(e => { console.error(e); process.exit(1); });
