#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pageSlugs = [
  'ab-testing-anchor-texts', 'affordable-link-building-services', 'ahrefs-for-link-building',
  'ai-powered-link-building', 'anchor-text-optimization-for-backlinks', 'are-paid-backlinks-worth-it',
  'authoritative-backlinks-for-e-commerce', 'backlink-building-for-beginners', 'backlink-disavow-tool-usage',
  'backlink-dr-vs-ur-metrics', 'backlink-equity-calculation', 'backlink-farming-risks',
  'backlink-growth-tracking', 'backlink-indexing-techniques', 'backlink-negotiation-scripts',
  'backlink-profile-diversification', 'backlink-quality-factors', 'backlink-relevancy-best-practices',
  'backlink-score-improvement', 'backlink-strategy-for-local-business', 'backlink-types-explained',
  'best-backlink-marketplaces', 'best-backlink-monitoring-tools', 'best-backlink-services-review',
  'best-guest-posting-platforms', 'best-link-building-agencies', 'best-link-building-courses',
  'best-seo-backlinking-tools', 'blogger-outreach-for-backlinks', 'broken-backlink-recovery',
  'broken-link-building-guide', 'buying-backlinks-safely', 'cheap-backlinks-vs-premium',
  'competitive-seo-backlink-analysis', 'content-distribution-backlinks', 'content-syndication-for-backlinks',
  'contextual-backlinks-guide', 'create-high-authority-backlinks', 'custom-backlink-strategy',
  'da-pa-backlink-metrics', 'edu-backlink-strategies', 'effective-backlink-outreach',
  'ecommerce-backlink-seo-guide', 'enterprise-link-building-strategy', 'expert-roundup-backlinks',
  'forum-backlinks-strategy', 'free-backlinks-methods', 'guest-post-backlink-strategy',
  'guest-post-email-templates', 'high-authority-blog-backlinks', 'high-quality-link-building-services',
  'how-many-backlinks-needed', 'how-to-analyze-backlink-quality', 'how-to-build-backlinks-fast',
  'how-to-check-backlinks', 'how-to-do-backlink-outreach', 'how-to-find-backlink-opportunities',
  'how-to-get-organic-backlinks', 'industry-specific-backlink-tips', 'influencer-link-building',
  'infographic-backlink-method', 'internal-links-vs-backlinks', 'keyword-research-for-link-building',
  'link-audit-and-cleanup', 'link-bait-content-ideas', 'link-building-automation-tools',
  'link-building-for-affiliate-sites', 'link-building-for-saas-companies', 'link-building-kpis',
  'link-building-scams-to-avoid', 'link-buying-vs-organic', 'link-exchange-risks',
  'link-indexing-services', 'link-insertion-backlinks', 'link-magnet-content-types',
  'local-backlink-strategies', 'manual-vs-automated-link-building', 'micro-niche-backlinks',
  'natural-backlink-growth', 'niche-edits-guide', 'nicheoutreach-backlinks',
  'outreach-personalization-tips', 'parasite-seo-backlink-strategy', 'pdf-backlinks-technique',
  'press-release-backlinks', 'private-blog-network-risks', 'profile-backlinks-guide',
  'quick-backlink-wins', 'resource-page-link-building', 'review-backlink-services',
  'seo-link-pyramids', 'seo-ranking-with-backlinks', 'skyscraper-backlink-technique',
  'social-media-signal-backlinks', 'spam-score-reduction-for-links', 'spyfu-competitor-backlinks',
  'tech-startup-backlinks', 'top-backlink-providers-reviewed', 'topical-authority-through-links',
  'toxic-backlink-removal', 'travel-blog-guest-posts', 'ultimate-link-building-checklist',
  'video-seo-backlinks', 'voice-search-backlink-optimization', 'web3-link-building-nfts',
  'where-to-find-high-quality-backlinks', 'white-hat-link-building-techniques', 'xrumer-backlink-automation',
  'zero-click-search-link-strategies', 'ai-tools-for-backlink-outreach', 'algorithm-proof-backlink-strategy',
  'backlink-diversity-services', 'backlink-impact-on-domain-authority', 'backlink-marketplace-alternatives',
  'backlink-optimization-for-ranking-drops', 'backlink-packages-for-agencies', 'backlink-packages-that-boost-sales',
  'backlink-penalty-prevention', 'backlink-pricing-guide', 'backlink-quality-vs-quantity-debate',
  'backlink-recommendations-for-2025', 'backlink-recommendations-for-new-domains', 'backlink-roi-calculation',
  'backlink-services-for-international-sites', 'backlink-services-for-multilingual-brands', 'backlink-services-for-niches',
  'backlink-services-for-wordpress-sites', 'backlink-services-that-actually-work', 'backlinks-for-affiliate-marketers',
  'backlinks-for-agencies', 'backlinks-for-ai-websites', 'backlinks-for-b2b-companies',
  'backlinks-for-bloggers', 'backlinks-for-consultants', 'backlinks-for-crypto-sites',
  'backlinks-for-dropshipping-stores', 'backlinks-for-lawyer-websites', 'backlinks-for-lead-generation-websites',
  'backlinks-for-local-maps-ranking', 'backlinks-for-medical-websites', 'backlinks-for-new-brands',
  'backlinks-for-portfolio-websites', 'backlinks-for-real-estate-websites', 'backlinks-for-saas-startups',
  'backlinks-for-service-businesses', 'backlinks-guaranteed-indexing', 'best-backlinks-for-fast-ranking',
  'best-places-to-buy-safe-backlinks', 'cheapest-white-hat-backlinks-online', 'cheap-seo-services-for-small-business',
  'competitor-backlink-replication-guide', 'contextual-link-packages', 'editorial-backlinks-service',
  'email-outreach-for-niche-edits', 'geo-targeted-seo-backlinks', 'google-friendly-backlink-services',
  'google-news-approved-backlinks', 'google-ranking-boost-services', 'guest-post-marketplaces-comparison',
  'high-authority-niche-edits-service', 'high-authority-seo-packages', 'high-dr-backlinks-for-cheap',
  'high-traffic-guest-posting-sites', 'high-trust-flow-backlinks', 'homepage-link-placements',
  'how-to-audit-paid-backlinks', 'how-to-boost-domain-authority-fast', 'how-to-check-if-backlinks-are-indexed',
  'how-to-choose-a-backlink-provider', 'how-to-fix-ranking-drop-after-update', 'how-to-get-high-dr-backlinks-free',
  'how-to-get-indexing-for-backlinks', 'how-to-increase-crawl-demand', 'how-to-recover-lost-backlinks',
  'internal-link-boosting-strategies', 'link-building-for-amazon-affiliates', 'link-building-for-finance-niche',
  'link-building-for-health-niche', 'link-building-for-new-blogs', 'link-building-for-tech-niche',
  'link-building-for-youtube-channels', 'link-building-packages-for-small-business', 'link-insertion-services',
  'local-seo-backlink-packages', 'local-seo-citations-and-backlinks', 'manual-link-building-service',
  'map-pack-seo-and-backlink-strategy', 'mixed-backlink-packages', 'monthly-backlink-subscription-services',
  'monthly-seo-and-backlink-plans', 'niche-backlinks-for-local-businesses', 'niche-specific-guest-post-services',
  'on-page-seo-and-backlink-bundle', 'organic-backlink-services-for-startups', 'paid-backlink-alternatives',
  'ranking-improvement-case-studies', 'safe-backlink-building-methods', 'seo-ranking-improvement-services',
  'seo-reseller-backlink-packages', 'seo-services-after-google-core-update', 'seo-services-for-ecommerce-stores',
  'tier-2-backlink-services', 'tier-3-backlink-services', 'white-label-link-building-service',
  'affordable-contextual-backlinks', 'affordable-high-dr-guest-posts'
];

