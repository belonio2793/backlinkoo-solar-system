import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const IMAGES_BUCKET = process.env.SUPABASE_IMAGES_BUCKET || 'images';

function envGet(name: string): string | undefined {
  return process.env[name] || (process.env as any)[`VITE_${name}`];
}

const SUPABASE_URL = envGet('SUPABASE_URL') || envGet('VITE_SUPABASE_URL');
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

async function ensureImagesBucket(client: ReturnType<typeof createClient>) {
  try {
    const { data: buckets } = await client.storage.listBuckets();
    const exists = (buckets || []).some((b: any) => b.name === IMAGES_BUCKET);
    if (!exists) {
      await client.storage.createBucket(IMAGES_BUCKET, { public: true });
    } else {
      // Best effort: set public true
      try { await client.storage.updateBucket(IMAGES_BUCKET, { public: true }); } catch {}
    }
  } catch {}
}

async function fetchPexels(keyword: string) {
  const key = process.env.PEXELS_API_KEY || envGet('PEXELS_API_KEY');
  if (!key) return null;
  const u = new URL('https://api.pexels.com/v1/search');
  u.searchParams.set('query', keyword);
  u.searchParams.set('orientation', 'landscape');
  u.searchParams.set('per_page', '1');
  u.searchParams.set('size', 'large');
  const res = await fetch(u.toString(), { headers: { Authorization: key } });
  if (!res.ok) return null;
  const j: any = await res.json();
  const photo = j?.photos?.[0];
  if (!photo) return null;
  const src = photo.src || {};
  const url: string = src.large2x || src.large || src.original || src.medium || src.landscape;
  if (!url) return null;
  const imgRes = await fetch(url);
  if (!imgRes.ok) return null;
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
  const meta = { url, alt: photo.alt || keyword, width: photo.width, height: photo.height, photographer: photo.photographer, photographer_url: photo.photographer_url };
  return { buffer: buf, contentType, meta };
}

async function generateOpenAI(keyword: string) {
  const key = process.env.OPENAI_API_KEY || envGet('OPENAI_API_KEY');
  if (!key) return null;
  const openai = new OpenAI({ apiKey: key });
  const prompt = `High-quality editorial photograph illustrating: ${keyword}. Style: realistic, professional blog hero image, landscape orientation, subtle depth of field, clear subject, balanced composition, natural lighting.`;
  const img = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x768', quality: 'high', response_format: 'b64_json' });
  const b64 = img.data?.[0]?.b64_json;
  if (!b64) return null;
  const buf = Buffer.from(b64, 'base64');
  const contentType = 'image/jpeg';
  const meta = { alt: `${keyword} — editorial hero image`, width: 1024, height: 768 } as any;
  return { buffer: buf, contentType, meta };
}

function buildFigureHtml(publicUrl: string, targetUrl: string, meta: any, title?: string) {
  const alt = meta?.alt || title || 'Featured image';
  const widthAttr = meta?.width ? ` width=\"${meta.width}\"` : '';
  const heightAttr = meta?.height ? ` height=\"${meta.height}\"` : '';
  const figCaption = meta?.photographer && meta?.photographer_url ? `Photo by <a href=\"${meta.photographer_url}\" target=\"_blank\" rel=\"noopener nofollow\">${meta.photographer}</a>` : '';
  return `\n<figure class=\"featured-image\" itemscope itemtype=\"https://schema.org/ImageObject\">\n  <a href=\"${targetUrl}\" target=\"_blank\" rel=\"noopener noreferrer\" itemprop=\"url\">\n    <img src=\"${publicUrl}\" alt=\"${alt}\" loading=\"eager\" decoding=\"async\" itemprop=\"contentUrl\"${widthAttr}${heightAttr} />\n  </a>\n  ${figCaption ? `<figcaption>${figCaption}</figcaption>` : ''}\n  ${meta?.width ? `<meta itemprop=\"width\" content=\"${meta.width}\" />` : ''}\n  ${meta?.height ? `<meta itemprop=\"height\" content=\"${meta.height}\" />` : ''}\n  ${alt ? `<meta itemprop=\"caption\" content=\"${alt}\" />` : ''}\n</figure>\n`;
}

