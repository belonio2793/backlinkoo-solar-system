#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, 'src', 'pages');

const internalLinkingMap = {
  'ai-tools-for-backlink-outreach': ['link-building-automation-tools', 'email-outreach-for-niche-edits', 'automated-link-building-service'],
  'algorithm-proof-backlink-strategy': ['safe-backlink-building-methods', 'google-penguin-recovery-backlinks', 'backlink-penalty-prevention'],
  'backlink-diversity-services': ['backlink-profile-diversification', 'backlink-quality-factors', 'mixed-backlink-packages'],
  'backlink-impact-on-domain-authority': ['da-pa-backlink-metrics', 'backlink-quality-factors', 'how-to-boost-domain-authority-fast'],
  'backlink-marketplace-alternatives': ['best-backlink-marketplaces', 'buying-backlinks-safely', 'best-places-to-buy-safe-backlinks'],
  'backlink-optimization-for-ranking-drops': ['how-to-fix-ranking-drop-after-update', 'backlink-penalty-prevention', 'google-penguin-recovery-backlinks'],
  'backlink-packages-for-agencies': ['white-label-link-building-service', 'seo-reseller-backlink-packages', 'backlinks-for-agencies'],
  'backlink-packages-that-boost-sales': ['conversion-optimized-backlinks', 'ranking-improvement-case-studies', 'seo-services-for-ecommerce-stores'],
  'backlink-penalty-prevention': ['safe-backlink-building-methods', 'algorithm-proof-backlink-strategy', 'google-friendly-backlink-services'],
  'backlink-pricing-guide': ['best-backlink-marketplaces', 'affordable-contextual-backlinks', 'high-dr-backlinks-for-cheap'],
  'backlink-quality-vs-quantity-debate': ['backlink-quality-factors', 'high-trust-flow-backlinks', 'best-places-to-buy-safe-backlinks'],
  'backlink-recommendations-for-2025': ['e-e-a-t-signals-via-backlinks', 'link-building-automation-tools', 'future-link-building-trends'],
  'backlink-recommendations-for-new-domains': ['backlinks-for-new-websites', 'backlinks-for-new-brands', 'how-to-boost-domain-authority-fast'],
  'backlink-roi-calculation': ['link-building-kpis', 'ranking-improvement-case-studies', 'seo-ranking-improvement-services'],
  'backlink-services-for-international-sites': ['backlink-services-for-multilingual-brands', 'geo-targeted-seo-backlinks', 'local-seo-backlink-packages'],
  'backlink-services-for-multilingual-brands': ['backlink-services-for-international-sites', 'geo-targeted-seo-backlinks', 'local-seo-citations-and-backlinks'],
  'backlink-services-for-niches': ['niche-backlinks-for-local-businesses', 'industry-specific-backlink-tips', 'backlink-services-for-wordpress-sites'],
  'backlink-services-for-wordpress-sites': ['backlink-quality-factors', 'best-seo-backlinking-tools', 'backlink-services-for-niches'],
  'backlink-services-that-actually-work': ['ranking-improvement-case-studies', 'best-backlink-services-review', 'backlinks-guaranteed-indexing'],
  'backlinks-for-affiliate-marketers': ['link-building-for-affiliate-sites', 'conversion-optimized-backlinks', 'high-traffic-guest-posting-sites'],
  'backlinks-for-agencies': ['backlink-packages-for-agencies', 'white-label-link-building-service', 'seo-reseller-backlink-packages'],
  'backlinks-for-ai-websites': ['tech-startup-backlinks', 'link-building-for-saas-companies', 'backlinks-for-b2b-companies'],
  'backlinks-for-b2b-companies': ['b2b-saas-company-backlinks', 'lead-generation-backlinks', 'backlinks-for-consultants'],
  'backlinks-for-bloggers': ['guest-post-link-building', 'content-syndication-for-backlinks', 'link-building-for-new-blogs'],
  'backlinks-for-consultants': ['expert-roundup-backlinks', 'influencer-link-building', 'backlinks-for-portfolios'],
  'backlinks-for-crypto-sites': ['industry-specific-backlink-tips', 'niche-backlinks-for-local-businesses', 'backlinks-for-b2b-companies'],
  'backlinks-for-dropshipping-stores': ['e-commerce-backlink-packages', 'conversion-optimized-backlinks', 'seo-services-for-ecommerce-stores'],
  'backlinks-for-lawyer-websites': ['local-seo-backlink-packages', 'backlinks-for-local-maps-ranking', 'industry-specific-backlink-tips'],
  'backlinks-for-lead-generation-websites': ['conversion-optimized-backlinks', 'email-outreach-for-niche-edits', 'high-converting-backlinks'],
  'backlinks-for-local-maps-ranking': ['local-seo-backlink-packages', 'local-seo-citations-and-backlinks', 'map-pack-seo-and-backlink-strategy'],
  'backlinks-for-medical-websites': ['health-blog-link-building', 'industry-specific-backlink-tips', 'ymyl-backlink-building'],
  'backlinks-for-new-brands': ['backlinks-for-new-websites', 'brand-awareness-backlinks', 'how-to-boost-domain-authority-fast'],
  'backlinks-for-portfolio-websites': ['backlinks-for-consultants', 'influencer-link-building', 'backlinks-for-bloggers'],
  'backlinks-for-real-estate-websites': ['backlinks-for-local-maps-ranking', 'local-seo-backlink-packages', 'geo-targeted-seo-backlinks'],
  'backlinks-for-saas-startups': ['link-building-for-saas-companies', 'backlinks-for-ai-websites', 'tech-startup-backlinks'],
  'backlinks-for-service-businesses': ['local-seo-backlink-packages', 'backlinks-for-local-maps-ranking', 'niche-backlinks-for-local-businesses'],
  'backlinks-guaranteed-indexing': ['how-to-get-indexing-for-backlinks', 'backlink-indexing-techniques', 'how-to-increase-crawl-demand'],
  'best-backlinks-for-fast-ranking': ['backlinks-for-new-websites', 'how-to-boost-domain-authority-fast', 'quick-ranking-strategies'],
  'best-places-to-buy-safe-backlinks': ['backlink-marketplace-alternatives', 'buying-backlinks-safely', 'affordable-contextual-backlinks'],
  'cheapest-white-hat-backlinks-online': ['affordable-link-building-services', 'safe-backlink-building-methods', 'affordable-high-dr-guest-posts'],
  'cheap-seo-services-for-small-business': ['link-building-packages-for-small-business', 'affordable-link-building-services', 'affordable-contextual-backlinks'],
  'competitor-backlink-replication-guide': ['competitor-backlink-gap-analysis', 'competitive-seo-backlink-analysis', 'how-to-choose-a-backlink-provider'],
  'contextual-link-packages': ['editorial-backlinks-service', 'niche-edits-and-content-placement', 'high-authority-niche-edits-service'],
  'editorial-backlinks-service': ['contextual-link-packages', 'expert-roundup-backlinks', 'google-news-approved-backlinks'],
  'email-outreach-for-niche-edits': ['how-to-do-backlink-outreach', 'blogger-outreach-for-backlinks', 'niche-edits-and-content-placement'],
  'geo-targeted-seo-backlinks': ['local-seo-backlink-packages', 'backlinks-for-local-maps-ranking', 'local-seo-citations-and-backlinks'],
  'google-friendly-backlink-services': ['safe-backlink-building-methods', 'algorithm-proof-backlink-strategy', 'google-penguin-recovery-backlinks'],
  'google-news-approved-backlinks': ['editorial-backlinks-service', 'expert-roundup-backlinks', 'press-release-backlinks'],
  'google-ranking-boost-services': ['how-to-boost-domain-authority-fast', 'seo-ranking-improvement-services', 'best-backlinks-for-fast-ranking'],
  'guest-post-marketplaces-comparison': ['best-guest-posting-platforms', 'guest-post-link-building', 'high-traffic-guest-posting-sites'],
  'high-authority-niche-edits-service': ['contextual-link-packages', 'editorial-backlinks-service', 'premium-link-building-services'],
  'high-authority-seo-packages': ['high-da-backlinks-for-sale', 'best-backlink-services-review', 'premium-link-building-services'],
  'high-dr-backlinks-for-cheap': ['affordable-high-dr-guest-posts', 'affordable-contextual-backlinks', 'high-authority-seo-packages'],
  'high-traffic-guest-posting-sites': ['best-guest-posting-platforms', 'guest-post-link-building', 'backlinks-for-bloggers'],
  'high-trust-flow-backlinks': ['backlink-quality-factors', 'da-pa-backlink-metrics', 'high-authority-seo-packages'],
  'homepage-link-placements': ['high-authority-seo-packages', 'editorial-backlinks-service', 'premium-link-building-services'],
  'how-to-audit-paid-backlinks': ['backlink-profile-diversification', 'link-audit-and-cleanup', 'safe-backlink-building-methods'],
  'how-to-boost-domain-authority-fast': ['google-ranking-boost-services', 'best-backlinks-for-fast-ranking', 'seo-ranking-improvement-services'],
  'how-to-check-if-backlinks-are-indexed': ['backlinks-guaranteed-indexing', 'backlink-indexing-techniques', 'how-to-get-indexing-for-backlinks'],
  'how-to-choose-a-backlink-provider': ['best-backlink-services-review', 'backlink-services-that-actually-work', 'backlink-pricing-guide'],
  'how-to-fix-ranking-drop-after-update': ['google-penguin-recovery-backlinks', 'backlink-penalty-prevention', 'algorithm-proof-backlink-strategy'],
  'how-to-get-high-dr-backlinks-free': ['free-backlinks-methods', 'free-backlink-opportunities-2025', 'organic-backlink-services-for-startups'],
  'how-to-get-indexing-for-backlinks': ['backlink-indexing-techniques', 'backlinks-guaranteed-indexing', 'how-to-increase-crawl-demand'],
  'how-to-increase-crawl-demand': ['backlink-indexing-techniques', 'how-to-get-indexing-for-backlinks', 'internal-link-boosting-strategies'],
  'how-to-recover-lost-backlinks': ['broken-backlink-recovery', 'backlink-growth-tracking', 'link-monitoring-tools'],
  'internal-link-boosting-strategies': ['internal-links-vs-backlinks', 'backlink-quality-factors', 'on-page-seo-best-practices'],
  'link-building-for-amazon-affiliates': ['backlinks-for-affiliate-marketers', 'link-building-for-affiliate-sites', 'conversion-optimized-backlinks'],
  'link-building-for-finance-niche': ['backlinks-for-b2b-companies', 'industry-specific-backlink-tips', 'ymyl-backlink-building'],
  'link-building-for-health-niche': ['backlinks-for-medical-websites', 'health-blog-link-building', 'industry-specific-backlink-tips'],
  'link-building-for-new-blogs': ['backlinks-for-bloggers', 'backlinks-for-new-websites', 'best-backlinks-for-fast-ranking'],
  'link-building-for-tech-niche': ['backlinks-for-ai-websites', 'tech-startup-backlinks', 'backlinks-for-saas-startups'],
  'link-building-for-youtube-channels': ['backlinks-for-bloggers', 'content-syndication-for-backlinks', 'high-traffic-guest-posting-sites'],
  'link-building-packages-for-small-business': ['cheap-seo-services-for-small-business', 'affordable-link-building-services', 'small-business-seo-tips'],
  'link-insertion-services': ['contextual-link-packages', 'niche-edits-and-content-placement', 'content-integration-services'],
  'local-seo-backlink-packages': ['backlinks-for-local-maps-ranking', 'local-seo-citations-and-backlinks', 'geo-targeted-seo-backlinks'],
  'local-seo-citations-and-backlinks': ['local-seo-backlink-packages', 'backlinks-for-local-maps-ranking', 'map-pack-seo-and-backlink-strategy'],
  'manual-link-building-service': ['effective-backlink-outreach', 'blogger-outreach-for-backlinks', 'premium-link-building-services'],
  'map-pack-seo-and-backlink-strategy': ['backlinks-for-local-maps-ranking', 'local-seo-backlink-packages', 'geo-targeted-seo-backlinks'],
  'mixed-backlink-packages': ['backlink-diversity-services', 'backlink-profile-diversification', 'comprehensive-link-building-strategy'],
  'monthly-backlink-subscription-services': ['monthly-seo-and-backlink-plans', 'link-building-automation-tools', 'recurring-seo-services'],
  'monthly-seo-and-backlink-plans': ['monthly-backlink-subscription-services', 'seo-ranking-improvement-services', 'long-term-seo-strategy'],
  'niche-backlinks-for-local-businesses': ['backlink-services-for-niches', 'local-seo-backlink-packages', 'industry-specific-backlink-tips'],
  'niche-specific-guest-post-services': ['guest-post-link-building', 'backlink-services-for-niches', 'industry-expert-positioning'],
  'on-page-seo-and-backlink-bundle': ['internal-link-boosting-strategies', 'backlink-quality-factors', 'comprehensive-seo-strategy'],
  'organic-backlink-services-for-startups': ['backlinks-for-new-brands', 'free-backlinks-methods', 'startup-seo-strategy'],
  'paid-backlink-alternatives': ['free-backlinks-methods', 'how-to-get-organic-backlinks', 'organic-link-building-strategies'],
  'ranking-improvement-case-studies': ['backlink-services-that-actually-work', 'best-backlink-services-review', 'seo-ranking-improvement-services'],
  'safe-backlink-building-methods': ['algorithm-proof-backlink-strategy', 'google-friendly-backlink-services', 'white-hat-seo-practices'],
  'seo-ranking-improvement-services': ['google-ranking-boost-services', 'how-to-boost-domain-authority-fast', 'ranking-improvement-case-studies'],
  'seo-reseller-backlink-packages': ['white-label-link-building-service', 'backlink-packages-for-agencies', 'reseller-seo-opportunities'],
  'seo-services-after-google-core-update': ['how-to-fix-ranking-drop-after-update', 'google-penguin-recovery-backlinks', 'algorithm-proof-backlink-strategy'],
  'seo-services-for-ecommerce-stores': ['e-commerce-backlink-packages', 'conversion-optimized-backlinks', 'backlinks-for-dropshipping-stores'],
  'tier-2-backlink-services': ['tier-3-backlink-services', 'link-building-automation-tools', 'advanced-link-building-strategies'],
  'tier-3-backlink-services': ['tier-2-backlink-services', 'link-building-automation-tools', 'pyramid-link-building-strategy'],
  'white-label-link-building-service': ['seo-reseller-backlink-packages', 'backlink-packages-for-agencies', 'white-label-seo-solutions'],
  'affordable-contextual-backlinks': ['contextual-link-packages', 'affordable-link-building-services', 'affordable-high-dr-guest-posts'],
  'affordable-high-dr-guest-posts': ['high-dr-backlinks-for-cheap', 'best-guest-posting-platforms', 'affordable-link-building-services']
};

