/*
  xai-keywords
  Scheduled function + API endpoint
  - GET: returns cached trending keywords from admin_settings (setting_key = 'trending_keywords')
  - POST: runs provider (X_AI preferred) with provided prompt, parses top 10 keywords, caches to Supabase
  - Schedule: daily at 00:00 UTC
*/

const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

const config = { schedule: '0 0 * * *' };

async function getSupabaseAdmin() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { auth: { persistSession: false } });
  } catch (e) {
    return null;
  }
}

async function readCachedKeywords() {
  const sb = await getSupabaseAdmin();
  if (!sb) return { data: null, error: 'Supabase admin not configured' };
  const { data, error } = await sb
    .from('admin_settings')
    .select('*')
    .eq('setting_key', 'trending_keywords')
    .single();
  if (error && error.code !== 'PGRST116') return { data: null, error: error.message };
  if (!data) return { data: null, error: null };
  let value = null;
  try { value = JSON.parse(data.setting_value); } catch { value = data.setting_value; }
  return { data: value, error: null };
}

async function writeCachedKeywords(payload) {
  const sb = await getSupabaseAdmin();
  if (!sb) return { data: null, error: 'Supabase admin not configured' };
  const setting_value = JSON.stringify(payload);
  const { data, error } = await sb
    .from('admin_settings')
    .upsert({ setting_key: 'trending_keywords', setting_value, updated_at: new Date().toISOString() })
    .select('*')
    .single();
  return { data, error: error ? error.message : null };
}

function parseKeywords(text) {
  let raw = String(text || '').trim();
  if (!raw) return [];

  // Strip markdown code fences and language hints
  if (/```/.test(raw)) {
    raw = raw.replace(/^```[a-zA-Z]*\s*/i, '').replace(/```\s*$/i, '').trim();
  }
  raw = raw.replace(/^json\s*$/im, '').replace(/^```json\s*/im, '').trim();

  // If a JSON array exists anywhere, try to parse it
  const firstBracket = raw.indexOf('[');
  const lastBracket = raw.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const maybe = raw.slice(firstBracket, lastBracket + 1);
    try {
      const arr = JSON.parse(maybe);
      if (Array.isArray(arr)) return arr.map((v)=>String(v).trim()).filter(Boolean).slice(0, 10);
    } catch {}
  }

  try {
    const asJson = JSON.parse(raw);
    if (Array.isArray(asJson)) return asJson.map((v)=>String(v).trim()).filter(Boolean).slice(0, 10);
    if (Array.isArray(asJson.keywords)) return asJson.keywords.map((v)=>String(v).trim()).filter(Boolean).slice(0, 10);
  } catch {}

  const lines = raw
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(l => l.replace(/^[-*\d\.\)\s]+/, '').trim())
    .filter(Boolean)
    .map(l => l.replace(/^```[a-zA-Z]*\s*/i, '').replace(/```$/i, '').trim())
    .filter(l => !/^\[\s*$/.test(l) && !/^\]\s*$/.test(l) && !/^json$/i.test(l));

  const unique = [];
  for (const line of lines) {
    const clean = line.replace(/^[\[\]"'`\-\s]+|[\[\]"'`\s,]+$/g, '');
    if (clean && !unique.includes(clean)) unique.push(clean);
    if (unique.length >= 10) break;
  }
  return unique.slice(0, 10);
}

async function callXAI(prompt, apiKeyOverride) {
  const apiKey = apiKeyOverride || process.env.X_API;
  if (!apiKey) return { provider: 'xai', success: false, error: 'Missing X_API' };
  const url = 'https://api.x.ai/v1/chat/completions';
  const body = {
    model: process.env.XAI_MODEL || 'grok-2-latest',
    messages: [
      { role: 'system', content: 'You are an internet trends analyst. Return only the list of top long-tail keywords as plain text or JSON array.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 500
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    return { provider: 'xai', success: false, error: `HTTP ${res.status}: ${errText}` };
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content || '';
  return { provider: 'xai', success: true, content, raw: json };
}

async function runJob(_promptIgnored, apiKeyOverride) {
  // Use a fixed prompt for all runs
  const effectivePrompt = 'what are the top 10 long tail keywords that matches trends on the internet today';
  const tried = [];
  const result = await callXAI(effectivePrompt, apiKeyOverride).catch(e => ({ provider: 'xai', success: false, error: e?.message || String(e) }));
  tried.push({ provider: 'xai', ok: !!result?.success });
  if (!result?.success) return { ok: false, error: result?.error || 'AI call failed', tried };
  const keywords = parseKeywords(result.content);
  const payload = {
    keywords,
    last_updated: new Date().toISOString(),
    provider: result.provider,
    prompt: effectivePrompt
  };
  const { error: cacheError } = await writeCachedKeywords(payload);
  return { ok: true, data: payload, cacheError, tried };
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersBase, body: '' };
  }

  try {
    // Scheduled invocation: Netlify sets event to not include httpMethod or uses cron context
    const isCron = !event.httpMethod || (event.httpMethod === 'POST' && event.headers['x-nf-schedule']);

    if (event.httpMethod === 'GET') {
      const { data, error } = await readCachedKeywords();
      if (error) return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, cached: null, warning: error }) };
      return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, cached: data || null }) };
    }

    if (event.httpMethod === 'POST' || isCron) {
      const rawBody = typeof event.body === 'string' ? event.body.trim() : '';
      let body = {};
      if (rawBody) {
        try {
          body = JSON.parse(rawBody);
        } catch (parseError) {
          return {
            statusCode: 400,
            headers: headersBase,
            body: JSON.stringify({ ok: false, error: 'Invalid JSON body', details: String(parseError?.message || parseError) })
          };
        }
      }
      const prompt = body?.prompt;
      const apiKeyOverride = body?.apiKey || body?.xai_key || body?.X_API;
      const result = await runJob(prompt, apiKeyOverride);
      const status = result.ok ? 200 : 500;
      return { statusCode: status, headers: headersBase, body: JSON.stringify(result) };
    }

    return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, message: 'Use GET for cached data or POST to run job.' }) };
  } catch (e) {
    return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: e?.message || String(e) }) };
  }
};

exports.config = config;
