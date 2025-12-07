const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers, 
      body: '' 
    };
  }

  // Handle GET (health check)
  if (event.httpMethod === 'GET') {
    const ok = !!process.env.X_API;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: ok,
        status: ok ? 'ready' : 'not_configured',
        service: 'homeFeaturedSearchRank'
      })
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        ok: false,
        error: 'Method not allowed. Use POST.'
      })
    };
  }

  try {
    const apiKey = process.env.X_API;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          error: 'API key not configured'
        })
      };
    }

    let body = {};
    if (event.body) {
      try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            ok: false,
            error: 'Invalid JSON'
          })
        };
      }
    }

    const url = body?.url;
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: 'URL is required'
        })
      };
    }

    // Validate URL
    let normalizedUrl = url;
    try {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      normalizedUrl = urlObj.toString();
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: 'Invalid URL format'
        })
      };
    }

    // Call Grok API
    const prompt = `how many backlinks would you recommend for ${normalizedUrl} and what keywords would you target? Respond in 2-3 sentences.`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Grok API error:', response.status, errorText);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: 'Unable to analyze website'
        })
      };
    }

    const jsonResponse = await response.json();
    const content = jsonResponse?.choices?.[0]?.message?.content || 'No analysis available';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        success: true,
        data: content,
        report: content
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: 'Server error'
      })
    };
  }
}

exports.handler = handler;
