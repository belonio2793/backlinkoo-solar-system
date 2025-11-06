import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/moneyrobot.css';

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

const metaTitle = 'Money Robot: Unbiased, In-Depth SEO Software Review (2025)';
const metaDescription = 'Independent analysis of Money Robot: automation features, backlink types, pricing, guarantees, quality controls, and comparisons (incl. Outreach Labs) with actionable playbooks.';
const metaKeywords = 'Money Robot, moneyrobot, SEO software, link building automation, backlink builder, outreach labs, backlinks, AI SEO, tiered links, pricing, captcha solving, live link checker';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'intent', label: 'Search Intent & Positioning' },
  { id: 'features', label: 'Platform Features & Capabilities' },
  { id: 'plans', label: 'Pricing & Plans' },
  { id: 'quality', label: 'Quality, Safety, and Policy Considerations' },
  { id: 'workflow', label: 'Operating Model & Governance' },
  { id: 'comparisons', label: 'Comparisons (incl. Outreach Labs)' },
  { id: 'playbook', label: '90-Day Action Playbook' },
  { id: 'faq', label: 'FAQs' },
];

export default function MoneyRobot() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/moneyrobot`;
    } catch {
      return '/moneyrobot';
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

    injectJSONLD('moneyrobot-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US'
    });

    const publisherUrlBase = canonical.replace('/moneyrobot','/');

    injectJSONLD('publisher-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Backlink ∞',
      url: publisherUrlBase,
      logo: { '@type': 'ImageObject', url: publisherUrlBase + 'assets/logos/backlink-logo-white.svg' }
    });

    injectJSONLD('moneyrobot-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Money Robot',
      url: 'https://www.moneyrobot.com/',
      sameAs: ['https://www.moneyrobot.com/']
    });

    injectJSONLD('moneyrobot-article', {
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

    injectJSONLD('moneyrobot-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: publisherUrlBase },
        { '@type': 'ListItem', position: 2, name: 'Money Robot', item: canonical }
      ]
    });

    const tocList = toc.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, url: `${canonical}#${t.id}` }));
    injectJSONLD('moneyrobot-toc', { '@context': 'https://schema.org', '@type': 'ItemList', name: 'On this page', itemListElement: tocList });

    injectJSONLD('moneyrobot-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Money Robot?', acceptedAnswer: { '@type': 'Answer', text: 'Money Robot is SEO software focused on automated backlink creation and related workflows like content spinning, captcha solving, and live link checking.' } },
        { '@type': 'Question', name: 'How does it differ from Outreach Labs?', acceptedAnswer: { '@type': 'Answer', text: 'Money Robot emphasizes software-driven automation, while Outreach Labs focuses on service-led, editorial-style outreach. Your choice should align to governance needs and risk tolerance.' } },
        { '@type': 'Question', name: 'What plans are available?', acceptedAnswer: { '@type': 'Answer', text: 'Public materials indicate a monthly subscription and a lifetime license option. Verify current pricing and inclusions directly with the vendor.' } }
      ]
    });
  }, [canonical]);

  const baseHtml = `
  <header class="mr-hero" aria-labelledby="page-title">
    <div class="mr-kicker">Independent Editorial Review</div>
    <h1 id="page-title" class="mr-title">Money Robot: Automated Link Building Software—Capabilities, Caveats, and Playbooks</h1>
    <p class="mr-subtitle">This practitioner-grade guide explains Money Robot's value proposition, feature set, pricing signals, quality controls, and where automation fits into a responsible link acquisition strategy. It also contrasts software-led approaches with managed services such as <strong>Outreach Labs</strong> for buyers evaluating hybrid stacks.</p>
    <div class="mr-meta">
      <span>Updated</span>
      <time dateTime="${new Date().toISOString().slice(0, 10)}">${new Date().toLocaleDateString()}</time>
      <span>Author: Editorial Team</span>
      <span>Read time: 60+ minutes</span>
    </div>
  </header>

  <nav class="mr-toc" aria-label="Table of Contents">
    <div class="mr-toc__title">On this page</div>
    <ul>
      ${toc.map((t) => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}
    </ul>
  </nav>

  <section id="overview" class="mr-section">
    <h2>Executive Overview</h2>
    <p>Money Robot markets high-speed, AI-assisted backlink creation across multiple platform types (e.g., Web 2.0, directories, bookmarking, forums, and RSS), with tooling for content spinning, automatic captcha solving, and link verification. The value proposition is throughput: launching campaigns quickly with automated assistance and centralized tracking.</p>
    <p>Automation can reduce manual overhead, but outcomes depend on governance. Buyers should define anchor policies, publisher standards, and measurement frameworks in advance—then use any software to accelerate procedures without compromising quality or compliance.</p>
  </section>

  <section id="intent" class="mr-section">
    <h2>Search Intent & Positioning</h2>
    <p>“Money Robot” is a navigational brand query. Evaluators expect a clear explanation of what the software does, which backlinks it creates, how quality is maintained, what plans cost, and how risks are mitigated. This resource presents that context neutrally and provides a playbook to translate features into measurable outcomes.</p>
  </section>

  <section id="features" class="mr-section">
    <h2>Platform Features & Capabilities</h2>
    <div class="mr-grid">
      <div>
        <h3>Automation Toolkit</h3>
        <ul>
          <li>AI-assisted content creation and spinning utilities</li>
          <li>Automatic captcha solving and site list updates</li>
          <li>Live backlink checker with high concurrency</li>
          <li>Tiered link diagrams and multi-platform submissions</li>
        </ul>
      </div>
      <div>
        <h3>Campaign Controls</h3>
        <ul>
          <li>Keyword and URL inputs with templated structures</li>
          <li>Scheduling and velocity configuration</li>
          <li>Exportable reports and progress dashboards</li>
          <li>OS coverage across desktop and mobile environments</li>
        </ul>
      </div>
    </div>
    <p>These capabilities accelerate execution. Governance remains essential: enforce topical relevance, control anchors, and validate whether placements index and drive value.</p>
  </section>

  <section id="plans" class="mr-section">
    <h2>Pricing & Plans</h2>
    <p>Public information highlights two options: a monthly subscription and a one-time lifetime license. Evaluate total cost vs. throughput and guardrails. If your team lacks editorial review and QA, pair software with service-led oversight or keep automation conservative.</p>
  </section>

  <section id="quality" class="mr-section">
    <h2>Quality, Safety, and Policy Considerations</h2>
    <div class="mr-grid">
      <div>
        <h3>Quality Standards</h3>
        <ul>
          <li>Favor contextual placements with relevant surrounding text</li>
          <li>Avoid footprints; rotate platforms and diversify anchors</li>
          <li>Monitor indexation and prune low-signal patterns</li>
          <li>Focus on end-user value and authenticity</li>
        </ul>
      </div>
      <div>
        <h3>Risk Controls</h3>
        <ul>
          <li>Use branded and partial-match anchors predominantly</li>
          <li>Keep link velocity natural and support with on-site content</li>
          <li>Document replacements/remediations and maintain an issues log</li>
          <li>Respect platform policies and legal/ethical boundaries</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="workflow" class="mr-section">
    <h2>Operating Model & Governance</h2>
    <ol>
      <li><strong>Define:</strong> clusters, landing pages, anchor rules, and success metrics</li>
      <li><strong>Configure:</strong> schedules, tiers, and platform mixes aligned to intent</li>
      <li><strong>Execute:</strong> run campaigns, review drafts/outputs, and validate links</li>
      <li><strong>Measure:</strong> monitor indexation, rankings, traffic, and conversions</li>
      <li><strong>Adjust:</strong> rebalance anchors, deprecate weak tactics, scale proven ones</li>
    </ol>
  </section>

  <section id="comparisons" class="mr-section">
    <h2>Comparisons (incl. Outreach Labs)</h2>
    <div class="mr-compare">
      <div class="mr-card">
        <h3>Money Robot</h3>
        <p>Software-led automation for backlink creation and verification. Strength: speed and throughput. Considerations: requires strict governance to preserve quality and brand safety.</p>
      </div>
      <div class="mr-card">
        <h3>Outreach Labs</h3>
        <p>Service-led editorial outreach. Strength: human vetting and brand-aligned placements. Considerations: throughput depends on approvals and publisher availability.</p>
      </div>
      <div class="mr-card">
        <h3>Marketplace Providers</h3>
        <p>Platforms (e.g., curated inventories) balance transparency and scale. Evaluate inventory quality, pricing, and reporting depth.</p>
      </div>
    </div>
  </section>

  <section id="playbook" class="mr-section">
    <h2>90-Day Action Playbook</h2>
    <ol>
      <li>Weeks 0–2: audit, map clusters, set anchors, and publish missing support content</li>
      <li>Weeks 3–6: launch conservative automated tiers; review outputs; verify indexation</li>
      <li>Weeks 7–10: expand winning mixes; retire noisy tactics; harden internal linking</li>
      <li>Weeks 11–13: package SOPs; align budget to ROI signals; plan next quarter</li>
    </ol>
  </section>

  <section id="faq" class="mr-section">
    <h2>Frequently Asked Questions</h2>
    <details>
      <summary>Is automation safe?</summary>
      <p>Automation can be safe when governed by strict relevance filters, conservative anchors, and continuous validation. Avoid mass, low-quality blasts without editorial review.</p>
    </details>
    <details>
      <summary>Do I still need outreach?</summary>
      <p>Most durable programs combine automation for speed with editorial outreach for authority and trust. Consider partnering with service-led teams for high-impact placements.</p>
    </details>
    <details>
      <summary>How do I measure ROI?</summary>
      <p>Track indexation rate, referring domain growth, target page rankings and traffic, and assisted conversions. Report by cluster and anchor group, not vanity totals alone.</p>
    </details>
  </section>
  `;

  function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.mr-progress__bar') as HTMLDivElement | null;
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
        const res = await fetch('/moneyrobot-content.html', { cache: 'no-store' });
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

      <div className="mr-progress"><div className="mr-progress__bar" /></div>

      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="mr-article" dangerouslySetInnerHTML={{ __html: baseHtml }} />

        {error && (
          <div className="mr-error" role="alert">{error}</div>
        )}

        {loading && (
          <div className="mr-loader"><div className="mr-loader__bar" style={{ width: `${progress || 30}%` }} /></div>
        )}

        {extendedHtml && (
          <article className="mr-article" dangerouslySetInnerHTML={{ __html: extendedHtml }} />
        )}

        <div className="mt-6 text-sm text-slate-500">Approximate word count: {totalWords.toLocaleString()}</div>
      </main>

      <Footer />
    </div>
  );
}
