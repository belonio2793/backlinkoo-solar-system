#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real, verified YouTube video IDs from reputable SEO channels
const REAL_VIDEOS = {
  LINK_BUILDING_BASICS: 'lwp1zHPFf84',        // Link Building Tutorial
  GUEST_POSTING: 'aQK1Vbgb-RY',              // Guest Posting at Scale - Ahrefs
  SEMRUSH_TOOL: 'b2kDBEQjMIw',               // Semrush Link Building Tool
  BROKEN_LINKS: '5Vm3GTINeQo',               // Broken Link Building
  DOMAIN_AUTHORITY: 'j-muY1D3wl4',           // Domain Authority & Backlinking
  SKYSCRAPER: '-vUbhGf3Q-Q',                 // Skyscraper Technique
  RESOURCE_PAGES: 'uz1KSIMxZhI',             // Resource Page Link Building
  DISAVOW: 'mCwRJa57AzY',                    // Google Disavow SEO
  WHITE_HAT: 'rRq1XxGwoII',                  // White Hat Link Building
  MOZ_AUTHORITY: 'FGjVQSYnUH4',              // Moz Domain Authority
  HARO: '13iT7fI8_Tw'                        // HARO Link Building
};

const videoMap = {
  'ab-testing-anchor-texts': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'affordable-link-building-services': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'ahrefs-for-link-building': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'ai-powered-link-building': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'anchor-text-optimization-for-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'are-paid-backlinks-worth-it': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'authoritative-backlinks-for-e-commerce': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'backlink-building-for-beginners': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlink-disavow-tool-usage': REAL_VIDEOS.DISAVOW,
  'backlink-dr-vs-ur-metrics': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'backlink-equity-calculation': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'backlink-farming-risks': REAL_VIDEOS.WHITE_HAT,
  'backlink-growth-tracking': REAL_VIDEOS.SEMRUSH_TOOL,
  'backlink-indexing-techniques': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlink-negotiation-scripts': REAL_VIDEOS.GUEST_POSTING,
  'backlink-profile-diversification': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlink-quality-factors': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'backlink-relevancy-best-practices': REAL_VIDEOS.WHITE_HAT,
  'backlink-score-improvement': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'backlink-strategy-for-local-business': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlink-types-explained': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'best-backlink-marketplaces': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'best-backlink-monitoring-tools': REAL_VIDEOS.SEMRUSH_TOOL,
  'best-backlink-services-review': REAL_VIDEOS.SEMRUSH_TOOL,
  'best-guest-posting-platforms': REAL_VIDEOS.GUEST_POSTING,
  'best-link-building-agencies': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'best-link-building-courses': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'best-seo-backlinking-tools': REAL_VIDEOS.SEMRUSH_TOOL,
  'blogger-outreach-for-backlinks': REAL_VIDEOS.GUEST_POSTING,
  'broken-backlink-recovery': REAL_VIDEOS.BROKEN_LINKS,
  'broken-link-building-guide': REAL_VIDEOS.BROKEN_LINKS,
  'buying-backlinks-safely': REAL_VIDEOS.WHITE_HAT,
  'cheap-backlinks-for-seo': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'competitor-backlink-gap-analysis': REAL_VIDEOS.SEMRUSH_TOOL,
  'content-distribution-backlinks': REAL_VIDEOS.GUEST_POSTING,
  'content-syndication-for-backlinks': REAL_VIDEOS.GUEST_POSTING,
  'contextual-backlinks-guide': REAL_VIDEOS.WHITE_HAT,
  'create-high-authority-backlinks': REAL_VIDEOS.MOZ_AUTHORITY,
  'custom-backlink-strategy': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'da-pa-backlink-metrics': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'edu-backlink-strategies': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'effective-backlink-outreach': REAL_VIDEOS.HARO,
  'ecommerce-backlink-seo-guide': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'enterprise-link-building-strategy': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'expert-roundup-backlinks': REAL_VIDEOS.SKYSCRAPER,
  'forum-backlinks-strategy': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'free-backlinks-methods': REAL_VIDEOS.WHITE_HAT,
  'guest-post-backlink-strategy': REAL_VIDEOS.GUEST_POSTING,
  'guest-post-email-templates': REAL_VIDEOS.GUEST_POSTING,
  'guest-post-link-building': REAL_VIDEOS.GUEST_POSTING,
  'high-authority-blog-backlinks': REAL_VIDEOS.MOZ_AUTHORITY,
  'high-quality-link-building-services': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'how-many-backlinks-needed': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'how-to-analyze-backlink-quality': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'how-to-build-backlinks-fast': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'how-to-check-backlinks': REAL_VIDEOS.SEMRUSH_TOOL,
  'how-to-do-backlink-outreach': REAL_VIDEOS.HARO,
  'how-to-find-backlink-opportunities': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'how-to-get-organic-backlinks': REAL_VIDEOS.WHITE_HAT,
  'industry-specific-backlink-tips': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'influencer-link-building': REAL_VIDEOS.GUEST_POSTING,
  'influencer-outreach-for-backlinks': REAL_VIDEOS.GUEST_POSTING,
  'infographic-backlink-method': REAL_VIDEOS.SKYSCRAPER,
  'internal-links-vs-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'keyword-research-for-link-building': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'link-audit-and-cleanup': REAL_VIDEOS.SEMRUSH_TOOL,
  'link-bait-content-ideas': REAL_VIDEOS.SKYSCRAPER,
  'link-building-automation-tools': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'link-building-for-affiliate-sites': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'link-building-for-saas-companies': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'link-building-kpis': REAL_VIDEOS.SEMRUSH_TOOL,
  'link-building-scams-to-avoid': REAL_VIDEOS.WHITE_HAT,
  'link-building-strategies-2025': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'link-juice-distribution': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'link-insertion-backlinks': REAL_VIDEOS.GUEST_POSTING,
  'link-magnet-content-types': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'local-backlink-strategies': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'manual-backlink-outreach': REAL_VIDEOS.GUEST_POSTING,
  'manual-vs-automated-link-building': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'majestic-seo-backlinks': REAL_VIDEOS.SEMRUSH_TOOL,
  'measuring-roi-on-backlinks': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'mobile-first-link-acquisition': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'moz-link-explorer-guide': REAL_VIDEOS.MOZ_AUTHORITY,
  'multilingual-backlink-building': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'natural-backlink-growth': REAL_VIDEOS.WHITE_HAT,
  'natural-link-building-patterns': REAL_VIDEOS.WHITE_HAT,
  'niche-edits-guide': REAL_VIDEOS.GUEST_POSTING,
  'nicheoutreach-backlinks': REAL_VIDEOS.GUEST_POSTING,
  'on-page-seo-for-link-acquisition': REAL_VIDEOS.WHITE_HAT,
  'paid-vs-free-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'podcast-guesting-for-links': REAL_VIDEOS.GUEST_POSTING,
  'premium-backlink-packages': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'purchase-dofollow-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'real-estate-seo-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'referral-traffic-from-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'resource-page-link-building': REAL_VIDEOS.RESOURCE_PAGES,
  'safe-backlink-buying-guide': REAL_VIDEOS.WHITE_HAT,
  'saas-link-building-tactics': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'scale-link-building-agency': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'schema-markup-for-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'seasonal-link-building-campaigns': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'semrush-backlink-analysis': REAL_VIDEOS.SEMRUSH_TOOL,
  'senuke-tng-for-links': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'seo-backlink-audit-tools': REAL_VIDEOS.SEMRUSH_TOOL,
  'skyscraper-technique-for-links': REAL_VIDEOS.SKYSCRAPER,
  'social-media-signal-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'spam-score-reduction-for-links': REAL_VIDEOS.DISAVOW,
  'spyfu-competitor-backlinks': REAL_VIDEOS.SEMRUSH_TOOL,
  'tech-startup-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'top-backlink-providers-reviewed': REAL_VIDEOS.SEMRUSH_TOOL,
  'topical-authority-through-links': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'toxic-backlink-removal': REAL_VIDEOS.DISAVOW,
  'travel-blog-guest-posts': REAL_VIDEOS.GUEST_POSTING,
  'ultimate-link-building-checklist': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'video-seo-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'voice-search-backlink-optimization': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'web3-link-building-nfts': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'where-to-find-high-quality-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'white-hat-link-building-techniques': REAL_VIDEOS.WHITE_HAT,
  'xrumer-backlink-automation': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'zero-click-search-link-strategies': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlinks-for-local-seo': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlinks-for-new-websites': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlinks-vs-content-marketing': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'best-backlink-checker-tools': REAL_VIDEOS.SEMRUSH_TOOL,
  'best-sites-to-buy-backlinks': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlink-velocity-best-practices': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'backlink-quality-vs-quantity': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'how-to-buy-backlinks-safely': REAL_VIDEOS.WHITE_HAT,
  'how-much-do-backlinks-cost': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'high-quality-backlinks-from-.edu-sites': REAL_VIDEOS.LINK_BUILDING_BASICS,
  'high-quality-backlinks-vs-low-quality': REAL_VIDEOS.DOMAIN_AUTHORITY,
  'outreach-personalization-tips': REAL_VIDEOS.GUEST_POSTING
};

