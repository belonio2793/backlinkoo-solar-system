require('dotenv').config();
const https = require('https');

const token = process.env.NETLIFY_ACCESS_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID;

if (!token) {
  console.error('NETLIFY_ACCESS_TOKEN missing');
  process.exit(2);
}
if (!siteId) {
  console.error('NETLIFY_SITE_ID missing');
  process.exit(2);
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      path,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data || '{}');
          resolve({ status: res.statusCode, json });
        } catch (e) {
          // Not JSON — return raw text
          resolve({ status: res.statusCode, json: null, text: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const site = await getJson(`/api/v1/sites/${siteId}`);
    if (site.status >= 400) {
      console.error('Netlify API error', site.status, site.json);
      process.exit(3);
    }
    const json = site.json;
    console.log('Netlify site info:', { id: json.id, name: json.name, ssl: json.ssl, custom_domain: json.custom_domain, domain_aliases: json.domain_aliases || json.aliases });

    const domainsRes = await getJson(`/api/v1/sites/${siteId}/domains`);
    if (domainsRes.status >= 400) {
      console.error('Failed to list domains:', domainsRes.status, domainsRes.json);
      process.exit(4);
    }
    const domains = domainsRes.json || [];
    console.log('Domains count:', domains.length);
    const sample = (domains.slice ? domains.slice(0,5) : []).map(d=>({hostname:d.hostname, ssl:d.ssl, dns:d.dns, verified: d.verified}));
    console.log('Sample domains:', sample);
    process.exit(0);
  } catch (e) {
    console.error('Netlify check failed', e);
    process.exit(1);
  }
})();
