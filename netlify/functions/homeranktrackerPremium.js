const {
  buildHeaders,
  callXAI,
  checkDailyLimit,
  getClientIp,
  isUserPremium,
  normalizeRemaining,
  parseNumeric,
  resolveUserFromToken,
} = require('./_shared/keywordResearchUtils');

const MAX_KEYWORDS_PER_REQUEST = 5;

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

function toKeywords(body) {
  const list = [];
  const add = (value) => {
    if (!value) return;
    const trimmed = String(value).trim();
    if (!trimmed) return;
    if (!list.includes(trimmed)) list.push(trimmed);
  };
  if (Array.isArray(body?.keywords)) body.keywords.forEach(add);
  add(body?.keyword);
  return list.slice(0, MAX_KEYWORDS_PER_REQUEST);
}

function normalizeDifficulty(raw) {
  if (!raw) return null;
  const txt = String(raw).toLowerCase();
  if (txt.includes('very')) return 'very hard';
  if (txt.includes('hard') && !txt.includes('very')) return 'hard';
  if (txt.includes('medium') || txt.includes('moderate')) return 'medium';
  if (txt.includes('easy') || txt.includes('low')) return 'easy';
  return null;
}

function normalizeCompetitors(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (!entry) return null;
        if (typeof entry === 'string') return entry.trim();
        if (typeof entry === 'object' && entry.url) return String(entry.url).trim();
        if (typeof entry.link === 'string') return entry.link.trim();
        if (typeof entry.href === 'string') return entry.href.trim();
        return null;
      })
      .filter((url) => url);
  }
  if (typeof raw === 'string') {
    return raw
      .split(/\n|,/) // split on newline or comma
      .map((part) => part.trim())
      .filter((part) => part);
  }
  return [];
}

function dedupeCompetitors(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const deduped = [];
  for (const value of list) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(trimmed);
    if (deduped.length >= 10) break;
  }
  return deduped;
}

function normalizePosition(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(1, Math.round(raw));
  if (typeof raw === 'string') {
    const num = parseNumeric(raw);
    if (num != null) return Math.max(1, Math.round(num));
  }
  return null;
}

function normalizePageNumber(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(1, Math.min(20, Math.round(raw)));
  if (typeof raw === 'string') {
    const num = parseNumeric(raw);
    if (num != null) return Math.max(1, Math.min(20, Math.round(num)));
  }
  return null;
}

function normalizeNumber(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(0, Math.round(raw));
  if (typeof raw === 'string') {
    const num = parseNumeric(raw);
    if (num != null) return Math.max(0, Math.round(num));
  }
  return null;
}

function fallbackDailyVisitors(monthlySearches, provided) {
  if (provided != null) return provided;
  if (monthlySearches == null) return null;
  const daily = Math.round((monthlySearches * 0.32) / 30);
  return Math.max(0, daily);
}

