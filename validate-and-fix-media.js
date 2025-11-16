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

// Known problematic YouTube video IDs
const KNOWN_PLACEHOLDER_VIDEOS = [
  'M7lc1BCxL00',     // YouTube API demo video
  'dQw4w9WgXcQ',     // Rick Roll (obvious placeholder)
  '2R-3X3kY9W8',     // Generic SEO placeholder
  'VxW4KKvQlHs',     // Generic demo video
];

function analyzeMediaInPage(filePath, slug) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/(const htmlContent = `)([\s\S]*?)(`\s*;)/);
    
    if (!match) {
      return {
        slug,
        analyzed: false,
        error: 'Could not extract htmlContent'
      };
    }

    const htmlContent = match[2];
    const result = {
      slug,
      analyzed: true,
      images: [],
      youtubeVideos: [],
      placeholderVideos: [],
      brokenContent: []
    };

    // Find all images
    const imgRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(htmlContent)) !== null) {
      const src = imgMatch[2];
      result.images.push({
        src,
        tag: imgMatch[0]
      });

      // Check for broken image patterns
      if (!src || src === '' || src === '#' || src.includes('placeholder')) {
        result.brokenContent.push({
          type: 'broken_image',
          content: imgMatch[0],
          reason: src === '' ? 'empty src' : 'placeholder URL'
        });
      }
    }

    // Find all YouTube embeds
    const youtubeRegex = /<iframe[^>]*src=["']([^"']*(?:youtube\.com|youtu\.be)[^"']*)["'][^>]*><\/iframe>/gi;
    let videoMatch;
    while ((videoMatch = youtubeRegex.exec(htmlContent)) !== null) {
      const src = videoMatch[1];
      const videoIdMatch = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      result.youtubeVideos.push({
        src,
        videoId,
        tag: videoMatch[0]
      });

      if (videoId && KNOWN_PLACEHOLDER_VIDEOS.includes(videoId)) {
        result.placeholderVideos.push({
          videoId,
          src,
          tag: videoMatch[0]
        });
        result.brokenContent.push({
          type: 'placeholder_video',
          videoId,
          reason: 'Known placeholder/demo video'
        });
      }
    }

    return result;
  } catch (error) {
    return {
      slug,
      analyzed: false,
      error: error.message
    };
  }
}

function reportFindings() {
  console.log(`\n📊 MEDIA VALIDATION REPORT\n${'='.repeat(60)}\n`);
  console.log(`Scanning ${pageSlugs.length} pages for broken media...\n`);

  const allResults = [];
  const pagesWithBrokenContent = [];
  
  let totalImages = 0;
  let totalVideos = 0;
  let totalBrokenImages = 0;
  let totalBrokenVideos = 0;

  for (const slug of pageSlugs) {
    const filePath = path.join('src', 'pages', `${slug}.tsx`);
    
    if (fs.existsSync(filePath)) {
      const result = analyzeMediaInPage(filePath, slug);
      if (result.analyzed) {
        allResults.push(result);
        totalImages += result.images.length;
        totalVideos += result.youtubeVideos.length;
        totalBrokenImages += result.brokenContent.filter(b => b.type === 'broken_image').length;
        totalBrokenVideos += result.brokenContent.filter(b => b.type === 'placeholder_video').length;

        if (result.brokenContent.length > 0) {
          pagesWithBrokenContent.push(result);
          console.log(`❌ ${slug}`);
          result.brokenContent.forEach(item => {
            if (item.type === 'broken_image') {
              console.log(`   └─ Broken Image: ${item.reason}`);
            } else if (item.type === 'placeholder_video') {
              console.log(`   └─ Placeholder Video: ${item.videoId}`);
            }
          });
        }
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n📈 SUMMARY:\n`);
  console.log(`   ✅ Total pages scanned: ${allResults.length}`);
  console.log(`   📷 Total images found: ${totalImages}`);
  console.log(`   🎥 Total YouTube videos found: ${totalVideos}`);
  console.log(`   ❌ Broken/Placeholder images: ${totalBrokenImages}`);
  console.log(`   ❌ Broken/Placeholder videos: ${totalBrokenVideos}`);
  console.log(`   ⚠️  Pages with issues: ${pagesWithBrokenContent.length}\n`);

  if (pagesWithBrokenContent.length > 0) {
    console.log(`📋 DETAILED BROKEN CONTENT:\n`);
    pagesWithBrokenContent.forEach(page => {
      console.log(`\n${page.slug}:`);
      page.brokenContent.forEach(item => {
        if (item.type === 'broken_image') {
          console.log(`   Image (${item.reason}): ${item.content.substring(0, 100)}...`);
        } else {
          console.log(`   Video (${item.reason}): ID=${item.videoId}`);
        }
      });
    });
  }

  // Save detailed report
  fs.writeFileSync('media-validation-report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalPagesScanned: allResults.length,
      totalImagesFound: totalImages,
      totalVideosFound: totalVideos,
      totalBrokenImages: totalBrokenImages,
      totalBrokenVideos: totalBrokenVideos,
      pagesWithIssues: pagesWithBrokenContent.length
    },
    pagesWithBrokenContent: pagesWithBrokenContent
  }, null, 2));

  console.log(`\n✅ Full report saved to: media-validation-report.json\n`);
  
  return pagesWithBrokenContent;
}

reportFindings();
