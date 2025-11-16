const fs = require('fs');
const path = require('path');
const https = require('https');

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
  'zero-click-search-link-strategies',
  'ai-tools-for-backlink-outreach',
  'algorithm-proof-backlink-strategy',
  'backlink-diversity-services',
  'backlink-impact-on-domain-authority',
  'backlink-marketplace-alternatives',
  'backlink-optimization-for-ranking-drops',
  'backlink-packages-for-agencies',
  'backlink-packages-that-boost-sales',
  'backlink-penalty-prevention',
  'backlink-pricing-guide',
  'backlink-quality-vs-quantity-debate',
  'backlink-recommendations-for-2025',
  'backlink-recommendations-for-new-domains',
  'backlink-roi-calculation',
  'backlink-services-for-international-sites',
  'backlink-services-for-multilingual-brands',
  'backlink-services-for-niches',
  'backlink-services-for-wordpress-sites',
  'backlink-services-that-actually-work',
  'backlinks-for-affiliate-marketers',
  'backlinks-for-agencies',
  'backlinks-for-ai-websites',
  'backlinks-for-b2b-companies',
  'backlinks-for-bloggers',
  'backlinks-for-consultants',
  'backlinks-for-crypto-sites',
  'backlinks-for-dropshipping-stores',
  'backlinks-for-lawyer-websites',
  'backlinks-for-lead-generation-websites',
  'backlinks-for-local-maps-ranking',
  'backlinks-for-medical-websites',
  'backlinks-for-new-brands',
  'backlinks-for-portfolio-websites',
  'backlinks-for-real-estate-websites',
  'backlinks-for-saas-startups',
  'backlinks-for-service-businesses',
  'backlinks-guaranteed-indexing',
  'best-backlinks-for-fast-ranking',
  'best-places-to-buy-safe-backlinks',
  'cheapest-white-hat-backlinks-online',
  'cheap-seo-services-for-small-business',
  'competitor-backlink-replication-guide',
  'contextual-link-packages',
  'editorial-backlinks-service',
  'email-outreach-for-niche-edits',
  'geo-targeted-seo-backlinks',
  'google-friendly-backlink-services',
  'google-news-approved-backlinks',
  'google-ranking-boost-services',
  'guest-post-marketplaces-comparison',
  'high-authority-niche-edits-service',
  'high-authority-seo-packages',
  'high-dr-backlinks-for-cheap',
  'high-traffic-guest-posting-sites',
  'high-trust-flow-backlinks',
  'homepage-link-placements',
  'how-to-audit-paid-backlinks',
  'how-to-boost-domain-authority-fast',
  'how-to-check-if-backlinks-are-indexed',
  'how-to-choose-a-backlink-provider',
  'how-to-fix-ranking-drop-after-update',
  'how-to-get-high-dr-backlinks-free',
  'how-to-get-indexing-for-backlinks',
  'how-to-increase-crawl-demand',
  'how-to-recover-lost-backlinks',
  'internal-link-boosting-strategies',
  'link-building-for-amazon-affiliates',
  'link-building-for-finance-niche',
  'link-building-for-health-niche',
  'link-building-for-new-blogs',
  'link-building-for-tech-niche',
  'link-building-for-youtube-channels',
  'link-building-packages-for-small-business',
  'link-insertion-services',
  'local-seo-backlink-packages',
  'local-seo-citations-and-backlinks',
  'manual-link-building-service',
  'map-pack-seo-and-backlink-strategy',
  'mixed-backlink-packages',
  'monthly-backlink-subscription-services',
  'monthly-seo-and-backlink-plans',
  'niche-backlinks-for-local-businesses',
  'niche-specific-guest-post-services',
  'on-page-seo-and-backlink-bundle',
  'organic-backlink-services-for-startups',
  'paid-backlink-alternatives',
  'ranking-improvement-case-studies',
  'safe-backlink-building-methods',
  'seo-ranking-improvement-services',
  'seo-reseller-backlink-packages',
  'seo-services-after-google-core-update',
  'seo-services-for-ecommerce-stores',
  'tier-2-backlink-services',
  'tier-3-backlink-services',
  'white-label-link-building-service',
  'affordable-contextual-backlinks',
  'affordable-high-dr-guest-posts'
];

