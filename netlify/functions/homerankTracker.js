const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://dfhanacsmsvvkpunurnp.supabase.co';

const DAILY_FREE_LIMIT = 5;
const MAX_OUTPUT_TOKENS = 128;

const dailyLimits = new Map();
let adminClient = null;

function getAdminClient() {
  if (adminClient) return adminClient;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  adminClient = createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false } });
  return adminClient;
}

function hasPremiumMetadata(user) {
  if (!user) return false;
  const meta = user.user_metadata || {};
  if (meta?.user_role === 'premium') return true;
  if (typeof meta?.user_role === 'object' && meta.user_role?.premium) return true;
  if (meta?.user_subscription === 'premium') return true;
  if (typeof meta?.user_subscription === 'object' && meta.user_subscription?.premium) return true;
  if (meta?.subscription_tier === 'premium' || meta?.subscription_tier === 'monthly') return true;
  if (Array.isArray(meta?.roles) && meta.roles.includes('premium')) return true;
  if (Array.isArray(meta?.plans) && meta.plans.includes('premium')) return true;
  if (user.app_metadata?.claims?.premium === true) return true;
  return false;
}

function getClientIp(event, context) {
  return (
    (event.headers && (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || event.headers['cf-connecting-ip'])) ||
    context?.identity?.sourceIp ||
    'unknown'
  ).toString().split(',')[0].trim();
}

function todayKey(id) {
  const d = new Date();
  const day = d.toISOString().slice(0, 10);
  return `${day}:${id}`;
}

async function resolveUserFromToken(authHeader) {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.replace('Bearer ', '');
    const admin = getAdminClient();
    if (!admin) return null;
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

async function isUserPremium(user) {
  if (!user) return false;
  if (hasPremiumMetadata(user)) return true;

  try {
    const admin = getAdminClient();
    if (!admin) return false;

    const userId = user.id;

    const { data: profile } = await admin
      .from('profiles')
      .select('subscription_tier, role')
      .eq('user_id', userId)
      .single();
    if (profile && (profile.subscription_tier === 'premium' || profile.subscription_tier === 'monthly' || profile.role === 'premium')) {
      return true;
    }

    const { data: sub } = await admin
      .from('premium_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .limit(1)
      .maybeSingle();

    return !!sub;
  } catch {
    return false;
  }
}

async function checkDailyLimit(identifier, isPremium) {
  if (isPremium) return { allowed: true, remaining: Infinity };
  const admin = getAdminClient();
  if (!admin || !SUPABASE_URL) {
    const key = todayKey(identifier);
    const used = dailyLimits.get(key) || 0;
    if (used >= DAILY_FREE_LIMIT) return { allowed: false, remaining: 0 };
    dailyLimits.set(key, used + 1);
    return { allowed: true, remaining: DAILY_FREE_LIMIT - (used + 1) };
  }
  const day = new Date().toISOString().slice(0, 10);
  try {
    const { data: existing, error: selErr } = await admin
      .from('daily_limits')
      .select('count')
      .eq('identifier', identifier)
      .eq('day', day)
      .maybeSingle();
    if (selErr && selErr.code !== 'PGRST116') {
      console.error('daily_limits select error:', selErr);
      // Fallback to in-memory if table missing or other error
      const key = todayKey(identifier);
      const used = dailyLimits.get(key) || 0;
      if (used >= DAILY_FREE_LIMIT) return { allowed: false, remaining: 0 };
      dailyLimits.set(key, used + 1);
      return { allowed: true, remaining: DAILY_FREE_LIMIT - (used + 1) };
    }
    const used = existing?.count || 0;
    if (used >= DAILY_FREE_LIMIT) return { allowed: false, remaining: 0 };
    if (existing) {
      const { error: updErr } = await admin
        .from('daily_limits')
        .update({ count: used + 1 })
        .eq('identifier', identifier)
        .eq('day', day);
      if (updErr) console.error('daily_limits update error:', updErr);
    } else {
      const { error: insErr } = await admin
        .from('daily_limits')
        .insert({ identifier, day, count: 1 });
      if (insErr) console.error('daily_limits insert error:', insErr);
    }
    return { allowed: true, remaining: DAILY_FREE_LIMIT - (used + 1) };
  } catch (err) {
    console.error('daily limit check error:', err);
    return { allowed: false, remaining: 0 };
  }
}

function wordsToNumber(str) {
  if (!str) return null;
  const s = String(str).toLowerCase().replace(/[-–—]/g, ' ');
  const units = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9 };
  const teens = { ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19 };
  const tens = { twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90 };
  const ordinals = { first:1, second:2, third:3, fourth:4, fifth:5, sixth:6, seventh:7, eighth:8, ninth:9, tenth:10, eleventh:11, twelfth:12, thirteenth:13, fourteenth:14, fifteenth:15, sixteenth:16, seventeenth:17, eighteenth:18, nineteenth:19, twentieth:20, thirtieth:30, fortieth:40, fiftieth:50, sixtieth:60, seventieth:70, eightieth:80, ninetieth:90 };
  const scales = { hundred:100, thousand:1000, million:1_000_000, billion:1_000_000_000 };

  let total = 0; let current = 0; let inDecimal = false; let decimalStr = '';
  const tokens = s.split(/[^a-z0-9\.]+/).filter(Boolean);
  if (tokens.length === 0) return null;

  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i];
    if (w in ordinals) { current += ordinals[w]; continue; }
    if (w === 'point') { inDecimal = true; continue; }
    if (inDecimal) {
      if (w in units) decimalStr += String(units[w]);
      else if (/^\d+$/.test(w)) decimalStr += w;
      else break;
      continue;
    }
    if (w in units) { current += units[w]; continue; }
    if (w in teens) { current += teens[w]; continue; }
    if (w in tens) { current += tens[w]; continue; }
    if (w === 'hundred') { if (current === 0) current = 1; current *= scales[w]; continue; }
    if (w in scales && w !== 'hundred') { total += (current === 0 ? 1 : current) * scales[w]; current = 0; continue; }
    if (/^\d+(?:\.\d+)?$/.test(w)) { current += Number(w); continue; }
  }
  let result = total + current;
  if (decimalStr) { result += Number('0.' + decimalStr); }
  if (!Number.isFinite(result)) return null;
  return Math.round(result);
}

