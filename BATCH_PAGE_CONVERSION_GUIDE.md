# Batch Page Conversion Guide

## Overview
This guide explains how to convert 100 imported SEO pages from using custom `PageContainer` styled components to using the `GenericPageTemplate` component for consistent styling like the `/senuke-tng-for-links` page.

## What's Already Done
✅ **ai-tools-for-backlink-outreach.tsx** - Already converted and using GenericPageTemplate

## Conversion Pattern

### Before (Current):
```tsx
import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ...
`;

const PageNamePage: React.FC = () => {
  const title = "Page Title Here";
  const subtitle = "Page subtitle here";
  const htmlContent = `<html content>`;
  
  return (
    <>
      <Head>...</Head>
      <PageContainer>
        <h1>...</h1>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ...
      </PageContainer>
    </>
  );
};
```

### After (Target):
```tsx
import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const PageNamePage: React.FC = () => {
  const title = "Page Title Here";
  const subtitle = "Page subtitle here";
  const htmlContent = `<html content>`;

  return <GenericPageTemplate title={title} subtitle={subtitle} htmlContent={htmlContent} />;
};

export default PageNamePage;
```

## Pages to Convert (99 remaining)

```
algorithm-proof-backlink-strategy
backlink-diversity-services
backlink-impact-on-domain-authority
backlink-marketplace-alternatives
backlink-optimization-for-ranking-drops
backlink-packages-for-agencies
backlink-packages-that-boost-sales
backlink-penalty-prevention
backlink-pricing-guide
backlink-quality-vs-quantity-debate
backlink-recommendations-for-2025
backlink-recommendations-for-new-domains
backlink-roi-calculation
backlink-services-for-international-sites
backlink-services-for-multilingual-brands
backlink-services-for-niches
backlink-services-for-wordpress-sites
backlink-services-that-actually-work
backlinks-for-affiliate-marketers
backlinks-for-agencies
backlinks-for-ai-websites
backlinks-for-b2b-companies
backlinks-for-bloggers
backlinks-for-consultants
backlinks-for-crypto-sites
backlinks-for-dropshipping-stores
backlinks-for-lawyer-websites
backlinks-for-lead-generation-websites
backlinks-for-local-maps-ranking
backlinks-for-medical-websites
backlinks-for-new-brands
backlinks-for-portfolio-websites
backlinks-for-real-estate-websites
backlinks-for-saas-startups
backlinks-for-service-businesses
backlinks-guaranteed-indexing
best-backlinks-for-fast-ranking
best-places-to-buy-safe-backlinks
cheapest-white-hat-backlinks-online
cheap-seo-services-for-small-business
competitor-backlink-replication-guide
contextual-link-packages
editorial-backlinks-service
email-outreach-for-niche-edits
geo-targeted-seo-backlinks
google-friendly-backlink-services
google-news-approved-backlinks
google-ranking-boost-services
guest-post-marketplaces-comparison
high-authority-niche-edits-service
high-authority-seo-packages
high-dr-backlinks-for-cheap
high-traffic-guest-posting-sites
high-trust-flow-backlinks
homepage-link-placements
how-to-audit-paid-backlinks
how-to-boost-domain-authority-fast
how-to-check-if-backlinks-are-indexed
how-to-choose-a-backlink-provider
how-to-fix-ranking-drop-after-update
how-to-get-high-dr-backlinks-free
how-to-get-indexing-for-backlinks
how-to-increase-crawl-demand
how-to-recover-lost-backlinks
internal-link-boosting-strategies
link-building-for-amazon-affiliates
link-building-for-finance-niche
link-building-for-health-niche
link-building-for-new-blogs
link-building-for-tech-niche
link-building-for-youtube-channels
link-building-packages-for-small-business
link-insertion-services
local-seo-backlink-packages
local-seo-citations-and-backlinks
manual-link-building-service
map-pack-seo-and-backlink-strategy
mixed-backlink-packages
monthly-backlink-subscription-services
monthly-seo-and-backlink-plans
niche-backlinks-for-local-businesses
niche-specific-guest-post-services
on-page-seo-and-backlink-bundle
organic-backlink-services-for-startups
paid-backlink-alternatives
ranking-improvement-case-studies
safe-backlink-building-methods
seo-ranking-improvement-services
seo-reseller-backlink-packages
seo-services-after-google-core-update
seo-services-for-ecommerce-stores
tier-2-backlink-services
tier-3-backlink-services
white-label-link-building-service
affordable-contextual-backlinks
affordable-high-dr-guest-posts
```

## Option 1: Manual Conversion (Safe but Time-Consuming)

For each page file:
1. Open `src/pages/[page-slug].tsx`
2. Extract the values from lines with:
   - `const title = "..."`
   - `const subtitle = "..."`  
   - `const htmlContent = \`...\`` (the entire backtick-wrapped content)
3. Replace entire file content with the GenericPageTemplate pattern shown above

## Option 2: Using a Conversion Script

Create a Node.js script in your project root and run it locally:

```bash
node convert-pages.js
```

The script `/convert_pages.py` is available in the root directory but requires Python execution environment.

## Key Benefits of GenericPageTemplate

1. **Consistent Styling** - Matches the senuke-tng-for-links page look
2. **Built-in Header & Footer** - No need to manage these separately
3. **Automatic Section Parsing** - Creates table of contents from headings
4. **Better Accessibility** - Improves SEO and user experience
5. **Dark Mode Support** - Generic-page.css has built-in dark mode
6. **Responsive Design** - Mobile-optimized styling
7. **Metadata Handling** - Automatic canonical URLs and JSON-LD schema

## Testing After Conversion

1. Visit the page in your browser: `https://yoursite.com/page-slug`
2. Verify:
   - Title displays correctly
   - Subtitle shows in hero section
   - Content renders properly
   - Links work (especially internal links to /senuke, /xrumer)
   - Images display
   - Tables format correctly
   - Responsive design works on mobile

## Troubleshooting

### Issue: Special characters breaking the file
- Solution: Ensure backticks (\`) in htmlContent are escaped as \\`
- Ensure quotes (") in title/subtitle are escaped as \\"

### Issue: Links not working
- Internal links like `<Link href="/senuke">` need to be changed to `<a href="/senuke">`
- The GenericPageTemplate doesn't import Next.js Link component

### Issue: Styling looks different
- This is expected - GenericPageTemplate uses generic-page.css which has different styling
- This is the desired outcome to match the /senuke appearance

## Next Steps

After conversion completes:
1. Test 5-10 random pages to ensure they render correctly
2. Check for any console errors in browser DevTools
3. Verify internal navigation works
4. Test responsive design on mobile
5. Verify all media (images/videos) load correctly

## Support

If you need help with specific pages or encounter issues, each page can be individually converted following the pattern above.
