const { createClient } = require('@supabase/supabase-js');

// Expect JSON POST: { domainId: string }
// Deletes all files under 'favicons/<domainId>/' and clears domains.favicon

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase not configured' }) };
    }
    const body = JSON.parse(event.body || '{}');
    const { domainId } = body;
    if (!domainId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing domainId' }) };

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const bucket = 'images';
    // List objects in folder
    const prefix = `favicons/${domainId}/`;
    const { data: list, error: listErr } = await supabase.storage.from(bucket).list(`favicons/${domainId}`, { limit: 1000, offset: 0 });
    if (listErr) console.warn('List error', listErr.message);

    if (Array.isArray(list) && list.length > 0) {
      const removes = list.map(item => `${prefix}${item.name}`);
      const { error: delErr } = await supabase.storage.from(bucket).remove(removes);
      if (delErr) console.warn('Remove error', delErr.message);
    }

    // Clear domains.favicon
    const { error: updErr } = await supabase.from('domains').update({ favicon: null, updated_at: new Date().toISOString() }).eq('id', domainId);
    if (updErr) console.warn('Failed to clear favicon', updErr.message);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
