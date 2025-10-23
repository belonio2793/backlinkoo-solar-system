const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

const DAILY_FREE_LIMIT = 5;
const MAX_OUTPUT_TOKENS = 32;

const dailyLimits = new Map();

let adminClient = null;
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  if (adminClient) return adminClient;
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
      const key = todayKey(identifier);
      const used = dailyLimits.get(key) || 0;
      if (used >= DAILY_FREE_LIMIT) return { allowed: false, remaining: 0 };
      dailyLimits.set(key, used + 1);
      return { allowed: true, remaining: DAILY_FREE_LIMIT - (used + 1) };
    }
    const used = existing?.count || 0;
    if (used >= DAILY_FREE_LIMIT) {
      return { allowed: false, remaining: 0 };
    }
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

function buildHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
}

function wordsToNumber(str) {
  if (!str) return null;
  const s = String(str).toLowerCase().replace(/[-–—]/g, ' ');
  const units = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9 };
  const teens = { ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19 };
  const tens = { twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90 };
  const scales = { hundred:100, thousand:1_000, million:1_000_000, billion:1_000_000_000 };

  let total = 0; let current = 0; let inDecimal = false; let decimalStr = '';
  const tokens = s.split(/[^a-z0-9\.]+/).filter(Boolean);
  if (tokens.length === 0) return null;

  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i];
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
  return result;
}

function parseNumeric(text) {
  const safe = String(text || '');
  const suff = safe.match(/(\d[\d,]*\.?\d*)\s*(k|m|b|bn|thousand|million|billion)?/i);
  if (suff) {
    const num = parseFloat(suff[1].replace(/,/g, ''));
    if (Number.isFinite(num)) {
      let mult = 1;
      const s = (suff[2] || '').toLowerCase();
      if (s === 'k' || s === 'thousand') mult = 1_000;
      else if (s === 'm' || s === 'million') mult = 1_000_000;
      else if (s === 'b' || s === 'bn' || s === 'billion') mult = 1_000_000_000;
      const n = num * mult;
      if (Number.isFinite(n)) return Math.max(0, Math.min(Math.round(n), 10_000_000_000));
    }
  }
  const wn = wordsToNumber(safe);
  if (wn != null && Number.isFinite(wn)) return Math.max(0, Math.min(Math.round(wn), 10_000_000_000));
  const match = safe.match(/\d[\d,\.\s]*/);
  if (match) {
    const digits = match[0].replace(/[^0-9\.]/g, '');
    const n = Number(digits);
    if (Number.isFinite(n)) return Math.max(0, Math.min(Math.round(n), 10_000_000_000));
  }
  if (/\b(no|none|zero|0)\b/i.test(safe)) return 0;
  return null;
}

async function callXAI({ messages, prompt, maxTokens = MAX_OUTPUT_TOKENS, temperature = 0.2, system } = {}) {
  const apiKey = process.env.X_API;
  const endpoint = process.env.XAI_ENDPOINT || 'https://api.x.ai/v1/chat/completions';
  if (!apiKey) return null;
  const finalMessages = Array.isArray(messages) && messages.length > 0
    ? messages
    : [
        system
          ? { role: 'system', content: system }
          : {
              role: 'system',
              content: 'You are a keyword research assistant. Respond plainly with the requested data.'
            },
        { role: 'user', content: prompt }
      ];
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-2-latest',
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens
      })
    });
    const rawText = await response.text().catch(() => '');
    if (!response.ok) {
      console.error('X_API call failed:', response.status, rawText);
      return null;
    }
    try {
      const parsed = JSON.parse(rawText);
      const content = parsed?.choices?.[0]?.message?.content;
      if (typeof content === 'string' && content.trim()) return content.trim();
    } catch {}
    return rawText.trim();
  } catch (error) {
    console.error('X_API call error:', error);
    return null;
  }
}

function normalizeRemaining(remaining) {
  return remaining === Infinity ? 'unlimited' : remaining;
}

module.exports = {
  MAX_OUTPUT_TOKENS,
  buildHeaders,
  callXAI,
  checkDailyLimit,
  getClientIp,
  isUserPremium,
  normalizeRemaining,
  parseNumeric,
  resolveUserFromToken,
};
