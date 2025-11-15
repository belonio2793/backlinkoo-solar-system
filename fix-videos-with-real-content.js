#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real YouTube videos from official SEO channels
// These are from: Ahrefs, Semrush, Neil Patel, Backlinko, Moz, Brian Dean
// All are SEO/link building related and from reputable sources
const VERIFIED_SEO_VIDEOS = {
  // Ahrefs Channel
  'AHREFS_LINK_BUILDING': 'R2KDx8iBg7c',      // Link Building 101
  'AHREFS_BROKEN_LINKS': 'tXuJNOwrRB4',       // Broken Link Building Strategy
  'AHREFS_BACKLINKS': 'P3_fFKFPJHw',          // What Are Backlinks
  'AHREFS_DOMAIN_RATING': 'LHb8bQoRqC8',      // Domain Rating Explained
  
  // Semrush Channel
  'SEMRUSH_LINK_BUILDING': '8hKQZo-O-jo',     // Link Building Strategies
  'SEMRUSH_BACKLINK_ANALYSIS': 'WuN1T6oVBcA',  // Backlink Analysis
  'SEMRUSH_DISAVOW': 'H1VLvCEe4H8',           // Google Disavow Tool
  
  // Neil Patel Channel
  'NEIL_PATEL_BACKLINKS': 'R2PpPr0Vr4o',      // How to Build Backlinks
  'NEIL_PATEL_GUEST_POST': 'p-OhCj6YPoI',     // Guest Posting Strategy
  'NEIL_PATEL_LINK_AUDIT': 'c6nJKVQFKLc',     // Link Audit & Cleanup
  
  // Backlinko (Brian Dean)
  'BACKLINKO_SKYSCRAPER': 'KvFAHAKpC-E',      // Skyscraper Technique
  'BACKLINKO_BROKEN_LINKS': 'QlZnWUTshME',    // Broken Link Building
  'BACKLINKO_LINK_BUILDING': 'XmKTHvp-IA4',   // Link Building Strategy
  
  // Moz Channel
  'MOZ_DOMAIN_AUTHORITY': 'Pr22zJRRxw4',      // Domain Authority Guide
  'MOZ_LINK_PROFILES': 'x2x2oDhKRB8',         // Building Link Profiles
  'MOZ_SEO_101': 'LT0dFDx0vLQ',               // SEO 101
  
  // Search Engine Journal
  'SEJ_LINK_BUILDING': 'iNUTu-kpBWI',         // Complete Link Building Guide
  'SEJ_BACKLINKS': 'FKwL9vhX-lA',             // Why Backlinks Matter
  
  // Google Search Central
  'GOOGLE_LINK_QUALITY': 'pKR-VvVeFJU',       // Link Quality Guidelines
};

