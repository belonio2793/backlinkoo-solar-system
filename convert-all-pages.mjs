#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGES_DIR = path.join(__dirname, 'src', 'pages');

const PAGES_TO_CONVERT = [
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

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function extractPageData(content) {
  const titleRegex = /const title = ["']([^"']+)["']/;
  const subtitleRegex = /const subtitle = ["']([^"']+)["']/;
  const htmlRegex = /const htmlContent = `([\s\S]*?)`\s*(?:;|const)/;

  const titleMatch = content.match(titleRegex);
  const subtitleMatch = content.match(subtitleRegex);
  const htmlMatch = content.match(htmlRegex);

  if (!titleMatch || !subtitleMatch || !htmlMatch) {
    return null;
  }

  return {
    title: titleMatch[1],
    subtitle: subtitleMatch[1],
    htmlContent: htmlMatch[1].trim()
  };
}

function escapeForTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/"/g, '\\"');
}

function generateNewPage(slug, data) {
  const componentName = toPascalCase(slug) + 'Page';
  const escapedTitle = escapeForTemplate(data.title);
  const escapedSubtitle = escapeForTemplate(data.subtitle);
  const escapedHtml = escapeForTemplate(data.htmlContent);

  return `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${escapedTitle}";
  const subtitle = "${escapedSubtitle}";
  const htmlContent = \`${escapedHtml}\`;

  return <GenericPageTemplate title={title} subtitle={subtitle} htmlContent={htmlContent} />;
};

export default ${componentName};
`;
}

async function main() {
  console.log('🚀 Starting batch page conversion...\n');
  
  let converted = 0;
  let failed = 0;
  const failures = [];

  for (const pageName of PAGES_TO_CONVERT) {
    const filePath = path.join(PAGES_DIR, `${pageName}.tsx`);

    if (!fs.existsSync(filePath)) {
      failed++;
      failures.push(`❌ File not found: ${filePath}`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = extractPageData(content);

      if (!data) {
        failed++;
        failures.push(`❌ Could not extract data from: ${pageName}`);
        continue;
      }

      const newContent = generateNewPage(pageName, data);
      fs.writeFileSync(filePath, newContent, 'utf-8');

      converted++;
      console.log(`✅ ${pageName}`);
    } catch (error) {
      failed++;
      failures.push(`❌ Error in ${pageName}: ${error.message}`);
      console.error(`❌ ${pageName}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Converted:  ${converted}/${PAGES_TO_CONVERT.length}`);
  console.log(`❌ Failed:     ${failed}`);
  console.log('='.repeat(60));

  if (failures.length > 0) {
    console.log('\n⚠️  FAILURES:\n');
    failures.forEach(f => console.log(f));
  }

  console.log('\n✨ Done!\n');
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
