/**
 * Netlify Function: regenerate-automation-post
 * Regenerates an existing automation post by full URL or by domain+slug, preserving the slug.
 * - Rendering now relies on Supabase theme post.html templates (no local cleaner)
 * - Optionally override title via ?title=... or body.title
 * - Returns updated row summary
 */
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { createClient } = require('@supabase/supabase-js');

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Supabase not configured' }) };
    }
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    const qs = event.queryStringParameters || {};
    const body = event.httpMethod === 'POST' ? (JSON.parse(event.body || '{}') || {}) : {};

    // Accept input via body or query
    const inputUrl = (body.url || body.href || qs.url || '').toString().trim();
    let domain = (body.domain || qs.domain || '').toString().trim();
    let slug = (body.slug || qs.slug || '').toString().trim();
    const overrideTitle = (body.title || qs.title || '').toString().trim();

    if (inputUrl && (!domain || !slug)) {
      try {
        const u = new URL(inputUrl);
        domain = u.hostname;
        const path = u.pathname.replace(/^\/+/, '');
        // Support both legacy /themes/<theme>/<slug> and new /<theme>/<slug>
        slug = path.replace(/^themes\//i, '').replace(/^\/+/, '');
      } catch (_) {}
    }

    if (!domain || !slug) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Provide either ?url=... or both domain and slug' }) };
    }

    // Load domain row
    const { data: domainRow, error: dErr } = await sb
      .from('domains')
      .select('id, domain')
      .eq('domain', domain)
      .maybeSingle();
    if (dErr || !domainRow) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Domain not found', domain, slug }) };
    }

    // Find existing automation post
    const { data: post, error: pErr } = await sb
      .from('automation_posts')
      .select('id, automation_id, user_id, domain_id, slug, title, content, keywords, anchor_texts')
      .eq('domain_id', domainRow.id)
      .eq('slug', slug)
      .maybeSingle();
    if (pErr || !post) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Post not found', domain, slug }) };
    }

    // Load campaign context for better backlink insertion
    let target_url = null;
    try {
      const { data: camp } = await sb
        .from('automation_campaigns')
        .select('target_url')
        .eq('id', post.automation_id)
        .maybeSingle();
      if (camp && camp.target_url) target_url = camp.target_url;
    } catch (_) {}

    // No local cleaning/formatting; keep stored content. Title can be overridden via param.
    const newTitle = overrideTitle || post.title;
    const newContent = post.content || '';

    // Update the existing row preserving slug and URL
    const host = String(domain).replace(/^https?:\/\//, '').replace(/\/$/, '');
    const url = `https://${host}/${slug}`;

    const { data: updated, error: uErr } = await sb
      .from('automation_posts')
      .update({ title: newTitle, content: newContent, url })
      .eq('id', post.id)
      .select('id, slug, title, url')
      .maybeSingle();

    if (uErr) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: uErr.message || String(uErr) }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, updated }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e && (e.message || String(e)) }) };
  }
};
