/* Upload a sample preview HTML to Supabase storage themes/random/index.html

Usage:
  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-random-preview.js

This script PUTs a simple HTML file into the themes/random folder.
*/

(async function main(){
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    if(!SUPABASE_URL || !SERVICE_ROLE) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    const uploadPath = 'random/index.html';
    const uploadUrl = `${String(SUPABASE_URL).replace(/\/$/, '')}/storage/v1/object/themes/${encodeURIComponent(uploadPath)}`;

    const seed = Date.now();
    const html = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Random Preview</title>\n<style>body{font-family:Inter, system-ui, Arial; background:linear-gradient(135deg,#eef2ff,#e0f2fe); color:#0f172a; padding:2rem}header{padding:2rem;border-radius:12px;background:linear-gradient(90deg,#7c3aed,#0ea5a4);color:#fff}h1{margin:0 0 .5rem}p{opacity:.9}a.button{display:inline-block;margin-top:1rem;padding:.6rem 1rem;background:#fff;color:#7c3aed;border-radius:8px;text-decoration:none;font-weight:600}article{margin-top:1.5rem}blockquote{border-left:4px solid rgba(0,0,0,0.08);padding-left:1rem;color:#334155}footer{margin-top:2rem;color:#64748b;font-size:.9rem}</style>\n</head>\n<body>\n  <header>\n    <h1>Random Preview — demo.random</h1>\n    <p>Auto-generated sample preview to ensure preview works.</p>\n    <a class="button" href="#">Explore Posts →</a>\n  </header>\n  <article>\n    <h2>Sample Article</h2>\n    <p>This is a placeholder page uploaded to the 'random' theme folder so previews render while the random preview generator runs.</p>\n    <blockquote>Controlled randomized theme preview placeholder.</blockquote>\n  </article>\n  <footer>Seed: ${seed}</footer>\n</body>\n</html>`;

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'text/html',
        'x-upsert': 'true'
      },
      body: html
    });

    console.log('Upload status:', res.status);
    if(res.ok) console.log('Uploaded to', `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/themes/random/index.html`);
    else {
      const txt = await res.text().catch(()=>'');
      console.error('Upload failed:', res.status, txt);
      process.exit(2);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
