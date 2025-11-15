# Media Replacement Guide for Backlink Pages

This guide explains the available scripts for replacing broken, invalid, or unavailable images and videos in your backlink-related pages.

## Available Scripts

### 1. **scripts/replace-media-comprehensive.mjs** (NEW - RECOMMENDED)
**Purpose**: Replaces all images and videos with content-relevant, high-quality alternatives

**Features**:
- Maps 95+ page slugs to relevant YouTube video IDs
- Replaces generic placeholder images with Unsplash images specific to each page topic
- Ensures consistent media across all pages
- Updates both img src attributes and YouTube iframe embeds
- Provides detailed reporting of changes

**Usage**:
```bash
node scripts/replace-media-comprehensive.mjs
```

**What it does**:
- Scans all pages from your list
- Replaces images from `pexels.com` with relevant Unsplash images
- Updates YouTube video IDs to match page content
- Creates a summary report of changes

---

### 2. **fill-all-videos-comprehensive.mjs**
**Purpose**: Ensures all pages have YouTube video embeds mapped to relevant content

**Features**:
- 100-page slug to video ID mapping
- Fills in missing videos if page has no video
- Replaces placeholder video IDs with real ones
- Verifies video coverage

**Usage**:
```bash
node fill-all-videos-comprehensive.mjs
```

---

### 3. **scripts/fix-unavailable-videos-final.mjs**
**Purpose**: Fixes broken/unavailable YouTube video IDs

**Features**:
- Identifies problematic video IDs
- Replaces with verified working alternatives
- Uses consistent video selection per page
- Reports all fixes

**Usage**:
```bash
node scripts/fix-unavailable-videos-final.mjs
```

---

### 4. **fill-video-placeholders.mjs**
**Purpose**: Fills placeholder video IDs with real YouTube IDs

**Features**:
- Maps placeholders to actual working videos
- Covers blogger outreach and related content
- Ensures all embeds are functional

**Usage**:
```bash
node fill-video-placeholders.mjs
```

---

### 5. **verify-videos.js**
**Purpose**: Verifies that YouTube video embeds are valid and functional

**Features**:
- Checks all video IDs in pages
- Reports invalid or broken videos
- Provides list of working alternatives
- No modifications, read-only

**Usage**:
```bash
node verify-videos.js
```

---

## Page Slugs Being Updated

The scripts handle all these page slugs (95+ total):

