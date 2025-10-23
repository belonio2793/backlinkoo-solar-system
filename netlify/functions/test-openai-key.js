/**
 * Test OpenAI API Key Configuration
 * This function tests if the OpenAI API key is properly configured
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const keyLength = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0;
    const keyPrefix = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) : 'none';

    console.log('🔑 OpenAI API Key Status:', {
      hasKey: hasApiKey,
      keyLength,
      keyPrefix
    });

    if (!hasApiKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          configured: false,
          message: 'OpenAI API key is not configured',
          instructions: 'Please set OPENAI_API_KEY environment variable in Netlify'
        }),
      };
    }

    // Make a simple test request using HTTP API to avoid heavy SDK
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      })
    });

    let data = null;
    try { data = await res.json(); } catch { data = null; }

    if (!res.ok || !data) {
      const details = data || (await res.text().catch(() => ''));
      throw new Error(`OpenAI API error: ${res.status} ${JSON.stringify(details)}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        configured: true,
        working: true,
        message: 'OpenAI API key is properly configured and working',
        keyPrefix,
        keyLength,
        testResponse: data.choices?.[0]?.message?.content || 'Test successful'
      }),
    };

  } catch (error) {
    console.error('❌ OpenAI API Key Test Error:', error);

    let errorType = 'unknown';
    let message = error.message;

    if (error.code === 'insufficient_quota') {
      errorType = 'quota_exceeded';
      message = 'OpenAI quota exceeded';
    } else if (error.code === 'invalid_api_key') {
      errorType = 'invalid_key';
      message = 'OpenAI API key is invalid';
    } else if (error.code === 'rate_limit_exceeded') {
      errorType = 'rate_limit';
      message = 'OpenAI rate limit exceeded';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        configured: !!process.env.OPENAI_API_KEY,
        working: false,
        error: errorType,
        message,
        keyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) : 'none'
      }),
    };
  }
};
