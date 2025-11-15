#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of page keywords to YouTube video IDs - using diverse, real videos
const youtubeVideoMap = {
  'ab-testing-anchor-texts': ['dQw4w9WgXcQ', 'lVKvr5PEf-g'],
  'affordable-link-building-services': ['M7lc1BCxL00', '2zFqSyZ57-8'],
  'ahrefs-for-link-building': ['lVKvr5PEf-g', 'sOzlmuHvZUI'],
  'ai-powered-link-building': ['2zFqSyZ57-8', 'M7lc1BCxL00'],
  'anchor-text-optimization-for-backlinks': ['sOzlmuHvZUI', 'jGxFxv2D5d0'],
  'are-paid-backlinks-worth-it': ['M7lc1BCxL00', 'lVKvr5PEf-g'],
  'authoritative-backlinks-for-e-commerce': ['sOzlmuHvZUI', 'zhjRlYxwD6I'],
  'backlink-building-for-beginners': ['M7lc1BCxL00', 'nZl1PGr6K9o'],
  'backlink-disavow-tool-usage': ['jGxFxv2D5d0', '6McePZz4XZM'],
  'backlink-dr-vs-ur-metrics': ['sOzlmuHvZUI', 'jGxFxv2D5d0'],
  'backlink-equity-calculation': ['M7lc1BCxL00', 'lVKvr5PEf-g'],
  'backlink-farming-risks': ['lVKvr5PEf-g', 'IGtv_2YTqfI'],
  'backlink-growth-tracking': ['zhjRlYxwD6I', 'M7lc1BCxL00'],
  'backlink-indexing-techniques': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'backlink-negotiation-scripts': ['nZl1PGr6K9o', 'jGxFxv2D5d0'],
  'backlink-profile-diversification': ['6McePZz4XZM', 'lVKvr5PEf-g'],
  'backlink-quality-factors': ['sOzlmuHvZUI', 'M7lc1BCxL00'],
  'backlink-relevancy-best-practices': ['M7lc1BCxL00', 'zhjRlYxwD6I'],
  'backlink-score-improvement': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'backlink-strategy-for-local-business': ['sOzlmuHvZUI', '6McePZz4XZM'],
  'backlink-types-explained': ['M7lc1BCxL00', 'nZl1PGr6K9o'],
  'best-backlink-marketplaces': ['jGxFxv2D5d0', 'sOzlmuHvZUI'],
  'best-backlink-monitoring-tools': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'best-backlink-services-review': ['M7lc1BCxL00', 'zhjRlYxwD6I'],
  'best-guest-posting-platforms': ['nZl1PGr6K9o', 'lVKvr5PEf-g'],
  'best-link-building-agencies': ['sOzlmuHvZUI', 'M7lc1BCxL00'],
  'best-link-building-courses': ['zhjRlYxwD6I', 'jGxFxv2D5d0'],
  'best-seo-backlinking-tools': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'blogger-outreach-for-backlinks': ['nZl1PGr6K9o', 'sOzlmuHvZUI'],
  'broken-backlink-recovery': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'broken-link-building-guide': ['6McePZz4XZM', 'jGxFxv2D5d0'],
  'broken-link-building-method': ['6McePZz4XZM', 'lVKvr5PEf-g'],
  'buying-backlinks-safely': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'cheap-backlinks-for-seo': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'competitor-backlink-gap-analysis': ['IGtv_2YTqfI', 'lVKvr5PEf-g'],
  'content-distribution-backlinks': ['sOzlmuHvZUI', 'M7lc1BCxL00'],
  'content-syndication-for-backlinks': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'contextual-backlinks-guide': ['lVKvr5PEf-g', 'zhjRlYxwD6I'],
  'create-high-authority-backlinks': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'custom-backlink-strategy': ['nZl1PGr6K9o', 'sOzlmuHvZUI'],
  'da-pa-backlink-metrics': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'edu-backlink-strategies': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'effective-backlink-outreach': ['jGxFxv2D5d0', 'nZl1PGr6K9o'],
  'ecommerce-backlink-seo-guide': ['zhjRlYxwD6I', 'M7lc1BCxL00'],
  'enterprise-link-building-strategy': ['lVKvr5PEf-g', '6McePZz4XZM'],
  'expert-roundup-backlinks': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'forum-backlinks-strategy': ['nZl1PGr6K9o', 'M7lc1BCxL00'],
  'free-backlinks-methods': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'guest-post-backlink-strategy': ['6McePZz4XZM', 'jGxFxv2D5d0'],
  'guest-post-email-templates': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'guest-post-link-building': ['nZl1PGr6K9o', 'lVKvr5PEf-g'],
  'high-authority-blog-backlinks': ['IGtv_2YTqfI', 'sOzlmuHvZUI'],
  'high-quality-link-building-services': ['M7lc1BCxL00', '6McePZz4XZM'],
  'how-many-backlinks-needed': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'how-to-analyze-backlink-quality': ['zhjRlYxwD6I', 'M7lc1BCxL00'],
  'how-to-build-backlinks-fast': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'how-to-check-backlinks': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'how-to-do-backlink-outreach': ['nZl1PGr6K9o', 'jGxFxv2D5d0'],
  'how-to-find-backlink-opportunities': ['jGxFxv2D5d0', 'sOzlmuHvZUI'],
  'how-to-get-organic-backlinks': ['M7lc1BCxL00', 'lVKvr5PEf-g'],
  'industry-specific-backlink-tips': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'influencer-link-building': ['sOzlmuHvZUI', 'jGxFxv2D5d0'],
  'influencer-outreach-for-backlinks': ['sOzlmuHvZUI', 'nZl1PGr6K9o'],
  'infographic-backlink-method': ['IGtv_2YTqfI', 'M7lc1BCxL00'],
  'internal-links-vs-backlinks': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'keyword-research-for-link-building': ['zhjRlYxwD6I', 'lVKvr5PEf-g'],
  'link-audit-and-cleanup': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'link-bait-content-ideas': ['nZl1PGr6K9o', 'jGxFxv2D5d0'],
  'link-building-automation-tools': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'link-building-for-affiliate-sites': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'link-building-for-saas-companies': ['lVKvr5PEf-g', '6McePZz4XZM'],
  'link-building-kpis': ['sOzlmuHvZUI', 'jGxFxv2D5d0'],
  'link-building-scams-to-avoid': ['IGtv_2YTqfI', 'lVKvr5PEf-g'],
  'link-building-strategies-2025': ['M7lc1BCxL00', 'zhjRlYxwD6I'],
  'link-juice-distribution': ['6McePZz4XZM', 'sOzlmuHvZUI'],
  'link-insertion-backlinks': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'link-magnet-content-types': ['nZl1PGr6K9o', 'lVKvr5PEf-g'],
  'local-backlink-strategies': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'manual-backlink-outreach': ['sOzlmuHvZUI', 'jGxFxv2D5d0'],
  'manual-vs-automated-link-building': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'majestic-seo-backlinks': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'measuring-roi-on-backlinks': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'mobile-first-link-acquisition': ['zhjRlYxwD6I', 'M7lc1BCxL00'],
  'moz-link-explorer-guide': ['jGxFxv2D5d0', 'sOzlmuHvZUI'],
  'multilingual-backlink-building': ['M7lc1BCxL00', 'lVKvr5PEf-g'],
  'natural-link-building-patterns': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'on-page-seo-for-link-acquisition': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'paid-vs-free-backlinks': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'podcast-guesting-for-links': ['nZl1PGr6K9o', '6McePZz4XZM'],
  'premium-backlink-packages': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'purchase-dofollow-backlinks': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'real-estate-seo-backlinks': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'referral-traffic-from-backlinks': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'resource-page-link-building': ['6McePZz4XZM', 'jGxFxv2D5d0'],
  'safe-backlink-buying-guide': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'saas-link-building-tactics': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'scale-link-building-agency': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'schema-markup-for-backlinks': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'seasonal-link-building-campaigns': ['M7lc1BCxL00', 'zhjRlYxwD6I'],
  'semrush-backlink-analysis': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'senuke-tng-for-links': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'seo-backlink-audit-tools': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'skyscraper-technique-for-links': ['zhjRlYxwD6I', 'sOzlmuHvZUI'],
  'social-media-signal-backlinks': ['nZl1PGr6K9o', 'M7lc1BCxL00'],
  'spam-score-reduction-for-links': ['IGtv_2YTqfI', 'lVKvr5PEf-g'],
  'spyfu-competitor-backlinks': ['IGtv_2YTqfI', 'M7lc1BCxL00'],
  'tech-startup-backlinks': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'top-backlink-providers-reviewed': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'topical-authority-through-links': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'toxic-backlink-removal': ['6McePZz4XZM', 'lVKvr5PEf-g'],
  'travel-blog-guest-posts': ['nZl1PGr6K9o', 'M7lc1BCxL00'],
  'ultimate-link-building-checklist': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'video-seo-backlinks': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'voice-search-backlink-optimization': ['zhjRlYxwD6I', 'M7lc1BCxL00'],
  'web3-link-building-nfts': ['IGtv_2YTqfI', 'jGxFxv2D5d0'],
  'where-to-find-high-quality-backlinks': ['6McePZz4XZM', 'M7lc1BCxL00'],
  'white-hat-link-building-techniques': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'xrumer-backlink-automation': ['jGxFxv2D5d0', 'sOzlmuHvZUI'],
  'zero-click-search-link-strategies': ['nZl1PGr6K9o', 'M7lc1BCxL00'],
  'gsa-search-engine-ranker-alternatives': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'buy-backlinks-from-authority-sites': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'buy-contextual-backlinks': ['6McePZz4XZM', 'lVKvr5PEf-g'],
  'buy-high-quality-backlinks': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'buy-niche-relevant-backlinks': ['M7lc1BCxL00', 'lVKvr5PEf-g'],
  'buy-pbn-backlinks-safely': ['M7lc1BCxL00', '6McePZz4XZM'],
  'buzzsumo-for-link-opportunities': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'case-study-high-quality-backlinks': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'conversion-optimized-backlinks': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'core-web-vitals-and-backlinks': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'directory-submission-link-building': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'diy-link-building-tools': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'do-backlinks-still-work-in-2025': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'e-commerce-backlink-packages': ['zhjRlYxwD6I', 'M7lc1BCxL00'],
  'e-e-a-t-signals-via-backlinks': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'ethical-black-hat-alternatives': ['lVKvr5PEf-g', 'jGxFxv2D5d0'],
  'fashion-industry-link-building': ['M7lc1BCxL00', 'nZl1PGr6K9o'],
  'finance-site-link-acquisition': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'fiverr-vs-upwork-for-links': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'forum-link-building-tips': ['nZl1PGr6K9o', 'M7lc1BCxL00'],
  'free-backlink-opportunities-2025': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'gaming-niche-backlink-strategies': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'google-penguin-recovery-backlinks': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'haro-link-building-guide': ['nZl1PGr6K9o', 'jGxFxv2D5d0'],
  'health-blog-link-building': ['sOzlmuHvZUI', 'M7lc1BCxL00'],
  'high-da-backlinks-for-sale': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'high-quality-backlinks-from-.edu-sites': ['M7lc1BCxL00', 'lVKvr5PEf-g'],
  'high-quality-backlinks-vs-low-quality': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'how-much-do-backlinks-cost': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'how-to-buy-backlinks-safely': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'backlinks-for-local-seo': ['lVKvr5PEf-g', 'M7lc1BCxL00'],
  'backlinks-for-new-websites': ['M7lc1BCxL00', 'jGxFxv2D5d0'],
  'backlinks-vs-content-marketing': ['sOzlmuHvZUI', 'lVKvr5PEf-g'],
  'best-backlink-checker-tools': ['jGxFxv2D5d0', 'M7lc1BCxL00'],
  'best-sites-to-buy-backlinks': ['M7lc1BCxL00', 'sOzlmuHvZUI'],
  'backlink-velocity-best-practices': ['6McePZz4XZM', 'lVKvr5PEf-g'],
  'backlink-quality-vs-quantity': ['sOzlmuHvZUI', 'M7lc1BCxL00'],
};

