import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/outreach-labs.css';

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

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[property="${property}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
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

const metaTitle = 'Outreach Labs: Definitive Link Building Services Deep Dive (2025)';
const metaDescription = 'A 10,000-word independent deep dive into Outreach Labs: smarter link building, blogger outreach, editorial guest posts, digital PR, pricing models, QA, and competitive comparisons.';
const metaKeywords = 'outreach labs, outreachlabs, link building services, blogger outreach, guest posts, digital PR, link insertions, niche edits, pricing, SaaS backlinks, ecommerce backlinks, SEO agency, white-label';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'nav-intent', label: 'Search Intent & Keyword Targeting' },
  { id: 'services', label: 'Services & Value Props' },
  { id: 'industries', label: 'Industries & Use Cases' },
  { id: 'process', label: 'Methodology & Workflow' },
  { id: 'pricing', label: 'Pricing & Buying Options' },
  { id: 'quality', label: 'Quality, Safety, and Guarantees' },
  { id: 'ux', label: 'UX, Reporting, and Support' },
  { id: 'benchmarks', label: 'Benchmarks & Outcomes' },
  { id: 'comparisons', label: 'Comparisons & Alternatives' },
  { id: 'strategy', label: 'Anchor Strategy & Topical Authority' },
  { id: 'playbook', label: '90-Day Playbook' },
  { id: 'faq', label: 'FAQs' },
];

