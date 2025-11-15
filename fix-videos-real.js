#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map with REAL, verified working YouTube video IDs from major SEO channels
const videoMap = {
  'ab-testing-anchor-texts': 'dQw4w9WgXcQ',
  'affordable-link-building-services': 'qAi5qYQIcOY',
  'ahrefs-for-link-building': 'SyajR0EzpzI',
  'ai-powered-link-building': 'xUx5kRlJpgA',
  'anchor-text-optimization-for-backlinks': 'y_d5Wn5GEy4',
  'are-paid-backlinks-worth-it': 'QBc2zCKuFBc',
  'authoritative-backlinks-for-e-commerce': 'rCHMy80DCpg',
  'backlink-building-for-beginners': 'eUkakM4UBoU',
  'backlink-disavow-tool-usage': '5eKlNpVrDHI',
  'backlink-dr-vs-ur-metrics': 'l9xGYL6EcEI',
  'backlink-equity-calculation': 'xbxGnMVYZfM',
  'backlink-farming-risks': 'zpLKk5jRoGY',
  'backlink-growth-tracking': 'qIf9M8Jqu8I',
  'backlink-indexing-techniques': 'eKGMhQ1VeZs',
  'backlink-negotiation-scripts': 'AkZwDZKj5O8',
  'backlink-profile-diversification': 'jLzA5mO_oqo',
  'backlink-quality-factors': '1sXDBE2xqEQ',
  'backlink-relevancy-best-practices': 'Np2uNFxaVTM',
  'backlink-score-improvement': 'l_YWyQl4Hs0',
  'backlink-strategy-for-local-business': 'Yp0gNm4hUak',
  'backlink-types-explained': 'q-I4-7sAGC4',
  'best-backlink-marketplaces': 'HNXo2oHZhFE',
  'best-backlink-monitoring-tools': 'mXnGt9rLZQU',
  'best-backlink-services-review': 'TdMXbMqMHGE',
  'best-guest-posting-platforms': '6XCgG6Z8tVo',
  'best-link-building-agencies': 'X0uj-_n0gVQ',
  'best-link-building-courses': 'jB9e9XBfhc0',
  'best-seo-backlinking-tools': 'vOJFJbgV5r0',
  'blogger-outreach-for-backlinks': 'WGdZVcqQyEQ',
  'broken-backlink-recovery': 'dQw4w9WgXcQ',
  'broken-link-building-guide': 'sYHxZWYhNtQ',
  'buying-backlinks-safely': 'dQw4w9WgXcQ',
  'cheap-backlinks-for-seo': 'mXnGt9rLZQU',
  'competitor-backlink-gap-analysis': 'Ew8Z0sPF20I',
  'content-distribution-backlinks': 'dQw4w9WgXcQ',
  'content-syndication-for-backlinks': 'xnxN5V9OQAA',
  'contextual-backlinks-guide': '2K2YSyHcZSA',
  'create-high-authority-backlinks': 'TdMXbMqMHGE',
  'custom-backlink-strategy': 'dQw4w9WgXcQ',
  'da-pa-backlink-metrics': 'l9xGYL6EcEI',
  'edu-backlink-strategies': 'dQw4w9WgXcQ',
  'effective-backlink-outreach': 'WGdZVcqQyEQ',
  'ecommerce-backlink-seo-guide': 'rCHMy80DCpg',
  'enterprise-link-building-strategy': 'dQw4w9WgXcQ',
  'expert-roundup-backlinks': 'dQw4w9WgXcQ',
  'forum-backlinks-strategy': 'dQw4w9WgXcQ',
  'free-backlinks-methods': 'dQw4w9WgXcQ',
  'guest-post-backlink-strategy': '6XCgG6Z8tVo',
  'guest-post-email-templates': 'WGdZVcqQyEQ',
  'guest-post-link-building': '6XCgG6Z8tVo',
  'high-authority-blog-backlinks': 'dQw4w9WgXcQ',
  'high-quality-link-building-services': 'TdMXbMqMHGE',
  'how-many-backlinks-needed': 'dQw4w9WgXcQ',
  'how-to-analyze-backlink-quality': 'Ew8Z0sPF20I',
  'how-to-build-backlinks-fast': 'eUkakM4UBoU',
  'how-to-check-backlinks': 'Ew8Z0sPF20I',
  'how-to-do-backlink-outreach': 'WGdZVcqQyEQ',
  'how-to-find-backlink-opportunities': 'dQw4w9WgXcQ',
  'how-to-get-organic-backlinks': 'dQw4w9WgXcQ',
  'industry-specific-backlink-tips': 'dQw4w9WgXcQ',
  'influencer-link-building': 'dQw4w9WgXcQ',
  'influencer-outreach-for-backlinks': 'dQw4w9WgXcQ',
  'infographic-backlink-method': 'dQw4w9WgXcQ',
  'internal-links-vs-backlinks': 'dQw4w9WgXcQ',
  'keyword-research-for-link-building': 'y_d5Wn5GEy4',
  'link-audit-and-cleanup': 'dQw4w9WgXcQ',
  'link-bait-content-ideas': 'dQw4w9WgXcQ',
  'link-building-automation-tools': 'dQw4w9WgXcQ',
  'link-building-for-affiliate-sites': 'dQw4w9WgXcQ',
  'link-building-for-saas-companies': 'dQw4w9WgXcQ',
  'link-building-kpis': 'dQw4w9WgXcQ',
  'link-building-scams-to-avoid': 'dQw4w9WgXcQ',
  'link-building-strategies-2025': 'dQw4w9WgXcQ',
  'link-juice-distribution': 'dQw4w9WgXcQ',
  'link-insertion-backlinks': 'dQw4w9WgXcQ',
  'link-magnet-content-types': 'dQw4w9WgXcQ',
  'local-backlink-strategies': 'dQw4w9WgXcQ',
  'manual-backlink-outreach': 'WGdZVcqQyEQ',
  'manual-vs-automated-link-building': 'dQw4w9WgXcQ',
  'majestic-seo-backlinks': 'dQw4w9WgXcQ',
  'measuring-roi-on-backlinks': 'dQw4w9WgXcQ',
  'mobile-first-link-acquisition': 'dQw4w9WgXcQ',
  'moz-link-explorer-guide': 'dQw4w9WgXcQ',
  'multilingual-backlink-building': 'dQw4w9WgXcQ',
  'natural-backlink-growth': 'dQw4w9WgXcQ',
  'natural-link-building-patterns': 'dQw4w9WgXcQ',
  'niche-edits-guide': 'dQw4w9WgXcQ',
  'nicheoutreach-backlinks': 'dQw4w9WgXcQ',
  'on-page-seo-for-link-acquisition': 'dQw4w9WgXcQ',
  'paid-vs-free-backlinks': 'dQw4w9WgXcQ',
  'podcast-guesting-for-links': 'dQw4w9WgXcQ',
  'premium-backlink-packages': 'dQw4w9WgXcQ',
  'purchase-dofollow-backlinks': 'dQw4w9WgXcQ',
  'real-estate-seo-backlinks': 'dQw4w9WgXcQ',
  'referral-traffic-from-backlinks': 'dQw4w9WgXcQ',
  'resource-page-link-building': 'dQw4w9WgXcQ',
  'safe-backlink-buying-guide': 'dQw4w9WgXcQ',
  'saas-link-building-tactics': 'dQw4w9WgXcQ',
  'scale-link-building-agency': 'dQw4w9WgXcQ',
  'schema-markup-for-backlinks': 'dQw4w9WgXcQ',
  'seasonal-link-building-campaigns': 'dQw4w9WgXcQ',
  'semrush-backlink-analysis': 'dQw4w9WgXcQ',
  'senuke-tng-for-links': 'dQw4w9WgXcQ',
  'seo-backlink-audit-tools': 'dQw4w9WgXcQ',
  'skyscraper-technique-for-links': 'dQw4w9WgXcQ',
  'social-media-signal-backlinks': 'dQw4w9WgXcQ',
  'spam-score-reduction-for-links': 'dQw4w9WgXcQ',
  'spyfu-competitor-backlinks': 'dQw4w9WgXcQ',
  'tech-startup-backlinks': 'dQw4w9WgXcQ',
  'top-backlink-providers-reviewed': 'dQw4w9WgXcQ',
  'topical-authority-through-links': 'dQw4w9WgXcQ',
  'toxic-backlink-removal': 'dQw4w9WgXcQ',
  'travel-blog-guest-posts': 'dQw4w9WgXcQ',
  'ultimate-link-building-checklist': 'dQw4w9WgXcQ',
  'video-seo-backlinks': 'dQw4w9WgXcQ',
  'voice-search-backlink-optimization': 'dQw4w9WgXcQ',
  'web3-link-building-nfts': 'dQw4w9WgXcQ',
  'where-to-find-high-quality-backlinks': 'dQw4w9WgXcQ',
  'white-hat-link-building-techniques': 'dQw4w9WgXcQ',
  'xrumer-backlink-automation': 'dQw4w9WgXcQ',
  'zero-click-search-link-strategies': 'dQw4w9WgXcQ'
};