// Known problematic/placeholder content to remove
const PATTERNS_TO_REMOVE = [
  // Empty image tags with blank src
  /<img[^>]*src=["']{2}[^>]*>/g,
  // Placeholder image domains
  /<img[^>]*src=["'](?:.*placeholder.*|.*via\.placeholder.*|.*placehold\.it.*)["'][^>]*>/g,
  // Known demo/placeholder YouTube videos
  /<iframe[^>]*src=["'](?:.*youtube\.com\/embed\/(?:M7lc1BCxL00|dQw4w9WgXcQ|2R-3X3kY9W8|VxW4KKvQlHs).*)["'][^>]*><\/iframe>/g,
  // Empty media divs (div with just whitespace)
  /<div\s+class=["']media["']\s*>\s*<\/div>/g,
];

function cleanupMediaInFile(filePath, slug) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    let changesCount = 0;

    // Extract the htmlContent portion
    const match = content.match(/(const htmlContent = `)([\s\S]*?)(`\s*;)/);
    if (!match) {
      return {
        slug,
        success: false,
        error: 'Could not parse htmlContent',
        changes: 0
      };
    }

    let htmlContent = match[2];

    // Apply each removal pattern
    for (const pattern of PATTERNS_TO_REMOVE) {
      const matches = htmlContent.match(pattern);
      if (matches) {
        changesCount += matches.length;
        htmlContent = htmlContent.replace(pattern, '');
      }
    }

    if (changesCount > 0) {
      // Reconstruct the file
      content = content.replace(
        /(const htmlContent = `)([\s\S]*?)(`\s*;)/,
        match[1] + htmlContent + match[3]
      );

      fs.writeFileSync(filePath, content, 'utf-8');
      
      return {
        slug,
        success: true,
        changes: changesCount,
        modified: true
      };
    }

    return {
      slug,
      success: true,
      changes: 0,
      modified: false
    };
  } catch (error) {
    return {
      slug,
      success: false,
      error: error.message,
      changes: 0
    };
  }
}

function main() {
  console.log(`\n🧹 MEDIA CLEANUP: Removing broken images and placeholder videos\n`);
  console.log(`${'='.repeat(70)}\n`);

  const results = [];
  let totalChanges = 0;
  let filesModified = 0;
  let processedCount = 0;

  for (const slug of pageSlugs) {
    const filePath = path.join('src', 'pages', `${slug}.tsx`);
    
    if (fs.existsSync(filePath)) {
      const result = cleanupMediaInFile(filePath, slug);
      results.push(result);
      
      if (result.success) {
        processedCount++;
        if (result.changes > 0) {
          totalChanges += result.changes;
          filesModified++;
          console.log(`✅ ${slug}: ${result.changes} broken media removed`);
        }
      } else {
        console.log(`⚠️  ${slug}: ${result.error}`);
      }
    }
  }

  console.log(`\n${'='.repeat(70)}\n`);
  console.log(`📊 CLEANUP SUMMARY:\n`);
  console.log(`   Pages processed: ${processedCount}/${pageSlugs.length}`);
  console.log(`   Files modified: ${filesModified}`);
  console.log(`   Total broken items removed: ${totalChanges}\n`);

  // Save report
  fs.writeFileSync('media-cleanup-report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalPagesProcessed: processedCount,
      filesModified,
      totalRemovedItems: totalChanges
    },
    results
  }, null, 2));

  console.log(`✅ Cleanup complete! Report saved to media-cleanup-report.json\n`);
}

main();
