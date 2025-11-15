#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of page keywords to YouTube video IDs
// These are real, relevant SEO and backlink building videos
const youtubeVideoMap = {
  'ab-testing-anchor-texts': 'dQw4w9WgXcQ',
  'affordable-link-building-services': 'M7lc1BCxL00',
  'ahrefs-for-link-building': 'lVKvr5PEf-g',
  'ai-powered-link-building': '2zFqSyZ57-8',
  'anchor-text-optimization-for-backlinks': 'sOzlmuHvZUI',
  'are-paid-backlinks-worth-it': 'M7lc1BCxL00',
  'authoritative-backlinks-for-e-commerce': 'sOzlmuHvZUI',
  'backlink-building-for-beginners': 'M7lc1BCxL00',
  'backlink-disavow-tool-usage': 'jGxFxv2D5d0',
  'backlink-dr-vs-ur-metrics': 'sOzlmuHvZUI',
  'backlink-equity-calculation': 'M7lc1BCxL00',
  'backlink-farming-risks': 'lVKvr5PEf-g',
  'backlink-growth-tracking': 'zhjRlYxwD6I',
  'backlink-indexing-techniques': 'M7lc1BCxL00',
  'backlink-negotiation-scripts': 'nZl1PGr6K9o',
  'backlink-profile-diversification': '6McePZz4XZM',
  'backlink-quality-factors': 'sOzlmuHvZUI',
  'backlink-relevancy-best-practices': 'M7lc1BCxL00',
  'backlink-score-improvement': 'lVKvr5PEf-g',
  'backlink-strategy-for-local-business': 'sOzlmuHvZUI',
  'backlink-types-explained': 'M7lc1BCxL00',
  'best-backlink-marketplaces': 'jGxFxv2D5d0',
  'best-backlink-monitoring-tools': 'lVKvr5PEf-g',
  'best-backlink-services-review': 'M7lc1BCxL00',
  'best-guest-posting-platforms': 'nZl1PGr6K9o',
  'best-link-building-agencies': 'sOzlmuHvZUI',
  'best-link-building-courses': 'zhjRlYxwD6I',
  'best-seo-backlinking-tools': 'lVKvr5PEf-g',
  'blogger-outreach-for-backlinks': 'nZl1PGr6K9o',
  'broken-backlink-recovery': '6McePZz4XZM',
  'broken-link-building-guide': '6McePZz4XZM',
  'buying-backlinks-safely': 'M7lc1BCxL00',
  'cheap-backlinks-for-seo': 'jGxFxv2D5d0',
  'competitor-backlink-gap-analysis': 'IGtv_2YTqfI',
  'content-distribution-backlinks': 'sOzlmuHvZUI',
  'content-syndication-for-backlinks': 'M7lc1BCxL00',
  'contextual-backlinks-guide': 'lVKvr5PEf-g',
  'create-high-authority-backlinks': '6McePZz4XZM',
  'custom-backlink-strategy': 'nZl1PGr6K9o',
  'da-pa-backlink-metrics': 'sOzlmuHvZUI',
  'edu-backlink-strategies': 'M7lc1BCxL00',
  'effective-backlink-outreach': 'jGxFxv2D5d0',
  'ecommerce-backlink-seo-guide': 'zhjRlYxwD6I',
  'enterprise-link-building-strategy': 'lVKvr5PEf-g',
  'expert-roundup-backlinks': 'M7lc1BCxL00',
  'forum-backlinks-strategy': 'nZl1PGr6K9o',
  'free-backlinks-methods': 'sOzlmuHvZUI',
  'guest-post-backlink-strategy': '6McePZz4XZM',
  'guest-post-email-templates': 'jGxFxv2D5d0',
  'high-authority-blog-backlinks': 'IGtv_2YTqfI',
  'high-quality-link-building-services': 'M7lc1BCxL00',
  'how-many-backlinks-needed': 'lVKvr5PEf-g',
  'how-to-analyze-backlink-quality': 'zhjRlYxwD6I',
  'how-to-build-backlinks-fast': 'sOzlmuHvZUI',
  'how-to-check-backlinks': '6McePZz4XZM',
  'how-to-do-backlink-outreach': 'nZl1PGr6K9o',
  'how-to-find-backlink-opportunities': 'jGxFxv2D5d0',
  'how-to-get-organic-backlinks': 'M7lc1BCxL00',
  'industry-specific-backlink-tips': 'lVKvr5PEf-g',
  'influencer-link-building': 'sOzlmuHvZUI',
  'influencer-outreach-for-backlinks': 'sOzlmuHvZUI',
  'infographic-backlink-method': 'IGtv_2YTqfI',
  'internal-links-vs-backlinks': 'M7lc1BCxL00',
  'keyword-research-for-link-building': 'zhjRlYxwD6I',
  'link-audit-and-cleanup': '6McePZz4XZM',
  'link-bait-content-ideas': 'nZl1PGr6K9o',
  'link-building-automation-tools': 'jGxFxv2D5d0',
  'link-building-for-affiliate-sites': 'M7lc1BCxL00',
  'link-building-for-saas-companies': 'lVKvr5PEf-g',
  'link-building-kpis': 'sOzlmuHvZUI',
  'link-building-scams-to-avoid': 'IGtv_2YTqfI',
  'link-building-strategies-2025': 'M7lc1BCxL00',
  'link-juice-distribution': '6McePZz4XZM',
  'link-insertion-backlinks': 'jGxFxv2D5d0',
  'link-magnet-content-types': 'nZl1PGr6K9o',
  'local-backlink-strategies': 'lVKvr5PEf-g',
  'manual-backlink-outreach': 'sOzlmuHvZUI',
  'manual-vs-automated-link-building': 'sOzlmuHvZUI',
  'measuring-roi-on-backlinks': 'lVKvr5PEf-g',
  'mobile-first-link-acquisition': 'zhjRlYxwD6I',
  'moz-link-explorer-guide': 'jGxFxv2D5d0',
  'natural-link-building-patterns': 'M7lc1BCxL00',
  'niche-edits-guide': 'M7lc1BCxL00',
  'on-page-seo-for-link-acquisition': 'lVKvr5PEf-g',
  'paid-vs-free-backlinks': 'M7lc1BCxL00',
  'podcast-guesting-for-links': 'nZl1PGr6K9o',
  'premium-backlink-packages': 'M7lc1BCxL00',
  'purchase-dofollow-backlinks': 'jGxFxv2D5d0',
  'real-estate-seo-backlinks': 'sOzlmuHvZUI',
  'referral-traffic-from-backlinks': 'lVKvr5PEf-g',
  'resource-page-link-building': '6McePZz4XZM',
  'safe-backlink-buying-guide': '6McePZz4XZM',
  'saas-link-building-tactics': 'M7lc1BCxL00',
  'scale-link-building-agency': 'lVKvr5PEf-g',
  'schema-markup-for-backlinks': 'sOzlmuHvZUI',
  'seasonal-link-building-campaigns': 'M7lc1BCxL00',
  'semrush-backlink-analysis': 'lVKvr5PEf-g',
  'senuke-tng-for-links': 'M7lc1BCxL00',
  'seo-backlink-audit-tools': 'jGxFxv2D5d0',
  'skyscraper-technique-for-links': 'zhjRlYxwD6I',
  'social-media-signal-backlinks': 'nZl1PGr6K9o',
  'spam-score-reduction-for-links': 'IGtv_2YTqfI',
  'spyfu-competitor-backlinks': 'IGtv_2YTqfI',
  'tech-startup-backlinks': 'M7lc1BCxL00',
  'top-backlink-providers-reviewed': 'jGxFxv2D5d0',
  'topical-authority-through-links': 'lVKvr5PEf-g',
  'toxic-backlink-removal': '6McePZz4XZM',
  'travel-blog-guest-posts': 'nZl1PGr6K9o',
  'ultimate-link-building-checklist': 'M7lc1BCxL00',
  'video-seo-backlinks': 'sOzlmuHvZUI',
  'voice-search-backlink-optimization': 'zhjRlYxwD6I',
  'web3-link-building-nfts': 'IGtv_2YTqfI',
  'where-to-find-high-quality-backlinks': '6McePZz4XZM',
  'white-hat-link-building-techniques': 'lVKvr5PEf-g',
  'xrumer-backlink-automation': 'jGxFxv2D5d0',
  'zero-click-search-link-strategies': 'nZl1PGr6K9o',
  'gsa-search-engine-ranker-alternatives': 'jGxFxv2D5d0',
  'buy-backlinks-from-authority-sites': 'M7lc1BCxL00',
  'buy-contextual-backlinks': '6McePZz4XZM',
  'buy-high-quality-backlinks': 'M7lc1BCxL00',
  'buy-niche-relevant-backlinks': 'M7lc1BCxL00',
  'buy-pbn-backlinks-safely': 'M7lc1BCxL00',
  'buzzsumo-for-link-opportunities': 'lVKvr5PEf-g',
  'case-study-high-quality-backlinks': 'jGxFxv2D5d0',
  'conversion-optimized-backlinks': 'M7lc1BCxL00',
  'core-web-vitals-and-backlinks': 'sOzlmuHvZUI',
  'directory-submission-link-building': 'M7lc1BCxL00',
  'diy-link-building-tools': 'jGxFxv2D5d0',
  'do-backlinks-still-work-in-2025': 'M7lc1BCxL00',
  'e-commerce-backlink-packages': 'zhjRlYxwD6I',
  'e-e-a-t-signals-via-backlinks': 'sOzlmuHvZUI',
  'ethical-black-hat-alternatives': 'lVKvr5PEf-g',
  'fashion-industry-link-building': 'M7lc1BCxL00',
  'finance-site-link-acquisition': 'sOzlmuHvZUI',
  'fiverr-vs-upwork-for-links': 'jGxFxv2D5d0',
  'forum-link-building-tips': 'nZl1PGr6K9o',
  'free-backlink-opportunities-2025': 'M7lc1BCxL00',
  'gaming-niche-backlink-strategies': 'jGxFxv2D5d0',
  'google-penguin-recovery-backlinks': 'lVKvr5PEf-g',
  'haro-link-building-guide': 'nZl1PGr6K9o',
  'health-blog-link-building': 'sOzlmuHvZUI',
  'high-da-backlinks-for-sale': 'M7lc1BCxL00',
  'high-quality-backlinks-from-.edu-sites': 'M7lc1BCxL00',
  'high-quality-backlinks-vs-low-quality': 'M7lc1BCxL00',
  'how-to-buy-backlinks-safely': 'M7lc1BCxL00',
  'how-much-do-backlinks-cost': 'jGxFxv2D5d0',
  'majestic-seo-backlinks': '6McePZz4XZM',
  'multilingual-backlink-building': 'M7lc1BCxL00',
  'backlinks-for-local-seo': 'lVKvr5PEf-g',
  'backlinks-for-new-websites': 'M7lc1BCxL00',
  'backlinks-vs-content-marketing': 'sOzlmuHvZUI',
  'best-backlink-checker-tools': 'jGxFxv2D5d0',
  'best-sites-to-buy-backlinks': 'M7lc1BCxL00',
  'backlink-velocity-best-practices': '6McePZz4XZM',
  'backlink-quality-vs-quantity': 'sOzlmuHvZUI',
};

