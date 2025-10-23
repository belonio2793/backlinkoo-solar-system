/**
 * Netlify Domain Validation + Alias Management
 * 
 * Uses Netlify API:
 * - Get site info, domains, DNS, SSL
 * - Validate domain status
 * - Add/remove aliases
 * - Full report
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
};

exports.handler = async function(event, context) {
  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'PATCH') {
    return jsonResponse(405, { success: false, error: 'Method not allowed. Use PATCH.' });
  }

  try {
    const { action, domain } = safeJsonParse(event.body);
    const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;

    if (!netlifyToken || !siteId) {
      return jsonResponse(500, { success: false, error: 'Missing Netlify configuration' });
    }

    const headers = {
      Authorization: `Bearer ${netlifyToken}`,
      'Content-Type': 'application/json',
    };

    switch (action) {
      case 'getSiteInfo': return await getSiteInfo(siteId, headers);
      case 'getDomains': return await getDomains(siteId, headers);
      case 'getDNSInfo': return await getDNSInfo(siteId, headers);
      case 'getSSLStatus': return await getSSLStatus(siteId, headers);
      case 'validateDomain': return await validateDomain(siteId, domain, headers);
      case 'addDomainAlias': return await addDomainAlias(siteId, domain, headers);
      case 'removeDomainAlias': return await removeDomainAlias(siteId, domain, headers);
      case 'listDomainAliases': return await listDomainAliases(siteId, headers);
      default: return await getFullDomainReport(siteId, domain, headers);
    }
  } catch (err) {
    console.error('❌ Handler error:', err);
    return jsonResponse(500, { success: false, error: err.message || 'Internal error' });
  }
};

/* -----------------------
   Helpers
------------------------ */

function safeJsonParse(body) {
  if (!body) return {};
  try { return JSON.parse(body); } catch { throw new Error('Invalid JSON in request body'); }
}

function normalizeDomain(d) {
  return String(d || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/* -----------------------
   Netlify API wrappers
------------------------ */

async function getDomains(siteId, headers) {
  return proxyNetlify(`https://api.netlify.com/api/v1/sites/${siteId}/domains`, headers, 'getDomains');
}

async function getSiteInfo(siteId, headers) {
  return proxyNetlify(`https://api.netlify.com/api/v1/sites/${siteId}`, headers, 'getSiteInfo');
}

async function getDNSInfo(siteId, headers) {
  return proxyNetlify(`https://api.netlify.com/api/v1/sites/${siteId}/dns`, headers, 'getDNSInfo');
}

async function getSSLStatus(siteId, headers) {
  return proxyNetlify(`https://api.netlify.com/api/v1/sites/${siteId}/ssl`, headers, 'getSSLStatus');
}

async function proxyNetlify(url, headers, action) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`${action} failed: ${res.status} ${msg}`);
  }
  const data = await res.json();
  return jsonResponse(200, { success: true, action, data });
}

/* -----------------------
   Domain ops
------------------------ */

async function validateDomain(siteId, domain, headers) {
  const cleanDomain = normalizeDomain(domain);
  const [siteRes, dnsRes, sslRes] = await Promise.all([
    fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, { headers }),
    fetch(`https://api.netlify.com/api/v1/sites/${siteId}/dns`, { headers }),
    fetch(`https://api.netlify.com/api/v1/sites/${siteId}/ssl`, { headers }),
  ]);

  const siteData = siteRes.ok ? await siteRes.json() : {};
  const dnsData = dnsRes.ok ? await dnsRes.json() : [];
  const sslData = sslRes.ok ? await sslRes.json() : null;

  const aliases = siteData.domain_aliases || [];
  const exists = aliases.some(a => normalizeDomain(a) === cleanDomain) ||
    normalizeDomain(siteData.custom_domain) === cleanDomain;

  const domainDNS = dnsData.filter(r => r.hostname === cleanDomain || r.hostname.endsWith(`.${cleanDomain}`));

  return jsonResponse(200, {
    success: true,
    action: 'validateDomain',
    domain: cleanDomain,
    validation: {
      exists_in_netlify: exists,
      dns_records_found: domainDNS.length > 0,
      ssl_configured: sslData?.state === 'issued',
      status: exists ? 'valid' : 'not_configured',
    },
    data: { site: siteData, dns_records: domainDNS, ssl_status: sslData },
  });
}

async function addDomainAlias(siteId, domain, headers) {
  const cleanDomain = normalizeDomain(domain);
  const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, { headers });
  if (!siteRes.ok) throw new Error(`Failed to fetch site: ${siteRes.status}`);
  const siteData = await siteRes.json();
  const aliases = siteData.domain_aliases || [];

  if (aliases.includes(cleanDomain) || normalizeDomain(siteData.custom_domain) === cleanDomain) {
    return jsonResponse(200, {
      success: true,
      action: 'addDomainAlias',
      message: `Domain ${cleanDomain} already exists`,
      aliases,
    });
  }

  const patchRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ domain_aliases: [...aliases, cleanDomain] }),
  });

  if (!patchRes.ok) {
    const msg = await patchRes.text();
    throw new Error(`Failed to add alias: ${patchRes.status} ${msg}`);
  }

  const updated = await patchRes.json();
  return jsonResponse(200, {
    success: true,
    action: 'addDomainAlias',
    domain: cleanDomain,
    aliases: updated.domain_aliases,
  });
}

async function removeDomainAlias(siteId, domain, headers) {
  const cleanDomain = normalizeDomain(domain);
  const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, { headers });
  if (!siteRes.ok) throw new Error(`Failed to fetch site: ${siteRes.status}`);
  const siteData = await siteRes.json();
  const aliases = siteData.domain_aliases || [];

  if (!aliases.includes(cleanDomain)) {
    return jsonResponse(200, {
      success: true,
      action: 'removeDomainAlias',
      message: `Domain ${cleanDomain} not found`,
      aliases,
    });
  }

  const patchRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ domain_aliases: aliases.filter(a => a !== cleanDomain) }),
  });

  if (!patchRes.ok) {
    const msg = await patchRes.text();
    throw new Error(`Failed to remove alias: ${patchRes.status} ${msg}`);
  }

  const updated = await patchRes.json();
  return jsonResponse(200, {
    success: true,
    action: 'removeDomainAlias',
    domain: cleanDomain,
    aliases: updated.domain_aliases,
  });
}

async function listDomainAliases(siteId, headers) {
  const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, { headers });
  if (!siteRes.ok) throw new Error(`Failed to fetch site: ${siteRes.status}`);
  const siteData = await siteRes.json();

  return jsonResponse(200, {
    success: true,
    action: 'listDomainAliases',
    aliases: siteData.domain_aliases || [],
    custom_domain: siteData.custom_domain,
    total: (siteData.domain_aliases?.length || 0) + (siteData.custom_domain ? 1 : 0),
  });
}

async function getFullDomainReport(siteId, domain, headers) {
  const [site, dns, ssl] = await Promise.allSettled([
    getSiteInfo(siteId, headers),
    getDNSInfo(siteId, headers),
    getSSLStatus(siteId, headers),
  ]);

  return jsonResponse(200, {
    success: true,
    action: 'getFullDomainReport',
    domain: domain ? normalizeDomain(domain) : null,
    report: {
      site: site.status === 'fulfilled' ? JSON.parse(site.value.body).data : null,
      dns: dns.status === 'fulfilled' ? JSON.parse(dns.value.body).data : null,
      ssl: ssl.status === 'fulfilled' ? JSON.parse(ssl.value.body).data : null,
    },
    timestamp: new Date().toISOString(),
  });
}
