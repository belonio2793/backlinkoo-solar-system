/* Clear all Netlify domain aliases for the configured site (keeps custom_domain) */
async function main(){
  try{
    const token=process.env.NETLIFY_ACCESS_TOKEN||process.env.VITE_NETLIFY_ACCESS_TOKEN||'';
    const siteId=process.env.NETLIFY_SITE_ID||process.env.VITE_NETLIFY_SITE_ID||'';
    if(!token||!siteId){
      console.error('Missing NETLIFY_ACCESS_TOKEN or NETLIFY_SITE_ID');
      process.exit(1);
    }
    const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
    const siteRes=await fetch('https://api.netlify.com/api/v1/sites/'+siteId,{headers});
    if(!siteRes.ok){
      console.error('Failed to fetch site',siteRes.status,await siteRes.text());
      process.exit(1);
    }
    const site=await siteRes.json();
    const aliases=Array.isArray(site.domain_aliases)?site.domain_aliases:[];
    const primary=site.custom_domain||null;
    console.log('Current aliases:',aliases);
    console.log('Primary domain:',primary);
    if(!aliases.length){
      console.log('No aliases to remove.');
      return;
    }
    const patchRes=await fetch('https://api.netlify.com/api/v1/sites/'+siteId,{method:'PATCH',headers,body:JSON.stringify({domain_aliases:[]})});
    const text=await patchRes.text().catch(function(){return''});
    if(!patchRes.ok){
      console.error('Failed to clear aliases',patchRes.status,text);
      process.exit(1);
    }
    console.log('Aliases cleared. Response snippet:',text.substring(0,200));
  }catch(e){console.error(e&&e.message?e.message:String(e));process.exit(1);}
}
main();
