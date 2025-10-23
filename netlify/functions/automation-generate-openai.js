/**
 * OpenAI Content Generation Netlify Function
 * Secure server-side OpenAI API calls with cost tracking
 */

exports.handler = async (event, context) => {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'generate-openai OK' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const { keyword, url, anchorText, wordCount = 2000, contentType = 'comprehensive', tone = 'professional' } = JSON.parse(event.body);

    if (!keyword || !url) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: keyword and url'
        })
      };
    }

    // API key
    let apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_API_KEY;

    // Slugify helper
    function slugify(s) {
      return String(s || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 120) || 'post';
    }

    const userPrompt = `Generate a 2000 word blog post about "${keyword}" in HTML format. Naturally include a hyperlink to "${url}" using the anchor text "${anchorText}". Create a beautiful page loaded .css design for the page that like something you would find at Themeforest or Envato and format the content accordingly. Make sure everything is in HTML format.`;

    console.log('🚀 Starting content generation...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Backlinkoo.com'
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'user', content: userPrompt }
        ],
        max_tokens: Math.min(4000, Math.floor(wordCount * 2.5)),
        temperature: 0.7
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('❌ Failed to parse response JSON:', jsonError);
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Failed to parse OpenAI response',
          provider: 'openai'
        })
      };
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || `OpenAI API error: ${response.status}`;
      console.error('❌ OpenAI API error:', errorMessage);

      return {
        statusCode: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          provider: 'openai'
        })
      };
    }

    if (!data.choices || data.choices.length === 0) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'No content generated from OpenAI',
          provider: 'openai'
        })
      };
    }

    const raw = data.choices[0].message.content;

    if (!raw || raw.trim().length < 100) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Generated content is too short or empty',
          provider: 'openai'
        })
      };
    }

    // Token + cost calculation for gpt-4.1
    const usage = data.usage || {};
    const promptTokens = usage.prompt_tokens || 0;
    const completionTokens = usage.completion_tokens || 0;
    const totalTokens = usage.total_tokens || (promptTokens + completionTokens);

    const promptCost = (promptTokens / 1000) * 0.005;
    const completionCost = (completionTokens / 1000) * 0.015;
    const totalCost = promptTokens && completionTokens
      ? promptCost + completionCost
      : (totalTokens / 1000) * 0.01; // fallback avg rate

    // Slug & title guess
    let titleGuess = '';
    try {
      const h1m = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1m && h1m[1]) titleGuess = h1m[1].replace(/<[^>]*>/g, '').trim();
    } catch { }
    if (!titleGuess) titleGuess = String(keyword || 'post');
    const slug = slugify(titleGuess);

    console.log('✅ Content generation successful:', {
      tokens: totalTokens,
      cost: `$${totalCost.toFixed(4)}`
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        source: 'openai',
        provider: 'openai',
        content: raw,
        html: raw,
        slug,
        usage: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: totalTokens,
          cost_usd: totalCost
        },
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Function error:', error);

    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        provider: 'openai'
      })
    };
  }
};