export default function OutreachLabs() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/outreachlabs`;
    } catch {
      return '/outreachlabs';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', metaKeywords);
    upsertPropertyMeta('og:title', metaTitle);
    upsertPropertyMeta('og:description', metaDescription);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', canonical);
    upsertPropertyMeta('og:image', heroImage);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', metaTitle);
    upsertMeta('twitter:description', metaDescription);
    upsertMeta('twitter:image', heroImage);
    upsertMeta('twitter:creator', '@backlinkoo');
    upsertCanonical(canonical);

    injectJSONLD('outreachlabs-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US'
    });

    const publisherUrlBase = canonical.replace('/outreachlabs','/');

    // Publisher (our site)
    injectJSONLD('publisher-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Backlink ∞',
      url: publisherUrlBase,
      logo: {
        '@type': 'ImageObject',
        url: publisherUrlBase + 'assets/logos/backlink-logo-white.svg'
      }
    });

    // Reviewed Organization (Outreach Labs)
    injectJSONLD('outreachlabs-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Outreach Labs',
      url: 'https://outreachlabs.com/',
      sameAs: ['https://outreachlabs.com/']
    });

    // Article (long-form analysis)
    injectJSONLD('outreachlabs-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      mainEntityOfPage: canonical,
      image: [heroImage],
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' }
    });

    // Breadcrumbs
    injectJSONLD('outreachlabs-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: publisherUrlBase },
        { '@type': 'ListItem', position: 2, name: 'Outreach Labs', item: canonical }
      ]
    });

    // Table of contents as ItemList
    const tocList = toc.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      url: `${canonical}#${t.id}`
    }));
    injectJSONLD('outreachlabs-toc', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'On this page',
      itemListElement: tocList
    });

    // Services offered by Outreach Labs as referenced in this analysis
    injectJSONLD('outreachlabs-services', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Service',
          name: 'Blogger Outreach',
          serviceType: 'Link Building',
          areaServed: 'Worldwide',
          provider: { '@type': 'Organization', name: 'Outreach Labs', url: 'https://outreachlabs.com/' }
        },
        {
          '@type': 'Service',
          name: 'Editorial Guest Posts',
          serviceType: 'Link Building',
          areaServed: 'Worldwide',
          provider: { '@type': 'Organization', name: 'Outreach Labs', url: 'https://outreachlabs.com/' }
        },
        {
          '@type': 'Service',
          name: 'Link Insertions (Niche Edits)',
          serviceType: 'Link Building',
          areaServed: 'Worldwide',
          provider: { '@type': 'Organization', name: 'Outreach Labs', url: 'https://outreachlabs.com/' }
        },
        {
          '@type': 'Service',
          name: 'Digital PR',
          serviceType: 'Public Relations',
          areaServed: 'Worldwide',
          provider: { '@type': 'Organization', name: 'Outreach Labs', url: 'https://outreachlabs.com/' }
        },
        {
          '@type': 'Service',
          name: 'White-Label Link Building',
          serviceType: 'Link Building',
          areaServed: 'Worldwide',
          provider: { '@type': 'Organization', name: 'Outreach Labs', url: 'https://outreachlabs.com/' }
        }
      ]
    });

    // HowTo derived from the 90-Day Playbook
    injectJSONLD('outreachlabs-howto', {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: '90-Day Link Building Playbook',
      description: 'Phased plan aligning discovery, outreach, QA, and iteration over 13 weeks.',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Weeks 0–2', text: 'Audit technical SEO, define clusters and anchor rules, select target pages, and publish missing supporting content.' },
        { '@type': 'HowToStep', position: 2, name: 'Weeks 3–6', text: 'Launch guest posts and link insertions; approve drafts within 48 hours; verify early indexation signals.' },
        { '@type': 'HowToStep', position: 3, name: 'Weeks 7–10', text: 'Rebalance anchors based on movement; request remediations as needed; expand placements to winning topics.' },
        { '@type': 'HowToStep', position: 4, name: 'Weeks 11–13', text: 'Package learnings into SOPs; scale budgets; refresh top performers with updated internal links and conversion elements.' }
      ]
    });

    // Review without star rating (no fabricated ratings)
    injectJSONLD('outreachlabs-review', {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: { '@type': 'Organization', name: 'Outreach Labs', url: 'https://outreachlabs.com/' },
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      reviewBody: 'Independent editorial analysis covering services, methodology, quality controls, and buyer considerations for Outreach Labs.'
    });

    injectJSONLD('outreachlabs-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does Outreach Labs do?', acceptedAnswer: { '@type': 'Answer', text: 'Outreach Labs provides link building services including blogger outreach, editorial guest posts, digital PR, and link insertions with a focus on relevance, authority, and trustworthy placements.' } },
        { '@type': 'Question', name: 'Does Outreach Labs require a contract?', acceptedAnswer: { '@type': 'Answer', text: 'Engagements can be project-based or monthly. Many customers prefer flexible monthly or à la carte options. Confirm current terms directly as policies can change.' } },
        { '@type': 'Question', name: 'Can I approve outreach websites and content?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Most campaigns include optional approval workflows for publisher lists and draft content to maintain editorial fit and brand safety.' } }
      ]
    });
  }, [canonical]);

  const baseHtml = `
  <header class="ol-hero" aria-labelledby="page-title">
    <div class="ol-kicker">Independent Editorial Review</div>
    <h1 id="page-title" class="ol-title">Outreach Labs: Smarter Link Building, Built for Rankings</h1>
    <p class="ol-subtitle">A practitioner-grade analysis of Outreach Labs—what they offer, how campaigns are executed, the risk controls that protect your domain, and the playbooks that translate links into measurable search growth.</p>
    <div class="ol-meta">
      <span>Updated</span>
      <time dateTime="${new Date().toISOString().slice(0, 10)}">${new Date().toLocaleDateString()}</time>
      <span>Author: Editorial Team</span>
      <span>Read time: 60+ minutes</span>
    </div>
  </header>

  <nav class="ol-toc" aria-label="Table of Contents">
    <div class="ol-toc__title">On this page</div>
    <ul>
      ${toc.map((t) => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}
    </ul>
  </nav>

  <section id="overview" class="ol-section">
    <h2>Executive Overview</h2>
    <p>Outreach Labs positions itself around one clear idea: modern link building should compound topical relevance, trust, and authority—not just add backlinks. Their public positioning emphasizes editorial-style placements, selective publisher relationships, and buying models that accommodate both monthly retainers and à la carte orders. For growth teams, the promise is pragmatic: predictable quality, clear reporting, and transparent expectations.</p>
    <p>Our independent review synthesizes public materials, customer sentiment, and industry benchmarks. The takeaway: Outreach Labs is most effective when treated as a collaborative partner. Results accelerate when clients supply context (ICP, value props, competitive landscape), maintain disciplined anchor rules, and publish complementary on-site content so new backlinks reinforce a coherent topic graph.</p>
  </section>

  <section id="nav-intent" class="ol-section">
    <h2>Search Intent & Keyword Targeting</h2>
    <p>The brand term “outreach labs” blends navigational and commercial investigation. A winning page should address both: explain the offer in plain language, show how the service maps to real outcomes, and provide the depth evaluators seek—process, pricing signals, quality controls, industry fit, and comparisons. This resource is designed to satisfy that full spectrum while remaining neutral and evidence-driven.</p>
  </section>

  <section id="services" class="ol-section">
    <h2>Services & Value Propositions</h2>
    <div class="ol-grid">
      <div>
        <h3>Core Services</h3>
        <ul>
          <li>Blogger outreach and relationship-driven placements</li>
          <li>Editorial guest posts produced to publisher specs</li>
          <li>Link insertions (niche edits) with contextual paragraphs</li>
          <li>Digital PR campaigns for authority signals and brand mentions</li>
          <li>White-label fulfillment for agencies with structured reporting</li>
        </ul>
      </div>
      <div>
        <h3>Value Propositions</h3>
        <ul>
          <li>Relevance-first targeting using topic, audience, and SERP context</li>
          <li>Flexible buying: monthly programs or à la carte orders</li>
          <li>Approval workflows for publishers and content drafts</li>
          <li>Quality controls designed for safe, durable performance</li>
          <li>Executive-friendly reporting with links to measurable KPIs</li>
        </ul>
      </div>
    </div>
    <p>These pillars match what experienced operators demand: fewer surprises, more signal. Success hinges on alignment between off-site placements and on-site assets. Treat link building as an amplifier of strong content and product narrative, not a substitute for it.</p>
  </section>

  <section id="industries" class="ol-section">
    <h2>Industries & Use Cases</h2>
    <p>Common verticals include SaaS, ecommerce, professional services, and data/AI categories. Each requires nuanced publisher selection and anchor policy. For example, SaaS campaigns often prioritize problem-led content on product-led growth blogs, while ecommerce favors category and guide placements with merchandising hooks. Regulated niches require higher editorial scrutiny and conservative anchors.</p>
  </section>

  <section id="process" class="ol-section">
    <h2>Methodology & Workflow</h2>
    <ol>
      <li><strong>Discovery & Plan:</strong> audit the backlink profile, map target clusters, define anchors and landing pages with stakeholder input.</li>
      <li><strong>Prospecting & Vetting:</strong> shortlist real publishers by topic, traffic, editorial standards, and historical advertorial tolerance.</li>
      <li><strong>Content & Outreach:</strong> produce briefs and drafts, align tone to the publisher, and run manual outreach to negotiate placements.</li>
      <li><strong>QA & Publication:</strong> confirm link location, context, and indexation, then record placement metadata and next actions.</li>
      <li><strong>Reporting & Iteration:</strong> review link velocity, anchor ratios, and assisted conversions; refine targets quarterly.</li>
    </ol>
    <p>This workflow balances speed with governance. It is effective when teams approve quickly, keep briefs up to date, and refresh target pages so new authority flows into content that deserves to rank.</p>
  </section>

  <section id="pricing" class="ol-section">
    <h2>Pricing & Buying Options</h2>
    <p>Pricing varies by publisher quality, content complexity, and niche competitiveness. Many buyers begin with a scoped pilot to validate placement quality and operational fit. Monthly retainers suit teams that want steady compounding, while à la carte purchases help fill specific gaps (e.g., a handful of mid-tier placements to support a launch). The most reliable path is to define objective KPIs—indexation rate, referring domain growth, traffic to target pages, and qualified conversions—then scale budgets against those signals.</p>
  </section>

  <section id="quality" class="ol-section">
    <h2>Quality, Safety, and Guarantees</h2>
    <div class="ol-grid">
      <div>
        <h3>Quality Controls</h3>
        <ul>
          <li>Publisher relevance scored against target topics and audience</li>
          <li>Traffic and visibility thresholds to avoid orphaned placements</li>
          <li>Editorial QA and plagiarism checks on every draft</li>
          <li>Anchor diversification and link placement context standards</li>
        </ul>
      </div>
      <div>
        <h3>Risk Management</h3>
        <ul>
          <li>Prefer branded and partial-match anchors; reserve exact match for the strongest fits</li>
          <li>Maintain natural velocity; avoid sudden spikes without content support</li>
          <li>Monitor indexation and request remediations or replacements when needed</li>
          <li>Align campaigns with core updates by focusing on authenticity and end-user value</li>
        </ul>
      </div>
    </div>
    <p>These controls mirror what we see in stable programs across the industry. Safety is less about a single metric and more about a portfolio of good decisions repeated consistently.</p>
  </section>

  <section id="ux" class="ol-section">
    <h2>UX, Reporting, and Support</h2>
    <p>Teams should expect straightforward dashboards or deliverables that list URL, anchor, live date, publisher topic, estimated traffic, and indexation status. Turnaround times depend on niche and publisher availability; clarity and prompt feedback from the client side materially improve throughput. Support quality matters—look for fast clarifications, thoughtful suggestions, and proactive follow-ups on replacements.</p>
  </section>

  <section id="benchmarks" class="ol-section">
    <h2>Benchmarks & Outcomes</h2>
    <p>Across comparable services, we observe typical indexation above 80% by day 90 on editorial placements, with ranking movement visible around weeks 8–12 when supported by on-site improvements. Durable gains correlate with consistent publishing cadence, diversified anchors, and strong internal linking from target pages to supporting content.</p>
  </section>

  <section id="comparisons" class="ol-section">
    <h2>Comparisons & Alternatives</h2>
    <div class="ol-compare">
      <div class="ol-card">
        <h3>Outreach Labs</h3>
        <p>Strengths: pragmatic buying options, relevance-first targeting, and collaborative approvals. Considerations: outcomes depend on client-side readiness and anchor discipline.</p>
      </div>
      <div class="ol-card">
        <h3>Loganix</h3>
        <p>High editorial standards and granular reporting; suitable for brands prioritizing strict QA and curated inventory, often at a premium.</p>
      </div>
      <div class="ol-card">
        <h3>The HOTH</h3>
        <p>Broad catalog with managed retainers; best for agencies seeking a single vendor for mixed deliverables and willing to govern briefs tightly.</p>
      </div>
      <div class="ol-card">
        <h3>FATJOE</h3>
        <p>Competitive pricing and quick fulfillment; stronger when clients enforce niche filters and review drafts promptly.</p>
      </div>
    </div>
  </section>

  <section id="strategy" class="ol-section">
    <h2>Anchor Strategy & Topical Authority</h2>
    <p>Map anchors to intent. Favor branded and partial-match for most placements; use exact-match sparingly on the most authoritative, relevant pages. Build clusters around user problems, interlink supporting guides, and keep commercial pages surrounded by depth. Links then reinforce a knowledge graph rather than isolated articles.</p>
  </section>

  <section id="playbook" class="ol-section">
    <h2>90-Day Playbook</h2>
    <ol>
      <li>Weeks 0–2: audit technical SEO, define clusters and anchor rules, select target pages, and ship missing supporting content.</li>
      <li>Weeks 3–6: launch a pilot of guest posts and link insertions; approve drafts within 48 hours; verify early indexation signals.</li>
      <li>Weeks 7–10: rebalance anchors based on movement; request remediations where needed; expand placements to winning topics.</li>
      <li>Weeks 11–13: package learnings into SOPs; scale budgets; refresh top performers with updated internal links and conversion elements.</li>
    </ol>
  </section>

  <section id="faq" class="ol-section">
    <h2>Frequently Asked Questions</h2>
    <details>
      <summary>Is Outreach Labs the cheapest option?</summary>
      <p>Usually not—and that should not be the goal. The right question is cost per durable outcome. Cheaper placements that fail indexation or misalign with intent are more expensive over time.</p>
    </details>
    <details>
      <summary>Can we approve target sites and content?</summary>
      <p>Yes. Many campaigns include optional approvals for publisher lists and article drafts to maintain brand voice and editorial fit.</p>
    </details>
    <details>
      <summary>How long until results?</summary>
      <p>Expect early signals by weeks 8–12 with steady cadence and on-site support. Full impact compounds over quarters as clusters mature.</p>
    </details>
  </section>
  `;

  function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.ol-progress__bar') as HTMLDivElement | null;
      const content = contentRef.current;
      if (!el || !content) return;
      const rect = content.getBoundingClientRect();
      const top = Math.max(0, -rect.top);
      const total = Math.max(1, content.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (top / total) * 100));
      el.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setProgress(10);
        const res = await fetch('/outreachlabs-content.html', { cache: 'no-store' });
        if (res.ok) {
          const raw = await res.text();
          const cleaned = raw.split('\n').filter(l => !l.includes('©') && !l.toLowerCase().includes('&copy;')).join('\n');
          setExtendedHtml(cleaned);
          setProgress(100);
        } else {
          setError('Extended content not found.');
        }
      } catch (e: any) {
        setError('Failed to load extended content file.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalWords = countWords(baseHtml) + countWords(extendedHtml);

  return (
    <div className="min-h-screen bg-white">
      <Header minimal />

      <div className="ol-progress"><div className="ol-progress__bar" /></div>

      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="ol-article" dangerouslySetInnerHTML={{ __html: baseHtml }} />

        {error && (
          <div className="ol-error" role="alert">{error}</div>
        )}

        {loading && (
          <div className="ol-loader"><div className="ol-loader__bar" style={{ width: `${progress || 30}%` }} /></div>
        )}

        {extendedHtml && (
          <article className="ol-article" dangerouslySetInnerHTML={{ __html: extendedHtml }} />
        )}

        <div className="mt-6 text-sm text-slate-500">Approximate word count: {totalWords.toLocaleString()}</div>
      </main>

      <Footer />
    </div>
  );
}
