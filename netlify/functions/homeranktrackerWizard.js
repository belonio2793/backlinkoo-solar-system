const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://dfhanacsmsvvkpunurnp.supabase.co';

const DAILY_FREE_LIMIT = 3; // Wizard: 3 free/day
const MAX_OUTPUT_TOKENS = Number(process.env.XAI_MAX_TOKENS || 2048);

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
      console.error('daily_limits select error (wizard):', selErr);
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
      if (updErr) console.error('daily_limits update error (wizard):', updErr);
    } else {
      const { error: insErr } = await admin
        .from('daily_limits')
        .insert({ identifier, day, count: 1 });
      if (insErr) console.error('daily_limits insert error (wizard):', insErr);
    }
    return { allowed: true, remaining: DAILY_FREE_LIMIT - (used + 1) };
  } catch (err) {
    console.error('daily limit check error (wizard):', err);
    return { allowed: false, remaining: 0 };
  }
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
    const rawUrl = body.url || body.target || body.page || '';
    const url = sanitizeUrl(rawUrl);

    if (!url) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'A valid URL is required' }) };
    }

    const ip = getClientIp(event, context);
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const user = await resolveUserFromToken(authHeader);
    const premium = await isUserPremium(user);
    // Namespace identifier so limits are separate from other tools
    const identifier = (user?.id || ip) + ':wiz';

    const rate = await checkDailyLimit(identifier, premium);
    if (!rate.allowed) {
      return { statusCode: 429, headers, body: JSON.stringify({ success: false, error: 'Daily limit reached', code: 'limit_reached', remaining: 0, premium }) };
    }

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
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: maxTokens
          })
        });
        const rawBody = await response.text().catch(() => '');
        if (!response.ok) {
          console.error('X_API call failed (wizard):', response.status, rawBody);
          return null;
        }
        try {
          const parsed = JSON.parse(rawBody);
          const content = parsed?.choices?.[0]?.message?.content;
          if (typeof content === 'string' && content.trim()) return content.trim();
        } catch {}
        return rawBody.trim();
      } catch (error) {
        console.error('X_API call error (wizard):', error);
        return null;
      }
    }

    const prompt = `Based on my URL: ${url}, find all of the keywords my domain is ranking for on search engines, the positions in search engines and put it in plain text. Find what keywords I could be targeting with and determine if they are easy, medium, or hard difficulty from a competition difficulty rating. PLus add search volumes and expected daily visitors for each keyword if my website showed up as the first result for each keyword. Response in plain text format, without using graphs and charts or special characters. Then add a subscribe to Backlink ∞ Premium for $29 a month for SEO automation.`;

    const aiResp = await callXAI(prompt);
    if (!aiResp) {
      return { statusCode: 502, headers, body: JSON.stringify({ success: false, error: 'Upstream AI service error' }) };
    }

    const remaining = rate.remaining === Infinity ? 'unlimited' : rate.remaining;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        premium,
        remaining,
        report: aiResp,
        url,
        prompt
      })
    };
  } catch (err) {
    console.error('homeranktrackerWizard error:', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