function parseRanking(raw) {
  if (!raw) return { page: null, position: null, numeric: null };
  const safe = String(raw);

  function extractNear(word) {
    const re = new RegExp(`${word}\\s+(?:is\\s+|about\\s+|approximately\\s+|around\\s+)?(#?\\d+|[a-z-]+)`, 'i');
    const m = safe.match(re);
    if (!m) return null;
    const token = m[1];
    if (/^#?\d+$/.test(token)) return Number(token.replace('#',''));
    const wn = wordsToNumber(token);
    return wn != null ? wn : null;
  }

  let page = extractNear('page');
  let position = extractNear('position');
  if (position == null) {
    const m = safe.match(/rank\s*(?:#|:)?\s*(\d+|[a-z-]+)/i);
    if (m) {
      position = /^\d+$/.test(m[1]) ? Number(m[1]) : wordsToNumber(m[1]);
    }
  }
  if (page == null) {
    const firstPage = safe.match(/(first|second|third|fourth|fifth)\s+page/i);
    if (firstPage) page = wordsToNumber(firstPage[1]);
  }

  // Fallback to any number (digits or words)
  let numeric = null;
  if (Number.isFinite(position)) numeric = position;
  else if (Number.isFinite(page)) numeric = page;
  else {
    const digits = safe.match(/\d+/);
    if (digits) numeric = Number(digits[0]);
    if (numeric == null) {
      const words = safe.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/i);
      if (words) numeric = wordsToNumber(words[0]);
    }
  }

  return {
    page: Number.isFinite(page) ? page : null,
    position: Number.isFinite(position) ? position : null,
    numeric: Number.isFinite(numeric) ? numeric : null,
  };
}

function sanitizeUrl(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  try {
    const normalized = new URL(trimmed);
    if (!['http:', 'https:'].includes(normalized.protocol)) return null;
    return normalized.toString();
  } catch {
    try {
      const attempt = new URL(`https://${trimmed}`);
      if (!['http:', 'https:'].includes(attempt.protocol)) return null;
      return attempt.toString();
    } catch {
      return null;
    }
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const keyword = String(body.keyword || '').trim().slice(0, 160);
    const url = sanitizeUrl(body.url);

    if (!keyword) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Keyword is required' }) };
    }
    if (!url) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'A valid URL is required' }) };
    }

    const ip = getClientIp(event, context);
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const user = await resolveUserFromToken(authHeader);
    const premium = await isUserPremium(user);
    const identifier = user?.id || ip;

    const rate = await checkDailyLimit(identifier, premium);
    if (!rate.allowed) {
      return { statusCode: 429, headers, body: JSON.stringify({ success: false, error: 'Daily limit reached', code: 'limit_reached', remaining: 0, premium }) };
    }

    let rawText = (body.raw || body.text || '').toString().trim();

    async function callXAI(prompt, maxTokens = MAX_OUTPUT_TOKENS) {
      const apiKey = process.env.X_API;
      const endpoint = process.env.XAI_ENDPOINT || 'https://api.x.ai/v1/chat/completions';
      if (!apiKey) return null;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.XAI_MODEL || 'grok-2-latest',
            messages: [
              {
                role: 'system',
                content: 'You analyze search rankings. Respond with the exact ranking details requested without extra commentary.'
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: maxTokens
          })
        });
        const rawBody = await response.text().catch(() => '');
        if (!response.ok) {
          console.error('X_API call failed:', response.status, rawBody);
          return null;
        }
        try {
          const parsed = JSON.parse(rawBody);
          const content = parsed?.choices?.[0]?.message?.content;
          if (typeof content === 'string' && content.trim()) return content.trim();
        } catch {}
        return rawBody.trim();
      } catch (error) {
        console.error('X_API call error:', error);
        return null;
      }
    }

    if (!rawText) {
      const prompt = `Based on my URL: "${url}" and any or all of the pages that I've built what page on Google can someone find my website when someone searches for "${keyword}. Respond with the exact page and ranking position.`;
      const aiResp = await callXAI(prompt);
      if (aiResp) {
        const formatted = aiResp.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
        const { page, position, numeric } = parseRanking(formatted);
        const remaining = rate.remaining === Infinity ? 'unlimited' : rate.remaining;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            formatted: (position != null || page != null)
              ? [
                  position != null ? `Position: ${position}` : null,
                  page != null ? `Page: ${page}` : null,
                ].filter(Boolean).join(' · ')
              : formatted,
            page,
            position,
            numeric,
            premium,
            remaining,
            raw: formatted,
          }),
        };
      }
    }

    const formatted = rawText.split('\n').map((line) => line.trim()).filter(Boolean).join('\n');
    const { page, position, numeric } = parseRanking(formatted);
    const remaining = rate.remaining === Infinity ? 'unlimited' : rate.remaining;

    const summary = [
      position != null ? `Position: ${position}` : null,
      page != null ? `Page: ${page}` : null,
    ].filter(Boolean).join(' · ');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        formatted: summary || formatted,
        page,
        position,
        numeric,
        premium,
        remaining,
        raw: formatted,
      }),
    };
  } catch (err) {
    console.error('homerankTracker error:', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
