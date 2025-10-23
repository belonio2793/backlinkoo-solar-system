(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_SECRET;
    if (!SUPABASE_URL) {
      console.error('Missing SUPABASE_URL');
      process.exit(2);
    }

    const url = SUPABASE_URL.replace(/\/$/, '') + '/functions/v1/netlify-domains-proxy';
    console.log('POST', url);

    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SERVICE_KEY ? ('Bearer ' + SERVICE_KEY) : undefined
        },
        body: JSON.stringify({ action: 'add', domains: ['test-supabase-proxy-timeout.example.com'] }),
        signal: controller.signal
      });

      clearTimeout(to);
      console.log('status', res.status);
      const text = await res.text();
      console.log('body:', text);
    } catch (err) {
      if (err.name === 'AbortError') console.error('error: request timed out');
      else console.error('error:', err.message || err);
      process.exit(2);
    }
  } catch (err) {
    console.error('fatal error:', err.message || err);
    process.exit(2);
  }
})();