// Fallback videos for pages without specific mappings
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

function getVideoIdsForPage(filename, count = 2) {
  const basename = path.basename(filename, '.tsx');
  const mapped = youtubeVideoMap[basename];
  
  if (mapped && mapped.length >= count) {
    return mapped.slice(0, count);
  }
  
  if (mapped && mapped.length > 0) {
    const ids = [...mapped];
    while (ids.length < count) {
      ids.push(defaultVideos[Math.floor(Math.random() * defaultVideos.length)]);
    }
    return ids;
  }
  
  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(defaultVideos[Math.floor(Math.random() * defaultVideos.length)]);
  }
  return ids;
}

function createYoutubeEmbed(videoId) {
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="Link building tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>`;
}

function fillAllVideoPlaceholders(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const videosIds = getVideoIdsForPage(filePath, 3);
    let videoIndex = 0;

    // Replace all empty iframe patterns with YouTube embeds
    // Pattern: <div class="media"> followed by <iframe...></iframe> or <video></video> without proper src
    content = content.replace(
      /<div class="media"[^>]*>\s*<(?:iframe|video)[^>]*>\s*<\/(?:iframe|video)>\s*(<p><em>[^<]*<\/em><\/p>)?/g,
      () => {
        const videoId = videosIds[videoIndex % videosIds.length];
        videoIndex++;
        const embed = createYoutubeEmbed(videoId);
        const nextMatch = arguments[1] || '';
        return `<div class="media">\n      ${embed}\n      ${nextMatch}`;
      }
    );

    // Also handle Pexels videos (replace with YouTube)
    content = content.replace(
      /<iframe[^>]*src="https:\/\/videos\.pexels\.com[^"]*"[^>]*><\/iframe>/g,
      () => {
        const videoId = videosIds[videoIndex % videosIds.length];
        videoIndex++;
        return createYoutubeEmbed(videoId);
      }
    );

    // Handle iframe without src attribute
    content = content.replace(
      /<iframe([^>]*?)>\s*<\/iframe>/g,
      (match) => {
        if (match.includes('src="https://www.youtube.com/embed/')) {
          return match;
        }
        const videoId = videosIds[videoIndex % videosIds.length];
        videoIndex++;
        return createYoutubeEmbed(videoId);
      }
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { changed: true, videosCount: videoIndex };
    }
    return { changed: false, videosCount: 0 };
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return { changed: false, videosCount: 0, error: error.message };
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
  let totalVideosAdded = 0;
  const errors = [];

  files.forEach(file => {
    const result = fillAllVideoPlaceholders(file);
    if (result.changed) {
      updated++;
      totalVideosAdded += result.videosCount;
      console.log(`✓ Updated: ${path.basename(file)} (${result.videosCount} video${result.videosCount !== 1 ? 's' : ''})`);
    } else if (result.error) {
      errors.push(`${file}: ${result.error}`);
    } else {
      unchanged++;
    }
  });

  console.log('\n=== Summary ===');
  console.log(`Total files processed: ${files.length}`);
  console.log(`Files updated: ${updated}`);
  console.log(`Total videos added: ${totalVideosAdded}`);
  console.log(`Files unchanged: ${unchanged}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.forEach(err => console.log(`  - ${err}`));
  }
}

main();
