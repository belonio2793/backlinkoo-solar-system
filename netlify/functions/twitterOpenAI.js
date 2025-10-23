import { createClient } from '@supabase/supabase-js';

export const config = {
  schedule: '0 * * * *' // run hourly; function decides when to post per account
};

const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

function rand0to24h() {
  return Math.floor(Math.random() * 24 * 60 * 60 * 1000);
}

function nextWindowFromNow() {
  const base = 24 * 60 * 60 * 1000; // 24h
  return new Date(Date.now() + base + rand0to24h()).toISOString();
}

async function ensureTables(sb) {
  await sb.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.twitter_accounts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        twitter_user_id text NOT NULL,
        twitter_username text,
        access_token text NOT NULL,
        refresh_token text,
        token_expires_at timestamptz,
        last_tweet_at timestamptz,
        next_scheduled_at timestamptz,
        post_count integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(user_id),
        UNIQUE(twitter_user_id)
      );
      CREATE TABLE IF NOT EXISTS public.twitter_settings (
        user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        keyword text,
        enabled boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS public.twitter_tweets (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        twitter_user_id text NOT NULL,
        tweet_id text,
        content text NOT NULL,
        posted_at timestamptz,
        status text,
        error text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS public.twitter_oauth_states (
        state text PRIMARY KEY,
        user_id uuid,
        code_verifier text,
        redirect_uri text,
        expires_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      ALTER TABLE public.twitter_settings ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "own settings rw" ON public.twitter_settings;
      CREATE POLICY "own settings rw" ON public.twitter_settings FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "own settings insert" ON public.twitter_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "own settings update" ON public.twitter_settings FOR UPDATE USING (auth.uid() = user_id);
      ALTER TABLE public.twitter_accounts ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "own accounts select" ON public.twitter_accounts;
      DROP POLICY IF EXISTS "own accounts update" ON public.twitter_accounts;
      CREATE POLICY "own accounts select" ON public.twitter_accounts FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "own accounts update" ON public.twitter_accounts FOR UPDATE USING (auth.uid() = user_id);
    `
  });
}

async function refreshTokenIfNeeded(account) {
  if (!account?.refresh_token || !account?.token_expires_at) return account;
  const exp = new Date(account.token_expires_at).getTime();
  if (Date.now() < exp - 60_000) return account; // 1min early refresh window

  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: account.refresh_token });
  const tokenRes = await fetch('https://api.x.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  });
  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(`Refresh failed: ${JSON.stringify(tokenJson)}`);
  return {
    ...account,
    access_token: tokenJson.access_token,
    refresh_token: tokenJson.refresh_token || account.refresh_token,
    token_expires_at: new Date(Date.now() + (tokenJson.expires_in || 7200) * 1000).toISOString()
  };
}

async function generateTweet(keyword) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');
  const prompt = `Write a tweet with the intent to be engaging, virality and contradiction about ${keyword} that's original but relevant or trending as a topic. Keep it under 260 characters. Avoid hashtags unless essential. Avoid emojis unless they add punch.`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write concise, punchy tweets that spark engagement and constructive disagreement.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 200
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${JSON.stringify(data)}`);
  let text = data.choices?.[0]?.message?.content?.trim() || '';
  if (text.length > 275) text = text.slice(0, 275);
  text = text.replace(/^"|"$/g, '').replace(/^`+|`+$/g, '').trim();
  return text;
}

async function postTweet(accessToken, text) {
  const res = await fetch('https://api.x.com/2/tweets', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: headersBase, body: '' };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sb = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  try {
    await ensureTables(sb);

    const body = event.httpMethod === 'POST' && event.body ? JSON.parse(event.body) : {};
    const action = body?.action || 'scheduled';

    if (action === 'ensure') {
      return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true }) };
    }

    if (action === 'run_now') {
      const userId = body?.user_id;
      if (!userId) return { statusCode: 400, headers: headersBase, body: JSON.stringify({ error: 'Missing user_id' }) };
      const { data: acc, error } = await sb.from('twitter_accounts').select('*').eq('user_id', userId).maybeSingle();
      if (error || !acc) return { statusCode: 400, headers: headersBase, body: JSON.stringify({ error: 'Account not connected' }) };
      const { data: settings } = await sb.from('twitter_settings').select('keyword, enabled').eq('user_id', userId).maybeSingle();
      const keyword = settings?.keyword || 'marketing';
      if (settings && settings.enabled === false) return { statusCode: 200, headers: headersBase, body: JSON.stringify({ message: 'Disabled' }) };
      const updated = await refreshTokenIfNeeded(acc);
      if (updated.access_token !== acc.access_token || updated.token_expires_at !== acc.token_expires_at || updated.refresh_token !== acc.refresh_token) {
        await sb.from('twitter_accounts').update({ access_token: updated.access_token, refresh_token: updated.refresh_token, token_expires_at: updated.token_expires_at }).eq('id', acc.id);
      }
      const tweet = await generateTweet(keyword);
      // Record generated tweet draft
      let genId = null;
      try {
        const { data: genData, error: genErr } = await sb.from('twitter_tweets').insert({ user_id: acc.user_id, twitter_user_id: acc.twitter_user_id, content: tweet, status: 'generated' }).select('id').maybeSingle();
        if (!genErr && genData) genId = genData.id;
      } catch (e) {
        console.warn('Failed to insert generated tweet record', e?.message || e);
      }

      const posted = await postTweet(updated.access_token, tweet);
      const tweetId = posted?.data?.id || null;
      const nowIso = new Date().toISOString();
      const nextAt = nextWindowFromNow();

      try {
        if (genId) {
          await sb.from('twitter_tweets').update({ tweet_id: tweetId, posted_at: nowIso, status: 'posted' }).eq('id', genId);
        } else {
          await sb.from('twitter_tweets').insert({ user_id: acc.user_id, twitter_user_id: acc.twitter_user_id, tweet_id: tweetId, content: tweet, posted_at: nowIso, status: 'posted' });
        }
      } catch (e) {
        console.warn('Failed to update/insert posted tweet record', e?.message || e);
      }

      await sb.from('twitter_accounts').update({ last_tweet_at: nowIso, next_scheduled_at: nextAt, post_count: (acc.post_count || 0) + 1 }).eq('id', acc.id);
      return { statusCode: 200, headers: headersBase, body: JSON.stringify({ message: 'Tweet posted', result: JSON.stringify({ tweet, tweetId, nextAt }) }) };
    }

    // Scheduled mode: find due accounts
    const { data: due } = await sb.rpc('exec_sql', { sql: `
      WITH due AS (
        SELECT a.* FROM public.twitter_accounts a
        JOIN public.twitter_settings s ON s.user_id = a.user_id AND COALESCE(s.enabled, true) = true
        WHERE (
          a.next_scheduled_at IS NULL
          OR a.next_scheduled_at <= now()
        )
      )
      SELECT id, user_id, twitter_user_id, twitter_username, access_token, refresh_token, token_expires_at, last_tweet_at, next_scheduled_at, post_count
      FROM due
      LIMIT 5; -- safety limit per run
    ` });

    const accounts = Array.isArray(due) ? due : [];
    const results = [];

    for (const acc of accounts) {
      try {
        const { data: settings } = await sb.from('twitter_settings').select('keyword').eq('user_id', acc.user_id).maybeSingle();
        const keyword = settings?.keyword || 'marketing';
        const updated = await refreshTokenIfNeeded(acc);
        if (updated.access_token !== acc.access_token || updated.token_expires_at !== acc.token_expires_at || updated.refresh_token !== acc.refresh_token) {
          await sb.from('twitter_accounts').update({ access_token: updated.access_token, refresh_token: updated.refresh_token, token_expires_at: updated.token_expires_at }).eq('id', acc.id);
        }
        const tweet = await generateTweet(keyword);
        // Insert generated draft record
        let genId = null;
        try {
          const { data: genData, error: genErr } = await sb.from('twitter_tweets').insert({ user_id: acc.user_id, twitter_user_id: acc.twitter_user_id, content: tweet, status: 'generated' }).select('id').maybeSingle();
          if (!genErr && genData) genId = genData.id;
        } catch (e) {
          console.warn('Failed to insert generated tweet record', e?.message || e);
        }

        const posted = await postTweet(updated.access_token, tweet);
        const tweetId = posted?.data?.id || null;
        const nowIso = new Date().toISOString();
        const nextAt = nextWindowFromNow();

        try {
          if (genId) {
            await sb.from('twitter_tweets').update({ tweet_id: tweetId, posted_at: nowIso, status: 'posted' }).eq('id', genId);
          } else {
            await sb.from('twitter_tweets').insert({ user_id: acc.user_id, twitter_user_id: acc.twitter_user_id, tweet_id: tweetId, content: tweet, posted_at: nowIso, status: 'posted' });
          }
        } catch (e) {
          console.warn('Failed to update/insert posted tweet record', e?.message || e);
        }

        await sb.from('twitter_accounts').update({ last_tweet_at: nowIso, next_scheduled_at: nextAt, post_count: (acc.post_count || 0) + 1 }).eq('id', acc.id);
        results.push({ user_id: acc.user_id, ok: true, tweetId, nextAt });
      } catch (e) {
        console.error('Tweeting failed for account', acc.id, e);
        await sb.from('twitter_tweets').insert({ user_id: acc.user_id, twitter_user_id: acc.twitter_user_id, content: '', posted_at: null, status: 'error', error: e?.message || String(e) });
        results.push({ user_id: acc.user_id, ok: false, error: e?.message || String(e) });
      }
    }

    return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, processed: results.length, results }) };
  } catch (error) {
    console.error('twitterOpenAI error', error);
    return { statusCode: 500, headers: headersBase, body: JSON.stringify({ error: error.message || 'Internal error' }) };
  }
};
