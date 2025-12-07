/*
  homeFeaturedSearchRank.js
  Uses Grok AI to analyze a URL and provide SEO insights.
  Accepts { url } and returns plain text analysis from Grok.
*/

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    const ok = !!process.env.X_API;
    const status = ok ? 'ready' : 'not_configured';
    const text = `ok=${ok}\nstatus=${status}\nservice=homeFeaturedSearchRank`;
    return {
      statusCode: 200,
      headers,
      body: text
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: headers,
      body: 'Method not allowed. Please use POST.'
    };
  }

  try {
    const apiKey = process.env.X_API;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: headers,
        body: 'API key not configured. Please contact support.'
      };
    }

    const rawBody = typeof event.body === 'string' ? event.body : '';
    let body = {};
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        return {
          statusCode: 400,
          headers: headers,
          body: 'Invalid request format. Please send valid JSON.'
        };
      }
    }

    const url = typeof body?.url === 'string' ? body.url.trim() : '';

    if (!url) {
      return {
        statusCode: 400,
        headers: headers,
        body: 'URL is required. Please provide a domain or website URL.'
      };
    }

    // Validate URL format
    let normalizedUrl = url;
    try {
      const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
      normalizedUrl = urlObj.toString();
    } catch (e) {
      return {
        statusCode: 400,
        headers: headers,
        body: 'Invalid URL format. Please provide a valid domain like example.com.'
      };
    }

    // Construct prompt for AI to analyze the website
    // Request unique analysis without templated format
    const prompt = `how many backlinks would you recommend for ${normalizedUrl} and what keywords would you target? Respond in one paragraph or a few sentences.
`;

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-4',
        messages: messages,
        temperature: 0.3,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', errorText);
      return {
        statusCode: response.status || 500,
        headers: headers,
        body: 'Unable to generate analysis at this time. Please try again later.'
      };
    }

    const jsonResponse = await response.json();
    const content = jsonResponse?.choices?.[0]?.message?.content || 'No analysis available';

    // Return the plain text response directly
    return {
      statusCode: 200,
      headers: headers,
      body: content
    };
  } catch (error) {
    console.error('Error in homeFeaturedSearchRank:', error);
    return {
      statusCode: 500,
      headers: headers,
      body: `An error occurred while analyzing your website. Please try again.`
    };
  }
}
