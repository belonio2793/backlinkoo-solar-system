import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

export default function AnchorTextRatioGuide() {
  React.useEffect(() => {
    upsertMeta('description', 'Expert guide on Anchor Text Ratio Guide. Discover proven techniques, real-world examples, and advanced strategies to maximize your SEO impact.');
    upsertCanonical(typeof window !== 'undefined' ? window.location.href : 'https://backlinkoo.com/anchor-text-ratio-guide');
    injectJSONLD('anchor-text-ratio-guide-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Anchor Text Ratio Guide: Master This Critical SEO Tactic',
      description: 'Expert guide on Anchor Text Ratio Guide. Discover proven techniques, real-world examples, and advanced strategies to maximize your SEO impact.',
      author: { '@type': 'Person', name: 'Backlinkoo SEO Expert' },
      datePublished: new Date().toISOString().split('T')[0],
    });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <article className="prose prose-slate max-w-4xl mx-auto dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: `
<article style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
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
</article>
` }} />
            <div className="mt-12">
              <BacklinkInfinityCTA />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
