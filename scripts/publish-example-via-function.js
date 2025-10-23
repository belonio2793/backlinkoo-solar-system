/*
Create a minimal campaign for a domain owner and invoke the automation-post edge function.
Usage: node scripts/publish-example-via-function.js <domain> <target_url> <keyword> <anchor_text>
*/
const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

async function main() {
  const [domain, targetUrl, keyword, anchorText] = process.argv.slice(2);
  if (!domain || !targetUrl || !keyword || !anchorText) {
    console.error('Usage: node scripts/publish-example-via-function.js <domain> <target_url> <keyword> <anchor_text>');
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
  // Create campaign for owner
  const cRes = await fetch(`${supabaseUrl}/rest/v1/automation_campaigns`, {
    method: 'POST', headers, body: JSON.stringify({ user_id: dom.user_id, name: keyword, target_url: targetUrl, keywords: [keyword], anchor_texts: [anchorText], status: 'active' })
  });
  if (!cRes.ok) { const t = await cRes.text(); throw new Error('Campaign create failed: ' + t); }
  const campaign = (await cRes.json())[0];
  // Invoke automation-post edge function
  const edgeUrl = `${supabaseUrl}/functions/v1/automation-post`;
  const fRes = await fetch(edgeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ campaign_id: campaign.id }) });
  const data = await fRes.json();
  console.log(JSON.stringify({ success: fRes.ok && data?.success !== false, campaign_id: campaign.id, result: data }));
}

main().catch(e => { console.error(JSON.stringify({ success: false, error: e && (e.message || String(e)) })); process.exit(1); });
