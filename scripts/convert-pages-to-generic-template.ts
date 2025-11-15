#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/pages');

const pagesToConvert = [
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

interface PageData {
  title: string;
  subtitle: string;
  htmlContent: string;
  description?: string;
}

function extractPageData(fileContent: string): PageData | null {
  const titleMatch = fileContent.match(/const title = ["']([^"']+)["']/);
  const subtitleMatch = fileContent.match(/const subtitle = ["']([^"']+)["']/);
  const htmlContentMatch = fileContent.match(/const htmlContent = `([\s\S]*?)`\s*(?:;|const)/);

  if (!titleMatch || !subtitleMatch || !htmlContentMatch) {
    return null;
  }

  const title = titleMatch[1];
  const subtitle = subtitleMatch[1];
  let htmlContent = htmlContentMatch[1].trim();

  return {
    title,
    subtitle,
    htmlContent,
    description: subtitle
  };
}

function generateConvertedPage(pageName: string, data: PageData): string {
  const componentName = pageName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Page';

  return `import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const ${componentName}: React.FC = () => {
  const title = "${data.title.replace(/"/g, '\\"')}";
  const subtitle = "${data.subtitle.replace(/"/g, '\\"')}";
  const htmlContent = \`${data.htmlContent.replace(/`/g, '\\`')}\`;

  return <GenericPageTemplate title={title} subtitle={subtitle} htmlContent={htmlContent} />;
};

export default ${componentName};
`;
}

async function convertPages() {
  let converted = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const pageName of pagesToConvert) {
    const filePath = path.join(pagesDir, `${pageName}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      errors.push(`File not found: ${filePath}`);
      failed++;
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const pageData = extractPageData(fileContent);

      if (!pageData) {
        errors.push(`Could not extract data from: ${pageName}`);
        failed++;
        continue;
      }

      const convertedContent = generateConvertedPage(pageName, pageData);
      fs.writeFileSync(filePath, convertedContent, 'utf-8');
      
      converted++;
      console.log(`✓ Converted: ${pageName}`);
    } catch (err) {
      errors.push(`Error processing ${pageName}: ${String(err)}`);
      failed++;
      console.error(`✗ Failed: ${pageName}`, err);
    }
  }

  console.log('\n=== Conversion Summary ===');
  console.log(`Total converted: ${converted}/${pagesToConvert.length}`);
  console.log(`Failed: ${failed}`);
  
  if (errors.length > 0) {
    console.log('\n=== Errors ===');
    errors.forEach(err => console.log(`- ${err}`));
  }
}

convertPages().catch(console.error);
