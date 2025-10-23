import 'dotenv/config';
const url = process.argv[2] || 'https://backlinkoo.com';
(async ()=>{
  try {
    const res = await fetch(url, { method: 'GET' });
    console.log('Status:', res.status);
    console.log('Headers:');
    for (const [k,v] of res.headers) console.log(k+':', v);
    const text = await res.text();
    console.log('Body snippet:', text.slice(0, 300));
  } catch (e) {
    console.error('Fetch failed:', e.message || e);
  }
})();
