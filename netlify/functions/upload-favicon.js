const { createClient } = require('@supabase/supabase-js');

// Expect JSON POST: { domainId: string, files: [{ name, b64, contentType }] }
// Uploads to storage bucket 'images' under path 'favicons/<domainId>/<name>' and updates domains.favicon

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase not configured' }) };
    }
    const body = JSON.parse(event.body || '{}');
    const { domainId, files } = body;
    if (!domainId || !Array.isArray(files) || files.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing domainId or files' }) };
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const bucket = 'images';
    const uploaded = [];

    for (const f of files) {
      const { name, b64, contentType } = f;
      if (!name || !b64) continue;
      const key = `favicons/${domainId}/${name}`;
      const buffer = Buffer.from(b64, 'base64');
      const { error } = await supabase.storage.from(bucket).upload(key, buffer, { contentType, upsert: true });
      if (error) {
        console.warn('Upload error for', key, error.message);
        continue;
      }
      const publicUrl = `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${encodeURIComponent(key)}`;
      uploaded.push({ key, publicUrl });
    }

    if (uploaded.length === 0) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No files uploaded' }) };
    }

    // Prefer favicon.ico if present, otherwise pick 32px then 16px then first
    let chosen = uploaded.find(u => u.key.endsWith('/favicon.ico'))
      || uploaded.find(u => /favicon[-_]32/i.test(u.key))
      || uploaded.find(u => /favicon[-_]16/i.test(u.key))
      || uploaded[0];

    if (chosen) {
      // Update domains table favicon column (service-role allowed)
      const { error: updErr } = await supabase
        .from('domains')
        .update({ favicon: chosen.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', domainId);
      if (updErr) console.warn('Failed to update domain favicon column:', updErr.message);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, uploaded }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
