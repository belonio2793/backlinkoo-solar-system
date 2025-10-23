const {
  MAX_OUTPUT_TOKENS,
  buildHeaders,
  callXAI,
  checkDailyLimit,
  getClientIp,
  isUserPremium,
  normalizeRemaining,
  resolveUserFromToken,
  parseNumeric
} = require('./_shared/keywordResearchUtils');

function extractArrayFromAi(raw) {
  if (!raw) return null;
  let text = String(raw);
  const fenced = text.match(/```(?:json)?([\s\S]*?)```/i);
  if (fenced) {
    text = fenced[1].trim();
  } else {
    text = text.trim();
  }

  const candidates = new Set();
  if (text) candidates.add(text);
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) candidates.add(arrayMatch[0]);

  for (const snippet of candidates) {
    try {
      const parsed = JSON.parse(snippet);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        const keys = ['results', 'data', 'keywords', 'items', 'entries', 'rows', 'output'];
        for (const key of keys) {
          if (Array.isArray(parsed[key])) return parsed[key];
        }
        const objectValues = Object.values(parsed).filter((v) => v && typeof v === 'object');
        if (objectValues.length && objectValues.every((v) => !Array.isArray(v) ? typeof v === 'object' : true)) {
          const flattened = objectValues.map((v) => Array.isArray(v) ? v : [v]).flat();
          if (flattened.every((v) => v && typeof v === 'object')) {
            return flattened.slice(0, 200);
          }
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

exports.handler = async (event, context) => {
  const headers = buildHeaders();
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const rawUrl = String(body.url || '').trim();
    if (!rawUrl) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'URL is required' }) };

    const ip = getClientIp(event, context);
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const user = await resolveUserFromToken(authHeader);
    const premium = await isUserPremium(user);
    const identifier = user?.id || ip;

    const rate = await checkDailyLimit(identifier, premium);
    if (!rate.allowed) return { statusCode: 429, headers, body: JSON.stringify({ success: false, error: 'Daily limit reached', code: 'limit_reached', remaining: 0, premium }) };

    // Build prompt asking X_API to search Google for the URL and return keywords and positions in strict JSON
    const prompt = `Find the provided URL: ${rawUrl} on Google search results. For any search queries where this URL appears in the organic results, produce a JSON array (no commentary) where each element is an object with keys:\n- keyword (the search term/query)\n- ranking_position (integer position the URL ranks at, 1..100; use null if not exact)\n- ranking_page (the full URL that matched)\n- ranking_page_number (SERP page number, integer; 1..10)\n- monthly_searches (integer estimate of monthly search volume for the keyword, optional)\n- traffic_estimate (integer estimate of monthly visitors from that position, optional)\n- difficulty (text label: easy|medium|hard|very hard, optional)\n- top_competitors (array of up to 10 competitor URLs for the keyword, optional)\n- notes (short string with any clarifying notes, optional)\nOnly return valid JSON. Limit to at most 200 entries. Ensure numbers are numeric where possible.`;

    const aiResp = await callXAI({ prompt, maxTokens: 1200, system: 'You are a web search and SEO analyst. Respond ONLY with valid JSON matching the requested schema.' });

    const remaining = normalizeRemaining(rate.remaining);

    if (!aiResp) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'No response from AI provider', premium, remaining }) };
    }

    let rows = extractArrayFromAi(aiResp);

    if (!rows) {
      try {
        rows = JSON.parse(aiResp);
      } catch {}
    }

    if (!Array.isArray(rows)) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'AI returned unexpected format', raw: aiResp, premium, remaining }) };
    }

    // Normalize rows into expected shape
    const normalized = rows.slice(0, 200).map((r, i) => {
      const keyword = typeof r?.keyword === 'string' ? r.keyword.trim() : (typeof r?.search_term === 'string' ? r.search_term.trim() : '');
      const ranking_position = typeof r?.ranking_position === 'number' ? Math.max(0, Math.round(r.ranking_position)) : (r?.position ? parseInt(r.position, 10) || null : null);
      const ranking_page = typeof r?.ranking_page === 'string' ? r.ranking_page.trim() : (typeof r?.ranking_url === 'string' ? r.ranking_url.trim() : null);
      const ranking_page_number = typeof r?.ranking_page_number === 'number' ? Math.max(1, Math.round(r.ranking_page_number)) : (r?.page_number ? parseInt(r.page_number, 10) || null : null);
      const monthly_searches = typeof r?.monthly_searches === 'number' ? Math.max(0, Math.round(r.monthly_searches)) : (r?.search_volume ? parseInt(r.search_volume, 10) || parseNumeric(r.search_volume) : null);
      const traffic_estimate = typeof r?.traffic_estimate === 'number' ? Math.max(0, Math.round(r.traffic_estimate)) : (r?.traffic ? parseInt(r.traffic, 10) || parseNumeric(r.traffic) : null);
      const difficulty = typeof r?.difficulty === 'string' ? r.difficulty.trim().toLowerCase() : null;
      const top_competitors = Array.isArray(r?.top_competitors) ? r.top_competitors.map((t) => (typeof t === 'string' ? t.trim() : (typeof t?.url === 'string' ? t.url.trim() : ''))).filter(Boolean).slice(0,10) : (typeof r?.top_competitors === 'string' ? r.top_competitors.split(/,|\n/).map(s=>s.trim()).filter(Boolean).slice(0,10) : []);
      const notes = typeof r?.notes === 'string' ? r.notes.trim() : (typeof r?.note === 'string' ? r.note.trim() : null);
      return {
        keyword: keyword || (`keyword_${i+1}`),
        ranking_position: Number.isFinite(ranking_position) ? ranking_position : null,
        ranking_page: ranking_page || null,
        ranking_page_number: Number.isFinite(ranking_page_number) ? ranking_page_number : null,
        monthly_searches: Number.isFinite(monthly_searches) ? monthly_searches : null,
        traffic_estimate: Number.isFinite(traffic_estimate) ? traffic_estimate : null,
        difficulty: difficulty || null,
        top_competitors: top_competitors.length ? top_competitors : null,
        notes: notes || null,
      };
    }).filter(Boolean);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, rows: normalized, premium, remaining, raw: aiResp }) };

  } catch (err) {
    console.error('homeranktrackerPremiumrankingkeywords error:', err?.stack || err);
    return { statusCode: 500, headers: buildHeaders(), body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
