const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// --- Helpers ---
function b64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function b64urlDecode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString('utf8');
}

// --- Allowed redirect URIs (update these to match Twitter app config) ---
const ALLOWED_REDIRECTS = [
  'https://backlinkoo.com/.netlify/functions/twitter-auth-callback',
  'https://backlinkoo.netlify.app/.netlify/functions/twitter-auth-callback',
  'http://localhost:3000/.netlify/functions/twitter-auth-callback',
  'http://localhost:3001/.netlify/functions/twitter-auth-callback'
];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { state, redirect_uri, scope } = body;

    const clientId = process.env.TWITTER_CLIENT_ID;
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const signSecret =
      process.env.TWITTER_CLIENT_SECRET || 'local-dev-secret';

    if (!clientId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing TWITTER_CLIENT_ID env' })
      };
    }
    if (!redirect_uri) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing redirect_uri' })
      };
    }
    if (!state) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing state' })
      };
    }

    // ✅ Validate redirect URI
    if (!ALLOWED_REDIRECTS.includes(redirect_uri)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid redirect_uri' })
      };
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false }
    });

    // Decode client-provided state safely
    let userId = null;
    let appRedirect = '';
    try {
      const decoded = JSON.parse(b64urlDecode(state));
      userId = decoded?.uid || null;
      appRedirect = decoded?.redirect || '';
    } catch (e) {
      console.error('State decode failed:', e);
    }

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid state' })
      };
    }

    // PKCE
    const codeVerifier = crypto.randomBytes(64).toString('hex');
    const challenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Build signed state payload
    const payload = {
      v: 1,
      uid: userId,
      ru: redirect_uri,
      redirect: appRedirect,
      ts: Date.now(),
      cv: codeVerifier
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto
      .createHmac('sha256', String(signSecret))
      .update(payloadStr)
      .digest('hex');
    const signedState = b64url(JSON.stringify({ p: payload, s: sig }));

    // Persist state (best effort)
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await supabase
        .from('twitter_oauth_states')
        .upsert(
          {
            state: signedState,
            user_id: userId,
            code_verifier: codeVerifier,
            redirect_uri,
            expires_at: expiresAt
          },
          { onConflict: 'state' }
        );
    } catch (e) {
      console.warn(
        'twitter_oauth_states upsert failed (non-fatal):',
        e?.message || e
      );
    }

    // Scopes
    const scopes =
      (scope || 'tweet.read tweet.write users.read offline.access')
        .split(/\s+/)
        .join(' ');

    // Auth URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri,
      scope: scopes,
      state: signedState,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `https://x.com/i/oauth2/authorize?${params.toString()}`;
    console.log('Generated authUrl:', authUrl);

    return { statusCode: 200, headers, body: JSON.stringify({ authUrl }) };
  } catch (error) {
    console.error('twitter-auth-start error', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal error' })
    };
  }
};
