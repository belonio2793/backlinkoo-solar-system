const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

function b64urlDecode(input) {
  const s = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : '';
  return Buffer.from(s + pad, 'base64').toString('utf8');
}

// Allowed origins for CORS
const allowedOrigins = [
  'https://backlinkoo.com',
  'https://backlinkoo.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

exports.handler = async (event) => {
  const origin = event.headers.origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const url = new URL(event.rawUrl || event.headers.referer || 'http://localhost');
    const code = url.searchParams.get('code') || (event.queryStringParameters && event.queryStringParameters.code);
    const state = url.searchParams.get('state') || (event.queryStringParameters && event.queryStringParameters.state);
    const oauthError = url.searchParams.get('error') || (event.queryStringParameters && event.queryStringParameters.error);

    // OAuth error redirect
    if (oauthError && state) {
      try {
        const parsed = JSON.parse(b64urlDecode(state));
        let appRedirect = parsed?.p?.redirect || '';
        if (appRedirect) {
          const sep = appRedirect.includes('?') ? '&' : '?';
          return {
            statusCode: 302,
            headers: { Location: `${appRedirect}${sep}oauth=twitter&error=${encodeURIComponent(oauthError)}` },
            body: ''
          };
        }
      } catch { }
    }

    // Missing code or state
    if (!code || !state) {
      const fallback = process.env.VITE_BASE_URL || process.env.PUBLIC_SITE_URL || '';
      if (fallback) {
        const sep = fallback.includes('?') ? '&' : '?';
        return {
          statusCode: 302,
          headers: { Location: `${String(fallback).replace(/\/$/, '')}/twitter${sep}oauth=twitter&error=${encodeURIComponent('missing_code_state')}` },
          body: ''
        };
      }
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing code/state' }) };
    }

    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const signSecret = clientSecret || serviceKey || 'local-dev-secret';

    if (!clientId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing TWITTER_CLIENT_ID env' }) };
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    // Look up stored state in Supabase
    let stateRow = null;
    try {
      const { data, error } = await supabase
        .from('twitter_oauth_states')
        .select('*')
        .eq('state', state)
        .maybeSingle();
      if (!error) stateRow = data || null;
    } catch { }

    let redirect_uri, code_verifier, appRedirect, user_id_from_state;

    if (stateRow && (!stateRow.expires_at || new Date(stateRow.expires_at).getTime() >= Date.now())) {
      redirect_uri = stateRow.redirect_uri;
      code_verifier = stateRow.code_verifier;
      user_id_from_state = stateRow.user_id;
      try {
        const j = JSON.parse(b64urlDecode(state));
        if (j && j.p) appRedirect = j.p.redirect || '';
      } catch { }
    } else {
      let parsed = null;
      try { parsed = JSON.parse(b64urlDecode(state)); } catch { }

      if (!parsed || !parsed.p || !parsed.s) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or expired state' }) };
      }

      const payloadStr = JSON.stringify(parsed.p);
      const expectedSig = crypto.createHmac('sha256', String(signSecret)).update(payloadStr).digest('hex');
      if (expectedSig !== parsed.s) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or expired state' }) };
      }
      if (!parsed.p.ts || Date.now() - parsed.p.ts > 15 * 60 * 1000) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'State expired' }) };
      }

      redirect_uri = parsed.p.ru;
      code_verifier = parsed.p.cv;
      appRedirect = parsed.p.redirect || '';
      user_id_from_state = parsed.p.uid || null;
    }

    // ⚡ Redirect whitelist
    const ALLOWED_REDIRECTS = [
      'https://backlinkoo.com/twitter',
      'https://backlinkoo.netlify.app/twitter',
      'http://localhost:3000/twitter',
      'http://localhost:3001/twitter'
    ];
    if (appRedirect && !ALLOWED_REDIRECTS.some(r => appRedirect.startsWith(r))) {
      appRedirect = '';
    }

    // Exchange code for tokens
    const tokenUrl = 'https://api.x.com/2/oauth2/token';
    const form = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      code_verifier
    });

    const headersToken = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (clientSecret) {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      headersToken['Authorization'] = `Basic ${basic}`;
    }

    const tokenRes = await fetch(tokenUrl, { method: 'POST', headers: headersToken, body: form });
    const tokenJson = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok || !tokenJson.access_token) {
      if (appRedirect) {
        const sep = appRedirect.includes('?') ? '&' : '?';
        return { statusCode: 302, headers: { Location: `${appRedirect}${sep}oauth=twitter&error=token_exchange_failed` }, body: '' };
      }
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Token exchange failed', details: tokenJson }) };
    }

    const access_token = tokenJson.access_token;
    const refresh_token = tokenJson.refresh_token;
    const expires_in = tokenJson.expires_in;
    const token_expires_at = new Date(Date.now() + (expires_in || 7200) * 1000).toISOString();

    // Fetch user profile
    const meRes = await fetch('https://api.x.com/2/users/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const me = await meRes.json();
    if (!meRes.ok) {
      if (appRedirect) {
        const sep = appRedirect.includes('?') ? '&' : '?';
        return { statusCode: 302, headers: { Location: `${appRedirect}${sep}oauth=twitter&error=user_fetch_failed` }, body: '' };
      }
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Failed to fetch user', details: me }) };
    }

    const twitter_user_id = me?.data?.id;
    const twitter_username = me?.data?.username || '';

    // Upsert account into Supabase
    const { error: upErr } = await supabase.from('twitter_accounts').upsert({
      user_id: user_id_from_state,
      twitter_user_id,
      twitter_username,
      access_token,
      refresh_token,
      token_expires_at
    }, { onConflict: 'user_id' });

    if (upErr) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: upErr.message }) };
    }

    // Cleanup state
    try { await supabase.from('twitter_oauth_states').delete().eq('state', state); } catch { }

    // Final redirect
    if (appRedirect) {
      return { statusCode: 302, headers: { Location: appRedirect }, body: '' };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, twitter_username }) };

  } catch (error) {
    console.error('twitter-auth-callback error', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message || 'Internal error' }) };
  }
};
