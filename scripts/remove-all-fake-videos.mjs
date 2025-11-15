import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All pages provided by user
const allPages = [
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

function removeAllVideos(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalLength = content.length;

    // Remove YouTube iframes
    content = content.replace(/<iframe[^>]*src=["']https:\/\/www\.youtube\.com\/embed\/[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi, '');
    
    // Remove iframe wrapper divs that are now empty
    content = content.replace(/<div class="media">\s*\n\s*<\/div>/gi, '');
    content = content.replace(/<div class="media">\s*<\/div>/gi, '');
    
    // Remove empty paragraph tags after video removal
    content = content.replace(/<p><em>Video guide[^<]*<\/em><\/p>/gi, '');
    
    // Write back if changes were made
    if (originalLength !== content.length) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function removeVideosFromAllPages() {
  const pagesDir = path.join(__dirname, '../src/pages');
  let removed = 0;
  let unchanged = 0;
  let failed = 0;

  console.log(`\n🎬 Removing all fake/generic videos from pages...\n`);

  for (const slug of allPages) {
    const filePath = path.join(pagesDir, `${slug}.tsx`);
    
    if (fs.existsSync(filePath)) {
      if (removeAllVideos(filePath)) {
        console.log(`✅ Removed videos from: ${slug}`);
        removed++;
      } else {
        unchanged++;
      }
    } else {
      failed++;
    }
  }

  console.log(`\n✅ Video removal complete!`);
  console.log(`📊 Summary:`);
  console.log(`  - Pages with videos removed: ${removed}`);
  console.log(`  - Pages with no videos: ${unchanged}`);
  console.log(`  - Pages not found: ${failed}`);
  console.log(`  - Total processed: ${allPages.length}`);
  
  return { removed, unchanged, failed };
}

// Run the video removal
await removeVideosFromAllPages();
