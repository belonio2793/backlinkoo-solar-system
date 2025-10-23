/*
Creates a post in automation_posts for a given domain with a provided title, target URL, anchor text, and optional theme-prefixed slug.
Usage:
  node scripts/create-domain-post.js <domain> <title> <target_url> <anchor_text> [slug]
Env:
  SUPABASE_URL or VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY or VITE_SERVICE_ROLE_KEY
*/

const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\-_ ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const [domain, titleArg, targetUrl, anchorText, slugArg] = process.argv.slice(2);
  if (!domain || !titleArg || !targetUrl || !anchorText) {
    console.error('Usage: node scripts/create-domain-post.js <domain> <title> <target_url> <anchor_text> [slug]');
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
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

  async function getDomainRow() {
    const res = await fetch(`${supabaseUrl}/rest/v1/domains?domain=eq.${encodeURIComponent(domain)}`, { headers });
    if (!res.ok) throw new Error(`Domain fetch failed: ${res.status}`);
    const arr = await res.json();
    return arr[0] || null;
  }

  const dom = await getDomainRow();
  if (!dom) {
    throw new Error(`Domain not found in database: ${domain}`);
  }
  const domain_id = dom.id;
  const user_id = dom.user_id || null;

  const safeTitle = String(titleArg);
  const safeAnchor = String(anchorText);
  const safeTarget = String(targetUrl);

  // Ensure a minimal automation_campaign exists to satisfy NOT NULL automation_id constraints
  let automation_id = null;
  try {
    const campRes = await fetch(`${supabaseUrl}/rest/v1/automation_campaigns`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_id, name: safeTitle, target_url: safeTarget, keyword: safeAnchor, anchor_text: safeAnchor, status: 'active' })
    });
    if (campRes.ok) {
      const camp = (await campRes.json())[0];
      automation_id = camp?.id || null;
    }
  } catch {}

  const bodyHtml = [
    `<article>`,
    `<h1>${safeTitle}</h1>`,
    `<p>This article covers key insights about Go High Level for real-world usage.</p>`,
    `<p>Read more at <a href="${safeTarget}" rel="noopener nofollow ugc">${safeAnchor}</a>.</p>`,
    `<h2>Why it matters</h2>`,
    `<ul><li>All-in-one marketing CRM</li><li>Automation and funnels</li><li>Great for agencies</li></ul>`,
    `<p>Visit <a href="${safeTarget}" rel="noopener nofollow ugc">${safeAnchor}</a> to learn more.</p>`,
    `</article>`,
  ].join('');

  const inner = slugArg ? String(slugArg) : slugify(safeAnchor || safeTitle);
  // Prefix with minimal theme for consistency
  const slug = inner.startsWith('minimal/') ? inner : `minimal/${inner}`;
  const now = new Date().toISOString();
  const url = `https://${domain}/${slug}`;

  async function tryInsertBlog(body) {
    const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) return { ok: false, text: await res.text() };
    const data = await res.json();
    return { ok: true, row: data[0] };
  }
  async function tryInsertAuto(body) {
    const res = await fetch(`${supabaseUrl}/rest/v1/automation_posts`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) return { ok: false, text: await res.text() };
    const data = await res.json();
    return { ok: true, row: data[0] };
  }

  let attempt = await tryInsertBlog({ automation_id, domain_id, user_id, slug, title: safeTitle, content: bodyHtml, url, status: 'published', published_at: now });
  if (!attempt.ok) attempt = await tryInsertBlog({ automation_id, domain_id, user_id, slug, title: safeTitle, content: bodyHtml, url });
  if (!attempt.ok) attempt = await tryInsertAuto({ automation_id, domain_id, user_id, slug, title: safeTitle, content: bodyHtml, url, status: 'published', published_at: now });
  if (!attempt.ok) attempt = await tryInsertAuto({ automation_id, domain_id, user_id, slug, title: safeTitle, content: bodyHtml, url, status: 'published' });
  if (!attempt.ok) throw new Error('Insert failed: ' + attempt.text);
  const row = attempt.row;
  const preview = `${supabaseUrl}/functions/v1/domain-blog-server/sites/${encodeURIComponent(domain)}/blog/${encodeURIComponent(slug)}`;
  console.log(JSON.stringify({ success: true, url, slug, title: safeTitle, preview }));
}

main().catch((e) => {
  console.error(JSON.stringify({ success: false, error: e && (e.message || String(e)) }));
  process.exit(1);
});
