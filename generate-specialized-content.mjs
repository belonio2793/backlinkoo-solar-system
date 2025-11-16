#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Specialized content templates per topic
const specializedContent = {
  'anchor-text-ratio-guide': {
    title: 'Anchor Text Ratio Guide: The Complete Distribution Framework',
    content: `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>Anchor Text Ratio Guide: The Complete Distribution Framework</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Your anchor text distribution is one of the most critical SEO metrics that separates industry leaders from underperformers. Getting your anchor text ratio wrong doesn't just limit rankings—it signals manipulation to Google and triggers penalty flags. This guide shows you exactly what ratio works, how to audit yours, and how to recover if you've over-optimized.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>The Golden Anchor Text Ratio:</strong> 50-60% branded, 20-30% generic/LSI, 10-20% partial match, 5-10% exact match. This distribution signals natural linking patterns while maximizing keyword relevance.
  </div>

  <h2>Understanding Anchor Text Distribution Fundamentals</h2>
  <p>Search engines analyze your entire backlink profile's anchor text distribution to determine if your link profile looks natural or engineered. A site with 85% exact-match anchors gets flagged immediately. A site with 15% exact-match anchors within a diverse mix looks earned.</p>
  
  <p>The algorithm examines:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li><strong>Ratio balance:</strong> How many exact-match vs. branded vs. generic anchors</li>
    <li><strong>Industry norms:</strong> Comparing your ratios to natural competitors in your niche</li>
    <li><strong>Growth pattern:</strong> Whether ratios changed suddenly (engineered) or gradually (natural)</li>
    <li><strong>Source diversity:</strong> Whether over-optimized anchors come from multiple different domains</li>
    <li><strong>Link velocity correlation:</strong> If you got 50 exact-match anchors last month but only 3 the month before</li>
  </ul>

  <h2>The Anchor Text Categories Explained</h2>
  
  <h3>Branded Anchors (50-60% of links)</h3>
  <p><strong>Examples:</strong> "Backlinkoo", "Backlinko", "Get Backlinkoo", "Backlinkoo.com"</p>
  <p>These should dominate your anchor text distribution. Branded anchors are natural—people link with your brand name. Search engines expect to see your brand as the most common anchor. For a site with 100 backlinks, 50-60 should use your brand name.</p>
  
  <p><strong>Action item:</strong> Count your current branded anchors. Divide by total backlinks. If you're below 40%, your profile looks artificial. If you're below 35%, you're vulnerable to penalty.</p>

  <h3>Generic/LSI Anchors (20-30% of links)</h3>
  <p><strong>Examples:</strong> "click here", "read more", "learn more", "check out this resource", "visit our site"</p>
  <p>These look completely natural and help balance your profile. LSI (Latent Semantic Indexing) anchors use related keywords that signal topical relevance without exact-match optimization. "SEO tool" for an "SEO software" site signals relevance without being an exact match.</p>
  
  <p><strong>Action item:</strong> If your generic anchor percentage is below 15%, you're vulnerable. Aim for 20-30% to build a natural profile.</p>

  <h3>Partial Match Anchors (10-20% of links)</h3>
  <p><strong>Examples:</strong> "best anchor text practices", "anchor text guide", "optimizing anchor text for SEO"</p>
  <p>These include your target keyword plus modifiers. They're valuable for rankings because they include keyword relevance, but they're safe because they're not 100% exact. Google sees these as natural editorial choices by diverse webmasters.</p>
  
  <p><strong>Action item:</strong> Track partial match anchors as a percentage. If you're below 10%, you're missing ranking potential. If you're above 25%, you're taking too much optimization risk.</p>

  <h3>Exact Match Anchors (5-10% of links)</h3>
  <p><strong>Examples:</strong> "anchor text ratio", "anchor text guide" (exact keyword phrase)</p>
  <p>These are the most risky. A link with your exact target keyword as anchor text is valuable for rankings, but too many look engineered. The sweet spot is 5-10% of your total backlink anchors.</p>
  
  <p><strong>Critical warning:</strong> If you have more than 20% exact-match anchors, you're in danger zone. More than 30%, you're almost certainly going to get hit with a Penguin-style penalty or manual action.</p>

  <h3>URL Anchors (0-5% of links)</h3>
  <p><strong>Examples:</strong> "backlinkoo.com", "https://backlinkoo.com/anchor-text-ratio-guide"</p>
  <p>These are completely natural—when people link to a resource, sometimes they just use the URL. Small percentages look earned. More than 10% starts looking artificial.</p>

  <h2>How to Audit Your Current Anchor Text Ratio</h2>
  
  <h3>Step 1: Export Your Backlinks</h3>
  <p>Use Ahrefs, SEMrush, or Moz to export your complete backlink profile. You need every backlink with its anchor text. Many tools allow CSV export with anchor text included.</p>
  
  <h3>Step 2: Categorize Your Anchors</h3>
  <p>Create a spreadsheet with columns: Anchor Text | Count | Category | %</p>
  <p>Manually categorize each unique anchor text into: Branded, Generic, Partial Match, Exact Match, URL, Other.</p>
  
  <p>Example for "backlinkoo.com":</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>"Backlinkoo" = Branded (120 links)</li>
    <li>"learn more" = Generic (45 links)</li>
    <li>"best link building tool" = Partial (35 links)</li>
    <li>"anchor text ratio" = Exact (8 links)</li>
    <li>"backlinkoo.com" = URL (12 links)</li>
  </ul>

  <h3>Step 3: Calculate Percentages</h3>
  <p>Total: 220 backlinks</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Branded: 120/220 = 54.5% ✅ (target range)</li>
    <li>Generic: 45/220 = 20.5% ✅ (target range)</li>
    <li>Partial: 35/220 = 15.9% ✅ (target range)</li>
    <li>Exact: 8/220 = 3.6% ✅ (safe)</li>
    <li>URL: 12/220 = 5.5% ✅ (natural)</li>
  </ul>
  <p>This profile is healthy—all ratios are in safe zones.</p>

  <h3>Step 4: Identify Problem Areas</h3>
  <p>If your exact-match percentage is 15%+, you need to diversify. If your branded percentage is below 35%, your profile looks artificial. If your generic percentage is below 15%, you're missing natural link signals.</p>

  <h2>Red Flags That Signal Over-Optimization</h2>
  
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li><strong>Exact-match jump:</strong> Getting 10 exact-match anchors in a month when you normally get 1-2. This looks engineered.</li>
    <li><strong>Exact-match domination:</strong> Your top 5 anchors are all exact-match. Natural profiles have branded as #1.</li>
    <li><strong>Anchor text uniformity:</strong> You have 50 links but only 5 unique anchor phrases. Real sites have 30+ unique anchors.</li>
    <li><strong>Comment spam patterns:</strong> Multiple exact-match anchors from blog comments on unrelated sites.</li>
    <li><strong>PBN footprints:</strong> Exact-match anchors from clusters of sites with similar content and linking patterns.</li>
    <li><strong>Competitor anchor analysis:</strong> Your exact-match percentage is 3x higher than competitors.</li>
  </ul>

  <h2>Recovery Strategy: Fixing Over-Optimized Anchor Profiles</h2>
  
  <h3>Step 1: Stop Adding Exact-Match Anchors</h3>
  <p>First rule of holes: stop digging. If you're in over-optimization trouble, your first priority is to completely stop building exact-match anchor links. Period.</p>

  <h3>Step 2: Diversify Your New Link Building</h3>
  <p>For the next 3-6 months, build only branded, generic, and partial-match anchors. This gradually rebalances your profile over time without the sudden drops that trigger algorithm re-evaluation.</p>
  
  <p><strong>Monthly target for recovery:</strong></p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>70% branded anchors</li>
    <li>20% generic anchors</li>
    <li>10% partial-match anchors</li>
    <li>0% exact-match anchors</li>
  </ul>

  <h3>Step 3: Disavow Low-Quality Over-Optimized Links</h3>
  <p>If you have exact-match anchors from obviously low-quality sources (comment spam, PBNs, footer links), disavow them. Google's tools make this easy. This shows you're taking corrective action.</p>
  
  <p>Don't disavow high-quality exact-match links from authoritative sites—those look natural even with exact keywords.</p>

  <h3>Step 4: Create Content Targeting Partial Matches</h3>
  <p>Optimize your on-page content to rank for partial-match phrases. If your target is "anchor text ratio guide", optimize for:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>"anchor text distribution"</li>
    <li>"optimal anchor text percentage"</li>
    <li>"anchor text best practices"</li>
    <li>"how to optimize anchor text"</li>
  </ul>
  <p>This way, partial-match anchors become more valuable for rankings.</p>

  <h2>Natural Anchor Text Ratios by Industry</h2>
  
  <p><strong>Highly Competitive Niches (Finance, Health, SEO)</strong></p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Branded: 55-65%</li>
    <li>Generic: 20-30%</li>
    <li>Partial: 8-12%</li>
    <li>Exact: 3-8%</li>
  </ul>

  <p><strong>Medium Competition (Tech, Software, B2B)</strong></p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Branded: 45-55%</li>
    <li>Generic: 25-35%</li>
    <li>Partial: 10-15%</li>
    <li>Exact: 5-12%</li>
  </ul>

  <p><strong>Low Competition (Local, Niche, New)</strong></p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Branded: 30-50%</li>
    <li>Generic: 20-30%</li>
    <li>Partial: 15-25%</li>
    <li>Exact: 10-20%</li>
  </ul>

  <h2>Tools for Anchor Text Ratio Monitoring</h2>
  
  <p><strong>Ahrefs</strong> - Best anchor text visualization. Hover over percentages to see breakdowns.</p>
  
  <p><strong>SEMrush</strong> - Good CSV export of all anchors, filterable by type.</p>
  
  <p><strong>Google Sheets Formula</strong> - Create a COUNTIF formula to automatically categorize anchors by keyword match.</p>
  
  <p><strong>Backlink Analyzer Tool</strong> - Some SEO platforms have built-in anchor text categorization. Use it.</p>

  <h2>Anchor Text Ratio Impact on Rankings</h2>
  
  <p>Studies by the SEO community show:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Sites with 50%+ branded anchors rank for their brand terms better (obviously)</li>
    <li>Sites with 5-10% exact-match anchors rank for keywords better than 0% but safer than 20%+</li>
    <li>Sites with diversified profiles (80%+ in top 4 categories) have fewer algorithm volatility issues</li>
    <li>Exact-match anchors provide 2-3x ranking boost per link, but they're riskier (penalty potential)</li>
  </ul>

  <h2>Common Mistakes and How to Avoid Them</h2>
  
  <p><strong>Mistake 1: Confusing Partial Match with Exact Match</strong></p>
  <p>"Best anchor text ratio guide" is partial match. "Anchor text ratio guide" is exact match. Track these separately.</p>

  <p><strong>Mistake 2: Only Monitoring Top Anchors</strong></p>
  <p>Your top 5 anchors might look good, but your bottom 50 might be garbage exact matches. Audit the full distribution.</p>

  <p><strong>Mistake 3: Not Comparing to Competitors</strong></p>
  <p>Run the same anchor audit on your top 3 competitors. If your exact-match percentage is 3x theirs, you're at risk.</p>

  <p><strong>Mistake 4: Sudden Anchor Changes</strong></p>
  <p>If your exact-match percentage jumped from 5% to 25% in 2 months, Google will notice. Gradual changes look natural.</p>

  <h2>Actionable Implementation Checklist</h2>
  
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>☐ Export your complete backlink profile this week</li>
    <li>☐ Categorize anchors into 5 types (branded, generic, partial, exact, URL)</li>
    <li>☐ Calculate your current percentages and compare to safe ranges</li>
    <li>☐ Run the same analysis on top 3 competitors</li>
    <li>☐ Identify any red flags (over-optimized categories)</li>
    <li>☐ If over-optimized: disavow low-quality over-optimized links</li>
    <li>☐ Plan next 6 months of link building with safer anchor ratios</li>
    <li>☐ Set up quarterly anchor text audits to monitor changes</li>
  </ul>

  <h2>Conclusion: The Safe Path to Rankings</h2>
  <p>Anchor text ratio is a lever you can pull for rankings, but it's one of the most dangerous levers. Sites that dominate with 60%+ branded anchors, 25% generic, 10% partial, and 5% exact-match anchors consistently outrank sites with over-optimized profiles—because they avoid the algorithm risks that tank over-optimized domains.</p>
  
  <p>Your anchor text profile is like a credit score. Build it slowly, maintain diversity, and watch your rankings compound. Rush it, over-optimize it, and you'll get penalized. The safe path wins in the long term.</p>
</article>`
  }
};

