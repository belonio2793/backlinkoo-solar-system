/*
Publish a post via the automation-blog edge function for a specific domain.
Usage: node scripts/publish-via-automation-blog.js <domain> <automation_id> <title> <target_url> <anchor_text>
*/
const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

async function main() {
  const [domain, automationId, title, targetUrl, anchorText] = process.argv.slice(2);
  if (!domain || !automationId || !title || !targetUrl || !anchorText) {
    console.error('Usage: node scripts/publish-via-automation-blog.js <domain> <automation_id> <title> <target_url> <anchor_text>');
    process.exit(1);
  }
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) {
    console.error('Missing Supabase env');
    process.exit(1);
  }
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  // Lookup domain
  const dRes = await fetch(`${supabaseUrl}/rest/v1/domains?domain=eq.${encodeURIComponent(domain)}`, { headers });
  if (!dRes.ok) throw new Error('Domain lookup failed');
  const dom = (await dRes.json())[0];
  if (!dom) throw new Error('Domain not found');

  const content = [
    `<article>`,
    `<h1>${title}</h1>`,
    `<p>Quick overview of Go High Level features and ideal use cases.</p>`,
    `<p>Read full review: <a href="${targetUrl}" rel="noopener nofollow ugc">${anchorText}</a></p>`,
    `</article>`
  ].join('');

  const edgeUrl = `${supabaseUrl}/functions/v1/automation-blog`;
  const res = await fetch(edgeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ automation_id: automationId, domain_id: dom.id, user_id: dom.user_id, title, content }) });
  const data = await res.json();
  console.log(JSON.stringify({ success: res.ok && data?.success !== false, result: data }));
}

main().catch(e => { console.error(JSON.stringify({ success: false, error: e && (e.message || String(e)) })); process.exit(1); });
