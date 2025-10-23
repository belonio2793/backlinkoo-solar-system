/*
  multi-indexing-submit
  Bulk-submit URLs to Google Indexing API and IndexNow (Bing/Yandex).
  - POST body: { urls: string[], engines?: ['google'|'bing'|'indexnow'], type?: 'URL_UPDATED'|'URL_DELETED' }
  - GET (or POST { status: true }) returns configuration status

  Requirements:
  - Google: Service account hardcoded below.
  - IndexNow: Optional INDEXNOW_KEY env (free from indexnow.org).

  Notes:
  - Service account must be added as an owner in Search Console.
  - IndexNow covers Bing, Yandex, DuckDuckGo; up to 10k URLs/day.
*/

const GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON = {
  "type": "service_account",
  "project_id": "turing-striker-468122-e5",
  "private_key_id": "5880b2f818e386b93023701491140beed524d131",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgx6VuFrVvt6Tv\n5dksJ+dNivME6WR88REhBjFlpyeLTgbaA3B9knZgyPXNThkCr8FZ5kwDSRXZiy4U\nbyJMz+Q82Oa3qXSQ72toJOnVjL1W46G+W7se3t2gK7Vle7E/FY8P1pFTDT+A9fLl\nvy0Zn4K2cdLz82FdoNaIVtCnhLnnywhv/ScvhzR/jp7I0OZCvZ7gq0tKwR9gTm/Y\nCavewEwuKe8Mam2hXT8CEw8ERP81plM+1H2CSNsf5XBwpHr3gRueoQ4Ac1fERnT+\nrtMuGfk96r4elsP0xGfpS9Q6WB/E/Bi5GK2X9lbr1JQS1mqCnC3333CWhT85H2cE\npHcgf4A9AgMBAAECggEABfhhPKU0D7sxxnpnlf5rAM6Mp3ge3riD5+ZHOMyxc6M4\n2Wkgc6VCkeWnIlHIrM3HyqsPfl1n0I1yGgOmHNSTwi0AD5NdDFG7pbZzMWvEZHYs\n8s43X1YsGXnDXAqbt77jnQAHzZ3zvPnvuazKQ7CQOxlJxFHGDI2U/HiUJG2nCplI\nu1i6FsgYVzJr9srXgl9bmXzr/gp9ajCVKLYtUJxgt/PYK6y8cUskE1rrZzOAi3KM\nUzCgtfiHt865OWwrD/slXUlexcO/vrAp5C7R7EstT69OU/UCV1UGzJU5oOSapXiS\nipSYCjcDnVXidAKdgZB7peAw20FPOEAhQkIJ26sXOQKBgQDh/HC8osGoWprJwU8z\naOZyFphUdJ2Mb1sLRzxlb7+hso0n28kBkdWiLuQpleN8Ym8SBWTo2EH/xvKZ3qKt\nkl0dkBT/5bWotYvYTMHe3uE4WJYDoj+fnFifKtAld1/YmKZckgChWlsJ9Gna+wH0\nmTNw6B+6KpH47CJw3LlxOUQa5QKBgQC2Ii9MpbxtLXjQ+6zU8BFwLsl2JLriNnnW\nuTa/XlFXh0YMtn3oFQI0Vzq0FQlpMquUh/E+W+3w3jpFUPJZW8GgFwsNzQ1rneiV\nIxxBJqZdNA6NspyXeKsY+ER8XqRqi7b1uNFzFG0PKbM09A55RtB7Yd7KbFGMmXsA\nVien1CUCeQKBgQCceE6Svdp6t+lO4pL1FJ/ixLRKXcgsUXnncDZoQZyc1+UWgP5H\nIPObbP47sPWmzPz8rFF3Sy0/bT/SvC1FIv9oFbgEisdh/fnLFTJzHz0v515PO8rz\nt6xA4MLn/iSV8vPVSp43GjnIxbt5jKyI8H6GoaI+I3WYtd8O6DVaKP135QKBgAPX\nOLQfEpgiy1ds1zouTc/VzL3HDIHUsEEM6tCiRojX+2wtNP594uwDouNFRkuHnAKn\n0ziDa8MWjJgFmvazbqPXmI4T8uKAE/WBJglhrURt4piuWYsAKmt+YMNWo5TzmUoZ\nOaF5nsshD/xf4SZBjgfsCmyuWBHk8qkRKAjr+lPRAoGATJHNFQgoAOQGUoZcPxAy\nk0mB6AHzHvRBUWygJTj6XKEhatZ6A9M3AzK1sd54wYNJa7uOnDAsTpeEbQ1ja0i2\nRLEVJ/6+T7IoJpwax0+lIQ9mTjPcCuhfxL95gu+JRJKS4t5PW8+5MN0ByPnOjZXU\nm0JpHraND4CR63ETzKyze9I=\n-----END PRIVATE KEY-----\n",
  "client_email": "backlink@turing-striker-468122-e5.iam.gserviceaccount.com",
  "client_id": "104875944720453159550",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/backlink%40turing-striker-468122-e5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const headersBase = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function base64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwtRS256(header, claimSet, privateKeyPEM) {
  const { createSign } = require('crypto');
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaim = base64url(JSON.stringify(claimSet));
  const toSign = `${encodedHeader}.${encodedClaim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(toSign);
  signer.end();
  const signature = signer.sign(privateKeyPEM);
  const encodedSignature = signature.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${toSign}.${encodedSignature}`;
}

function getServiceAccountConfig() {
  const json = GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON;
  let clientEmail = '';
  let privateKey = '';
  try {
    clientEmail = json.client_email || '';
    privateKey = json.private_key || '';
  } catch (e) {
    // ignore
  }
  if (privateKey && !privateKey.includes('\n') && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  privateKey = privateKey ? privateKey.trim() : privateKey;

  const missing = [];
  if (!clientEmail) missing.push('GOOGLE_INDEXING_CLIENT_EMAIL');
  if (!privateKey) missing.push('GOOGLE_INDEXING_PRIVATE_KEY');
  return { clientEmail, privateKey, missing };
}

async function getAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };
  const assertion = signJwtRS256(header, claimSet, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch { }
  if (!res.ok) {
    const msg = data?.error_description || data?.error || text;
    throw new Error(`Token error: ${msg}`);
  }
  const token = data?.access_token;
  if (!token) throw new Error('No access_token in response');
  return token;
}

async function publishGoogleUrl(token, url, type) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, type })
  });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch { }
  if (!res.ok) {
    const errMsg = (data && (data.error?.message || data.error)) || text;
    return { ok: false, status: res.status, error: typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) };
  }
  return { ok: true, status: res.status, data };
}

