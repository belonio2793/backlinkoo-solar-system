(async () => {
  try {
    const url = 'http://localhost:3001/.netlify/functions/netlify-domains-proxy';
    console.log('POST', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', domains: ['testclient.example.com'] })
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body:', text);
  } catch (err) {
    console.error('error:', err);
    process.exit(1);
  }
})();
