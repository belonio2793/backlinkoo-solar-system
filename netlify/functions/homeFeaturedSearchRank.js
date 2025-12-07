const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

async function callGrokWithTimeout(apiKey, url, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const prompt = `For the website ${url}, estimate: 1) how many backlinks are recommended, 2) what keywords to target. Keep answer brief.`;
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'grok-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    const content = jsonResponse?.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    return content;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handler(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Health check
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: !!process.env.X_API,
        status: process.env.X_API ? 'ready' : 'unconfigured',
        service: 'homeFeaturedSearchRank'
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    };
  }

  try {
    const apiKey = process.env.X_API;
    if (!apiKey) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ ok: false, error: 'Service not configured' })
      };
    }

    let body = {};
    try {
      body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, error: 'Invalid request' })
      };
    }

    const url = body?.url;
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, error: 'URL required' })
      };
    }

    // Normalize URL
    let normalizedUrl = url;
    try {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      normalizedUrl = urlObj.toString();
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, error: 'Invalid URL' })
      };
    }

    // Call Grok API with timeout
    const analysis = await callGrokWithTimeout(apiKey, normalizedUrl);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        success: true,
        data: analysis,
        report: analysis,
        url: normalizedUrl
      })
    };

  } catch (error) {
    console.error('Error in homeFeaturedSearchRank:', error?.message || error);
    
    const statusCode = error?.message?.includes('abort') ? 504 : 500;
    const message = error?.message?.includes('abort') ? 'Request timeout' : 'Analysis failed';

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        ok: false,
        error: message
      })
    };
  }
}

exports.handler = handler;
