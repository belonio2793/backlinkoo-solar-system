'use strict';

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

    if (!supabaseUrl || !serviceKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing service credentials' }) };
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const { id, name, target_url } = payload;

    if (!id && !target_url && !name) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Provide campaign id or identifying fields' }) };
    }

    // Resolve campaign id if not provided
    let campaignId = id;
    if (!campaignId) {
      const { data: found } = await supabase
        .from('automation_campaigns')
        .select('id')
        .match({ name, target_url })
        .maybeSingle();
      campaignId = found?.id || null;
      if (!campaignId) {
        const { data: legacy } = await supabase
          .from('automation')
          .select('id')
          .match({ name, target_url })
          .maybeSingle();
        campaignId = legacy?.id || null;
      }
    }

    if (!campaignId) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Campaign not found' }) };
    }

    // Preserve posts and DO NOT modify automation_posts as requested
    await supabase.from('automation_published_links').delete().eq('campaign_id', campaignId);

    // Delete main campaign (new table first, then legacy)
    const delNew = await supabase.from('automation_campaigns').delete().eq('id', campaignId);
    if (delNew.error) {
      const delLegacy = await supabase.from('automation').delete().eq('id', campaignId);
      if (delLegacy.error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: delLegacy.error.message || 'Delete failed' }) };
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: campaignId }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err?.message || String(err) }) };
  }
};