function extractImagesAndVideos(htmlContent) {
  const images = [];
  const videos = [];

  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)?["'])?/gi;
  let match;
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push({
      src: match[1],
      alt: match[2] || ''
    });
  }

  // Extract YouTube videos (iframe and embed patterns)
  const youtubeRegex = /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/gi;
  while ((match = youtubeRegex.exec(htmlContent)) !== null) {
    videos.push({
      id: match[1],
      type: 'youtube'
    });
  }

  // Extract iframe videos
  const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = iframeRegex.exec(htmlContent)) !== null) {
    videos.push({
      src: match[1],
      type: 'iframe'
    });
  }

  return { images, videos };
}

async function checkImageUrl(url) {
  return new Promise((resolve) => {
    if (!url || url === '') {
      resolve(false);
      return;
    }

    // Check for common placeholder patterns
    if (url.includes('placeholder') || url.includes('via.placeholder') || url === '#') {
      resolve(false);
      return;
    }

    // For localhost or relative URLs, assume they're valid
    if (url.startsWith('/') || url.startsWith('.') || url.includes('localhost')) {
      resolve(true);
      return;
    }

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);

    try {
      https.head(url, { timeout: 5000 }, (res) => {
        clearTimeout(timeout);
        resolve(res.statusCode === 200);
      }).on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    } catch (e) {
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

async function checkYouTubeVideo(videoId) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);

    try {
      https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, { timeout: 5000 }, (res) => {
        clearTimeout(timeout);
        resolve(res.statusCode === 200);
      }).on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    } catch (e) {
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

async function scanPage(filePath, slug) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/const htmlContent = `([\s\S]*?)`\s*;/);
    
    if (!match) {
      return null;
    }

    const htmlContent = match[1];
    const { images, videos } = extractImagesAndVideos(htmlContent);

    const brokenImages = [];
    const brokenVideos = [];

    // Check images
    for (const img of images) {
      const isValid = await checkImageUrl(img.src);
      if (!isValid) {
        brokenImages.push(img);
      }
    }

    // Check YouTube videos
    for (const video of videos) {
      if (video.type === 'youtube') {
        const isValid = await checkYouTubeVideo(video.id);
        if (!isValid) {
          brokenVideos.push(video);
        }
      }
    }

    return {
      slug,
      filePath,
      totalImages: images.length,
      totalVideos: videos.length,
      brokenImages,
      brokenVideos,
      hasIssues: brokenImages.length > 0 || brokenVideos.length > 0
    };
  } catch (error) {
    console.error(`Error processing ${slug}:`, error.message);
    return null;
  }
}

async function main() {
  console.log(`Scanning ${pageSlugs.length} pages for broken media...\n`);
  
  const results = [];
  let processedCount = 0;

  for (const slug of pageSlugs) {
    const filePath = path.join('src', 'pages', `${slug}.tsx`);
    
    if (fs.existsSync(filePath)) {
      const result = await scanPage(filePath, slug);
      if (result) {
        results.push(result);
        if (result.hasIssues) {
          console.log(`❌ ${slug}: ${result.brokenImages.length} broken images, ${result.brokenVideos.length} broken videos`);
        } else {
          console.log(`✅ ${slug}`);
        }
      }
      processedCount++;
    } else {
      console.log(`⚠️  ${slug}: File not found`);
    }
  }

  console.log(`\n\nScan Complete: Processed ${processedCount}/${pageSlugs.length} pages`);
  
  const pagesWithIssues = results.filter(r => r.hasIssues);
  console.log(`\nPages with broken media: ${pagesWithIssues.length}`);
  
  if (pagesWithIssues.length > 0) {
    console.log('\n=== BROKEN MEDIA DETAILS ===\n');
    pagesWithIssues.forEach(result => {
      console.log(`\n${result.slug}:`);
      if (result.brokenImages.length > 0) {
        console.log('  Broken Images:');
        result.brokenImages.forEach(img => {
          console.log(`    - ${img.src}`);
        });
      }
      if (result.brokenVideos.length > 0) {
        console.log('  Broken Videos:');
        result.brokenVideos.forEach(vid => {
          if (vid.id) {
            console.log(`    - YouTube: ${vid.id}`);
          } else {
            console.log(`    - ${vid.src}`);
          }
        });
      }
    });
  }

  // Save results to file
  fs.writeFileSync('broken-media-results.json', JSON.stringify(results, null, 2));
  console.log('\n\nResults saved to broken-media-results.json');
}

main().catch(console.error);