function normalizeRankingPage(raw, baseUrl) {
  if (!raw) return null;
  try {
    const txt = String(raw).trim();
    if (!txt) return null;
    const parsed = new URL(txt, baseUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function extractJsonStructure(text) {
  if (!text) return null;
  const trimmed = String(text).trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {}
  const match = trimmed.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  return null;
}

async function fetchRankingData(url, keyword) {
  const prompt = `For the domain "${url}", determine where it currently ranks in Google's organic results for the keyword "${keyword}". Reply strictly as JSON with the fields: {"ranking_page": string|null, "ranking_position": number|null, "ranking_page_number": number|null, "difficulty": string|null}. If the site does not rank, set all fields to null and do not add commentary.`;
  const aiResp = await callXAI({
    prompt,
    maxTokens: 450,
    system: 'You are an SEO analyst returning only JSON data.',
    temperature: 0.1,
  });
  if (!aiResp) return null;
  const parsed = extractJsonStructure(aiResp);
  if (parsed && typeof parsed === 'object') {
    return {
      ranking_page: parsed.ranking_page ?? parsed.page ?? null,
      ranking_position: parsed.ranking_position ?? parsed.position ?? null,
      ranking_page_number: parsed.ranking_page_number ?? parsed.page_number ?? parsed.google_page ?? null,
      difficulty: parsed.difficulty ?? null,
    };
  }
  return null;
}

async function fetchTopCompetitors(keyword) {
  const prompt = `List the top ten organic Google result URLs for the keyword "${keyword}". Respond strictly as a JSON array of up to 10 URL strings ordered from rank 1 downward. Do not include explanations or additional keys.`;
  const aiResp = await callXAI({
    prompt,
    maxTokens: 600,
    system: 'You return only JSON arrays of URLs.',
    temperature: 0.1,
  });
  if (!aiResp) return null;
  const parsed = extractJsonStructure(aiResp);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.top_competitors)) return parsed.top_competitors;
  if (parsed && Array.isArray(parsed.competitors)) return parsed.competitors;
  if (parsed && Array.isArray(parsed.urls)) return parsed.urls;
  return null;
}

async function fetchMonthlySearchVolume(keyword) {
  const prompt = `Provide your best estimate of the global average monthly search volume for the keyword "${keyword}". Respond strictly as JSON: {"monthly_searches": number|null, "difficulty": string|null}. Use an integer for monthly_searches and set it to null only if no estimate is possible.`;
  const aiResp = await callXAI({
    prompt,
    maxTokens: 300,
    system: 'You provide concise numeric SEO metrics as JSON.',
    temperature: 0.1,
  });
  if (!aiResp) return null;
  const parsed = extractJsonStructure(aiResp);
  if (parsed && typeof parsed === 'object') {
    const monthly = parsed.monthly_searches ?? parsed.search_volume ?? parsed.volume ?? null;
    return {
      monthly_searches: monthly,
      difficulty: parsed.difficulty ?? parsed.competition ?? null,
    };
  }
  if (typeof parsed === 'number') {
    return { monthly_searches: parsed, difficulty: null };
  }
  return null;
}

async function fetchDailyVisitorsAndDifficulty(url, keyword, monthlySearches) {
  const volumeContext =
    monthlySearches != null
      ? `The estimated global monthly search volume is approximately ${monthlySearches}.`
      : 'If you do not know the monthly search volume, provide a realistic estimate before answering.';
  const prompt = `For the keyword "${keyword}" and the target website "${url}", ${volumeContext} Estimate the average daily visitors the site could receive if it ranked first on Google and provide a competition difficulty label ("easy", "medium", "hard", or "very hard"). Respond strictly as JSON: {"daily_visitors": number|null, "difficulty": "easy"|"medium"|"hard"|"very hard"}.`;
  const aiResp = await callXAI({
    prompt,
    maxTokens: 350,
    system: 'You are an SEO analyst returning JSON metrics only.',
    temperature: 0.1,
  });
  if (!aiResp) return null;
  const parsed = extractJsonStructure(aiResp);
  if (parsed && typeof parsed === 'object') {
    return {
      daily_visitors: parsed.daily_visitors ?? parsed.visitors ?? parsed.estimated_daily_visitors ?? null,
      difficulty: parsed.difficulty ?? parsed.competition ?? null,
    };
  }
  return null;
}

async function analyzeKeyword(url, keyword) {
  const [rankingRaw, competitorsRaw, monthlyRaw] = await Promise.all([
    fetchRankingData(url, keyword),
    fetchTopCompetitors(keyword),
    fetchMonthlySearchVolume(keyword),
  ]);
  const monthlyValue = normalizeNumber(
    monthlyRaw?.monthly_searches ?? monthlyRaw?.search_volume ?? monthlyRaw?.volume ?? monthlyRaw
  );
  const dailyRaw = await fetchDailyVisitorsAndDifficulty(url, keyword, monthlyValue);

  const rankingPage = normalizeRankingPage(rankingRaw?.ranking_page, url);
  const rankingPosition = normalizePosition(rankingRaw?.ranking_position);
  const rankingPageNumber = normalizePageNumber(rankingRaw?.ranking_page_number);
  const competitorSource = Array.isArray(competitorsRaw)
    ? competitorsRaw
    : Array.isArray(competitorsRaw?.top_competitors)
      ? competitorsRaw.top_competitors
      : Array.isArray(competitorsRaw?.competitors)
        ? competitorsRaw.competitors
        : Array.isArray(competitorsRaw?.urls)
          ? competitorsRaw.urls
          : competitorsRaw;
  const topCompetitors = dedupeCompetitors(normalizeCompetitors(competitorSource));
  const dailyVisitors = fallbackDailyVisitors(monthlyValue, normalizeNumber(dailyRaw?.daily_visitors));
  const difficulty = normalizeDifficulty(
    dailyRaw?.difficulty || rankingRaw?.difficulty || monthlyRaw?.difficulty
  );

  const hasData =
    Boolean(rankingPage) ||
    rankingPosition != null ||
    rankingPageNumber != null ||
    monthlyValue != null ||
    dailyVisitors != null ||
    (Array.isArray(topCompetitors) && topCompetitors.length > 0) ||
    Boolean(difficulty);

  if (!hasData) {
    return { keyword, error: 'no_data', raw: { rankingRaw, competitorsRaw, monthlyRaw, dailyRaw } };
  }

  return {
    keyword,
    ranking_page: rankingPage,
    ranking_position: rankingPosition,
    ranking_page_number: rankingPageNumber,
    monthly_searches: monthlyValue,
    daily_visitors: dailyVisitors,
    top_competitors: topCompetitors,
    difficulty,
    raw: { rankingRaw, competitorsRaw, monthlyRaw, dailyRaw },
  };
}

exports.handler = async (event, context) => {
  const headers = buildHeaders();
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const url = sanitizeUrl(body.url || body.siteUrl || body.targetUrl);
    const keywords = toKeywords(body);

    if (!url) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'A valid URL is required' }) };
    }
    if (!keywords.length) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'At least one keyword is required' }) };
    }

    const ip = getClientIp(event, context);
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const user = await resolveUserFromToken(authHeader);
    const premium = await isUserPremium(user);
    const identifier = user?.id || ip;

    const rate = await checkDailyLimit(identifier, premium);
    if (!rate.allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ success: false, error: 'Daily limit reached', code: 'limit_reached', remaining: 0, premium }),
      };
    }

    const rows = [];
    const errors = [];

    for (const keyword of keywords) {
      const result = await analyzeKeyword(url, keyword);
      if (result.error) {
        errors.push({ keyword, code: result.error, raw: result.raw || null });
      } else {
        rows.push(result);
      }
    }

    const remaining = normalizeRemaining(rate.remaining);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: rows.length > 0,
        rows,
        errors,
        premium,
        remaining,
      }),
    };
  } catch (err) {
    console.error('homeranktrackerPremium error:', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
