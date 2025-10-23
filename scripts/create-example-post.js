/* Script to create a sample blog post on a given domain and output preview URLs */
const fetch = global.fetch || ((...args) => import('node-fetch').then(({default: f}) => f(...args)));

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
  const domain = process.argv[2] || 'kyliecosmetics.org';
  const titleArg = process.argv[3] || 'Example Post: Welcome to Kylie Cosmetics';
  const targetUrl = process.argv[4] || 'https://kyliecosmetics.com';
  const anchorText = process.argv[5] || 'Kylie Cosmetics';
  const themePrefix = process.argv[6] || 'minimal';

  if (!supabaseUrl || !key) {
    console.error('Missing Supabase env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  async function getDomain() {
    const res = await fetch(`${supabaseUrl}/rest/v1/domains?domain=eq.${encodeURIComponent(domain)}`, { headers });
    if (!res.ok) throw new Error(`Domain fetch failed: ${res.status}`);
    const arr = await res.json();
    return arr[0] || null;
  }

  async function ensureDomain() {
    let row = await getDomain();
    if (row) return row;
    const now = new Date().toISOString();
    const body = { domain, blog_enabled: true, created_at: now, updated_at: now };
    const res = await fetch(`${supabaseUrl}/rest/v1/domains`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const t = await res.text();
      throw new Error('Insert domain failed: ' + t);
    }
    const data = await res.json();
    return data[0];
  }

  function slugify(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9\-_ ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const title = titleArg;
  const inner = slugify(anchorText || title);
  const slug = `${themePrefix}/${inner}`;
  const content = '<article><h1>' + title + '</h1>'+
    '<p>This is a sample article published for preview on ' + domain + '.</p>'+
    '<p>Read more: <a href="' + targetUrl + '" rel="noopener nofollow ugc">' + anchorText + '</a></p>'+
    '</article>';
  const now = new Date().toISOString();

  try {
    const d = await ensureDomain();
    const domain_id = d.id;

    // Try blog_posts first
    // Try blog_posts first with minimal columns
    const blogBody = { domain_id, slug, title, content, published_at: now };
    let table = 'blog_posts';
    let row = null;

    let res = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, { method: 'POST', headers, body: JSON.stringify(blogBody) });
    if (!res.ok) {
      // fallback to automation_posts (also minimal columns)
      table = 'automation_posts';
      const autoBody = { domain_id, slug, title, content, published_at: now };
      res = await fetch(`${supabaseUrl}/rest/v1/automation_posts`, { method: 'POST', headers, body: JSON.stringify(autoBody) });
      if (!res.ok) {
        const t = await res.text();
        throw new Error('Both inserts failed: ' + t);
      }
    }
    const data = await res.json();
    row = data[0];

    const previewBase = `${supabaseUrl}/functions/v1/domain-blog-server/sites/${domain}`;
    const previewUrl = `${previewBase}/blog/${slug}`;
    const listUrl = `${previewBase}/blog`;

    console.log(JSON.stringify({ success: true, domain, domain_id, table, slug, title, previewUrl, listUrl }));
  } catch (err) {
    console.error('ERR', err && (err.message || err));
    console.log(JSON.stringify({ success: false, error: String(err) }));
    process.exit(1);
  }
}

main();
