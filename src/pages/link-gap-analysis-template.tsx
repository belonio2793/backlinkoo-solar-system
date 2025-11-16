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

export default function LinkGapAnalysisTemplate() {
  React.useEffect(() => {
    upsertMeta('description', 'Complete resource for Link Gap Analysis Template. Get detailed strategies, practical tips, and proven methodologies to enhance your link building efforts.');
    upsertCanonical(typeof window !== 'undefined' ? window.location.href : 'https://backlinkoo.com/link-gap-analysis-template');
    injectJSONLD('link-gap-analysis-template-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Link Gap Analysis Template: Master This Critical SEO Tactic',
      description: 'Complete resource for Link Gap Analysis Template. Get detailed strategies, practical tips, and proven methodologies to enhance your link building efforts.',
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
  <h1>Link Gap Analysis: Competitive Link Benchmarking</h1>
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

  <h2>Step-by-Step link gap analysis template Process</h2>
  
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

  <h2>link gap analysis template Tools and Resources</h2>
  <p><strong>Ahrefs:</strong> Best interface for gap analysis. Shows competitor backlinks vs. your backlinks side by side.</p>
  
  <p><strong>SEMrush:</strong> Powerful backlink export. Good filtering options.</p>
  
  <p><strong>Google Sheets:</strong> For manual analysis, use VLOOKUP to identify gaps quickly.</p>

  <h2>Real-World link gap analysis template Example</h2>
  <p>Competitor 1 has 450 backlinks. You have 280. Using gap analysis, you identify 120 links you could realistically get based on content fit and relevance. That's a 43% growth opportunity just from matching your competition's strategy.</p>

  <h2>link gap analysis template Advanced Tactics</h2>
  
  <p><strong>Skyscraper Method:</strong> Find gaps, then create content better than what the linking sites currently reference. Contact those sites with your superior resource.</p>

  <p><strong>Competitor Replacement:</strong> Find instances where a competitor is cited on authoritative sites. Pitch yourself as a more updated or comprehensive source.</p>

  <p><strong>Niche Gap Mapping:</strong> Identify link sources your competitors haven't found yet (5+ years old domains, industry directories, emerging platforms).</p>

  <h2>Common link gap analysis template Mistakes</h2>
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li>Pursuing low-quality gaps because they're easy</li>
    <li>Not personalizing outreach (template emails get ignored)</li>
    <li>Targeting gaps too quickly (build good content first)</li>
    <li>Only analyzing one competitor (need at least 3)</li>
  </ul>

  <h2>Your link gap analysis template Action Plan</h2>
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
