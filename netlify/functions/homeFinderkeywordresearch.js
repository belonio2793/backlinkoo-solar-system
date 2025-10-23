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
    const keyword = String(body.keyword || body.term || '').trim().slice(0, 120);
    if (!keyword) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Keyword is required' }) };
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
    const prompt = `Give me a list of 10 relevant keywords, search terms, or phrases closely related to "${keyword}". For each entry include the estimated global monthly search volume and a competition difficulty score from 0 (easy) to 100 (hard). Use null when you are unsure.`;

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
          keyword,
          generatedAt: new Date().toISOString(),
          source: 'keyword',
        },
      }),
    };
  } catch (err) {
    console.error('homeFinderkeywordresearch error:', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
