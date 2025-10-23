const fetch = globalThis.fetch || require('node-fetch');

exports.handler = async function (event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const json = (statusCode, payload) => ({
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const keyword = (body.keyword || body.kw || '').trim();

    if (!keyword) {
      return json(400, { error: 'Missing keyword' });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

    // Basic prompt - ask model to return a short plain text estimate like: "Between 30 and 200 referring domains (backlinks)"
    const prompt = `Provide a short, conservative estimate for the number of referring domains (backlinks) the top organic Google result for the keyword \"${keyword}\" is likely to have. Respond in one clear sentence or phrase like: \"Between 30 and 200 referring domains (backlinks)\". Do not include any extra commentary.`;

    let estimateText = `Unable to estimate backlinks for "${keyword}" right now.`;

    if (OPENAI_KEY) {
      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are a concise SEO assistant.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 120,
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
          if (content && String(content).trim()) {
            estimateText = String(content).trim();
          }
        } else {
          const txt = await resp.text().catch(() => '');
          console.error('OpenAI responded non-ok:', resp.status, txt);
        }
      } catch (e) {
        console.error('OpenAI call failed:', e?.message || e);
      }
    } else {
      // No OpenAI key - provide a conservative heuristic based on keyword length/complexity
      // This is intentionally simple: short generic fallback estimates
      const words = keyword.split(/\s+/).filter(Boolean).length;
      const baseMin = 20 + Math.min(200, words * 10);
      const baseMax = baseMin * 4;
      estimateText = `Between ${Math.round(baseMin)} and ${Math.round(baseMax)} referring domains (backlinks)`;
    }

    return json(200, { estimate_text: estimateText });
  } catch (err) {
    console.error('keywordrankEstimatedBacklinks error:', err);
    return json(500, { error: 'Internal error' });
  }
};