// Generate topic-specific content for different page types
function generateTopicContent(slug, title) {
  // If we have specialized content, use it
  if (specializedContent[slug]) {
    return specializedContent[slug].content;
  }

  // Otherwise generate based on slug pattern
  const topic = slug.replace(/-/g, ' ');
  const topicUpper = topic.toUpperCase();
  
  // Categorize by topic to generate more specific content
  if (slug.includes('anchor-text')) {
    return generateAnchorTextContent(slug, title, topic);
  } else if (slug.includes('backlink')) {
    return generateBacklinkContent(slug, title, topic);
  } else if (slug.includes('link-building')) {
    return generateLinkBuildingContent(slug, title, topic);
  } else if (slug.includes('link-gap')) {
    return generateLinkGapContent(slug, title, topic);
  } else if (slug.includes('link-insertion')) {
    return generateLinkInsertionContent(slug, title, topic);
  } else {
    return generateGenericOptimizedContent(slug, title, topic);
  }
}

function generateAnchorTextContent(slug, title, topic) {
  return `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>${title}</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Anchor text optimization is one of the highest-ROI SEO tactics when done right, and one of the highest-risk tactics when done wrong. This guide covers the exact strategies used by sites ranking in position 1 for competitive keywords.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>Key Insight:</strong> The difference between a 20-position ranking and a top-3 ranking often comes down to anchor text strategy, not content quality.
  </div>

  <h2>Why ${topic} Matters More Than Most SEO Professionals Realize</h2>
  <p>Search engines use anchor text to understand what a page is about. When multiple high-authority sites link with the phrase "best ${topic.toLowerCase()}", Google infers that page is relevant for that phrase. But the moment you have too many exact-match anchors, the algorithm flags your profile as engineered and discounts the links.</p>

  <h2>Advanced ${topic} Implementation</h2>
  <p>Start by understanding your current state. Audit all backlinks pointing to your key pages and categorize the anchor text. Look for patterns that indicate natural vs. artificial linking. Natural links have:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Brand-heavy anchors (50%+ of total)</li>
    <li>Diverse anchor vocabulary (30+ unique phrases)</li>
    <li>Gradual anchor growth (not spikes in exact-match)</li>
    <li>Anchor text aligned with page content</li>
  </ul>

  <h2>The ${topic} Framework: Build Links That Stick</h2>
  <p>Sustainable link building for ${topic} requires a multi-phase approach:</p>
  
  <h3>Phase 1: Research Your Current Anchor Profile</h3>
  <p>Export all backlinks. Categorize by anchor type. Calculate percentages. Identify opportunities to diversify.</p>

  <h3>Phase 2: Target Underserved Anchor Phrases</h3>
  <p>Find anchor phrases your competitors rank for but you don't have links with. These become your new targets.</p>

  <h3>Phase 3: Build Relationships for Anchor Placement</h3>
  <p>Instead of asking for specific anchors, build content that people want to link to, then let webmasters choose their anchors.</p>

  <h2>Common ${topic} Pitfalls and How to Avoid Them</h2>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Over-optimizing exact-match anchors (creates algorithmic risk)</li>
    <li>Ignoring branded anchors (loses ranking compounding effects)</li>
    <li>Using the same anchor phrase on every link (looks artificial)</li>
    <li>Not matching anchors to content topics (confuses search engines)</li>
  </ul>

  <h2>${topic} Tools and Resources</h2>
  <p>Use Ahrefs, SEMrush, or Moz to analyze anchor text distribution. Track changes monthly. Compare to top 3 competitors.</p>

  <h2>Conclusion: Master ${topic} for Sustainable Rankings</h2>
  <p>The sites that dominate search results don't just have backlinks—they have strategically distributed backlinks with anchor text that signals to Google: "Yes, this site is relevant for these keywords, and yes, real people would naturally link to it." That's the foundation of lasting rankings.</p>
</article>`;
}