function injectIntoContent(html: string, figure: string): string {
  try {
    const m = html.match(/<h2[^>]*>[^<]*<\/h2>/i);
    if (m) {
      const idx = html.indexOf(m[0]) + m[0].length;
      return html.slice(0, idx) + figure + html.slice(idx);
    }
  } catch {}
  return figure + html;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  try {
    if (!SUPABASE_URL) return { statusCode: 500, body: JSON.stringify({ error: 'SUPABASE_URL not configured' }) };
    if (!SERVICE_ROLE) return { statusCode: 500, body: JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }) };

    const body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
    const domain: string = (body.domain || '').toString().trim();
    const slug: string = (body.slug || '').toString().trim().replace(/^\/+|^themes\//i, '');
    let keyword: string = (body.keyword || '').toString().trim();

    if (!domain || !slug) return { statusCode: 400, body: JSON.stringify({ error: 'domain and slug are required' }) };

    const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    await ensureImagesBucket(client);

    // Resolve domain row
    const { data: domainRow, error: dErr } = await client
      .from('domains')
      .select('id, domain')
      .or(`domain.eq.${domain},domain.eq.www.${domain}`)
      .maybeSingle();
    if (dErr || !domainRow) return { statusCode: 404, body: JSON.stringify({ error: 'Domain not found' }) };

    // Load post
    const { data: postRow, error: pErr } = await client
      .from('automation_posts')
      .select('id, title, content, url')
      .eq('domain_id', domainRow.id)
      .eq('slug', slug)
      .maybeSingle();
    if (pErr || !postRow) return { statusCode: 404, body: JSON.stringify({ error: 'Post not found' }) };

    const title = postRow.title || slug;
    if (!keyword) keyword = title.replace(/<[^>]*>/g, '').replace(/[-_]+/g, ' ').trim();

    // Try Pexels, then OpenAI
    let image: { buffer: Buffer; contentType: string; meta: any } | null = null;
    image = await fetchPexels(keyword);
    if (!image) image = await generateOpenAI(keyword);
    if (!image) return { statusCode: 502, body: JSON.stringify({ error: 'Failed to obtain image from Pexels or OpenAI' }) };

    // Upload to storage
    const safeSlug = `${slug}`.toLowerCase().replace(/[^a-z0-9\-\/_ ]+/g, '').replace(/\s+/g, '-');
    const ext = image.contentType.includes('png') ? '.png' : '.jpg';
    const key = `posts/${safeSlug}/featured${ext}`;
    const { error: upErr } = await client.storage.from(IMAGES_BUCKET).upload(key, image.buffer, { contentType: image.contentType, upsert: true, cacheControl: '3600' });
    if (upErr) return { statusCode: 502, body: JSON.stringify({ error: 'Upload failed', details: upErr.message }) };
    const { data: pub } = client.storage.from(IMAGES_BUCKET).getPublicUrl(key);

    const targetUrl = postRow.url || `https://${String(domainRow.domain).replace(/^https?:\/\//,'')}/`;
    const figure = buildFigureHtml(pub?.publicUrl || '', targetUrl, image.meta, title);
    const updatedHtml = injectIntoContent(String(postRow.content || ''), figure);

    const { error: updErr } = await client
      .from('automation_posts')
      .update({ content: updatedHtml })
      .eq('id', postRow.id);
    if (updErr) return { statusCode: 500, body: JSON.stringify({ error: 'Update failed', details: updErr.message }) };

    return { statusCode: 200, body: JSON.stringify({ success: true, image: { url: pub?.publicUrl || null, ...image.meta }, updated: true }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'Unexpected error' }) };
  }
};