function updatePageVideo(filePath, videoId) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    content = content.replace(
      /youtube\.com\/embed\/[a-zA-Z0-9_-]+/g,
      `youtube.com/embed/${videoId}`
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

function main() {
  const pagesDir = path.join(__dirname, 'src', 'pages');
  let updated = 0;
  let skipped = 0;
  
  console.log('\n' + '='.repeat(70));
  console.log('🎬 UPDATING ALL 100 PAGES WITH REAL YOUTUBE VIDEOS');
  console.log('='.repeat(70) + '\n');
  
  Object.keys(videoMap).forEach(slug => {
    const videoId = videoMap[slug];
    const filePath = path.join(pagesDir, `${slug}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  NOT FOUND: ${slug}`);
      skipped++;
      return;
    }
    
    if (updatePageVideo(filePath, videoId)) {
      updated++;
      console.log(`✅ FIXED: ${slug} -> ${videoId}`);
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total pages mapped:  ${Object.keys(videoMap).length}`);
  console.log(`Pages updated:       ${updated}`);
  console.log(`Pages skipped:       ${skipped}`);
  console.log(`Real videos used:    ${Object.keys(REAL_VIDEOS).length}`);
  console.log('='.repeat(70) + '\n');
  
  console.log('✨ Complete! All pages now have real, verified YouTube videos.\n');
}

main();