function generateBacklinkContent(slug, title, topic) {
  return `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>${title}</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Backlinks remain the #1 ranking factor in 2025. But not all backlinks are created equal. This guide shows you the exact criteria that separate $10 backlinks from $10,000 backlinks.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>The Core Truth:</strong> One link from a domain ranking #1 for a relevant keyword is worth more than 100 links from random low-authority blogs.
  </div>

  <h2>Understanding ${topic}</h2>
  <p>Most backlink strategies fail because they focus on quantity (getting links) instead of quality (getting the right links). This guide flips that focus.</p>

  <h2>The Backlink Quality Scorecard</h2>
  <p>When evaluating potential backlinks, score them on these criteria:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li><strong>Domain Authority (DA):</strong> Higher is better. Sites with DA 40+ carry the most weight.</li>
    <li><strong>Topical Relevance:</strong> A link from a related site is worth 5-10x more than a random site.</li>
    <li><strong>Link Position:</strong> Links in the main content are worth 3x more than footer or sidebar links.</li>
    <li><strong>Anchor Text:</strong> Targeted anchors are valuable, but over-optimization creates risk.</li>
    <li><strong>Link Velocity:</strong> Getting links gradually is more natural than sudden spikes.</li>
    <li><strong>Traffic Potential:</strong> Links from pages that actually get clicks send referral value too.</li>
  </ul>

  <h2>How to Find and Evaluate ${topic} Opportunities</h2>
  <p>Start by analyzing your top 10 competitors. Which sites link to them? Which anchors do those links use? Which topics do those links come from? This reveals the backlink playbook your competition is using.</p>

  <h2>Building Your ${topic} Strategy</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li>Identify 20 high-quality sites in your niche that might link to you</li>
    <li>Analyze what content gets linked to on those sites</li>
    <li>Create better content targeting those same topics</li>
    <li>Reach out with a personalized pitch highlighting why your content is relevant</li>
    <li>If they link, track the link and its impact on rankings</li>
  </ol>

  <h2>${topic} Success Metrics</h2>
  <p>Don't just count links. Measure these:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Organic traffic from backlinked pages</li>
    <li>Keyword ranking improvements for linked keywords</li>
    <li>Referral traffic (actual clicks from linked pages)</li>
    <li>Domain authority growth</li>
    <li>Backlink anchor text diversity</li>
  </ul>

  <h2>Common ${topic} Mistakes</h2>
  <p>Avoid these patterns that lead to algorithm penalties:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Building 100% exact-match anchors</li>
    <li>Using PBN networks (all linking with similar structure)</li>
    <li>Getting links from spammy directories</li>
    <li>Sudden spikes in link volume (looks engineered)</li>
    <li>Links from completely irrelevant sites</li>
  </ul>

  <h2>Your ${topic} Action Plan</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li>Audit your current backlinks this week</li>
    <li>Identify quality leaders in your niche</li>
    <li>Map their linking strategies</li>
    <li>Build content targeting their backlink sources</li>
    <li>Reach out with specific value propositions</li>
    <li>Track link impact on rankings</li>
    <li>Iterate based on what works</li>
  </ol>

  <h2>Conclusion</h2>
  <p>The backlink game is about quality over quantity. One relevant, high-authority link drives more results than 1,000 random links. Master the quality criteria, build strategically, and watch your rankings compound.</p>
</article>`;
}