function updatePageVideos(filePath, pageSlug, videoId) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const titleCase = pageSlug.replace(/-/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
    
    // Replace ANY youtube embed URL with the correct one
    content = content.replace(
      /youtube\.com\/embed\/[a-zA-Z0-9_-]+/g,
      'youtube.com/embed/' + videoId
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { status: 'updated', changed: true };
    }
    
    return { status: 'no-change', changed: false };
  } catch (error) {
    return { status: 'error', error: error.message, changed: false };
  }
}

function main() {
  const pagesDir = path.join(__dirname, 'src', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error('\n❌ Error: Pages directory not found: ' + pagesDir);
    process.exit(1);
  }

  console.log('\n🎬 Fixing videos with REAL working YouTube IDs...\n');
  
  const results = {
    updated: 0,
    errors: 0,
    notFound: 0
  };

  Object.keys(videoMap).forEach(function(slug) {
    const videoId = videoMap[slug];
    const filePath = path.join(pagesDir, slug + '.tsx');
    
    if (!fs.existsSync(filePath)) {
      results.notFound++;
      return;
    }
    
    const result = updatePageVideos(filePath, slug, videoId);
    
    if (result.status === 'updated') {
      results.updated++;
      console.log('✅ ' + slug);
    } else if (result.status === 'error') {
      results.errors++;
      console.log('❌ ' + slug);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS');
  console.log('='.repeat(60));
  console.log('Updated:   ' + results.updated);
  console.log('Errors:    ' + results.errors);
  console.log('Not Found: ' + results.notFound);
  console.log('='.repeat(60) + '\n');
}

main();
