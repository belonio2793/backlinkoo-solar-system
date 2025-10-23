#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\_ ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

(async () => {
  const campaignId = process.argv[2] || '50282ae6-72c4-43e3-bfc2-4e2b402d2eac';
  console.log('Running admin publisher for campaign', campaignId);

  try {
    const { data: rawCampaign, error: cErr } = await supabase.from('automation_campaigns').select('*').eq('id', campaignId).maybeSingle();
    if (cErr || !rawCampaign) {
      console.error('Campaign not found or error:', cErr);
      process.exit(2);
    }
    const campaign = rawCampaign;

    const { data: domains, error: dErr } = await supabase.from('domains').select('*').eq('user_id', campaign.user_id).eq('dns_verified', true).eq('netlify_verified', true)
    if (dErr) throw dErr;
    const domainRows = (domains || []).filter(Boolean);
    if (!domainRows.length) {
      console.log('No eligible domains'); process.exit(0);
    }

    let published = 0;
    for (const d of domainRows) {
      try {
        // skip if existing automation_posts for this campaign & domain
        const { data: exists } = await supabase.from('automation_posts').select('id').eq('automation_id', campaignId).eq('domain_id', d.id).maybeSingle();
        if (exists) { console.log('Skipping domain, already has post:', d.domain); continue; }

        const themeKey = (d.blog_theme_template_key || d.selected_theme || 'minimal').toString().toLowerCase();
        const keyword = (Array.isArray(campaign.keywords) && campaign.keywords[0]) || campaign.keyword || campaign.name || 'post';
        const title = `${keyword} — ${d.domain}`.slice(0, 120);
        const base = slugify(title || 'post');
        const slug = `${themeKey}/${base}-${Math.random().toString(36).slice(2,7)}`;
        const targetUrl = campaign.target_url || campaign.targetUrl || '';
        const anchor = (Array.isArray(campaign.anchor_texts) && campaign.anchor_texts[0]) || campaign.anchor_text || keyword;
        const content = `<article class="${themeKey}"><h1>${title}</h1><p>Auto-generated for campaign ${campaignId}. Anchor: <a href="${targetUrl}">${anchor}</a></p></article>`;
        const host = String(d.domain).replace(/^https?:\/\//, '').replace(/\/$/, '');
        const finalUrl = `https://${host}/themes/${slug}`;

        const payload = {
          automation_id: campaignId,
          domain_id: d.id,
          user_id: campaign.user_id || null,
          slug,
          title,
          content,
          url: finalUrl,
          status: 'published',
          published_at: new Date().toISOString(),
          blog_theme: themeKey,
          keywords: Array.isArray(campaign.keywords) ? campaign.keywords : (campaign.keyword ? [String(campaign.keyword)] : []),
          anchor_texts: Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts : (campaign.anchor_text ? [String(campaign.anchor_text)] : [])
        };

        const { data: inserted, error: insErr } = await supabase.from('automation_posts').insert(payload).select().maybeSingle();
        if (insErr) {
          console.warn('Insert failed for domain', d.domain, insErr.message || insErr);
          continue;
        }
        console.log('Inserted post for domain', d.domain, 'url=', finalUrl, 'id=', inserted?.id);
        published++;
      } catch (e) {
        console.warn('Error processing domain', d.domain, e?.message || e);
      }
    }

    console.log(`Done. Published ${published} posts.`);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error', err?.message || err);
    process.exit(5);
  }
})();
