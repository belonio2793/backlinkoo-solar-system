# Complete List of Broken Video Patterns to Remove

## Summary
This document lists all the exact placeholder YouTube video ID patterns found across the remaining 40-50 pages that still need fixing.

## All Placeholder Video IDs Found

```
youtube.com/embed/example-video-id
youtube.com/embed/sample-video-id
youtube.com/embed/another-video-id
youtube.com/embed/example-tutorial
youtube.com/embed/example-tutorial-video
youtube.com/embed/example-tutorial-id
youtube.com/embed/another-tutorial
youtube.com/embed/another-tutorial-id
youtube.com/embed/another-video-tutorial
youtube.com/embed/example-gaming-backlink-tutorial
youtube.com/embed/example-faq-backlinks
youtube.com/embed/faq-tutorial
youtube.com/embed/faq-tutorial-video
youtube.com/embed/case-study-video
youtube.com/embed/example-organic-link-building-tutorial
youtube.com/embed/example-paid-backlinks-tutorial
youtube.com/embed/example-link-building-tutorial
youtube.com/embed/another-link-building-video
youtube.com/embed/example-link-building-tutorial
youtube.com/embed/another-link-building-video
youtube.com/embed/example-tutorial-video
youtube.com/embed/another-tutorial
youtube.com/embed/test-video
youtube.com/embed/demo-video
youtube.com/embed/sample-tutorial
youtube.com/embed/tutorial-video
```

## Exact HTML Patterns to Remove

### Pattern 1: Standard Media Block
```html
<div class="media">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/[PLACEHOLDER-ID]" title="..." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <p><em>Description text here</em></p>
</div>
```

### Pattern 2: Media Block with Inline Styles
```html
<div class="media" style="margin: 20px 0; text-align: center;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/[PLACEHOLDER-ID]" title="..." frameborder="0" allow="..." allowfullscreen></iframe>
    <p><em>Description text</em></p>
</div>
```

### Pattern 3: Media Block with max-width Style
```html
<div class="media" style="text-align: center; margin: 20px 0;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/[PLACEHOLDER-ID]" ... style="max-width: 100%;"></iframe>
    <p><em>Description</em></p>
</div>
```

### Pattern 4: Iframe without Media Div (Rare)
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/[PLACEHOLDER-ID]" ...></iframe>
<p><em>Description</em></p>
```

## Files Needing Fixes (Categorized by Placeholder ID Count)

### Files with 2 Videos
- best-backlink-checker-tools.tsx
- buy-niche-relevant-backlinks.tsx
- buzzsumo-for-link-opportunities.tsx
- cheap-backlinks-for-seo.tsx
- competitor-backlink-gap-analysis.tsx
- conversion-optimized-backlinks.tsx
- directory-submission-link-building.tsx
- e-commerce-backlink-packages.tsx
- e-e-a-t-signals-via-backlinks.tsx
- ethical-black-hat-alternatives.tsx
- finance-site-link-acquisition.tsx
- fiverr-vs-upwork-for-links.tsx
- forum-link-building-tips.tsx
- free-backlink-opportunities-2025.tsx
- google-penguin-recovery-backlinks.tsx
- gsa-search-engine-ranker-alternatives.tsx
- haro-link-building-guide.tsx
- health-blog-link-building.tsx
- influencer-outreach-for-backlinks.tsx
- link-building-strategies-2025.tsx
- measuring-roi-on-backlinks.tsx
- mobile-first-link-acquisition.tsx
- multilingual-backlink-building.tsx
- natural-link-building-patterns.tsx
- podcast-guesting-for-links.tsx
- premium-backlink-packages.tsx
- purchase-dofollow-backlinks.tsx
- real-estate-seo-backlinks.tsx
- referral-traffic-from-backlinks.tsx
- safe-backlink-buying-guide.tsx
- scale-link-building-agency.tsx
- schema-markup-for-backlinks.tsx
- seasonal-link-building-campaigns.tsx
- senuke-tng-for-links.tsx
- toxic-backlink-removal.tsx
- web3-link-building-nfts.tsx
- white-hat-link-building-techniques.tsx
- backlinks-for-local-seo.tsx
- guest-post-link-building.tsx
- top-backlink-providers-reviewed.tsx

### Files with 1 Video
- broken-link-building-method.tsx
- buy-backlinks-from-authority-sites.tsx
- buy-pbn-backlinks-safely.tsx
- case-study-high-quality-backlinks.tsx
- core-web-vitals-and-backlinks.tsx
- how-much-do-backlinks-cost.tsx
- how-to-buy-backlinks-safely.tsx
- moz-link-explorer-guide.tsx
- on-page-seo-for-link-acquisition.tsx
- paid-vs-free-backlinks.tsx
- saas-link-building-tactics.tsx
- social-media-signal-backlinks.tsx
- spam-score-reduction-for-links.tsx
- spyfu-competitor-backlinks.tsx
- tech-startup-backlinks.tsx
- travel-blog-guest-posts.tsx
- video-seo-backlinks.tsx
- xrumer-backlink-automation.tsx
- backlinks-vs-content-marketing.tsx

### Files with 2+ Videos
- majestic-seo-backlinks.tsx (3+ videos)

## Recommended Fix Strategies

### Strategy 1: Regex Find & Replace (Fastest - 5 minutes)
Best for: Batch fixing all remaining files at once

**Tools:** VSCode, Sublime Text, or any regex-enabled editor

**Find:** 
```
<div class="media"[^>]*>\s*<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/(example|sample|another|test|demo|faq|tutorial|case-study)[^"]*"[^>]*(?:style="[^"]*")?>(?:<\/iframe>)?\s*<p><em>[^<]*<\/em><\/p>\s*<\/div>
```

**Replace:** (leave empty)

### Strategy 2: Manual Deletion (Accurate - 20-30 minutes)
Best for: Ensuring each change is verified

Steps:
1. Open each file in list
2. Search for `youtube.com/embed/`
3. Select the entire `<div class="media">` block
4. Delete it
5. Save

### Strategy 3: Script-Based (Automated - requires terminal)
Once ACL restrictions allow script execution:

```bash
for file in src/pages/*.tsx; do
  sed -i '/<div class="media">/,/<\/div>/{
    /youtube\.com\/embed\/\(example\|sample\|another\|test\|demo\|faq\|tutorial\|case-study\)/,/<\/div>/d
  }' "$file"
done
```

## Verification Checklist

After fixes:
- [ ] No placeholder IDs remain: `grep -r "youtube.com/embed/example\|youtube.com/embed/sample\|youtube.com/embed/another" src/pages/`
- [ ] No empty media divs: `grep -r "<div class=\"media\"></div>" src/pages/`
- [ ] Build succeeds: `npm run build` (if applicable)
- [ ] No syntax errors in changed files
- [ ] Spot check 3-5 files to verify layout is clean

## Time Estimate

| Method | Time | Accuracy | Effort |
|--------|------|----------|--------|
| Regex Find & Replace | 5 min | 95% | Very Low |
| Manual Deletion | 20-30 min | 100% | Medium |
| Script-Based | 5 min | 100% | Medium (requires setup) |

**Recommendation:** Use Regex Find & Replace for fastest results, then do manual verification of a few files.

---

**Total videos to remove:** ~70-80 iframes across ~40-50 remaining files
**Status:** 34 files already completed
**Work remaining:** 40-50 files (varies by method)
