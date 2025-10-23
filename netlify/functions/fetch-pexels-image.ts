import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const IMAGES_BUCKET = process.env.SUPABASE_IMAGES_BUCKET || 'images';

function getEnv(name: string): string | undefined {
  return process.env[name] || (process.env as any)[`VITE_${name}`];
}

const SUPABASE_URL = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const apiKey = process.env.PEXELS_API_KEY || process.env.VITE_PEXELS_API_KEY;
    if (!apiKey) {
      return { statusCode: 400, body: JSON.stringify({ error: 'PEXELS_API_KEY not configured' }) };
    }

    if (!SUPABASE_URL) {
      return { statusCode: 500, body: JSON.stringify({ error: 'SUPABASE_URL not configured' }) };
    }
    if (!SERVICE_ROLE) {
      return { statusCode: 500, body: JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }) };
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
    const keyword: string = (body.keyword || '').toString().trim();
    const targetUrl: string = (body.targetUrl || body.url || '').toString().trim();
    const slug: string = (body.slug || body.postSlug || '').toString().trim();

    if (!keyword) {
      return { statusCode: 400, body: JSON.stringify({ error: 'keyword is required' }) };
    }

    const searchUrl = new URL('https://api.pexels.com/v1/search');
    searchUrl.searchParams.set('query', keyword);
    searchUrl.searchParams.set('orientation', 'landscape');
    searchUrl.searchParams.set('per_page', '1');
    searchUrl.searchParams.set('size', 'large');

    const pexelsRes = await fetch(searchUrl.toString(), { headers: { Authorization: apiKey } });
    if (!pexelsRes.ok) {
      const t = await pexelsRes.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'Pexels API error', status: pexelsRes.status, body: t }) };
    }
    const pexelsJson: any = await pexelsRes.json();
    const photo = pexelsJson?.photos?.[0];
    if (!photo) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No images found for keyword' }) };
    }

    const src: any = photo.src || {};
    const imageUrl: string = src.large2x || src.large || src.original || src.medium || src.landscape;
    if (!imageUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No suitable image URL from Pexels' }) };
    }

    // Fetch the image binary
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      const t = await imgRes.text().catch(() => '');
      return { statusCode: 502, body: JSON.stringify({ error: 'Failed to download image', status: imgRes.status, body: t }) };
    }
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';

    // Upload to Supabase storage
    const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const safeSlug = (slug || `${keyword}-${Date.now().toString(36)}`)
      .toLowerCase()
      .replace(/[^a-z0-9\-\_ ]+/g, '')
      .replace(/\s+/g, '-');
    const key = `posts/${safeSlug}/featured${contentType.includes('png') ? '.png' : '.jpg'}`;

    const { error: upErr } = await client.storage.from(IMAGES_BUCKET).upload(key, buffer, { contentType, upsert: true, cacheControl: '3600' });
    if (upErr) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Upload failed', details: upErr.message }) };
    }

    const { data: pub } = client.storage.from(IMAGES_BUCKET).getPublicUrl(key);

    const meta = {
      url: pub?.publicUrl || null,
      alt: (photo.alt || keyword).toString(),
      width: Number(photo.width) || undefined,
      height: Number(photo.height) || undefined,
      avg_color: photo.avg_color || null,
      photographer: photo.photographer || null,
      photographer_url: photo.photographer_url || null,
      pexels_url: photo.url || null,
      license: 'Pexels',
      source: 'pexels',
      target_url: targetUrl || null,
      bucket: IMAGES_BUCKET,
      key
    };

    return { statusCode: 200, body: JSON.stringify({ success: true, image: meta }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'Unexpected error' }) };
  }
};

export { handler };
