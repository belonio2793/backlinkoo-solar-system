const {
  buildHeaders,
  callXAI,
  checkDailyLimit,
  getClientIp,
  isUserPremium,
  normalizeRemaining,
  resolveUserFromToken,
} = require('./_shared/keywordResearchUtils');
const { parseKeywordList } = require('./_shared/keywordListParser');

const MAX_LIST_TOKENS = 640;

function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return null;
  let trimmed = input.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  try {
    const url = new URL(trimmed);
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

exports.handler = async (event, context) => {
  const headers = buildHeaders();

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const urlInput = String(body.url || body.target || '').trim();
    if (!urlInput) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'URL is required' }) };
    }

    const normalizedUrl = normalizeUrl(urlInput);
    if (!normalizedUrl) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'URL is invalid' }) };
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

    const system = 'You are a keyword research assistant. Always respond with valid JSON that matches this schema: {"keywords":[{"keyword":string,"searchVolume":number|null,"difficulty":number|null,"notes":string|null,"intent":string|null}]} . Do not include any explanation or markdown.';
    const prompt = `Based on the business, content, and offerings found at ${normalizedUrl}, provide a list of 8 to 12 highly relevant keyword opportunities. Include their estimated global monthly search volumes and competition difficulty from 0 (easy) to 100 (hard). Use null when data is unclear.`;

    const aiResp = await callXAI({
      system,
      prompt,
      maxTokens: MAX_LIST_TOKENS,
      temperature: 0.25,
    });

    if (!aiResp) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'MODEL_UNAVAILABLE',
          keywords: [],
          premium,
          remaining: normalizeRemaining(rate.remaining),
          raw: '',
        }),
      };
    }

    const { keywords } = parseKeywordList(aiResp);
    if (keywords.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'PARSE_FAILED',
          keywords: [],
          premium,
          remaining: normalizeRemaining(rate.remaining),
          raw: aiResp,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        premium,
        remaining: normalizeRemaining(rate.remaining),
        keywords,
        raw: aiResp,
        metadata: {
          url: normalizedUrl,
          generatedAt: new Date().toISOString(),
          source: 'url',
        },
      }),
    };
  } catch (err) {
    console.error('homeurlKeywordresearch error:', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
