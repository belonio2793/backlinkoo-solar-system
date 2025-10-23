#!/usr/bin/env node

/**
 * Netlify Environment Tools
 * - analyze: prints total env size and largest variables for the site
 * - prune: keep only an allowlist of keys to reduce size (dry-run by default)
 *
 * Requirements: NETLIFY_ACCESS_TOKEN, NETLIFY_SITE_ID
 */

const SITE_ID = process.env.NETLIFY_SITE_ID || 'ca6261e6-0a59-40b5-a2bc-5b5481ac8809';
const TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN;

if (!TOKEN) {
  console.log('ℹ️ Skipping Netlify env tool: NETLIFY_ACCESS_TOKEN not set. Continuing without prune.');
  process.exit(0);
}

const BASE = 'https://api.netlify.com/api/v1';
let ACCOUNT_ID = null;

// Conservative allowlist – adjust as needed
const ALLOWLIST = new Set([
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_ENVIRONMENT',
]);

function header() {
  return { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
}

async function fetchEnv() {
  // Try the env endpoint first
  let res = await fetch(`${BASE}/sites/${SITE_ID}/env`, { headers: header() });
  if (res.ok) {
    const data = await res.json();
    // Normalize to object map
    if (Array.isArray(data)) {
      // Newer API may return array of { key, values }
      const out = {};
      for (const item of data) {
        if (item && item.key) out[item.key] = item.values?.production ?? item.values?.value ?? '';
      }
      return out;
    }
    return data;
  }
  // Fallback to site payload
  res = await fetch(`${BASE}/sites/${SITE_ID}`, { headers: header() });
  if (!res.ok) {
    throw new Error(`Failed to load site: HTTP ${res.status}`);
  }
  const site = await res.json();
  // Try common locations
  return (
    site?.build_settings?.env ||
    site?.build_settings?.environment ||
    site?.env ||
    {}
  );
}

async function fetchAccounts() {
  const res = await fetch(`${BASE}/accounts`, { headers: header() });
  if (!res.ok) throw new Error(`Failed to load accounts: HTTP ${res.status}`);
  const accounts = await res.json();
  ACCOUNT_ID = accounts?.[0]?.id || accounts?.[0]?.slug || null;
  return accounts;
}

async function fetchAccountEnv() {
  if (!ACCOUNT_ID) await fetchAccounts();
  const res = await fetch(`${BASE}/accounts/${ACCOUNT_ID}/env`, { headers: header() });
  if (!res.ok) throw new Error(`Failed to load account env: HTTP ${res.status}`);
  const data = await res.json();
  // Normalize to object map of production values and scopes
  const out = {};
  for (const item of data || []) {
    if (!item?.key) continue;
    out[item.key] = {
      value: item.values?.production ?? item.values?.value ?? '',
      scopes: item.scopes || []
    };
  }
  return out;
}

function computeStats(env) {
  const entries = Object.entries(env);
  const sizes = entries.map(([k, v]) => ({ key: k, size: (k?.length || 0) + (String(v)?.length || 0) + 2, valueLen: String(v)?.length || 0 }));
  const total = sizes.reduce((s, x) => s + x.size, 0);
  sizes.sort((a, b) => b.size - a.size);
  return { total, sizes };
}

async function analyze() {
  const env = await fetchEnv();
  const { total, sizes } = computeStats(env);
  console.log('📦 Netlify environment variables summary');
  console.log(`Site: ${SITE_ID}`);
  console.log(`Total keys: ${Object.keys(env).length}`);
  console.log(`Approx total size: ${total} bytes`);
  console.log('\nTop 15 largest variables:');
  sizes.slice(0, 15).forEach((e, i) => console.log(`${i + 1}. ${e.key} (${e.size} bytes)`));
  if (total > 4096) {
    console.log('\n⚠️ Size exceeds 4KB limit. Consider pruning or shortening values.');
  } else {
    console.log('\n✅ Size within 4KB limit.');
  }

  // Also analyze account-level env (may be inherited by functions)
  try {
    const acctEnv = await fetchAccountEnv();
    const acctSimple = Object.fromEntries(Object.entries(acctEnv).map(([k, v]) => [k, v.value]));
    const { total: acctTotal, sizes: acctSizes } = computeStats(acctSimple);
    console.log('\n🏢 Account-level env summary');
    console.log(`Account: ${ACCOUNT_ID}`);
    console.log(`Total keys: ${Object.keys(acctSimple).length}`);
    console.log(`Approx total size: ${acctTotal} bytes`);
    console.log('Top 10 largest:');
    acctSizes.slice(0, 10).forEach((e, i) => console.log(`${i + 1}. ${e.key} (${e.size} bytes)`));
  } catch (e) {
    console.log('\nℹ️ Account-level env analysis skipped:', e.message || e);
  }
}

async function prune(confirm) {
  const env = await fetchEnv();
  const keep = {};
  for (const [k, v] of Object.entries(env)) {
    if (ALLOWLIST.has(k)) keep[k] = v;
  }
  const { total: before } = computeStats(env);
  const { total: after } = computeStats(keep);

  console.log('✂️  Prune plan');
  console.log(`Before: ${Object.keys(env).length} vars, ~${before} bytes`);
  console.log(`After:  ${Object.keys(keep).length} vars, ~${after} bytes`);
  const removed = Object.keys(env).filter(k => !ALLOWLIST.has(k));
  console.log(`Removing ${removed.length} keys:`);
  removed.slice(0, 50).forEach(k => console.log(` - ${k}`));
  if (removed.length > 50) console.log(` ...and ${removed.length - 50} more`);

  if (!confirm) {
    console.log('\nDry run only. Re-run with "--yes" to apply.');
    return;
  }

  // Apply by overwriting env set to the allowlisted keys only
  let applied = false;
  try {
    const res = await fetch(`${BASE}/sites/${SITE_ID}/env`, {
      method: 'PUT',
      headers: header(),
      body: JSON.stringify(keep)
    });
    if (res.ok) {
      applied = true;
    } else {
      const text = await res.text();
      if (res.status !== 404 && res.status !== 400) {
        throw new Error(`Failed to update env: HTTP ${res.status} ${text}`);
      }
    }
  } catch (_) {}

  if (!applied) {
    // Fallback: delete keys one by one (older API compatibility)
    console.log('ℹ️ Bulk update not supported. Deleting non-allowlisted keys individually...');
    for (const key of removed) {
      const del = await fetch(`${BASE}/sites/${SITE_ID}/env/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: header()
      });
      if (del.ok) {
        console.log(`   🗑️  Deleted ${key}`);
      } else {
        // Treat missing keys as non-fatal (skip quietly)
        if (del.status === 404 || del.status === 400) {
          console.log(`   ⏭️  Skipped ${key} (not present)`);
        } else {
          const t = await del.text();
          console.log(`   ⚠️  Failed to delete ${key}: HTTP ${del.status} ${t}`);
        }
      }
    }
  }

  console.log('✅ Environment prune attempt completed');
}

(async () => {
  const cmd = process.argv[2] || 'analyze';
  try {
    if (cmd === 'analyze') {
      await analyze();
    } else if (cmd === 'prune') {
      const confirm = process.argv.includes('--yes') || process.env.CONFIRM === '1';
      await prune(confirm);
    } else if (cmd === 'prune:auto') {
      const confirm = process.argv.includes('--yes') || process.env.CONFIRM === '1';
      const env = await fetchEnv();
      const { total } = computeStats(env);
      console.log(`Auto-prune check: current size ~${total} bytes`);
      if (total > 4096) {
        console.log('Size exceeds 4KB; proceeding to prune...');
        await prune(confirm);
      } else {
        console.log('Size within limit; skipping prune.');
      }
    } else if (cmd === 'analyze:account') {
      await fetchAccounts();
      const acctEnv = await fetchAccountEnv();
      const acctSimple = Object.fromEntries(Object.entries(acctEnv).map(([k, v]) => [k, v.value]));
      const { total, sizes } = computeStats(acctSimple);
      console.log('🏢 Account-level env summary');
      console.log(`Account: ${ACCOUNT_ID}`);
      console.log(`Total keys: ${Object.keys(acctSimple).length}`);
      console.log(`Approx total size: ${total} bytes`);
      sizes.slice(0, 15).forEach((e, i) => console.log(`${i + 1}. ${e.key} (${e.size} bytes)`));
    } else {
      console.log('Usage: node scripts/netlify-env-tools.js [analyze|prune|prune:auto|analyze:account] [--yes]');
    }
  } catch (e) {
    console.error('❌', e.message || e);
    process.exit(1);
  }
})();
