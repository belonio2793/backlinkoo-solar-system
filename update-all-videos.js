#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Complete mapping of all 100 pages to YouTube video IDs
const videoMap = {
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
  'zero-click-search-link-strategies': 'nZl1PGr6K9o'
};

function createVideoEmbed(videoId, title) {
  return `<div class="media">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>
    <p><em>Video guide on this topic</em></p>
  </div>`;
}

function updatePageVideos(filePath, pageSlug, videoId) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const titleCase = pageSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const videoEmbed = createVideoEmbed(videoId, titleCase);
    
    // Check if already has this video
    if (content.includes(`youtube.com/embed/${videoId}`)) {
      return { status: 'already-has-video', changed: false };
    }
    
    // Replace invalid/placeholder video IDs
    const invalidPatterns = [
      /youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*/g,
      /youtube\.com\/embed\/[^"]*[?&](v|id)=[^"&]*/g,
    ];
    
    let updated = false;
    invalidPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, `youtube.com/embed/${videoId}`);
        updated = true;
      }
    });
    
    // If no video exists, add one before FAQ or Conclusion
    if (!content.includes('youtube.com/embed/')) {
      if (content.includes('<h2>FAQ')) {
        content = content.replace('<h2>FAQ', `${videoEmbed}\n\n<h2>FAQ`);
        updated = true;
      } else if (content.includes('<h2>Conclusion')) {
        content = content.replace('<h2>Conclusion', `${videoEmbed}\n\n<h2>Conclusion`);
      } else {
        // Last resort: add before closing template
        content = content.replace(/`;\s*const keywords/g, `\n\n  ${videoEmbed}\n  `;\n  const keywords`);
        updated = true;
      }
    }
    
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
    console.error(`\n❌ Error: Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }

  console.log('\n📊 Starting video update process...\n');
  
  const results = {
    updated: [],
    alreadyHave: [],
    errors: [],
    notFound: []
  };

  Object.entries(videoMap).forEach(([slug, videoId]) => {
    const filePath = path.join(pagesDir, `${slug}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      results.notFound.push(slug);
      console.log(`⚠️  NOT FOUND: ${slug}`);
      return;
    }
    
    const result = updatePageVideos(filePath, slug, videoId);
    
    if (result.status === 'updated') {
      results.updated.push(slug);
      console.log(`✅ UPDATED: ${slug}`);
    } else if (result.status === 'already-has-video') {
      results.alreadyHave.push(slug);
      console.log(`✔️  EXISTS: ${slug}`);
    } else if (result.status === 'error') {
      results.errors.push({ slug, error: result.error });
      console.log(`❌ ERROR: ${slug} - ${result.error}`);
    } else {
      console.log(`➡️  UNCHANGED: ${slug}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('📈 FINAL REPORT');
  console.log('='.repeat(60));
  console.log(`Total pages checked:   ${Object.keys(videoMap).length}`);
  console.log(`✅ Updated:             ${results.updated.length}`);
  console.log(`✔️  Already have video: ${results.alreadyHave.length}`);
  console.log(`❌ Errors:              ${results.errors.length}`);
  console.log(`⚠️  Not found:          ${results.notFound.length}`);
  console.log('='.repeat(60));
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach(({ slug, error }) => {
      console.log(`  • ${slug}: ${error}`);
    });
  }
  
  if (results.notFound.length > 0) {
    console.log(`\n⚠️  Missing ${results.notFound.length} page(s)`);
  }
  
  console.log('\n✨ Process complete!\n');
}

main();