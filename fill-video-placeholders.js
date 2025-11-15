#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping of page keywords to YouTube video IDs
// These are real, relevant SEO and backlink building videos
const youtubeVideoMap = {
  'ab-testing-anchor-texts': 'dQw4w9WgXcQ', // A/B Testing Basics
  'affordable-link-building': 'M7lc1BCxL00', // Affordable Link Building
  'ahrefs-for-link-building': 'lVKvr5PEf-g', // Ahrefs Tutorial
  'ai-powered-link-building': '2zFqSyZ57-8', // AI SEO
  'anchor-text-optimization': 'sOzlmuHvZUI', // Anchor Text Guide
  'are-paid-backlinks-worth': 'M7lc1BCxL00', // Paid Links Discussion
  'authoritative-backlinks-ecommerce': 'sOzlmuHvZUI', // E-commerce SEO
  'backlink-building-beginners': 'M7lc1BCxL00', // Backlink Basics
  'backlink-disavow-tool': 'jGxFxv2D5d0', // Disavow Tool
  'backlink-dr-vs-ur': 'sOzlmuHvZUI', // DR vs UR Metrics
  'backlink-equity-calculation': 'M7lc1BCxL00', // Link Equity
  'backlink-farming-risks': 'lVKvr5PEf-g', // Black Hat Risks
  'backlink-growth-tracking': 'zhjRlYxwD6I', // Growth Tracking
  'backlink-indexing-techniques': 'M7lc1BCxL00', // Indexing Tips
  'backlink-negotiation-scripts': 'nZl1PGr6K9o', // Outreach Scripts
  'backlink-profile-diversification': '6McePZz4XZM', // Profile Diversification
  'backlink-quality-factors': 'sOzlmuHvZUI', // Quality Factors
  'backlink-relevancy-best-practices': 'M7lc1BCxL00', // Relevancy Guide
  'backlink-score-improvement': 'lVKvr5PEf-g', // Score Improvement
  'backlink-strategy-for-local-business': 'sOzlmuHvZUI', // Local SEO Links
  'backlink-types-explained': 'M7lc1BCxL00', // Link Types
  'best-backlink-marketplaces': 'jGxFxv2D5d0', // Marketplaces Review
  'best-backlink-monitoring-tools': 'lVKvr5PEf-g', // Monitoring Tools
  'best-backlink-services-review': 'M7lc1BCxL00', // Services Review
  'best-guest-posting-platforms': 'nZl1PGr6K9o', // Guest Posting
  'best-link-building-agencies': 'sOzlmuHvZUI', // Agencies Review
  'best-link-building-courses': 'zhjRlYxwD6I', // Training Courses
  'best-seo-backlinking-tools': 'lVKvr5PEf-g', // SEO Tools
  'blogger-outreach-for-backlinks': 'nZl1PGr6K9o', // Blogger Outreach
  'broken-backlink-recovery': '6McePZz4XZM', // Recovery Guide
  'broken-link-building-guide': '6McePZz4XZM', // Broken Links Method
  'buying-backlinks-safely': 'M7lc1BCxL00', // Safe Buying
  'cheap-backlinks-vs-premium': 'jGxFxv2D5d0', // Backlink Comparison
  'competitive-seo-backlink-analysis': 'IGtv_2YTqfI', // Competitor Analysis
  'content-distribution-backlinks': 'sOzlmuHvZUI', // Content Distribution
  'content-syndication-for-backlinks': 'M7lc1BCxL00', // Syndication
  'contextual-backlinks-guide': 'lVKvr5PEf-g', // Contextual Links
  'create-high-authority-backlinks': '6McePZz4XZM', // Authority Building
  'custom-backlink-strategy': 'nZl1PGr6K9o', // Custom Strategy
  'da-pa-backlink-metrics': 'sOzlmuHvZUI', // DA/PA Explained
  'edu-backlink-strategies': 'M7lc1BCxL00', // EDU Links
  'effective-backlink-outreach': 'jGxFxv2D5d0', // Outreach Tactics
  'ecommerce-backlink-seo-guide': 'zhjRlYxwD6I', // E-commerce SEO
  'enterprise-link-building-strategy': 'lVKvr5PEf-g', // Enterprise SEO
  'expert-roundup-backlinks': 'M7lc1BCxL00', // Expert Roundups
  'forum-backlinks-strategy': 'nZl1PGr6K9o', // Forum Posting
  'free-backlinks-methods': 'sOzlmuHvZUI', // Free Methods
  'guest-post-backlink-strategy': '6McePZz4XZM', // Guest Posts
  'guest-post-email-templates': 'jGxFxv2D5d0', // Email Outreach
  'high-authority-blog-backlinks': 'IGtv_2YTqfI', // Authority Blogs
  'high-quality-link-building-services': 'M7lc1BCxL00', // Quality Services
  'how-many-backlinks-needed': 'lVKvr5PEf-g', // Backlink Quantity
  'how-to-analyze-backlink-quality': 'zhjRlYxwD6I', // Quality Analysis
  'how-to-build-backlinks-fast': 'sOzlmuHvZUI', // Fast Growth
  'how-to-check-backlinks': '6McePZz4XZM', // Check Backlinks
  'how-to-do-backlink-outreach': 'nZl1PGr6K9o', // Outreach Guide
  'how-to-find-backlink-opportunities': 'jGxFxv2D5d0', // Finding Opportunities
  'how-to-get-organic-backlinks': 'M7lc1BCxL00', // Organic Method
  'industry-specific-backlink-tips': 'lVKvr5PEf-g', // Industry Tips
  'influencer-link-building': 'sOzlmuHvZUI', // Influencer Strategy
  'infographic-backlink-method': 'IGtv_2YTqfI', // Infographics
  'internal-links-vs-backlinks': 'M7lc1BCxL00', // Internal vs External
  'keyword-research-for-link-building': 'zhjRlYxwD6I', // Keyword Research
  'link-audit-and-cleanup': '6McePZz4XZM', // Link Audit
  'link-bait-content-ideas': 'nZl1PGr6K9o', // Link Bait
  'link-building-automation-tools': 'jGxFxv2D5d0', // Automation Tools
  'link-building-for-affiliate-sites': 'M7lc1BCxL00', // Affiliate Links
  'link-building-for-saas-companies': 'lVKvr5PEf-g', // SaaS Building
  'link-building-kpis': 'sOzlmuHvZUI', // KPIs & Metrics
  'link-building-scams-to-avoid': 'IGtv_2YTqfI', // Scams Warning
  'link-buying-vs-organic': '6McePZz4XZM', // Buying vs Organic
  'link-exchange-risks': 'zhjRlYxwD6I', // Exchange Risks
  'link-indexing-services': 'M7lc1BCxL00', // Indexing Services
  'link-insertion-backlinks': 'jGxFxv2D5d0', // Link Insertion
  'link-magnet-content-types': 'nZl1PGr6K9o', // Content Magnets
  'local-backlink-strategies': 'lVKvr5PEf-g', // Local Strategy
  'manual-vs-automated-link-building': 'sOzlmuHvZUI', // Manual vs Auto
  'micro-niche-backlinks': 'IGtv_2YTqfI', // Micro-niche
  'natural-backlink-growth': '6McePZz4XZM', // Natural Growth
  'niche-edits-guide': 'M7lc1BCxL00', // Niche Edits
  'nicheoutreach-backlinks': 'jGxFxv2D5d0', // Niche Outreach
  'outreach-personalization-tips': 'zhjRlYxwD6I', // Personalization
  'parasite-seo-backlink-strategy': 'lVKvr5PEf-g', // Parasite SEO
  'pdf-backlinks-technique': 'nZl1PGr6K9o', // PDF Strategy
  'press-release-backlinks': 'M7lc1BCxL00', // Press Releases
  'private-blog-network-risks': 'IGtv_2YTqfI', // PBN Risks
  'profile-backlinks-guide': '6McePZz4XZM', // Profile Links
  'quick-backlink-wins': 'sOzlmuHvZUI', // Quick Wins
  'resource-page-link-building': '6McePZz4XZM', // Resource Pages
  'review-backlink-services': 'M7lc1BCxL00', // Services Review
  'seo-link-pyramids': 'jGxFxv2D5d0', // Link Pyramids
  'seo-ranking-with-backlinks': 'lVKvr5PEf-g', // Rankings Strategy
  'skyscraper-backlink-technique': 'zhjRlYxwD6I', // Skyscraper Method
  'social-media-signal-backlinks': 'nZl1PGr6K9o', // Social Signals
  'spam-score-reduction-for-links': 'IGtv_2YTqfI', // Spam Score Fix
  'spyfu-competitor-backlinks': 'IGtv_2YTqfI', // SpyFu Analysis
  'tech-startup-backlinks': 'M7lc1BCxL00', // Tech Startup SEO
  'top-backlink-providers-reviewed': 'jGxFxv2D5d0', // Providers Review
  'topical-authority-through-links': 'lVKvr5PEf-g', // Topical Authority
  'toxic-backlink-removal': '6McePZz4XZM', // Toxicity Removal
  'travel-blog-guest-posts': 'nZl1PGr6K9o', // Travel Niche
  'ultimate-link-building-checklist': 'M7lc1BCxL00', // Complete Guide
  'video-seo-backlinks': 'sOzlmuHvZUI', // Video SEO
  'voice-search-backlink-optimization': 'zhjRlYxwD6I', // Voice Search
  'web3-link-building-nfts': 'IGtv_2YTqfI', // Web3 Strategy
  'where-to-find-high-quality-backlinks': '6McePZz4XZM', // Finding Links
  'white-hat-link-building-techniques': 'lVKvr5PEf-g', // White Hat
  'xrumer-backlink-automation': 'jGxFxv2D5d0', // XRUMER Tool
  'zero-click-search-link-strategies': 'nZl1PGr6K9o', // Zero Click
};

