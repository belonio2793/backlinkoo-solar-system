import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE env vars. Aborting.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function escapeRegex(s) {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ensureAnchorForTarget(content, anchorText, targetUrl) {
  const t = String(targetUrl || '').trim();
  if (!t) return content;
  const html = String(content || '');
  // Regex to find an anchor with exact href to targetUrl
  try {
    const hrefRe = new RegExp(`<a\\b[^>]*href=["']${escapeRegex(t)}["'][^>]*>`, 'i');
    if (hrefRe.test(html)) {
      // ensure rel/target attributes exist on that anchor
      return html.replace(new RegExp(`(<a\\b[^>]*href=["']${escapeRegex(t)}["'][^>]*)(>)`, 'ig'), (m, g1, g2) => {
        let attrs = g1;
        if (!/target=/.test(attrs)) attrs += ' target="_blank"';
        if (!/rel=/.test(attrs)) attrs += ' rel="noopener noreferrer"';
        return attrs + g2;
      });
    }
  } catch (e) {}

  // If anchorText appears as plain text, replace first occurrence
  const at = String(anchorText || '').trim();
  if (at && new RegExp(escapeRegex(at)).test(html)) {
    // Replace first plain-text occurrence that's not inside a tag
    const replaced = html.replace(new RegExp(`(^|>)([^<]*?)(${escapeRegex(at)})([^<]*?)(<|$)`, 'i'), (m, g1, g2, g3, g4, g5) => {
      // do not replace if inside an existing anchor
      if (/^<a\b/i.test(g1)) return m;
      return `${g1}${g2}<a href="${t}" target="_blank" rel="noopener noreferrer">${g3}</a>${g4}${g5}`;
    });
    if (replaced !== html) return replaced;
  }

  // If plain url appears, wrap it in anchor
  const urlPlainRe = new RegExp(`${escapeRegex(t)}`, 'i');
  if (urlPlainRe.test(html)) {
    const replaced = html.replace(urlPlainRe, `<a href="${t}" target="_blank" rel="noopener noreferrer">${t}</a>`);
    if (replaced !== html) return replaced;
  }

  // As last resort, append a paragraph with link before </article> or at end
  if (/<\/article>\s*$/i.test(html)) {
    return html.replace(/<\/article>\s*$/i, `\n<p><a href="${t}" target="_blank" rel="noopener noreferrer">${escapeHtml(at || t)}</a></p>\n</article>`);
  }
  return html + `\n<p><a href="${t}" target="_blank" rel="noopener noreferrer">${escapeHtml(at || t)}</a></p>`;
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function fetchAllAutomationPosts(limit = 5000) {
  // fetch automation_posts rows with related automation_campaigns and domains
  const { data, error } = await supabase
    .from('automation_posts')
    .select(`id, content, slug, domain_id, automation_id, url, title, anchor_texts, created_at`)
    .limit(limit);
  if (error) throw error;
  return data || [];
}

async function fetchCampaignMap(ids) {
  if (!ids || ids.length === 0) return {};
  const { data } = await supabase.from('automation_campaigns').select('id, target_url, anchor_text, anchor_texts, keyword, keywords').in('id', ids);
  const map = {};
  for (const c of data || []) map[c.id] = c;
  return map;
}

async function fetchDomainMap(ids) {
  if (!ids || ids.length === 0) return {};
  const { data } = await supabase.from('domains').select('id, domain').in('id', ids);
  const map = {};
  for (const d of data || []) map[d.id] = d;
  return map;
}

async function run({ dryRun = true, batchSize = 200 }) {
  console.log(`Starting update automation_posts anchors (dryRun=${dryRun})`);
  const posts = await fetchAllAutomationPosts(10000);
  console.log(`Fetched ${posts.length} posts`);
  const campaignIds = Array.from(new Set(posts.map(p => p.automation_id).filter(Boolean)));
  const domainIds = Array.from(new Set(posts.map(p => p.domain_id).filter(Boolean)));
  const campaigns = await fetchCampaignMap(campaignIds);
  const domains = await fetchDomainMap(domainIds);

  const toUpdate = [];
  const backup = [];

  for (const p of posts) {
    const orig = { id: p.id, content: p.content, url: p.url, slug: p.slug, domain_id: p.domain_id, automation_id: p.automation_id };
    const campaign = p.automation_id ? campaigns[p.automation_id] : null;
    const targetUrl = campaign?.target_url || campaign?.targetUrl || null;
    const anchorText = (Array.isArray(p.anchor_texts) && p.anchor_texts[0]) || campaign?.anchor_text || (Array.isArray(campaign?.anchor_texts) && campaign.anchor_texts[0]) || (Array.isArray(campaign?.keywords) && campaign.keywords[0]) || p.title || '';
    const host = domains[p.domain_id] ? String(domains[p.domain_id].domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
    const publishedUrl = host && p.slug ? `https://${host}/themes/${p.slug}` : p.url;
    let newContent = p.content || '';
    let changed = false;

    // 1) Ensure url field matches publishedUrl
    if (publishedUrl && p.url !== publishedUrl) {
      orig.new_url = publishedUrl;
      changed = true;
    }

    // 2) Ensure content contains an anchor linking to targetUrl using anchorText
    if (targetUrl) {
      const updatedContent = ensureAnchorForTarget(newContent, anchorText, targetUrl);
      if (updatedContent !== newContent) {
        newContent = updatedContent;
        changed = true;
      }
    }

    if (changed) {
      toUpdate.push({ id: p.id, newContent, newUrl: publishedUrl });
      backup.push(orig);
    }
  }

  console.log(`Planned updates for ${toUpdate.length} posts`);
  const backupPath = path.join(process.cwd(), 'tmp');
  try { if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath); } catch {}
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupPath, `automation_posts_backup_${ts}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  console.log(`Backup written to ${backupFile}`);

  if (dryRun) {
    console.log('Dry run complete. No changes applied. Use --apply to update the database.');
    return { planned: toUpdate.length, backupFile };
  }

  // Apply updates in batches
  let updated = 0;
  for (let i = 0; i < toUpdate.length; i += batchSize) {
    const batch = toUpdate.slice(i, i + batchSize);
    // Build updates in parallel
    const updates = [];
    for (const u of batch) {
      const payload = {};
      if (u.newContent !== undefined) payload.content = u.newContent;
      if (u.newUrl !== undefined) payload.url = u.newUrl;
      updates.push(supabase.from('automation_posts').update(payload).eq('id', u.id));
    }
    const results = await Promise.all(updates);
    for (const r of results) {
      if (r.error) console.error('Update error:', r.error.message || r.error);
      else updated += 1;
    }
    console.log(`Applied batch ${i / batchSize + 1}: ${batch.length}`);
  }

  console.log(`Applied updates to ${updated} posts`);
  return { applied: updated, backupFile };
}

// CLI
(async () => {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply') || args.includes('-a');
  const dryRun = !apply;
  try {
    const res = await run({ dryRun });
    console.log('Result:', res);
  } catch (e) {
    console.error('Error during run:', e);
    process.exit(1);
  }
})();
