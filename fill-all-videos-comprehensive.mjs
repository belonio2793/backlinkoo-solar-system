#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive mapping of all 100 page slugs to YouTube video IDs
const youtubeVideoMap = {
  'ab-testing-anchor-texts': 'nZl1PGr6K9o',
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
  'guest-post-link-building': 'nZl1PGr6K9o',
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
  'majestic-seo-backlinks': '6McePZz4XZM',
  'measuring-roi-on-backlinks': 'lVKvr5PEf-g',
  'mobile-first-link-acquisition': 'zhjRlYxwD6I',
  'moz-link-explorer-guide': 'jGxFxv2D5d0',
  'multilingual-backlink-building': 'M7lc1BCxL00',
  'natural-backlink-growth': '6McePZz4XZM',
  'natural-link-building-patterns': 'M7lc1BCxL00',
  'niche-edits-guide': 'M7lc1BCxL00',
  'nicheoutreach-backlinks': 'jGxFxv2D5d0',
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
};

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

function ensureVideoInPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const videoId = getVideoIdForPage(filePath);
    
    // Check if page already has this video
    if (content.includes(`youtube.com/embed/${videoId}`)) {
      return { changed: false, hasVideo: true, videoId };
    }
    
    // Replace placeholder video IDs with real ones
    content = content.replace(/youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*/g, `youtube.com/embed/${videoId}`);
    
    // If still no video, add one
    if (!content.includes('youtube.com/embed/')) {
      const youtubeEmbed = createYoutubeEmbed(videoId);
      
      // Insert in media block before FAQ or Conclusion
      if (content.includes('<h2>FAQ')) {
        const divBlock = `\n  <div class="media">\n    ${youtubeEmbed}\n    <p><em>Video tutorial on this topic</em></p>\n  </div>\n\n  `;
        content = content.replace('<h2>FAQ', divBlock + '<h2>FAQ');
      } else if (content.includes('<h2>Conclusion')) {
        const divBlock = `\n  <div class="media">\n    ${youtubeEmbed}\n    <p><em>Expert insights on this topic</em></p>\n  </div>\n\n  `;
        content = content.replace('<h2>Conclusion', divBlock + '<h2>Conclusion');
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { changed: true, hasVideo: true, videoId };
    }
    return { changed: false, hasVideo: true, videoId };
  } catch (error) {
    return { changed: false, hasVideo: false, videoId: null, error: error.message };
  }
}

function main() {
  const pagesDir = path.join(__dirname, 'src', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  const targetPageNames = Object.keys(youtubeVideoMap).map(k => `${k}.tsx`);
  
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx') && targetPageNames.includes(f))
    .map(f => path.join(pagesDir, f));

  let updated = 0;
  let withVideo = 0;
  const errors = [];
  const results = [];

  console.log(`\n📋 Processing ${files.length} pages...\n`);

  files.forEach(file => {
    const result = ensureVideoInPage(file);
    const filename = path.basename(file);
    
    if (result.hasVideo) {
      withVideo++;
    }
    
    if (result.changed) {
      updated++;
      console.log(`✓ UPDATED: ${filename}`);
      results.push({ filename, videoId: result.videoId, status: 'updated' });
    } else if (result.error) {
      errors.push({ filename, error: result.error });
      console.log(`✗ ERROR: ${filename}`);
    } else if (result.hasVideo) {
      console.log(`✓ EXISTS: ${filename}`);
      results.push({ filename, videoId: result.videoId, status: 'exists' });
    } else {
      console.log(`⚠ NO VIDEO: ${filename}`);
      results.push({ filename, videoId: null, status: 'missing' });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total pages:     ${files.length}`);
  console.log(`With videos:     ${withVideo}`);
  console.log(`Updated:         ${updated}`);
  console.log(`Errors:          ${errors.length}`);
  console.log(`Coverage:        ${Math.round((withVideo / files.length) * 100)}%`);
  console.log('='.repeat(60));
}

main();
