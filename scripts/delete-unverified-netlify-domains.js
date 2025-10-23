/* Delete unverified Netlify domains using NETLIFY_ACCESS_TOKEN and NETLIFY_SITE_ID */

async function main() {
  try {
    const token = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN || '';
    const siteId = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID || '';
    if (!token || !siteId) {
      console.error('Missing NETLIFY_ACCESS_TOKEN or NETLIFY_SITE_ID');
      process.exit(1);
    }

    const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };

    function norm(d) {
      return String(d || '')
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
    }
    function getName(d) {
      return norm(d && (d.hostname || d.domain || d.name || d.host || ''));
    }
    function coalesceBool() {
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'boolean') return arguments[i];
      }
      return false;
    }
    function sslIssued(d) {
      const s = d && d.ssl_status;
      if (!s) return false;
      if (typeof s === 'string') return s.toLowerCase() === 'issued';
      if (typeof s === 'object' && typeof s.state === 'string') return s.state.toLowerCase() === 'issued';
      return false;
    }
    function isAwaiting(d) {
      const s = String((d && (d.state || d.status || d.ssl_status)) || '').toLowerCase();
      return s.indexOf('await') >= 0 || s.indexOf('pending') >= 0 || s.indexOf('checking') >= 0;
    }

    const siteRes = await fetch('https://api.netlify.com/api/v1/sites/' + siteId, { headers });
    if (!siteRes.ok) {
      console.error('Failed to fetch site', siteRes.status, await siteRes.text());
      process.exit(1);
    }
    const site = await siteRes.json();
    const primary = norm(site.custom_domain || '');
    const defaultHost = new URL(site.ssl_url || site.url || ('https://' + site.name + '.netlify.app')).hostname;

    const listRes = await fetch('https://api.netlify.com/api/v1/sites/' + siteId + '/domains', { headers });
    if (!listRes.ok) {
      console.error('Failed to list domains', listRes.status, await listRes.text());
      process.exit(1);
    }
    const domains = await listRes.json();

    const candidates = (Array.isArray(domains) ? domains : []).filter(function (d) {
      const name = getName(d);
      if (!name) return false;
      if (name === norm(primary)) return false;
      if (name === norm(defaultHost)) return false;
      const verified = coalesceBool(d && d.verified, d && d.verification_status === 'verified', d && d.checks && d.checks.dns && d.checks.dns.status === 'verified');
      const issued = sslIssued(d);
      if (!verified && !issued) return true;
      if (isAwaiting(d)) return true;
      return false;
    });

    console.log(JSON.stringify({ total: domains.length || 0, candidates: candidates.map(function (d) { return { domain: getName(d), state: (d && (d.ssl_status || d.state || null)), verified: coalesceBool(d && d.verified, d && d.verification_status === 'verified', d && d.checks && d.checks.dns && d.checks.dns.status === 'verified') }; }) }, null, 2));

    let deleted = 0, failed = 0;
    for (const d of candidates) {
      const name = getName(d);
      const delUrl = 'https://api.netlify.com/api/v1/sites/' + siteId + '/domains/' + encodeURIComponent(name);
      const del = await fetch(delUrl, { method: 'DELETE', headers });
      const text = await del.text().catch(function () { return ''; });
      if (del.ok) {
        deleted++;
        console.log('Deleted ' + name);
      } else {
        failed++;
        console.log('Failed ' + name + ' ' + del.status + ' ' + text.substring(0, 200));
      }
    }

    console.log(JSON.stringify({ deleted: deleted, failed: failed }, null, 2));
  } catch (e) {
    console.error(e && e.message ? e.message : String(e));
    process.exit(1);
  }
}

main();
