const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (!['POST', 'GET'].includes(event.httpMethod)) {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ safer: only service role

    if (!supabaseUrl || !serviceKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing service credentials' }) };
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    // Parse payload
    let payload = {};
    if (event.httpMethod === 'POST') {
      try {
        payload = JSON.parse(event.body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON body', details: String(e) })
        };
      }
    } else if (event.httpMethod === 'GET') {
      payload = event.queryStringParameters || {};
    }

    console.log('deleteAutomationCampaign payload:', payload);

    const { id, name, target_url } = payload;
    if (!id && !name && !target_url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Provide campaign id or identifying fields' }) };
    }

    // Resolve campaign id if not provided
    let campaignId = id;
    if (!campaignId) {
      const { data: found, error: fErr } = await supabase
        .from('automation_campaigns')
        .select('id')
        .match({ name, target_url })
        .maybeSingle();

      if (fErr) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'DB lookup failed', details: fErr.message || String(fErr) })
        };
      }
      campaignId = found?.id || null;
    }

    if (!campaignId) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Campaign not found' }) };
    }

    // Delete campaign row
    const { error: delErr } = await supabase.from('automation_campaigns').delete().eq('id', campaignId);
    if (delErr) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: delErr.message || 'Delete failed' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: campaignId }) };
  } catch (err) {
    console.error('deleteAutomationCampaign error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err?.message || String(err) }) };
  }
};
