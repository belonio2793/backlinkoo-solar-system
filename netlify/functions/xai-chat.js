/*
  xai-chat
  Whitelabeled chat proxy using server-side key from X_API.
  Exposes a simple POST endpoint that accepts { messages, temperature, max_tokens, model } and returns an assistant message.
  Does not disclose upstream provider in the response payload.
*/

const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersBase, body: '' };
  }

  if (event.httpMethod === 'GET') {
    // Health check without revealing provider
    const ok = !!process.env.X_API;
    return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok, status: ok ? 'ready' : 'not_configured' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  try {
    const apiKey = process.env.X_API;
    if (!apiKey) return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Server not configured' }) };

    const rawBody = typeof event.body === 'string' ? event.body : '';
    let body = {};
    if (rawBody) {
      try { body = JSON.parse(rawBody); } catch (e) {
        return { statusCode: 400, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Invalid JSON body' }) };
      }
    }

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const userMessage = typeof body?.message === 'string' ? body.message : null;

    // If a single message is provided, push it as the latest user entry
    const finalMessages = messages.slice(0);
    if (userMessage) finalMessages.push({ role: 'user', content: userMessage });

    if (!finalMessages.length) {
      return { statusCode: 400, headers: headersBase, body: JSON.stringify({ ok: false, error: 'No messages provided' }) };
    }

    const model = body?.model || process.env.XAI_MODEL || 'grok-2-latest';
    const temperature = typeof body?.temperature === 'number' ? body.temperature : 0.5;
    const max_tokens = typeof body?.max_tokens === 'number' ? body.max_tokens : 1024;

    const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages: finalMessages, temperature, max_tokens })
    });

    const text = await upstream.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* return raw text gracefully */ }

    if (!upstream.ok) {
      const err = json && json.error ? json.error : text;
      return { statusCode: upstream.status || 500, headers: headersBase, body: JSON.stringify({ ok: false, error: typeof err === 'string' ? err : (err?.message || 'Unknown error') }) };
    }

    const content = json?.choices?.[0]?.message?.content || '';
    return {
      statusCode: 200,
      headers: headersBase,
      body: JSON.stringify({ ok: true, message: { role: 'assistant', content }, usage: json?.usage || null })
    };
  } catch (e) {
    return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: e?.message || String(e) }) };
  }
}
