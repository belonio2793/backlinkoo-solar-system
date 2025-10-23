(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!SUPABASE_URL) return console.error('Missing SUPABASE_URL env');

    const url = SUPABASE_URL.replace(/\/$/, '') + '/functions/v1/netlify-domains';
    console.log('POST', url);

    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'POST',
      headers: Object.fromEntries([
        ['Content-Type','application/json'],
        ...(ANON ? [['Authorization', 'Bearer ' + ANON]] : [])
      ]),
      body: JSON.stringify({ action: 'list' }),
      signal: controller.signal
    });

    clearTimeout(to);
    console.log('status', res.status);
    console.log('headers:');
    for (const [k,v] of res.headers) console.log(' ', k+':', v);
    const text = await res.text();
    console.log('body:', text);
  } catch (err) {
    if (err.name === 'AbortError') console.error('error: request timed out');
    else console.error('error:', err.message || err);
    process.exit(2);
  }
})();
