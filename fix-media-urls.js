#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Image rotation URLs (10 total)
const imageUrls = [
  'https://images.pexels.com/photos/669621/pexels-photo-669621.jpeg',
  'https://images.pexels.com/photos/6281145/pexels-photo-6281145.jpeg',
  'https://images.pexels.com/photos/313691/pexels-photo-313691.jpeg',
  'https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg',
  'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
  'https://images.pexels.com/photos/33137126/pexels-photo-33137126.jpeg',
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
  'https://images.pexels.com/photos/6894103/pexels-photo-6894103.jpeg',
  'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
  'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg'
];

// Video rotation URLs (2 total)
const videoUrls = [
  'https://videos.pexels.com/video-files/6003997/6003997-sd_540_960_30fps.mp4',
  'https://videos.pexels.com/video-files/6584525/6584525-sd_240_426_25fps.mp4'
];

// List of 100 files to process
const filesToProcess = [
  'ab-testing-anchor-texts.tsx',
  'affordable-link-building-services.tsx',
  'ahrefs-for-link-building.tsx',
  'ai-powered-link-building.tsx',
  'anchor-text-optimization-for-backlinks.tsx',
  'are-paid-backlinks-worth-it.tsx',
  'authoritative-backlinks-for-e-commerce.tsx',
  'backlink-building-for-beginners.tsx',
  'backlink-disavow-tool-usage.tsx',
  'backlink-dr-vs-ur-metrics.tsx',
  'backlink-equity-calculation.tsx',
  'backlink-farming-risks.tsx',
  'backlink-growth-tracking.tsx',
  'backlink-indexing-techniques.tsx',
  'backlink-negotiation-scripts.tsx',
  'backlink-profile-diversification.tsx',
  'backlink-quality-vs-quantity.tsx',
  'backlink-velocity-best-practices.tsx',
  'backlinks-for-local-seo.tsx',
  'backlinks-for-new-websites.tsx',
  'backlinks-vs-content-marketing.tsx',
  'best-backlink-checker-tools.tsx',
  'best-sites-to-buy-backlinks.tsx',
  'broken-link-building-method.tsx',
  'buy-backlinks-from-authority-sites.tsx',
  'buy-contextual-backlinks.tsx',
  'buy-high-quality-backlinks.tsx',
  'buy-niche-relevant-backlinks.tsx',
  'buy-pbn-backlinks-safely.tsx',
  'buzzsumo-for-link-opportunities.tsx',
  'case-study-high-quality-backlinks.tsx',
  'cheap-backlinks-for-seo.tsx',
  'competitor-backlink-gap-analysis.tsx',
  'conversion-optimized-backlinks.tsx',
  'core-web-vitals-and-backlinks.tsx',
  'directory-submission-link-building.tsx',
  'diy-link-building-tools.tsx',
  'do-backlinks-still-work-in-2025.tsx',
  'e-commerce-backlink-packages.tsx',
  'e-e-a-t-signals-via-backlinks.tsx',
  'ethical-black-hat-alternatives.tsx',
  'fashion-industry-link-building.tsx',
  'finance-site-link-acquisition.tsx',
  'fiverr-vs-upwork-for-links.tsx',
  'forum-link-building-tips.tsx',
  'free-backlink-opportunities-2025.tsx',
  'gaming-niche-backlink-strategies.tsx',
  'google-penguin-recovery-backlinks.tsx',
  'gsa-search-engine-ranker-alternatives.tsx',
  'guest-post-link-building.tsx',
  'haro-link-building-guide.tsx',
  'health-blog-link-building.tsx',
  'high-da-backlinks-for-sale.tsx',
  'high-quality-backlinks-from-.edu-sites.tsx',
  'high-quality-backlinks-vs-low-quality.tsx',
  'how-much-do-backlinks-cost.tsx',
  'how-to-buy-backlinks-safely.tsx',
  'influencer-outreach-for-backlinks.tsx',
  'link-building-strategies-2025.tsx',
  'link-juice-distribution.tsx',
  'majestic-seo-backlinks.tsx',
  'manual-backlink-outreach.tsx',
  'measuring-roi-on-backlinks.tsx',
  'mobile-first-link-acquisition.tsx',
  'moz-link-explorer-guide.tsx',
  'multilingual-backlink-building.tsx',
  'natural-link-building-patterns.tsx',
  'on-page-seo-for-link-acquisition.tsx',
  'paid-vs-free-backlinks.tsx',
  'podcast-guesting-for-links.tsx',
  'premium-backlink-packages.tsx',
  'purchase-dofollow-backlinks.tsx',
  'real-estate-seo-backlinks.tsx',
  'referral-traffic-from-backlinks.tsx',
  'resource-page-link-building.tsx',
  'saas-link-building-tactics.tsx',
  'safe-backlink-buying-guide.tsx',
  'scale-link-building-agency.tsx',
  'schema-markup-for-backlinks.tsx',
  'seasonal-link-building-campaigns.tsx',
  'semrush-backlink-analysis.tsx',
  'senuke-tng-for-links.tsx',
  'seo-backlink-audit-tools.tsx',
  'skyscraper-technique-for-links.tsx',
  'social-media-signal-backlinks.tsx',
  'spam-score-reduction-for-links.tsx',
  'spyfu-competitor-backlinks.tsx',
  'tech-startup-backlinks.tsx',
  'top-backlink-providers-reviewed.tsx',
  'topical-authority-through-links.tsx',
  'toxic-backlink-removal.tsx',
  'travel-blog-guest-posts.tsx',
  'ultimate-link-building-checklist.tsx',
  'video-seo-backlinks.tsx',
  'voice-search-backlink-optimization.tsx',
  'web3-link-building-nfts.tsx',
  'where-to-find-high-quality-backlinks.tsx',
  'white-hat-link-building-techniques.tsx',
  'xrumer-backlink-automation.tsx',
  'zero-click-search-link-strategies.tsx'
];

