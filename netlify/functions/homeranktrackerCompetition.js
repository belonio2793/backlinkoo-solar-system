const {
  MAX_OUTPUT_TOKENS,
  buildHeaders,
  callXAI,
  checkDailyLimit,
  getClientIp,
  isUserPremium,
  normalizeRemaining,
  resolveUserFromToken,
} = require('./_shared/keywordResearchUtils');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const DAILY_FREE_LIMIT = 5;

exports.handler = async (event, context) => {
  const headers = buildHeaders();
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const keyword = String(body.keyword || '').trim().slice(0, 200);
    if (!keyword) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Keyword is required' }) };

    const ip = getClientIp(event, context);
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const user = await resolveUserFromToken(authHeader);
    const premium = await isUserPremium(user);
    const identifier = user?.id || ip;

    const rate = await checkDailyLimit(identifier, premium);
    if (!rate.allowed) return { statusCode: 429, headers, body: JSON.stringify({ success: false, error: 'Daily limit reached', code: 'limit_reached', remaining: 0, premium }) };

    // Prompt X_API to produce a strict JSON array of top 20 results with estimated backlinks & competition
    const prompt = `Provide the top 20 Google search results for the exact keyword: "${keyword}". Respond ONLY with a JSON array (no commentary). Each element must be an object with keys: position (1..20), url (full URL), domain, title (page title), estimated_backlinks (integer estimate of backlinks to that URL), competition (integer 0..100 where higher is more competitive). Ensure valid JSON output.`;

    const aiResp = await callXAI({ prompt, maxTokens: 1200, system: 'You are a search analyst. Return only valid JSON array as described.' });

    const remaining = normalizeRemaining(rate.remaining);

    if (!aiResp) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'No response from AI provider', premium, remaining }) };
    }

    let results = null;
    try {
      // Try parse directly
      results = JSON.parse(aiResp);
    } catch (err) {
      // Attempt to extract JSON substring
      const m = aiResp.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (m) {
        try { results = JSON.parse(m[0]); } catch (e) { results = null; }
      }
    }

    if (!Array.isArray(results)) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'AI returned unexpected format', raw: aiResp, premium, remaining }) };
    }

    // Normalize entries
    const normalized = results.slice(0, 20).map((r, i) => {
      const pos = typeof r?.position === 'number' && Number.isFinite(r.position) ? r.position : i + 1;
      const url = typeof r?.url === 'string' ? r.url.trim() : (r?.link || r?.href || '');
      const domain = typeof r?.domain === 'string' ? r.domain : (() => { try { return new URL(url).hostname.replace(/^www\./,''); } catch { return url; } })();
      const title = typeof r?.title === 'string' ? r.title : '';
      const estimated_backlinks = typeof r?.estimated_backlinks === 'number' && Number.isFinite(r.estimated_backlinks) ? Math.max(0, Math.round(r.estimated_backlinks)) : (typeof r?.backlinks === 'number' ? Math.max(0, Math.round(r.backlinks)) : null);
      const competition = typeof r?.competition === 'number' && Number.isFinite(r.competition) ? Math.max(0, Math.min(100, Math.round(r.competition))) : null;
      return { position: pos, url, domain, title, estimated_backlinks, competition };
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, results: normalized, premium, remaining, raw: aiResp }) };

  } catch (err) {
    console.error('homeranktrackerCompetition error:', err?.stack || err);
    return { statusCode: 500, headers: buildHeaders(), body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