- ai-tools-for-backlink-outreach
- algorithm-proof-backlink-strategy
- backlink-diversity-services
- backlink-impact-on-domain-authority
- backlink-marketplace-alternatives
- backlink-optimization-for-ranking-drops
- backlink-packages-for-agencies
- backlink-packages-that-boost-sales
- backlink-penalty-prevention
- backlink-pricing-guide
- backlink-quality-vs-quantity-debate
- backlink-recommendations-for-2025
- backlink-recommendations-for-new-domains
- backlink-roi-calculation
- backlink-services-for-international-sites
- backlink-services-for-multilingual-brands
- backlink-services-for-niches
- backlink-services-for-wordpress-sites
- backlink-services-that-actually-work
- backlinks-for-affiliate-marketers
- backlinks-for-agencies
- backlinks-for-ai-websites
- backlinks-for-b2b-companies
- backlinks-for-bloggers
- backlinks-for-consultants
- backlinks-for-crypto-sites
- backlinks-for-dropshipping-stores
- backlinks-for-lawyer-websites
- backlinks-for-lead-generation-websites
- backlinks-for-local-maps-ranking
- backlinks-for-medical-websites
- backlinks-for-new-brands
- backlinks-for-portfolio-websites
- backlinks-for-real-estate-websites
- backlinks-for-saas-startups
- backlinks-for-service-businesses
- backlinks-guaranteed-indexing
- best-backlinks-for-fast-ranking
- best-places-to-buy-safe-backlinks
- cheapest-white-hat-backlinks-online
- cheap-seo-services-for-small-business
- competitor-backlink-replication-guide
- contextual-link-packages
- editorial-backlinks-service
- email-outreach-for-niche-edits
- geo-targeted-seo-backlinks
- google-friendly-backlink-services
- google-news-approved-backlinks
- google-ranking-boost-services
- guest-post-marketplaces-comparison
- high-authority-niche-edits-service
- high-authority-seo-packages
- high-dr-backlinks-for-cheap
- high-traffic-guest-posting-sites
- high-trust-flow-backlinks
- homepage-link-placements
- how-to-audit-paid-backlinks
- how-to-boost-domain-authority-fast
- how-to-check-if-backlinks-are-indexed
- how-to-choose-a-backlink-provider
- how-to-fix-ranking-drop-after-update
- how-to-get-high-dr-backlinks-free
- how-to-get-indexing-for-backlinks
- how-to-increase-crawl-demand
- how-to-recover-lost-backlinks
- internal-link-boosting-strategies
- link-building-for-amazon-affiliates
- link-building-for-finance-niche
- link-building-for-health-niche
- link-building-for-new-blogs
- link-building-for-tech-niche
- link-building-for-youtube-channels
- link-building-packages-for-small-business
- local-seo-backlink-packages
- local-seo-citations-and-backlinks
- manual-link-building-service
- map-pack-seo-and-backlink-strategy
- mixed-backlink-packages
- monthly-backlink-subscription-services
- monthly-seo-and-backlink-plans
- niche-backlinks-for-local-businesses
- niche-specific-guest-post-services
- on-page-seo-and-backlink-bundle
- organic-backlink-services-for-startups
- paid-backlink-alternatives
- ranking-improvement-case-studies
- safe-backlink-building-methods
- seo-ranking-improvement-services
- seo-reseller-backlink-packages
- seo-services-after-google-core-update
- seo-services-for-ecommerce-stores
- tier-2-backlink-services
- tier-3-backlink-services
- white-label-link-building-service
- affordable-contextual-backlinks
- affordable-high-dr-guest-posts

## Recommended Workflow

### Step 1: Run the Comprehensive Media Replacement
```bash
node scripts/replace-media-comprehensive.mjs
```

This will:
- Replace all generic/broken images with topic-relevant ones from Unsplash
- Update YouTube video IDs to match page content
- Report exactly which pages were updated

### Step 2: Verify Results
The script will output:
- Total pages processed
- Number of pages with updated media
- Coverage percentage
- Sample of updated pages

### Step 3: Test in Browser
After running the script:
1. Rebuild your application: `npm run build`
2. Test a few pages to verify images and videos load correctly
3. Check that videos are relevant to the page topic

## Image Sources

The scripts use high-quality image sources:
- **Unsplash**: Free, high-resolution, professionally-curated images
- Each page gets an image relevant to its specific topic (e.g., "Backlink diversity" gets different image than "SaaS startup backlinks")

## Video Mapping

The scripts use verified working YouTube video IDs, including:
- Link building tutorials
- SEO strategy guides
- Backlink analysis tools demos
- Platform-specific guidance

Each page slug is mapped to the most relevant video content.

## Troubleshooting

### Videos Not Loading
If videos appear broken after running the script:
1. Check the console for any JavaScript errors
2. Run `node verify-videos.js` to identify problematic IDs
3. Run the appropriate fix script

### Images Not Displaying
If images don't load:
1. Check network tab in browser DevTools
2. Verify Unsplash URLs are accessible
3. Re-run the comprehensive script

### Need to Update Specific Page
To update a single page manually:
1. Find the page file in `src/pages/[slug].tsx`
2. Locate the `htmlContent` variable
3. Update the image `src` and YouTube `videoId` values
4. Save and rebuild

## Next Steps

1. ✅ Run the comprehensive media replacement script
2. ✅ Rebuild and test your application
3. ✅ Verify images and videos load correctly
4. ✅ Check that media is relevant to page content
5. ✅ Deploy your changes

---

**Last Updated**: Now  
**Script Version**: 1.0  
**Pages Covered**: 95+