async function publishIndexNowUrls(urls, key = null) {
  if (!urls.length) return { ok: true, success: 0, results: [] };
  const indexNowKey = key || process.env.INDEXNOW_KEY;
  if (!indexNowKey) {
    return { ok: false, error: 'INDEXNOW_KEY required for submission', success: 0, results: urls.map(u => ({ url: u, ok: false, error: 'Missing key' })) };
  }

  // IndexNow supports up to 10k URLs per request; batch if needed (here, assume <10k)
  const urlList = urls.map(u => encodeURIComponent(u)).join('&url=');
  const params = new URLSearchParams({ key: indexNowKey });
  if (urlList) params.append('url', urlList);
  const host = new URL(urls[0]).host; // Assume all same domain
  params.append('host', host);

  const res = await fetch(`https://www.bing.com/indexnow?${params.toString()}`, { method: 'POST' });
  const ok = res.ok;
  const results = urls.map(url => ({ url, ok, status: res.status, error: !ok ? await res.text() : null }));
  const success = results.filter(r => r.ok).length;
  return { ok, success, results };
}

async function withConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let i = 0;
  const running = new Set();
  async function runOne(index) {
    const p = Promise.resolve().then(() => worker(items[index], index)).then(r => { results[index] = r; running.delete(p); });
    running.add(p);
    p.finally(() => { /* no-op */ });
  }
  while (i < items.length && running.size < limit) {
    await runOne(i++);
  }
  while (i < items.length) {
    await Promise.race(Array.from(running));
    await runOne(i++);
  }
  await Promise.allSettled(Array.from(running));
  return results;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersBase, body: '' };
  }

  if (event.httpMethod === 'GET') {
    const { clientEmail, privateKey, missing: googleMissing } = getServiceAccountConfig();
    const indexNowKey = process.env.INDEXNOW_KEY || '';
    const missing = [...googleMissing];
    if (!indexNowKey) missing.push('INDEXNOW_KEY');
    const configured = missing.length === 0;
    return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, configured, missing }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  try {
    const body = (() => { try { return JSON.parse(event.body || '{}'); } catch { return {}; } })();
    if (body && body.status) {
      const { clientEmail, privateKey, missing: googleMissing } = getServiceAccountConfig();
      const indexNowKey = process.env.INDEXNOW_KEY || '';
      const missing = [...googleMissing];
      if (!indexNowKey) missing.push('INDEXNOW_KEY');
      const configured = missing.length === 0;
      return { statusCode: 200, headers: headersBase, body: JSON.stringify({ ok: true, configured, missing }) };
    }

    const urlsRaw = Array.isArray(body.urls) ? body.urls : [];
    let urls = urlsRaw.map(u => String(u || '').trim()).filter(Boolean);
    if (!urls.length && typeof body.text === 'string') {
      urls = body.text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
    const type = (body.type === 'URL_DELETED') ? 'URL_DELETED' : 'URL_UPDATED';
    const engines = Array.isArray(body.engines) ? body.engines : ['google']; // e.g., ['google', 'bing']

    if (!urls.length) {
      return { statusCode: 400, headers: headersBase, body: JSON.stringify({ ok: false, error: 'No URLs provided' }) };
    }

    const { clientEmail, privateKey, missing: googleMissing } = getServiceAccountConfig();
    if (googleMissing.length && engines.includes('google')) {
      return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: 'Google not configured', missing: googleMissing }) };
    }

    const results = { google: null, indexnow: null };
    let totalSuccess = 0;

    // Google submission (if selected)
    if (engines.includes('google')) {
      const token = await getAccessToken(clientEmail, privateKey);
      const concurrency = 5;
      const googleResults = await withConcurrency(urls, concurrency, async (url) => {
        try {
          return await publishGoogleUrl(token, url, type);
        } catch (e) {
          return { ok: false, error: e?.message || String(e) };
        }
      });
      const summarizedGoogle = googleResults.map((r, i) => ({ url: urls[i], ok: !!r?.ok, status: r?.status || null, error: r?.error || null }));
      const googleSuccess = summarizedGoogle.filter(r => r.ok).length;
      results.google = { success: googleSuccess, results: summarizedGoogle };
      totalSuccess += googleSuccess;
    }

    // IndexNow submission (Bing/Yandex if 'bing' or 'indexnow' selected)
    const doIndexNow = engines.includes('bing') || engines.includes('indexnow');
    if (doIndexNow) {
      const indexNowRes = await publishIndexNowUrls(urls);
      results.indexnow = indexNowRes;
      totalSuccess += indexNowRes.success;
    }

    return {
      statusCode: 200,
      headers: headersBase,
      body: JSON.stringify({
        ok: true,
        type,
        engines,
        total: urls.length,
        success: totalSuccess,
        results
      })
    };
  } catch (e) {
    return { statusCode: 500, headers: headersBase, body: JSON.stringify({ ok: false, error: e?.message || String(e) }) };
  }
}