function generateLinkBuildingContent(slug, title, topic) {
  return `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>${title}</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Successful link building is 80% strategy and 20% execution. Most SEO professionals get this backwards, leading to wasted effort and minimal results. This guide focuses on the 80%—the framework that makes link building work predictably and repeatably.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>Strategic Principle:</strong> The best link you'll ever get is the one someone wants to give you because your content is genuinely useful.
  </div>

  <h2>The ${topic} Framework</h2>
  <p>Rather than a one-size-fits-all approach, effective ${topic} requires matching your strategy to your situation:</p>

  <ul style="margin: 15px 0; padding-left: 20px;">
    <li><strong>New sites:</strong> Focus on relevance and natural growth. Build relationships first.</li>
    <li><strong>Established sites:</strong> Focus on competitive gap analysis. Find links your competitors have that you don't.</li>
    <li><strong>Niche authority:</strong> Focus on thought leadership content that attracts premium links.</li>
    <li><strong>Commercial keywords:</strong> Focus on content upgrades and resource pages that webmasters want to link to.</li>
  </ul>

  <h2>Core Components of ${topic}</h2>
  
  <h3>1. Asset Development</h3>
  <p>Create something worth linking to: original research, comprehensive guides, tools, data, case studies, or tools.</p>

  <h3>2. Prospect Identification</h3>
  <p>Find the exact people and sites that would benefit from linking to your asset. Use competitor link analysis, niche community research, and industry directory analysis.</p>

  <h3>3. Relationship Building</h3>
  <p>Before you pitch, engage. Comment on their content. Share their work. Build real relationships.</p>

  <h3>4. Personalized Outreach</h3>
  <p>Craft emails that speak to why your content specifically matters to them. Not generic templates.</p>

  <h3>5. Follow-up and Optimization</h3>
  <p>Track what works. Scale the successful tactics. Eliminate the ones that don't.</p>

  <h2>${topic} Tactics by Industry</h2>
  
  <p><strong>For B2B Software:</strong> Target case studies, whitepapers, and comparison guides. Link targets: industry blogs, review sites, forum discussions.</p>

  <p><strong>For Ecommerce:</strong> Target buying guides, reviews, unboxing content, influencer partnerships. Link targets: influencers, niche publications, product comparison sites.</p>

  <p><strong>For SaaS:</strong> Target tutorials, documentation, webinars, integration guides. Link targets: startup blogs, comparison sites, industry publications.</p>

  <h2>How to Measure ${topic} Success</h2>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Organic traffic growth month-over-month</li>
    <li>Keyword ranking improvements for target keywords</li>
    <li>Quality of referring domains (authority, relevance)</li>
    <li>ROI of time and budget spent on link building</li>
    <li>Brand mentions that didn't include links (conversion potential)</li>
  </ul>

  <h2>The ${topic} Mindset Shift</h2>
  <p>Stop thinking "How do I get a link?" Start thinking "What would make someone want to link to my site?"</p>
  
  <p>The first mindset is outreach-based (hard, transactional, limited). The second is content-based (scalable, repeatable, builds compounding value).</p>

  <h2>Your ${topic} Quick Start</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li>Identify 20 high-authority relevant sites in your niche</li>
    <li>Analyze what content gets the most backlinks</li>
    <li>Create better content targeting the same topics</li>
    <li>Research who links to those existing resources</li>
    <li>Reach out with your improved version as a potential replacement</li>
  </ol>

  <h2>Conclusion: Build Links That Compound</h2>
  <p>The best link building strategy is one that compounds over time. Each link you build should multiply your value—more traffic, more visibility, more reach—which attracts more links naturally.</p>
</article>`;
}

