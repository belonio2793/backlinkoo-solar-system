/*
  generate-rapid-indexer-content
  Generates long-form SEO sections for the Rapid Link Indexer page using server-side X_API (xAI).
  POST body: { topic?: string, keyword?: string, intent?: string, avoid_headings?: string[], target_words?: number }
  Returns: { ok, content (markdown), word_count, usage }
*/

const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersBase, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }
  try {
    const apiKey = process.env.X_API;
    if (!apiKey) {
      return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Server not configured (missing X_API)' }) };
    }

    const body = (() => { try { return JSON.parse(event.body || '{}'); } catch { return {}; } })();
    const topic = (body.topic || 'Rapid Link Indexer — complete guide').toString();
    const keyword = (body.keyword || 'rapid link indexer').toString();
    const intent = (body.intent || 'evergreen SEO landing page with product-led education').toString();
    const avoid = Array.isArray(body.avoid_headings) ? body.avoid_headings.map(s=>String(s)) : [];
    const targetWords = Math.max(600, Math.min(1800, Number(body.target_words) || 1200));

    const doNotRepeat = avoid.length ? `Avoid repeating these headings or their exact phrasing: ${avoid.map(h=>`"${h}"`).join(', ')}.` : '';

    const messages = [
      { role: 'system', content: 'You are a senior SEO copywriter. Output valid Markdown only. Use H2/H3 headings, short paragraphs, skimmable bullets. No code fences.' },
      { role: 'user', content: `Write a new long-form section (approximately ${targetWords} words) that fits into a premium landing page targeting the keyword "${keyword}".\n\nTopic: ${topic}\nSearch Intent: ${intent}\n${doNotRepeat}\n\nRules:\n- Write in professional, confident tone.\n- Use compact paragraphs (2–4 sentences each).\n- Prefer lists, tables, and callouts where appropriate (in markdown).\n- Add semantically-related keywords for "${keyword}" naturally (indexing, backlinks, Google crawling, pay-for-performance indexing).\n- Do not include a top-level H1; start at H2 and below.\n- Do not include external links.\n- Do not add a conclusion; this is one section of a very long page.` }
    ];

    const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-2-latest',
        messages,
        temperature: 0.6,
        max_tokens: 3000
      })
    });

    const text = await upstream.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    if (!upstream.ok) {
      const err = json && json.error ? json.error : text;
      return { statusCode: upstream.status || 500, headers: headersBase, body: JSON.stringify({ ok: false, error: typeof err === 'string' ? err : (err?.message || 'Upstream error') }) };
    }

    const content = (json?.choices?.[0]?.message?.content || '').replace(/```[a-zA-Z]*\n?|```/g, '').trim();
    const words = countWords(content);

    return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, content, word_count: words, usage: json?.usage || null }) };
  } catch (e) {
    return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: e?.message || String(e) }) };
  }
}
