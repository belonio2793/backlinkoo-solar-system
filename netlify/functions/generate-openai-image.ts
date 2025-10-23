import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';
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
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || getEnv('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return { statusCode: 400, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
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

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `High-quality editorial photograph illustrating: ${keyword}. Style: realistic, professional blog hero image, landscape orientation, subtle depth of field, clear subject, balanced composition, natural lighting.`;

    // Generate image (gpt-image-1 returns base64)
    const imgRes = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x768',
      quality: 'high',
      response_format: 'b64_json'
    });

    const b64 = imgRes.data?.[0]?.b64_json;
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenAI image generation failed' }) };
    }

    const buffer = Buffer.from(b64, 'base64');

    const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    const safeSlug = (slug || `${keyword}-${Date.now().toString(36)}`)
      .toLowerCase()
      .replace(/[^a-z0-9\-\_ ]+/g, '')
      .replace(/\s+/g, '-');
    const key = `posts/${safeSlug}/featured.jpg`;

    // Upload JPEG
    const { error: upErr } = await client.storage.from(IMAGES_BUCKET).upload(key, buffer, { contentType: 'image/jpeg', upsert: true, cacheControl: '3600' });
    if (upErr) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Upload failed', details: upErr.message }) };
    }

    const { data: pub } = client.storage.from(IMAGES_BUCKET).getPublicUrl(key);

    const meta = {
      url: pub?.publicUrl || null,
      alt: `${keyword} — editorial hero image`,
      width: 1024,
      height: 768,
      avg_color: null,
      photographer: null,
      photographer_url: null,
      pexels_url: null,
      license: 'OpenAI generated',
      source: 'openai',
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