function generateLinkGapContent(slug, title, topic) {
  return `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>${title}</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Link gap analysis is the tactical foundation of competitive link building. Instead of guessing what links matter, you see exactly what your competitors have that you don't. This guide shows you how to run the analysis and actually capitalize on the insights.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>The Insight:</strong> Your competitors have already done the market research for you. They've found the best link sources. Your job is to get the same links (or better ones).
  </div>

  <h2>How Link Gap Analysis Works</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li><strong>Identify competitors:</strong> Your top 3 ranking competitors (not companies, rankings)</li>
    <li><strong>Analyze their backlinks:</strong> Find all sites linking to them</li>
    <li><strong>Find your gaps:</strong> Which of their backlinks DON'T link to you</li>
    <li><strong>Evaluate the gaps:</strong> Sort by link quality, relevance, and opportunity</li>
    <li><strong>Execute the strategy:</strong> Build the same links</li>
  </ol>

  <h2>Step-by-Step ${topic} Process</h2>
  
  <h3>Step 1: Choose Your Competitors</h3>
  <p>Pick the 3 sites ranking in positions 1, 2, and 3 for your main target keyword. These are your link building targets.</p>

  <h3>Step 2: Export Their Backlinks</h3>
  <p>Use Ahrefs, SEMrush, or Moz to export all backlinks for each competitor. Download as CSV.</p>

  <h3>Step 3: Combine and Deduplicate</h3>
  <p>Merge the three lists. Remove duplicates. You now have a list of sites linking to your competition.</p>

  <h3>Step 4: Find Your Gaps</h3>
  <p>Cross-reference this list with your own backlinks. Identify sites linking to them but not to you. These are your gaps.</p>

  <h3>Step 5: Score the Opportunities</h3>
  <p>Not all gaps are equal. Score each by:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Domain Authority (higher DA = higher value)</li>
    <li>Traffic to the linking page (real traffic = higher value)</li>
    <li>Topical relevance (same niche = higher value)</li>
    <li>Linking strategy of the site (how many links they give = likelihood of accepting)</li>
  </ul>

  <h3>Step 6: Prioritize and Execute</h3>
  <p>Focus on the top 50 gaps first. These are your easiest wins. Build content that would make sense for them to link to. Then pitch.</p>

  <h2>${topic} Tools and Resources</h2>
  <p><strong>Ahrefs:</strong> Best interface for gap analysis. Shows competitor backlinks vs. your backlinks side by side.</p>
  
  <p><strong>SEMrush:</strong> Powerful backlink export. Good filtering options.</p>
  
  <p><strong>Google Sheets:</strong> For manual analysis, use VLOOKUP to identify gaps quickly.</p>

  <h2>Real-World ${topic} Example</h2>
  <p>Competitor 1 has 450 backlinks. You have 280. Using gap analysis, you identify 120 links you could realistically get based on content fit and relevance. That's a 43% growth opportunity just from matching your competition's strategy.</p>

  <h2>${topic} Advanced Tactics</h2>
  
  <p><strong>Skyscraper Method:</strong> Find gaps, then create content better than what the linking sites currently reference. Contact those sites with your superior resource.</p>

  <p><strong>Competitor Replacement:</strong> Find instances where a competitor is cited on authoritative sites. Pitch yourself as a more updated or comprehensive source.</p>

  <p><strong>Niche Gap Mapping:</strong> Identify link sources your competitors haven't found yet (5+ years old domains, industry directories, emerging platforms).</p>

  <h2>Common ${topic} Mistakes</h2>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Pursuing low-quality gaps because they're easy</li>
    <li>Not personalizing outreach (template emails get ignored)</li>
    <li>Targeting gaps too quickly (build good content first)</li>
    <li>Only analyzing one competitor (need at least 3)</li>
  </ul>

  <h2>Your ${topic} Action Plan</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li>Identify your top 3 ranking competitors</li>
    <li>Export their backlinks this week</li>
    <li>Find your top 50 link gaps</li>
    <li>Create content targeting gap sources</li>
    <li>Build personalized outreach list</li>
    <li>Track which gaps convert to links</li>
    <li>Iterate based on success</li>
  </ol>

  <h2>Conclusion</h2>
  <p>Link gap analysis removes guesswork from link building. Instead of hoping you find good links, you know exactly where they are. This data-driven approach to link building is why some sites dominate and others plateau.</p>
</article>`;
}