let imageCounter = 0;
let videoCounter = 0;
let replacementStats = {
  filesProcessed: 0,
  imagesReplaced: 0,
  videosReplaced: 0,
  filesFailed: 0
};

function getNextImageUrl() {
  const url = imageUrls[imageCounter % imageUrls.length];
  imageCounter++;
  return url;
}

function getNextVideoUrl() {
  const url = videoUrls[videoCounter % videoUrls.length];
  videoCounter++;
  return url;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Replace broken image URLs (/media/*.jpg)
    const imageRegex = /src="(\/media\/[^"]+\.jpg)"/g;
    content = content.replace(imageRegex, (match) => {
      const newUrl = getNextImageUrl();
      replacementStats.imagesReplaced++;
      return `src="${newUrl}"`;
    });

    // Replace broken YouTube embed URLs
    // Match src="https://www.youtube.com/embed/sample-tutorial-video" or similar patterns
    const youtubeRegex = /src="(https:\/\/www\.youtube\.com\/embed\/[^"]*)"(?=[^>]*title)/g;
    content = content.replace(youtubeRegex, (match) => {
      const newUrl = getNextVideoUrl();
      replacementStats.videosReplaced++;
      return `src="${newUrl}"`;
    });

    // Also handle video tag replacements for broken YouTube embeds
    // Replace incomplete or broken iframe blocks with video tags
    const iframeRegex = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([^"]*)"[^>]*><\/iframe>/g;
    content = content.replace(iframeRegex, (match, videoId) => {
      // If video ID is empty or looks like a placeholder (contains hyphens but is short), replace with video tag
      if (!videoId || videoId.includes('-') || videoId.length < 10) {
        const newUrl = getNextVideoUrl();
        replacementStats.videosReplaced++;
        return `<video width="560" height="315" controls muted playsInline style="max-width: 100%; height: auto;"><source src="${newUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
      }
      return match;
    });

    // Write back only if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      replacementStats.filesProcessed++;
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    replacementStats.filesFailed++;
    return false;
  }
}

// Main execution
console.log(`Starting media URL fixes for ${filesToProcess.length} files...\n`);

const pagesDir = path.join(__dirname, 'src', 'pages');

filesToProcess.forEach((filename) => {
  const filePath = path.join(pagesDir, filename);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
    replacementStats.filesFailed++;
  }
});

console.log('\n===== Summary =====');
console.log(`Files processed: ${replacementStats.filesProcessed}`);
console.log(`Images replaced: ${replacementStats.imagesReplaced}`);
console.log(`Videos replaced: ${replacementStats.videosReplaced}`);
console.log(`Files failed: ${replacementStats.filesFailed}`);
console.log(`\nAll broken /media/ URLs have been replaced with rotating Pexels image URLs.`);
console.log(`All broken YouTube embeds have been replaced with rotating Pexels video URLs.`);
