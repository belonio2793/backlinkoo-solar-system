#!/usr/bin/env node
// Usage: node scripts/test-estimate.js "keyword"
(async () => {
  const kw = process.argv[2] || 'best coffee grinder';

  const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
  console.log('OPENAI key present:', !!OPENAI_KEY);

  if (OPENAI_KEY) {
    try {
      console.log('Calling OpenAI directly to validate key and prompt...');
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            { role: 'system', content: 'You are an SEO analyst. Provide a concise estimate.' },
            { role: 'user', content: `Give an estimated number of backlinks for the top result on Google for the keyword "${kw}".` }
          ],
          temperature: 0.5,
          max_tokens: 180,
        }),
      });

      console.log('OpenAI direct call status:', resp.status);
      const text = await resp.text().catch(() => '');
      console.log('OpenAI response (truncated):', text.slice(0, 2000));
    } catch (err) {
      console.error('OpenAI direct call error:', err);
    }
  } else {
    console.warn('No OpenAI key found in environment for direct call.');
  }

  const base = (process.env.VITE_NETLIFY_FUNCTIONS_URL || process.env.NETLIFY_FUNCTIONS_URL || process.env.VITE_NETLIFY_DEV_FUNCTIONS || process.env.NETLIFY_DEV_FUNCTIONS || 'https://backlinkoo.netlify.app/.netlify/functions').replace(/\/$/, '');
  const url = `${base}/keywordrankEstimatedBacklinks`;
  console.log('Calling Netlify function at:', url);

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: kw }),
    });
    console.log('Netlify function status:', r.status);
    const body = await r.text().catch(() => '');
    console.log('Netlify function body (truncated):', body.slice(0, 2000));
  } catch (err) {
    console.error('Error calling Netlify function:', err);
  }

  console.log('\nDone.');
})();