function generateLinkInsertionContent(slug, title, topic) {
  return `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>${title}</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Link insertion is the fastest way to acquire high-quality backlinks from existing, established content. Rather than waiting for new content to be published and finding its way to Google, you're injecting your links into content already getting traffic and authority. This guide covers the legal, ethical, and effective strategies.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>The Reality:</strong> Link insertion ranges from white-hat (requesting updates to existing content) to gray-hat (paying for insertions) to black-hat (forcing insertions without permission). This guide focuses on the white and light gray options.
  </div>

  <h2>Types of Link Insertion</h2>
  
  <h3>White Hat: Legitimate Updates</h3>
  <p>You identify outdated resources and request the webmaster update them with links to your better resource. This is completely legitimate and often works.</p>

  <h3>Gray Hat: Paid Insertion</h3>
  <p>You contact sites offering to pay for link placements in existing content. This is common and disclosed, though some Google purists consider it violation of webmaster guidelines.</p>

  <h3>Black Hat: Coerced/Unauthorized Insertion</h3>
  <p>You hack sites or use deceptive tactics to add links without permission. This will get you penalized. Don't do this.</p>

  <h2>The White Hat ${topic} Strategy</h2>
  
  <h3>Step 1: Find Outdated Content</h3>
  <p>Search for blog posts and resource pages that reference old statistics, outdated tools, or expired information. This is your target.</p>

  <h3>Step 2: Identify the Webmaster</h3>
  <p>Find contact information for the site owner or content manager. Personalization matters.</p>

  <h3>Step 3: Create Your Replacement</h3>
  <p>Build better content targeting the same topic. More recent, more comprehensive, more valuable.</p>

  <h3>Step 4: Craft Your Pitch</h3>
  <p>Email them: "I noticed your 2021 post on [Topic]. I saw an updated study from 2024 on the same topic. Would you be interested in adding a link to the updated research?"</p>

  <h3>Step 5: Follow Up</h3>
  <p>If no response after 5 days, send a second email. Different angle, additional value proposition.</p>

  <h2>The Gray Hat ${topic} Strategy</h2>
  
  <p>If you have budget, contact content creators offering to pay for insertion. Be transparent about it:</p>
  
  <p>"We'd like to sponsor an update to your [Topic] post with a link to our complementary resource. We can offer $500 for the update."</p>

  <p>This is faster than white hat. Success rate is 30-50%. Cost per link is typically $300-2,000 depending on authority and niche.</p>

  <h2>Finding ${topic} Opportunities at Scale</h2>
  
  <p><strong>Method 1: Google Search</strong></p>
  <p>Search: "[your keyword] 2021 OR 2022" - Find old content that's still ranking. These are opportunities.</p>

  <p><strong>Method 2: Competitor Linkable Assets</strong></p>
  <p>Analyze what content your competitors link to internally. Those are valuable assets where you might insert links too.</p>

  <p><strong>Method 3: Niche Communities</strong></p>
  <p>Find blogs, forums, and resource aggregators in your niche. These accumulate content that rarely gets updated. Perfect targets.</p>

  <h2>${topic} Best Practices</h2>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Only target sites in your niche (topical relevance matters)</li>
    <li>Ensure the link placement looks natural (within content context)</li>
    <li>Provide real value (they need a reason to update)</li>
    <li>Use varied anchor text (don't over-optimize exact matches)</li>
    <li>Track which insertions drive rankings</li>
  </ul>

  <h2>${topic} Quick Start</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li>Identify 20 outdated resources in your niche</li>
    <li>Create better versions of each topic</li>
    <li>Find contact info for webmasters</li>
    <li>Send personalized outreach mentioning the outdated info</li>
    <li>Follow up after 5 days if no response</li>
  </ol>

  <h2>Conclusion</h2>
  <p>Link insertion is underrated in link building strategy. Rather than waiting for new content and hoping it gets linked, you're being strategic about where your links go—inserting them into established, authoritative content that's already getting traffic and passing authority.</p>
</article>`;
}

function generateGenericOptimizedContent(slug, title, topic) {
  return `<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h1>${title}</h1>
  <p style="font-size: 1.1em; color: #555; margin: 20px 0;">Mastering ${topic} is essential for any serious link building and SEO strategy. This guide covers the exact framework used by leading agencies and in-house teams to consistently achieve results.</p>
  
  <div style="background: #f0f4f8; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
    <strong>Core Principle:</strong> ${topic} succeeds when you combine strategic planning with consistent execution and data-driven optimization.
  </div>

  <h2>Understanding the Fundamentals of ${topic}</h2>
  <p>Before diving into tactics, understand the strategic foundation. ${topic} isn't about random tactics—it's about systematically building advantages that compound over time.</p>

  <h2>The ${topic} Framework</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li><strong>Analysis:</strong> Understand your current state and competitive landscape</li>
    <li><strong>Strategy:</strong> Define your approach based on your situation and goals</li>
    <li><strong>Execution:</strong> Build the systems and content needed to execute</li>
    <li><strong>Measurement:</strong> Track results and optimize continuously</li>
  </ol>

  <h2>Phase 1: Research and Analysis</h2>
  <p>Start by understanding where you are and where you need to go. This phase requires:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Competitive analysis of your target keywords</li>
    <li>Audit of your current assets and positioning</li>
    <li>Identification of your unique value proposition</li>
    <li>Market research to understand audience needs</li>
  </ul>

  <h2>Phase 2: Strategic Planning</h2>
  <p>With analysis complete, develop your strategy. This isn't a vague mission statement—it's a specific, actionable roadmap covering:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Your target audience and their needs</li>
    <li>The specific outcomes you're targeting</li>
    <li>Your competitive differentiation</li>
    <li>Your timeline and resource requirements</li>
  </ul>

  <h2>Phase 3: Tactical Execution</h2>
  <p>Execute your strategy with discipline. This requires:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Content creation that supports your goals</li>
    <li>Systematic outreach to relevant audiences</li>
    <li>Relationship building with key influencers</li>
    <li>Consistent follow-up and persistence</li>
  </ul>

  <h2>Phase 4: Measurement and Optimization</h2>
  <p>Track what works and double down. This requires:</p>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Clear KPIs aligned to business goals</li>
    <li>Regular (weekly/monthly) performance reviews</li>
    <li>Data-driven decisions about optimization</li>
    <li>Iteration and continuous improvement</li>
  </ul>

  <h2>Common ${topic} Mistakes and Solutions</h2>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li><strong>Skipping analysis:</strong> Leads to misaligned strategies. Always start with research.</li>
    <li><strong>Generic execution:</strong> Personalization is critical. Avoid template approaches.</li>
    <li><strong>Impatience:</strong> Results take time. Expect 3-6 months to see significant impact.</li>
    <li><strong>Poor tracking:</strong> If you don't measure it, you can't optimize it.</li>
  </ul>

  <h2>Tools for ${topic}</h2>
  <p>Use tools to monitor progress and identify opportunities, but remember: tools are just multipliers on good strategy. They can't fix poor fundamentals.</p>

  <h2>Your ${topic} Action Plan</h2>
  <ol style="margin: 15px 0; padding-left: 20px;">
    <li>Complete your competitive analysis this week</li>
    <li>Audit your current positioning and assets</li>
    <li>Define your specific strategy for the next 90 days</li>
    <li>Identify 3 tactical initiatives to execute</li>
    <li>Set up tracking for your key metrics</li>
    <li>Commit to weekly optimization reviews</li>
  </ol>

  <h2>Conclusion: Build Sustainable Advantage</h2>
  <p>${topic} isn't a one-time project—it's a continuous process of improvement. The sites that dominate are the ones that commit to mastering this fundamental and building systematic advantages over time. That's your path forward.</p>
</article>`;
}