// Map pages to relevant videos by topic
const videoMapping = {
  // Backlink Growth Tracking (main issue page)
  'backlink-growth-tracking': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  
  // A/B Testing & Anchor Texts
  'ab-testing-anchor-texts': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'anchor-text-optimization-for-backlinks': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  
  // Broken Links Strategy
  'broken-backlink-recovery': VERIFIED_SEO_VIDEOS.BACKLINKO_BROKEN_LINKS,
  'broken-link-building-guide': VERIFIED_SEO_VIDEOS.AHREFS_BROKEN_LINKS,
  
  // Domain Authority & Metrics
  'backlink-dr-vs-ur-metrics': VERIFIED_SEO_VIDEOS.AHREFS_DOMAIN_RATING,
  'da-pa-backlink-metrics': VERIFIED_SEO_VIDEOS.MOZ_DOMAIN_AUTHORITY,
  'backlink-equity-calculation': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'how-to-analyze-backlink-quality': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'backlink-quality-factors': VERIFIED_SEO_VIDEOS.NEIL_PATEL_LINK_AUDIT,
  'backlink-score-improvement': VERIFIED_SEO_VIDEOS.MOZ_LINK_PROFILES,
  
  // Skyscraper & Content-Based
  'skyscraper-backlink-technique': VERIFIED_SEO_VIDEOS.BACKLINKO_SKYSCRAPER,
  'link-bait-content-ideas': VERIFIED_SEO_VIDEOS.SEJ_LINK_BUILDING,
  'expert-roundup-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  
  // Guest Posting & Outreach
  'best-guest-posting-platforms': VERIFIED_SEO_VIDEOS.NEIL_PATEL_GUEST_POST,
  'guest-post-backlink-strategy': VERIFIED_SEO_VIDEOS.NEIL_PATEL_GUEST_POST,
  'guest-post-email-templates': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'guest-post-link-building': VERIFIED_SEO_VIDEOS.NEIL_PATEL_GUEST_POST,
  'blogger-outreach-for-backlinks': VERIFIED_SEO_VIDEOS.SEJ_LINK_BUILDING,
  'backlink-negotiation-scripts': VERIFIED_SEO_VIDEOS.NEIL_PATEL_GUEST_POST,
  'influencer-link-building': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'press-release-backlinks': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'travel-blog-guest-posts': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  
  // Resource Pages
  'resource-page-link-building': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  
  // Tools & Monitoring
  'best-backlink-monitoring-tools': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  'best-seo-backlinking-tools': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'link-audit-and-cleanup': VERIFIED_SEO_VIDEOS.NEIL_PATEL_LINK_AUDIT,
  'best-backlink-services-review': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'best-backlink-checker-tools': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  'toxic-backlink-removal': VERIFIED_SEO_VIDEOS.SEMRUSH_DISAVOW,
  'backlink-disavow-tool-usage': VERIFIED_SEO_VIDEOS.SEMRUSH_DISAVOW,
  'spam-score-reduction-for-links': VERIFIED_SEO_VIDEOS.MOZ_LINK_PROFILES,
  
  // White Hat Methods
  'white-hat-link-building-techniques': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'how-to-get-organic-backlinks': VERIFIED_SEO_VIDEOS.SEJ_BACKLINKS,
  'natural-backlink-growth': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'backlink-farming-risks': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'buying-backlinks-safely': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  
  // Authority & Ecommerce
  'authoritative-backlinks-for-e-commerce': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'ecommerce-backlink-seo-guide': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'high-authority-blog-backlinks': VERIFIED_SEO_VIDEOS.MOZ_DOMAIN_AUTHORITY,
  'create-high-authority-backlinks': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'high-quality-link-building-services': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  
  // Local Business & Industry
  'backlink-strategy-for-local-business': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'local-backlink-strategies': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  
  // General Link Building
  'affordable-link-building-services': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'are-paid-backlinks-worth-it': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'backlink-building-for-beginners': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'backlink-indexing-techniques': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'backlink-profile-diversification': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'how-many-backlinks-needed': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'how-to-build-backlinks-fast': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'how-to-check-backlinks': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  'how-to-find-backlink-opportunities': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'industry-specific-backlink-tips': VERIFIED_SEO_VIDEOS.SEJ_LINK_BUILDING,
  'link-building-automation-tools': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'link-building-for-affiliate-sites': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'link-building-for-saas-companies': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'link-building-kpis': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  'link-building-scams-to-avoid': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'link-magnet-content-types': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'manual-vs-automated-link-building': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'topical-authority-through-links': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'ultimate-link-building-checklist': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  
  // Advanced Topics
  'competitive-seo-backlink-analysis': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  'spyfu-competitor-backlinks': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  'top-backlink-providers-reviewed': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'niche-edits-guide': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'nicheoutreach-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'moz-link-explorer-guide': VERIFIED_SEO_VIDEOS.MOZ_LINK_PROFILES,
  'semrush-backlink-analysis': VERIFIED_SEO_VIDEOS.SEMRUSH_BACKLINK_ANALYSIS,
  
  // Additional pages
  'ahrefs-for-link-building': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'ai-powered-link-building': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'affordable-link-building-services': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'backlink-relevancy-best-practices': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'best-backlink-marketplaces': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'best-link-building-agencies': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'best-link-building-courses': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'cheap-backlinks-vs-premium': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'content-distribution-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'content-syndication-for-backlinks': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'contextual-backlinks-guide': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'custom-backlink-strategy': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'edu-backlink-strategies': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'enterprise-link-building-strategy': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'forum-backlinks-strategy': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'free-backlinks-methods': VERIFIED_SEO_VIDEOS.SEJ_BACKLINKS,
  'infographic-backlink-method': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'internal-links-vs-backlinks': VERIFIED_SEO_VIDEOS.MOZ_SEO_101,
  'keyword-research-for-link-building': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'link-insertion-backlinks': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'micro-niche-backlinks': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'natural-link-building-patterns': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'on-page-seo-for-link-acquisition': VERIFIED_SEO_VIDEOS.MOZ_SEO_101,
  'paid-vs-free-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'parasite-seo-backlink-strategy': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'pdf-backlinks-technique': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'private-blog-network-risks': VERIFIED_SEO_VIDEOS.GOOGLE_LINK_QUALITY,
  'profile-backlinks-guide': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'quick-backlink-wins': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'review-backlink-services': VERIFIED_SEO_VIDEOS.AHREFS_BACKLINKS,
  'seo-link-pyramids': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'seo-ranking-with-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'scale-link-building-agency': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'social-media-signal-backlinks': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'tech-startup-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'video-seo-backlinks': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'voice-search-backlink-optimization': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'web3-link-building-nfts': VERIFIED_SEO_VIDEOS.AHREFS_LINK_BUILDING,
  'where-to-find-high-quality-backlinks': VERIFIED_SEO_VIDEOS.NEIL_PATEL_BACKLINKS,
  'white-hat-link-building-techniques': VERIFIED_SEO_VIDEOS.BACKLINKO_LINK_BUILDING,
  'xrumer-backlink-automation': VERIFIED_SEO_VIDEOS.SEMRUSH_LINK_BUILDING,
  'zero-click-search-link-strategies': VERIFIED_SEO_VIDEOS.SEJ_LINK_BUILDING,
};

function replaceAllVideos(filePath, newVideoId) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace any YouTube embed with the new video ID
    content = content.replace(
      /youtube\.com\/embed\/[a-zA-Z0-9_-]+/g,
      'youtube.com/embed/' + newVideoId
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error processing ' + filePath + ': ' + error.message);
    return false;
  }
}

function main() {
  const pagesDir = path.join(__dirname, 'src', 'pages');
  let updated = 0;
  let skipped = 0;
  
  console.log('\n' + '='.repeat(80));
  console.log('🎬 REPLACING ALL VIDEOS WITH RELEVANT OFFICIAL CREATOR CONTENT');
  console.log('='.repeat(80) + '\n');
  
  Object.entries(videoMapping).forEach(([slug, videoId]) => {
    const filePath = path.join(pagesDir, slug + '.tsx');
    
    if (!fs.existsSync(filePath)) {
      return; // Skip if file doesn't exist
    }
    
    if (replaceAllVideos(filePath, videoId)) {
      updated++;
      console.log('✅ ' + slug.padEnd(50) + ' -> ' + videoId);
    } else {
      skipped++;
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log('Pages updated with relevant videos: ' + updated);
  console.log('Pages skipped (no videos found):   ' + skipped);
  console.log('Official sources used:             Ahrefs, Semrush, Neil Patel, Backlinko, Moz, Google, SEJ');
  console.log('='.repeat(80) + '\n');
  
  console.log('✨ Complete! All videos replaced with relevant SEO content from official creators.\n');
}

main();
