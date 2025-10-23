const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

async function callXAI(prompt, apiKeyOverride) {
  const apiKey = apiKeyOverride || process.env.X_API;
  if (!apiKey) return { provider: 'xai', success: false, error: 'Missing X_API' };
  const url = 'https://api.x.ai/v1/chat/completions';
  const body = {
    model: process.env.XAI_MODEL || 'grok-2-latest',
    messages: [
      { role: 'system', content: 'You are an expert SEO analyst and journalist. Produce original, factual content. Output valid HTML only with semantic headings, lists, and paragraphs.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.5,
    max_tokens: 3500
  };

  try {
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
    const content = json?.choices?.[0]?.message?.content || json?.choices?.[0]?.text || '';
    return { provider: 'xai', success: true, content, raw: json };
  } catch (e) {
    return { provider: 'xai', success: false, error: e?.message || String(e) };
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersBase, body: '' };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 400, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Use POST to generate content' }) };
    }

    const rawBody = typeof event.body === 'string' ? event.body.trim() : '';
    let body = {};
    if (rawBody) {
      try { body = JSON.parse(rawBody); } catch (e) { body = {}; }
    }

    const apiKeyOverride = body?.apiKey || body?.xai_key || body?.X_API;

    const prompts = [
      'Write a 2500-3000 word independent HTML analysis section about Page One Power focusing on methodology, prospecting, asset development, outreach sequencing, and placement verification. Output valid HTML with headings, lists, and paragraphs only.',
      'Write a 2500-3000 word independent HTML analysis section about editorial standards, domain vetting, anchor strategy, risk mitigation, and long-term link health for Page One Power. Output valid HTML with headings, lists, and paragraphs only.',
      'Write a 2500-3000 word independent HTML analysis section about case studies, performance measurement, KPIs, examples of successful outreach, and actionable playbooks for buyers working with Page One Power. Output valid HTML with headings, lists, and paragraphs only.',
      'Write a 2500-3000 word independent HTML analysis section about pricing models, contracting, SLAs, alternatives comparison, and an extended FAQ targeted at people searching for Page One Power. Output valid HTML with headings, lists, and paragraphs only.'
    ];

    const outputs = [];
    for (let i = 0; i < prompts.length; i++) {
      const p = prompts[i];
      const result = await callXAI(p, apiKeyOverride).catch(e => ({ provider: 'xai', success: false, error: e?.message || String(e) }));
      if (!result.success) {
        return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: result.error, part: i + 1 }) };
      }
      outputs.push(result.content || '');
    }

    const combined = outputs.join('\n<hr/>\n');
    return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, content: combined }) };
  } catch (e) {
    return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: e?.message || String(e) }) };
  }
}