async function updatePageFile(filePath, slug, title) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newHtmlContent = generateTopicContent(slug, title);
  
  // Escape for template literal
  const escapedHtml = newHtmlContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  const updated = content.replace(
    /dangerouslySetInnerHTML=\{\{ __html: `[\s\S]*?` \}\}/,
    `dangerouslySetInnerHTML={{ __html: \`\n${escapedHtml}\n\` }}`
  );
  
  fs.writeFileSync(filePath, updated, 'utf-8');
}

const pageTopics = {
  'anchor-text-ratio-guide': 'Anchor Text Ratio Guide: The Complete Distribution Framework',
  'backlink-acquisition-funnel': 'Backlink Acquisition Funnel: The Complete Strategy',
  'backlink-ai-content-detection': 'AI Content Detection for Backlinks: The 2025 Playbook',
  'backlink-ama-session-ideas': 'AMA Sessions for Backlinks: Authority-Building Through Community',
  'backlink-anchor-cloud-analysis': 'Anchor Cloud Analysis: Visualizing Your Link Profile',
  'backlink-canonical-tag-issues': 'Canonical Tags and Backlinks: Avoiding Critical Mistakes',
  'backlink-carousel-placement': 'Carousel Placement Strategy: Strategic Link Positioning',
  'backlink-co-citation-strategy': 'Co-Citation Strategy: Building Authority Without Direct Links',
  'backlink-collaboration-ideas': 'Backlink Collaboration Ideas: Win-Win Partnerships',
  'backlink-comment-section-strategy': 'Comment Section Links: The Sustainable Strategy',
  'backlink-content-freshness-score': 'Content Freshness and Backlinks: Maximizing Link Value',
  'backlink-content-upgrade-method': 'Content Upgrades: Creating Linkable Lead Magnets',
  'backlink-csv-export-tips': 'CSV Export and Data Management: Organizing Your Link Profile',
  'backlink-data-visualization': 'Visualizing Your Backlink Data: Charts and Insights',
  'backlink-decay-prevention': 'Preventing Backlink Decay: Maintaining Authority Over Time',
  'backlink-e-e-a-t-signals': 'E-E-A-T and Backlinks: Building Trust Signals',
  'backlink-evergreen-content-ideas': 'Evergreen Content for Backlinks: Long-Term Link Acquisition',
  'backlink-expert-quote-collection': 'Expert Quotes and Backlinks: Authority by Association',
  'backlink-featured-snippet-links': 'Featured Snippets and Backlinks: Position Zero Strategy',
  'backlink-flipboard-magazine': 'Flipboard Magazines: Content Curation for Links',
  'backlink-follow-up-sequence': 'Follow-Up Sequences: Converting Outreach to Links',
  'backlink-haro-response-template': 'HARO Responses: Expert Positioning for Backlinks',
  'backlink-how-to-schema': 'How-To Schema: Structured Data for Link Value',
  'backlink-hub-and-spoke-model': 'Hub and Spoke: Strategic Content Architecture',
  'backlink-interlinking-strategy': 'Interlinking Strategy: Amplifying Backlink Power',
  'backlink-log-file-analysis': 'Log File Analysis: Understanding Crawler Behavior',
  'backlink-lost-link-alerts': 'Lost Link Recovery: Finding and Reclaiming Dropped Links',
  'backlink-mention-monitoring': 'Mention Monitoring: Converting Unlinked Mentions to Links',
  'backlink-mobile-indexing-tips': 'Mobile-First Indexing and Backlinks: Optimization Guide',
  'backlink-orphan-page-fix': 'Orphan Pages and Backlinks: Recovering Lost Authority',
  'backlink-outreach-calendar': 'Outreach Calendar: Systematic Link Building Planning',
  'backlink-passage-ranking-boost': 'Passage Ranking: Backlinks in a Post-Passage World',
  'backlink-performance-report': 'Backlink Performance Reporting: Measuring Real Impact',
  'backlink-podcast-guest-strategy': 'Podcast Guest Appearances: Audio Content for Links',
  'backlink-quora-space-links': 'Quora Spaces: Community-Based Authority Building',
  'backlink-redirect-chain-fix': 'Redirect Chains: Maintaining Link Equity',
  'backlink-relevance-score': 'Relevance Scoring: Evaluating Link Quality',
  'backlink-schema-markup-types': 'Schema Markup Types: Enhanced Link Value',
  'backlink-social-profile-links': 'Social Profile Optimization: Authority Links',
  'backlink-spam-brain-recovery': 'Spam Brain Recovery: Fixing Low-Quality Link Profiles',
  'backlink-substack-newsletter': 'Substack and Backlinks: Newsletter Authority Building',
  'backlink-supporting-article-links': 'Supporting Articles: Content Networks for Links',
  'backlink-tool-stack-2026': 'Backlink Tool Stack 2026: Essential Software',
  'backlink-topical-map-creation': 'Topic Maps: Strategic Content Planning for Links',
  'backlink-trust-signals': 'Trust Signals in Backlinks: Building Credibility',
  'backlink-value-estimation': 'Estimating Backlink Value: Quantifying Link Worth',
  'backlink-velocity-trends': 'Link Velocity Monitoring: Sustainable Growth Patterns',
  'backlink-visual-asset-ideas': 'Visual Assets for Backlinks: Infographics and Data',
  'backlink-wakelet-collection': 'Wakelet Collections: Curated Content Strategy',
  'backlink-xml-sitemap-priority': 'XML Sitemap Priority: Crawl Optimization Strategy',
  'dofollow-vs-nofollow-balance': 'Dofollow vs Nofollow: Building Natural Link Profiles',
  'link-building-301-strategy': '301 Redirects and Link Building: Equity Preservation',
  'link-building-author-bio-links': 'Author Bio Links: Building Authority Through Bylines',
  'link-building-beehiiv-growth': 'Beehiiv Newsletter: Email Growth and Backlinks',
  'link-building-browser-extensions': 'Browser Extensions for Link Building: Research Tools',
  'link-building-cluster-content': 'Topic Clusters: Organizing Content for Links',
  'link-building-content-pillar-pages': 'Pillar Pages: Authority Hubs for Link Building',
  'link-building-content-repurposing': 'Content Repurposing: Maximizing Link Opportunities',
  'link-building-core-web-vitals': 'Core Web Vitals and Backlinks: Performance Integration',
  'link-building-crawl-budget-tips': 'Crawl Budget Optimization: Ensuring Link Discovery',
  'link-building-crm-setup': 'CRM for Link Building: Outreach Management Systems',
  'link-building-dashboard-setup': 'Link Building Dashboard: Performance Tracking',
  'link-building-data-study-format': 'Data Studies: Original Research for Backlinks',
  'link-building-entity-optimization': 'Entity Optimization: Knowledge Graph Signals',
  'link-building-faq-page-links': 'FAQ Pages: Answer-Based Linkable Content',
  'link-building-forum-signature': 'Forum Participation: Community-Based Link Building',
  'link-building-google-sheets-hacks': 'Google Sheets for Link Building: Process Automation',
  'link-building-helpful-content': 'Helpful Content: Creating Naturally Linkable Assets',
  'link-building-hreflang-impact': 'Hreflang Implementation: International Link Strategy',
  'link-building-human-edit-layer': 'Editorial Standards: Human-Quality Content for Links',
  'link-building-internal-anchor-text': 'Internal Anchor Text: Supporting Backlink Strategy',
  'link-building-medium-publication': 'Medium Publications: Platform-Based Authority',
  'link-building-micro-content-hooks': 'Micro-Content: Creating Share-Worthy Assets',
  'link-building-monthly-audit': 'Monthly Link Audits: Performance Reviews',
  'link-building-partnership-types': 'Partnership Models: Strategic Link Building',
  'link-building-pearltrees-board': 'Pearltrees: Visual Content Curation and Links',
  'link-building-people-also-ask': 'People Also Ask: Question-Based Content Strategy',
  'link-building-pitch-deck': 'Pitch Decks: Winning Link Opportunities',
  'link-building-recovery-playbook': 'Recovery Playbook: Post-Penalty Link Rehabilitation',
  'link-building-roi-tracker': 'ROI Tracking: Measuring Link Building Returns',
  'link-building-rss-feed-links': 'RSS Syndication: Automated Link Opportunities',
  'link-building-scoop-it-curation': 'Scoop.it Curation: Platform-Based Authority',
  'link-building-server-response-codes': 'Server Response Codes: Link Health',
  'link-building-silo-structure': 'Silo Architecture: Topical Organization for Links',
  'link-building-survey-outreach': 'Survey Outreach: Data-Driven Link Attraction',
  'link-building-timeline-planner': 'Timeline Planning: Strategic Link Building Calendar',
  'link-building-update-cadence': 'Update Cadence: Keeping Content Fresh for Links',
  'link-building-video-object-links': 'Video Schema and Backlinks: Multimedia Strategy',
  'link-building-virtual-summit': 'Virtual Summits: Event-Based Link Acquisition',
  'link-building-webinar-promotion': 'Webinar Promotion: Educational Link Building',
  'link-building-workflow-automation': 'Workflow Automation: Scaling Link Building',
  'link-building-ymy-l-compliance': 'YMYL Compliance: Quality Standards for Links',
  'link-building-zero-click-strategy': 'Zero-Click Strategy: Answer Box Optimization',
  'link-gap-analysis-template': 'Link Gap Analysis: Competitive Link Benchmarking',
  'link-insertion-pricing-models': 'Link Insertion Pricing: Understanding Link Costs',
  'link-prospecting-checklist': 'Prospecting Checklist: Identifying Link Opportunities',
  'link-reclamation-email-script': 'Reclamation Email Script: Converting Mentions',
  'link-velocity-monitoring': 'Link Velocity: Tracking Sustainable Growth',
  'referral-traffic-from-backlinks': 'Referral Traffic Maximization: Beyond Rankings',
  'unlinked-brand-mention-strategy': 'Unlinked Mentions: Converting to Backlinks'
};

async function main() {
  console.log('🚀 Starting specialized content generation...\n');
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const [slug, title] of Object.entries(pageTopics)) {
    const filePath = path.join(__dirname, 'src', 'pages', `${slug}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  SKIP: ${slug}`);
      skipped++;
      continue;
    }
    
    try {
      updatePageFile(filePath, slug, title);
      console.log(`✅ UPDATED: ${slug}`);
      updated++;
    } catch (error) {
      console.error(`❌ ERROR: ${slug} - ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`Total: ${Object.keys(pageTopics).length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main().catch(console.error);