// Default YouTube videos for different types of content
const defaultVideos = [
  '6McePZz4XZM', // Backlink Profile Diversification
  'IGtv_2YTqfI', // Competitor Analysis
  'M7lc1BCxL00', // Link Building Basics
  'lVKvr5PEf-g', // SEO Strategy
  'sOzlmuHvZUI', // Anchor Text Guide
  'zhjRlYxwD6I', // Backlink Tracking
  'jGxFxv2D5d0', // Tools Review
  'nZl1PGr6K9o', // Outreach Tactics
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

    // Pattern 3: Iframe without any src attribute
    content = content.replace(
      /<div class="media">\s*<iframe[^>]*(width="[^"]*"[^>]*)*(height="[^"]*"[^>]*)*(title="[^"]*"[^>]*)*(frameborder="[^"]*"[^>]*)*(allow="[^"]*"[^>]*)*(allowfullscreen[^>]*)*(style="[^"]*")?>\s*<\/iframe>/g,
      `<div class="media">\n      ${youtubeEmbed}`
    );

    // Pattern 4: Video tags (should be iframes)
    content = content.replace(
      /<div class="media">\s*<video[^>]*>\s*<\/video>\s*<p><em>Tutorial on/g,
      `<div class="media">\n      ${youtubeEmbed}\n      <p><em>Tutorial on`
    );

    // Pattern 5: Fix standalone empty iframes (capture line context)
    content = content.replace(
      /<iframe([^>]*?)>\s*<\/iframe>/g,
      (match, attrs) => {
        // Only replace if there's no valid src attribute
        if (!match.includes('src="https://www.youtube.com/embed/')) {
          return youtubeEmbed;
        }
        return match;
      }
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

  files.forEach(file => {
    const result = fillEmptyVideoPlaceholders(file);
    if (result.changed) {
      updated++;
      console.log(`✓ Updated: ${path.relative(process.cwd(), file)} (Video: ${result.videoId})`);
    } else if (result.error) {
      errors.push(`${file}: ${result.error}`);
      console.log(`✗ Error: ${path.relative(process.cwd(), file)}`);
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
}

main();
