/*
Ensure every automation_posts row contains at least one hyperlink to its campaign target_url using the campaign anchor_text (fallback to hostname).
Usage: node scripts/ensure-anchor-links.mjs [--dry] [--limit=200] [--offset=0] [--domain=example.com]
*/
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !KEY) { console.error('Missing Supabase env'); process.exit(1); }
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };

function hasHref(html, url){ if(!url) return true; const esc=url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); return new RegExp(`<a\\b[^>]*href=["']${esc}["']`,'i').test(String(html||'')); }
function injectLink(html, text, url){ const h=String(html||''); if(!url) return h; if(hasHref(h,url)) return h; const label=(text||'').trim()||url.replace(/^https?:\/\//,'').replace(/\/$/,''); const link=`<p><a href="${url}" target="_blank" rel="noopener">${label}</a></p>`; if(/<\/article>\s*$/i.test(h)) return h.replace(/<\/article>\s*$/i, `${link}</article>`); return `${h}\n${link}`; }

async function fetchBatch(offset, limit, domainId){ const base=`${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/automation_posts`; const params=new URLSearchParams({ select:'id,automation_id,content,domain_id', order:'created_at.asc', offset:String(offset), limit:String(limit) }); if(domainId) params.set('domain_id',`eq.${domainId}`); const res=await fetch(`${base}?${params}`,{ headers }); if(!res.ok) throw new Error(`fetch posts ${res.status}`); return res.json(); }
async function fetchCampaign(campId){ const res=await fetch(`${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/automation_campaigns?id=eq.${encodeURIComponent(campId)}&select=target_url,anchor_texts`,{ headers }); const j=await res.json(); const row=j&&j[0]; return { target_url: row?.target_url||'', anchor_text: Array.isArray(row?.anchor_texts)&&row.anchor_texts[0]||'' };
}
async function updatePost(id, content){ const res=await fetch(`${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/automation_posts?id=eq.${encodeURIComponent(id)}`,{ method:'PATCH', headers, body: JSON.stringify({ content, updated_at: new Date().toISOString() }) }); if(!res.ok){ const t=await res.text().catch(()=> ''); throw new Error(`update ${id} failed ${res.status} ${t}`); } }

async function main(){ const args=process.argv.slice(2); const DRY=args.includes('--dry'); const lim=Number((args.find(a=>a.startsWith('--limit='))||'').split('=')[1])||200; const off=Number((args.find(a=>a.startsWith('--offset='))||'').split('=')[1])||0; const domain=(args.find(a=>a.startsWith('--domain='))||'').split('=')[1]||null; let domainId=null; if(domain){ const r=await fetch(`${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/domains?select=id,domain&domain=eq.${encodeURIComponent(domain)}`,{ headers }); const rows=await r.json(); domainId=rows?.[0]?.id||null; if(!domainId){ console.error('Domain not found', domain); process.exit(2);} }
  let offset=off, updated=0, scanned=0, batch=0; console.log('Starting ensure-anchor-links',{ DRY, lim, off, domainId });
  while(true){ batch++; const rows=await fetchBatch(offset, lim, domainId); if(!rows.length) break; scanned+=rows.length; for(const row of rows){ try{ const c=await fetchCampaign(row.automation_id); const next=injectLink(row.content, c.anchor_text, c.target_url); if(next!==row.content && !DRY){ await updatePost(row.id, next); updated++; } else if (next!==row.content) { updated++; } } catch(e){ console.warn('row failed', row.id, e.message||e); }
    }
    console.log(`Batch ${batch}: processed=${rows.length}`); offset+=lim; }
  console.log(`Done. scanned=${scanned}, updated~=${updated}, dry=${DRY}`);
}

main().catch(e=>{ console.error('Job failed', e); process.exit(1); });
