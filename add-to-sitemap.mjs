#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

const newKeywords = [
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

function generateSitemapEntry(slug) {
  const today = new Date().toISOString().split('T')[0];
  return `  <url>
    <loc>https://backlinkoo.com/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

async function updateSitemap() {
  try {
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Remove closing tag
    const closingTag = '</urlset>';
    const contentWithoutClosing = sitemapContent.replace(closingTag, '').trim();
    
    // Generate new entries
    const newEntries = newKeywords.map(slug => generateSitemapEntry(slug)).join('\n');
    
    // Combine and add closing tag
    const updatedContent = contentWithoutClosing + '\n' + newEntries + '\n' + closingTag;
    
    // Write back to file
    fs.writeFileSync(sitemapPath, updatedContent, 'utf-8');
    
    console.log('✅ Sitemap updated successfully!');
    console.log(`Added ${newKeywords.length} new URLs to sitemap.xml`);
    console.log(`Total sitemap entries: ${(sitemapContent.match(/<loc>/g) || []).length + newKeywords.length}`);
  } catch (err) {
    console.error('❌ Error updating sitemap:', err);
    process.exit(1);
  }
}

updateSitemap();
