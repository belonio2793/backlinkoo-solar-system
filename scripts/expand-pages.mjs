import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of 100 pages to process
const pageSlugs = [
  'ab-testing-anchor-texts',
  'affordable-link-building-services',
  'ahrefs-for-link-building',
  'ai-powered-link-building',
  'anchor-text-optimization-for-backlinks',
  'are-paid-backlinks-worth-it',
  'authoritative-backlinks-for-e-commerce',
  'backlink-building-for-beginners',
  'backlink-disavow-tool-usage',
  'backlink-dr-vs-ur-metrics',
  'backlink-equity-calculation',
  'backlink-farming-risks',
  'backlink-growth-tracking',
  'backlink-indexing-techniques',
  'backlink-negotiation-scripts',
  'backlink-profile-diversification',
  'backlink-quality-factors',
  'backlink-relevancy-best-practices',
  'backlink-score-improvement',
  'backlink-strategy-for-local-business',
  'backlink-types-explained',
  'best-backlink-marketplaces',
  'best-backlink-monitoring-tools',
  'best-backlink-services-review',
  'best-guest-posting-platforms',
  'best-link-building-agencies',
  'best-link-building-courses',
  'best-seo-backlinking-tools',
  'blogger-outreach-for-backlinks',
  'broken-backlink-recovery',
  'broken-link-building-guide',
  'buying-backlinks-safely',
  'cheap-backlinks-vs-premium',
  'competitive-seo-backlink-analysis',
  'content-distribution-backlinks',
  'content-syndication-for-backlinks',
  'contextual-backlinks-guide',
  'create-high-authority-backlinks',
  'custom-backlink-strategy',
  'da-pa-backlink-metrics',
  'edu-backlink-strategies',
  'effective-backlink-outreach',
  'ecommerce-backlink-seo-guide',
  'enterprise-link-building-strategy',
  'expert-roundup-backlinks',
  'forum-backlinks-strategy',
  'free-backlinks-methods',
  'guest-post-backlink-strategy',
  'guest-post-email-templates',
  'high-authority-blog-backlinks',
  'high-quality-link-building-services',
  'how-many-backlinks-needed',
  'how-to-analyze-backlink-quality',
  'how-to-build-backlinks-fast',
  'how-to-check-backlinks',
  'how-to-do-backlink-outreach',
  'how-to-find-backlink-opportunities',
  'how-to-get-organic-backlinks',
  'industry-specific-backlink-tips',
  'influencer-link-building',
  'infographic-backlink-method',
  'internal-links-vs-backlinks',
  'keyword-research-for-link-building',
  'link-audit-and-cleanup',
  'link-bait-content-ideas',
  'link-building-automation-tools',
  'link-building-for-affiliate-sites',
  'link-building-for-saas-companies',
  'link-building-kpis',
  'link-building-scams-to-avoid',
  'link-buying-vs-organic',
  'link-exchange-risks',
  'link-indexing-services',
  'link-insertion-backlinks',
  'link-magnet-content-types',
  'local-backlink-strategies',
  'manual-vs-automated-link-building',
  'micro-niche-backlinks',
  'natural-backlink-growth',
  'niche-edits-guide',
  'nicheoutreach-backlinks',
  'outreach-personalization-tips',
  'parasite-seo-backlink-strategy',
  'pdf-backlinks-technique',
  'press-release-backlinks',
  'private-blog-network-risks',
  'profile-backlinks-guide',
  'quick-backlink-wins',
  'resource-page-link-building',
  'review-backlink-services',
  'seo-link-pyramids',
  'seo-ranking-with-backlinks',
  'skyscraper-backlink-technique',
  'social-media-signal-backlinks',
  'spam-score-reduction-for-links',
  'spyfu-competitor-backlinks',
  'tech-startup-backlinks',
  'top-backlink-providers-reviewed',
  'topical-authority-through-links',
  'toxic-backlink-removal',
  'travel-blog-guest-posts',
  'ultimate-link-building-checklist',
  'video-seo-backlinks',
  'voice-search-backlink-optimization',
  'web3-link-building-nfts',
  'where-to-find-high-quality-backlinks',
  'white-hat-link-building-techniques',
  'xrumer-backlink-automation',
  'zero-click-search-link-strategies'
];

// Function to count words in HTML content
function countWords(htmlContent) {
  // Remove HTML tags
  const text = htmlContent.replace(/<[^>]*>/g, '');
  // Split by whitespace and filter empty strings
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// Function to identify broken videos
function findBrokenVideos(htmlContent) {
  const videoPatterns = [
    /<iframe[^>]*src=["']([^"']+)["'][^>]*>/g,
    /<video[^>]*src=["']([^"']+)["'][^>]*>/g,
    /https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+/g,
    /https:\/\/youtu\.be\/[a-zA-Z0-9_-]+/g,
    /https:\/\/vimeo\.com\/\d+/g,
  ];
  
  const videos = [];
  for (const pattern of videoPatterns) {
    let match;
    while ((match = pattern.exec(htmlContent)) !== null) {
      videos.push(match[0]);
    }
  }
  
  return videos;
}

// Function to remove broken videos
function removeBrokenVideos(htmlContent) {
  // Remove video iframes and video tags
  let cleaned = htmlContent.replace(/<iframe[^>]*src=["'].*?youtube|vimeo|youtu\.be.*?["'][^>]*>[\s\S]*?<\/iframe>/gi, '');
  cleaned = cleaned.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '');
  return cleaned;
}

// Main function
async function analyzePages() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const report = {
    total: pageSlugs.length,
    analyzed: 0,
    needsExpansion: [],
    hasVideos: [],
    wordCounts: {}
  };

  for (const slug of pageSlugs) {
    const filePath = path.join(pagesDir, `${slug}.tsx`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract htmlContent
      const htmlMatch = content.match(/htmlContent\s*=\s*`([\s\S]*?)`;/);
      if (!htmlMatch) {
        console.log(`⚠️  Could not parse ${slug}`);
        continue;
      }
      
      const htmlContent = htmlMatch[1];
      const wordCount = countWords(htmlContent);
      const videos = findBrokenVideos(htmlContent);
      
      report.wordCounts[slug] = wordCount;
      report.analyzed++;
      
      if (wordCount < 1000) {
        report.needsExpansion.push({ slug, wordCount });
      }
      
      if (videos.length > 0) {
        report.hasVideos.push({ slug, videoCount: videos.length, videos });
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${slug}: ${error.message}`);
    }
  }

  return report;
}

// Run analysis
const report = await analyzePages();

console.log('\n=== PAGE EXPANSION ANALYSIS REPORT ===\n');
console.log(`Total pages analyzed: ${report.analyzed}/${report.total}`);
console.log(`Pages needing expansion (< 1000 words): ${report.needsExpansion.length}`);
console.log(`Pages with videos: ${report.hasVideos.length}`);

console.log('\n=== PAGES NEEDING EXPANSION ===');
report.needsExpansion.forEach(({ slug, wordCount }) => {
  console.log(`${slug}: ${wordCount} words (needs +${1000 - wordCount} words)`);
});

console.log('\n=== PAGES WITH VIDEOS ===');
report.hasVideos.forEach(({ slug, videoCount }) => {
  console.log(`${slug}: ${videoCount} video(s)`);
});

// Save report to file
fs.writeFileSync(
  path.join(__dirname, '../PAGE_EXPANSION_REPORT.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n✅ Report saved to PAGE_EXPANSION_REPORT.json');