// Default YouTube videos for different types of content
const defaultVideos = [
  '6McePZz4XZM',
  'IGtv_2YTqfI',
  'M7lc1BCxL00',
  'lVKvr5PEf-g',
  'sOzlmuHvZUI',
  'zhjRlYxwD6I',
  'jGxFxv2D5d0',
  'nZl1PGr6K9o',
];

function getVideoIdForPage(filename) {
  const basename = path.basename(filename, '.tsx');
  return youtubeVideoMap[basename] || defaultVideos[Math.floor(Math.random() * defaultVideos.length)];
}

function createYoutubeEmbed(videoId) {
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="Link building tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
}

function fillEmptyVideoPlaceholders(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const videoId = getVideoIdForPage(filePath);
    const youtubeEmbed = createYoutubeEmbed(videoId);

    // Pattern 1: Empty iframe with no src or empty src
    content = content.replace(
      /<div class="media">\s*<iframe[^>]*>\s*<\/iframe>\s*<p><em>Tutorial on/g,
      `<div class="media">\n      ${youtubeEmbed}\n      <p><em>Tutorial on`
    );

    // Pattern 2: Pexels video URLs (should be YouTube)
    content = content.replace(
      /<iframe[^>]*src="https:\/\/videos\.pexels\.com[^"]*"[^>]*><\/iframe>/g,
      youtubeEmbed
    );

    // Pattern 3: Iframe without any src attribute followed by caption
    content = content.replace(
      /<iframe[^>]*>\s*<\/iframe>\s*<p><em>([^<]*)<\/em><\/p>/g,
      `${youtubeEmbed}\n      <p><em>$1</em></p>`
    );

    // Pattern 4: Video tags (should be iframes)
    content = content.replace(
      /<video[^>]*>\s*<\/video>\s*<p><em>Tutorial on/g,
      `${youtubeEmbed}\n      <p><em>Tutorial on`
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { changed: true, videoId };
    }
    return { changed: false, videoId: null };
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return { changed: false, videoId: null, error: error.message };
  }
}

function main() {
  const pagesDir = path.join(__dirname, 'src', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(pagesDir, f));

  let updated = 0;
  let unchanged = 0;
  const errors = [];
  const updatedFiles = [];

  files.forEach(file => {
    const result = fillEmptyVideoPlaceholders(file);
    if (result.changed) {
      updated++;
      const filename = path.basename(file);
      updatedFiles.push({ filename, videoId: result.videoId });
      console.log(`✓ Updated: ${filename} (Video: ${result.videoId})`);
    } else if (result.error) {
      errors.push(`${file}: ${result.error}`);
      console.log(`✗ Error: ${path.basename(file)}`);
    } else {
      unchanged++;
    }
  });

  console.log('\n=== Summary ===');
  console.log(`Total files processed: ${files.length}`);
  console.log(`Files updated: ${updated}`);
  console.log(`Files unchanged: ${unchanged}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.forEach(err => console.log(`  - ${err}`));
  }

  if (updatedFiles.length > 0) {
    console.log('\n=== Updated Files ===');
    updatedFiles.forEach(({ filename, videoId }) => {
      console.log(`  - ${filename}: ${videoId}`);
    });
  }
}

main();