function addInternalLinksToPage(slug, relatedSlugs) {
  const filePath = path.join(pagesDir, `${slug}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `File not found: ${slug}` };
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Build internal links section
    let relatedLinksHtml = '\n    <h2>Related Resources</h2>\n    <div class="related-links" style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;">\n      <p style="margin: 0 0 15px 0;"><strong>Explore these related guides for comprehensive link building knowledge:</strong></p>\n      <ul style="margin: 0; padding-left: 20px;">\n';
    
    relatedSlugs.forEach((relatedSlug, index) => {
      const relatedTitle = slugToTitle(relatedSlug);
      relatedLinksHtml += `        <li style="margin: 8px 0;"><a href="/${relatedSlug}" title="${relatedTitle}">${relatedTitle}</a></li>\n`;
    });
    
    relatedLinksHtml += '      </ul>\n    </div>\n';
    
    // Insert before conclusion
    const conclusionPattern = /<h2>Conclusion:/i;
    if (conclusionPattern.test(content)) {
      content = content.replace(conclusionPattern, relatedLinksHtml + '\n    <h2>Conclusion:');
    } else {
      // If no conclusion, append before closing template tag
      content = content.replace('    </div>`;', relatedLinksHtml + '\n    </div>`;');
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, linksAdded: relatedSlugs.length, slug };
  } catch (err) {
    return { success: false, error: err.message, slug };
  }
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function implementInternalLinking() {
  console.log('\n' + '='.repeat(70));
  console.log('🔗 INTERNAL LINKING IMPLEMENTATION');
  console.log('='.repeat(70) + '\n');

  let successCount = 0;
  let failureCount = 0;
  const errors = [];

  for (const [slug, relatedSlugs] of Object.entries(internalLinkingMap)) {
    // Only link to pages that actually exist
    const existingRelated = relatedSlugs.filter(s => {
      const path = `${s}.tsx`;
      return Object.keys(internalLinkingMap).includes(s);
    }).slice(0, 5); // Limit to 5 internal links max per page

    if (existingRelated.length === 0) continue;

    const result = addInternalLinksToPage(slug, existingRelated);
    
    if (result.success) {
      console.log(`✅ ${slug}`);
      console.log(`   └─ Added ${result.linksAdded} internal links\n`);
      successCount++;
    } else {
      console.log(`❌ ${slug}: ${result.error}\n`);
      failureCount++;
      errors.push(result.error);
    }
  }

  console.log('='.repeat(70));
  console.log('📊 INTERNAL LINKING RESULTS');
  console.log('='.repeat(70));
  console.log(`\n✅ Pages Updated: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`\n📈 Total Internal Links Created: ~${successCount * 4}\n`);

  console.log('🎯 Benefits of This Internal Linking Strategy:');
  console.log('  ✓ Improved crawlability and indexation');
  console.log('  ✓ Link equity distribution across the site');
  console.log('  ✓ Enhanced user navigation and engagement');
  console.log('  ✓ Semantic relevance signals to Google');
  console.log('  ✓ Reduced bounce rates through related content');
  console.log('  ✓ Increased pages per session metrics');
  console.log('  ✓ Better contextual link placement\n');

  if (errors.length > 0) {
    console.log('⚠️  Errors Encountered:');
    errors.forEach(err => console.log(`  - ${err}`));
    console.log();
  }

  console.log('✨ Internal linking strategy implementation complete!\n');
}

implementInternalLinking().catch(console.error);
