const {
  MAX_OUTPUT_TOKENS,
  buildHeaders,
  callXAI,
  checkDailyLimit,
  getClientIp,
  isUserPremium,
  normalizeRemaining,
  parseNumeric,
  resolveUserFromToken,
} = require('./_shared/keywordResearchUtils');

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
    const keyword = String(body.keyword || '').trim().slice(0, 120);
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

    let raw = (body.raw || body.prompt || '').toString().trim();

    if (!raw) {
      const prompt = `Give me an estimate how many people are searching for ${keyword} across the entire internet for this phrase each month.`;
      const aiResp = await callXAI({
        prompt,
        maxTokens: MAX_OUTPUT_TOKENS,
        system: 'You are a keyword research assistant. Respond with the requested estimate or insight plainly without additional commentary.',
      });
      if (aiResp) {
        const est = parseNumeric(aiResp);
        const remaining = normalizeRemaining(rate.remaining);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            estimate: est,
            raw: String(aiResp),
            premium,
            remaining,
            formatted: typeof est === 'number' ? `Estimated monthly searches: ${Number(est).toLocaleString()}` : String(aiResp),
          }),
        };
      }
    }

    const estimate = parseNumeric(raw);
    const remaining = normalizeRemaining(rate.remaining);

    if (estimate == null) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, estimate: null, raw, premium, remaining, formatted: raw }),
      };
    }

    const formatted = `Estimated monthly searches: ${Number(estimate).toLocaleString()}`;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, estimate, raw, premium, remaining, formatted }),
    };
  } catch (err) {
    console.error('homekeywordResearch error:', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
