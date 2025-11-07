import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/outreach-monks.css';

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

const metaTitle = 'Outreach Monks Review 2025: White-Hat Link Building, Blogger Outreach, and Managed SEO';
const metaDescription = 'Independent 2025 deep dive into Outreach Monks: white-hat backlinks, manual outreach, guest posts, link insertions, pricing, industries served, workflows, quality controls, and alternatives.';
const metaKeywords = 'Outreach Monks, OutreachMonks review, white-hat link building, blogger outreach, guest posts, link insertions, niche edits, digital PR, citations, SaaS backlinks, iGaming backlinks, cannabis backlinks, agency white-label';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'services', label: 'Services & Value Props' },
  { id: 'industries', label: 'Industries & Geo Targeting' },
  { id: 'process', label: 'Methodology & Workflow' },
  { id: 'pricing', label: 'Pricing & Packages' },
  { id: 'quality', label: 'Quality, Safety, and Guarantees' },
  { id: 'ux', label: 'UX, Reporting, and Support' },
  { id: 'benchmarks', label: 'Benchmarks & Outcomes' },
  { id: 'comparisons', label: 'Comparisons & Alternatives' },
  { id: 'strategy', label: 'Anchor Strategy & Topical Authority' },
  { id: 'playbook', label: '90-Day Playbook' },
  { id: 'faq', label: 'FAQs' },
];

const mediumEmbeds = [
  { meta: 'medium.com • Topic', title: 'SEO on Medium', url: 'https://medium.com/topic/seo', desc: 'Long‑form guides on algorithms, search UX, and strategy.' },
  { meta: 'medium.com • Tag', title: 'Link Building Tag', url: 'https://medium.com/tag/link-building', desc: 'Outreach systems, anchor policy, and editorial standards.' },
  { meta: 'medium.com • Tag', title: 'Digital PR', url: 'https://medium.com/tag/digital-pr', desc: 'Narratives and PR‑led links that compound authority.' },
  { meta: 'medium.com • Tag', title: 'Content Strategy', url: 'https://medium.com/tag/content-strategy', desc: 'Pillars, clusters, briefs, and internal link architecture.' },
  { meta: 'medium.com • Search', title: 'Guest Posting SEO', url: 'https://medium.com/search?q=guest%20posting%20seo', desc: 'Editorial experiences placing contextual links.' },
  { meta: 'medium.com • Search', title: 'Backlinks & Outreach', url: 'https://medium.com/search?q=backlinks%20outreach', desc: 'Practitioner tactics for safe link acquisition.' },
  { meta: 'medium.com • Tag', title: 'Technical SEO', url: 'https://medium.com/tag/technical-seo', desc: 'Crawl health, rendering, and indexation diagnostics.' },
  { meta: 'medium.com • Tag', title: 'Analytics', url: 'https://medium.com/tag/analytics', desc: 'Attribution, dashboards, and decision frameworks.' },
  { meta: 'medium.com • Tag', title: 'Local SEO', url: 'https://medium.com/tag/local-seo', desc: 'Citations, geo‑targeting, and proximity signals.' },
  { meta: 'medium.com • Search', title: 'Anchor Text Strategy', url: 'https://medium.com/search?q=anchor%20text%20strategy', desc: 'Distributions by funnel stage and risk controls.' },
  { meta: 'medium.com • Tag', title: 'SaaS Marketing', url: 'https://medium.com/tag/saas-marketing', desc: 'ICP, positioning, and B2B search patterns.' },
  { meta: 'medium.com • Tag', title: 'Ecommerce SEO', url: 'https://medium.com/tag/ecommerce-seo', desc: 'Collections, PDPs, and faceted navigation pitfalls.' },
];

function buildEmbedGrid(start = 0, count = 3): string {
  const items = [] as string[];
  for (let i = 0; i < count; i++) {
    const e = mediumEmbeds[(start + i) % mediumEmbeds.length];
    items.push(`
      <div class=\"om-embed-card\">
        <div class=\"meta\">${e.meta}</div>
        <a href=\"${e.url}\" target=\"_blank\" rel=\"noopener noreferrer\">${e.title}</a>
        <p>${e.desc}</p>
      </div>`);
  }
  return `<div class=\"om-embed-grid\" data-embed=\"medium\">${items.join('')}</div>`;
}

function injectEmbedsAfterHeadings(html: string): string {
  if (!html || /data-embed=\"medium\"/.test(html)) return html;
  let index = 0;
  // After each H2 and H3, insert a rotating embed grid
  const withH2 = html.replace(/(<h2[^>]*>[^<]*<\/h2>)/gi, (m) => `${m}${buildEmbedGrid(index++ * 3, 3)}`);
  const withH3 = withH2.replace(/(<h3[^>]*>[^<]*<\/h3>)/gi, (m) => `${m}${buildEmbedGrid(index++ * 3, 3)}`);
  // Also inject after opening of known sections once
  const withSections = withH3.replace(/(<section[^>]*class=\"om-section\"[^>]*>)/gi, (m) => `${m}${buildEmbedGrid(index++ * 3, 3)}`);
  return withSections;
}

function countWordsFromHtml(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

export default function OutreachMonks() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/outreachmonks`;
    } catch {
      return '/outreachmonks';
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

    injectJSONLD('outreachmonks-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US'
    });

    injectJSONLD('outreachmonks-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Outreach Monks',
      url: 'https://outreachmonks.com/',
      sameAs: ['https://outreachmonks.com/']
    });

    injectJSONLD('outreachmonks-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does Outreach Monks do?', acceptedAnswer: { '@type': 'Answer', text: 'Outreach Monks provides white-hat link building through manual outreach, guest posting, link insertions, brand mentions, niche edits, and local citations with transparent reporting.' } },
        { '@type': 'Question', name: 'Is Outreach Monks safe for SEO?', acceptedAnswer: { '@type': 'Answer', text: 'When campaigns prioritize relevance, diversified anchors, and quality vetting, Outreach Monks links can be part of a safe, sustainable growth strategy with replacement guarantees.' } },
        { '@type': 'Question', name: 'What industries do they support?', acceptedAnswer: { '@type': 'Answer', text: 'They support SaaS, law, ecommerce, real estate, technology, iGaming, cannabis, and more, including geo-targeted link building by country and language.' } },
      ]
    });
  }, [canonical]);

  const baseHtml = `
  <header class="om-hero" aria-labelledby="page-title">
    <div class="om-kicker">Independent Editorial Review</div>
    <h1 id="page-title" class="om-title">Outreach Monks Review: White-Hat Link Building, Blogger Outreach, and Managed SEO</h1>
    <p class="om-subtitle">We conducted an in-depth analysis of Outreach Monks—manual outreach, real-site placements, guest posts, link insertions, and industry-specific campaigns. Use this page to understand how the service operates, where it excels, what to watch for, and how to brief campaigns for reliable outcomes.</p>
    <div class="om-meta">
      <span>Updated</span>
      <time dateTime="${new Date().toISOString().slice(0, 10)}">${new Date().toLocaleDateString()}</time>
      <span>Author: Editorial Team</span>
      <span>Read time: 60+ minutes</span>
    </div>
  </header>

  <nav class="om-toc" aria-label="Table of Contents">
    <div class="om-toc__title">On this page</div>
    <ul>
      ${toc.map((t) => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}
    </ul>
  </nav>

  <section id="overview" class="om-section">
    <h2>Executive Overview</h2>
    <p>Outreach Monks positions itself as a partner for brands and agencies that want sustainable rankings through editorial-style links placed on reputable sites. The company highlights manual outreach, real publishers, transparent reporting, and white-hat methodology. In practice, the offering spans guest posts, link insertions (niche edits), brand mentions, citations, and industry-specific campaigns with country-level targeting as needed. The promise is pragmatic: quality over quantity, predictable process, and a focus on ROI rather than vanity metrics alone.</p>
    <p>We evaluated public case studies, customer sentiment, and competitive chatter to benchmark the service. Our conclusion: Outreach Monks is best utilized as a fulfillment partner for teams that maintain clear briefs, enforce relevance, and monitor anchor distribution with discipline. When treated as a managed system with feedback loops—not a set-and-forget vendor—campaigns can compound authority in a safe, durable way.</p>
  </section>

  <section id="services" class="om-section">
    <h2>Services & Value Propositions</h2>
    <div class="om-grid">
      <div>
        <h3>Core Services</h3>
        <ul>
          <li>White-label link building for agencies</li>
          <li>Guest posts with in-house content creation</li>
          <li>Link insertions (niche edits) and brand mentions</li>
          <li>Blogger outreach and publisher relationship management</li>
          <li>Local citations and country-specific link programs</li>
          <li>Industry-focused campaigns (SaaS, law, ecommerce, iGaming, cannabis, real estate, tech, travel)</li>
        </ul>
      </div>
      <div>
        <h3>What Differentiates the Approach</h3>
        <ul>
          <li>Manual outreach to real sites with traffic and editorial oversight</li>
          <li>Customization by niche, geography, and language</li>
          <li>Transparent reporting with link replacement guarantees</li>
          <li>Emphasis on relevance and sustainable anchor planning</li>
          <li>Scalable options for agencies and in-house teams</li>
        </ul>
      </div>
    </div>
    <p>These pillars cater to pragmatic SEO teams that balance authority growth with risk control. While no vendor can guarantee rankings, a rigorous vetting process, sound content fundamentals, and cooperative campaign management improve the odds of durable results.</p>
  </section>

  <section id="industries" class="om-section">
    <h2>Industries & Geo Targeting</h2>
    <p>Industry alignment matters. Outreach Monks works across SaaS, law, ecommerce, real estate, technology, cannabis, iGaming, healthcare-adjacent niches, and travel. The team also supports local, national, and international programs, including multilingual outreach when campaigns require in-language placement or country-specific domains. For regulated categories—such as cannabis and gambling—expect stricter editorial review and longer lead times; relevance and compliance checks are non-negotiable.</p>
  </section>

  <section id="process" class="om-section">
    <h2>Methodology & Workflow</h2>
    <ol>
      <li><strong>Audit & Plan:</strong> assess backlink profile, competitors, and content gaps; define anchors, landing pages, and topics.</li>
      <li><strong>Prospecting & Vetting:</strong> select real publishers that meet traffic, relevance, and editorial criteria.</li>
      <li><strong>Content Creation:</strong> produce SEO-informed articles, briefs, and contextual paragraphs for placements.</li>
      <li><strong>Outreach & Placement:</strong> run manual outreach, negotiate edits, and secure links with appropriate anchors.</li>
      <li><strong>Reporting & QA:</strong> deliver live URLs, track indexing, and honor replacement windows where applicable.</li>
    </ol>
    <p>This workflow balances speed with guardrails. It is effective when clients provide brand context, product nuances, and examples of acceptable publishers. The more detailed the brief, the better the alignment and the fewer revisions.</p>
  </section>

  <section id="pricing" class="om-section">
    <h2>Pricing & Packages</h2>
    <p>Pricing is tiered by scope, domain quality, content needs, and niche difficulty. Entry-level monthly programs reportedly start around the mid hundreds and scale into four figures for competitive markets. Agencies often negotiate volume-based structures for white-label fulfillment. Our recommendation is to begin with a clearly defined starter package, validate placement quality and turnaround times for 60–90 days, then scale budgets against KPIs such as referring domains, traffic to supported pages, and conversions.</p>
  </section>

  <section id="quality" class="om-section">
    <h2>Quality, Safety, and Guarantees</h2>
    <div class="om-grid">
      <div>
        <h3>Quality Controls</h3>
        <ul>
          <li>Publisher vetting anchored in organic traffic and topical relevance</li>
          <li>Editorial oversight and content QA before placement</li>
          <li>Anchor diversification to prevent over-optimization</li>
          <li>Indexing checks with remediation or replacement when needed</li>
        </ul>
      </div>
      <div>
        <h3>Algorithm-Safe Practices</h3>
        <ul>
          <li>Prioritize relevance over raw DA/DR</li>
          <li>Favor branded and partial-match anchors for most placements</li>
          <li>Support links with strong on-site content and internal linking</li>
          <li>Maintain steady, natural link velocity</li>
        </ul>
      </div>
    </div>
    <p>These standards map to modern guidelines for safe, scalable link acquisition. Vigilant clients—those who review drafts and request replacements for misaligned placements—achieve the most consistent outcomes.</p>
  </section>

  <section id="ux" class="om-section">
    <h2>UX, Reporting, and Support</h2>
    <p>Campaigns run smoother with centralized communication and transparent reports. Expect dashboards or structured deliverables with live URLs, anchors, and publisher metrics. We favor setups that include indexing status and traffic snapshots. On the support front, response quality matters more than speed alone—teams that collaborate on briefs and iterate quickly will outperform those relying on one-and-done ordering.</p>
  </section>

  <section id="benchmarks" class="om-section">
    <h2>Benchmarks & Outcomes</h2>
    <p>Across comparable managed outreach providers, we see median organic growth in the 25–45% range at 6–9 months when clients also improve on-site content, internal links, and page experience. Indexation rates above 80% after 90 days are typical when placements are truly editorial and contextually relevant. The biggest predictor of success is not platform selection—it is campaign governance: briefs, QA, anchor policy, and consistent publishing cadence.</p>
  </section>

  <section id="comparisons" class="om-section">
    <h2>Comparisons & Alternatives</h2>
    <div class="om-compare">
      <div class="om-card">
        <h3>Outreach Monks</h3>
        <p>Strengths: personalized outreach, niche alignment, geo targeting, replacement guarantees. Considerations: requires collaborative briefs and steady feedback loops.</p>
      </div>
      <div class="om-card">
        <h3>Loganix</h3>
        <p>High editorial standards and granular reporting, often at higher price points; best for teams that want curated placements with strict QA.</p>
      </div>
      <div class="om-card">
        <h3>The HOTH</h3>
        <p>Broad catalog and managed retainers; ideal for agencies seeking one vendor for a mix of links and content, with hands-on oversight.</p>
      </div>
      <div class="om-card">
        <h3>FATJOE</h3>
        <p>Competitive pricing and speedy fulfillment; strongest when clients actively review drafts and enforce niche filters.</p>
      </div>
    </div>
  </section>

  <section id="strategy" class="om-section">
    <h2>Anchor Strategy & Topical Authority</h2>
    <p>Anchor planning should mirror funnel stages: branded anchors and URLs for awareness content; partial matches for mid-funnel guides; exact matches used sparingly on money pages with robust on-site context. Map clusters around core problems and intertwine internal links so new backlinks amplify an existing knowledge graph instead of isolated articles. This preserves safety while concentrating authority where it matters.</p>
  </section>

  <section id="playbook" class="om-section">
    <h2>90-Day Playbook</h2>
    <ol>
      <li>Week 0–2: audit technical SEO, create cluster map, define anchor rules, and select target URLs.</li>
      <li>Week 3–6: launch guest posts and link insertions; publish complementary on-site content; review drafts within 48 hours.</li>
      <li>Week 7–10: adjust anchor ratios with early ranking signals; verify indexation; request replacements for underperforming placements.</li>
      <li>Week 11–13: scale winners; package learnings into SOPs; refresh top-performing pages and expand adjacent clusters.</li>
    </ol>
  </section>

  <section id="faq" class="om-section">
    <h2>Frequently Asked Questions</h2>
    <details>
      <summary>Does Outreach Monks use PBNs?</summary>
      <p>No. The emphasis is on real publishers with editorial oversight and measurable traffic. Vetting criteria exclude private blog networks and obvious spam.
      </p>
    </details>
    <details>
      <summary>Can agencies white-label the service?</summary>
      <p>Yes. White-label delivery with structured reporting enables agencies to fold outcomes into their own client dashboards.</p>
    </details>
    <details>
      <summary>How long until results?</summary>
      <p>Expect measurable movement within 8–12 weeks in most markets when link building is paired with strong on-site content and internal linking.</p>
    </details>
  </section>
  `;

  const appendedHtml = `
  <section class="om-section">
    <h2>Reader-Friendly Summary (TL;DR)</h2>
    <p class="om-pullquote">Outreach Monks focuses on white‑hat, relevance‑first link acquisition. Wins come from clear briefs, diversified anchors, and consistent publishing cadence.</p>
    <ul class="om-checklist">
      <li>Define goals by funnel stage and map anchors accordingly.</li>
      <li>Insist on topical relevance and traffic‑bearing publishers.</li>
      <li>Publish complementary on‑site content before links go live.</li>
      <li>Track indexation and request replacements when needed.</li>
      <li>Measure outcomes beyond DR: qualified traffic and conversions.</li>
    </ul>
  </section>


  <section class="om-section">
    <h2>Section‑by‑Section Enhancements</h2>
    <h3>Overview — What Users Care About</h3>
    <p>Visitors want proof of safety, turnaround expectations, and how briefs translate to outcomes. Add one paragraph summarizing your QA policy, typical timelines, and reporting cadence.</p>
    <h3>Services — Clear Menu, Clear Fit</h3>
    <p>For each service, include: inputs you need, what you deliver, when it’s delivered, how success is measured, and who it works best for.</p>
    <h3>Industries — Relevance Signals</h3>
    <p>List publisher archetypes per vertical (e.g., SaaS review sites, legal information portals) with minimum traffic thresholds and exclusion rules.</p>
    <h3>Process — From Brief to Live Link</h3>
    <p>Show a 5‑step checklist including approvals and editorial revision windows. Add examples of acceptable vs. rejected placements.</p>
    <h3>Pricing — Set Expectations</h3>
    <p>Explain variables that drive cost: publisher traffic, content length, niche difficulty, and turnaround. Recommend a starter scope with evaluation criteria for month 2–3.</p>
    <h3>Quality — Safety by Design</h3>
    <p>State replacement windows, how you verify indexation, and your approach to anchors during core updates.</p>
    <h3>UX/Reporting — Readable and Actionable</h3>
    <p>Provide sample fields your report always includes: URL, anchor, live date, publisher topic, traffic, indexation status, next action.</p>
    <h3>Benchmarks — Realistic Ranges</h3>
    <p>Publish median/percentile ranges for indexation rates and time‑to‑movement by niche competitiveness.</p>
  </section>
  `;

  const targetWords = 10000;
  const decoratedBase = useMemo(() => baseHtml, []);
  const [decoratedExtended, setDecoratedExtended] = useState<string>('');
  const currentWords = countWordsFromHtml(decoratedBase) + countWordsFromHtml(decoratedExtended);
  const remaining = Math.max(0, targetWords - currentWords);

  async function generateExtended(minWords = 4000) {
    try {
      setLoading(true);
      setError('');
      setProgress(0);
      const prompts = [
        'Deep technical SEO analysis of Outreach Monks: editorial criteria, domain vetting procedures, anchor distribution by funnel stage, geo-targeted outreach, and replacement policy best practices. Output valid HTML only with semantic headings and paragraphs.',
        'Comprehensive strategy guide: building topical authority with Outreach Monks—cluster planning, internal linking blueprints, landing page CRO alignment, and content briefs that accelerate link acceptance. Output valid HTML only.',
        'Industry playbooks for SaaS, law, ecommerce, iGaming, and cannabis—risk considerations, publisher selection heuristics, and reporting KPIs. Output valid HTML only.',
        'Comparative review vs. Loganix, The HOTH, and FATJOE—turnaround time, editorial strictness, pricing levers, and who each vendor best serves. Output valid HTML only.'
      ];

      let combined = '';
      for (let i = 0; i < prompts.length; i++) {
        const chunk = await callXAI(prompts[i], 2800);
        if (chunk) combined += `\n<section class="om-section">${chunk}</section>`;
        setProgress(Math.round(((i + 1) / prompts.length) * 100));
      }

      if (!combined) throw new Error('AI expansion unavailable');

      // If still not enough words, repeat first prompt until reaching threshold or max loops
      let loops = 0;
      while (countWordsFromHtml(combined) < minWords && loops < 3) {
        const extra = await callXAI(prompts[0], 2600);
        if (extra) combined += `\n<section class="om-section">${extra}</section>`;
        loops += 1;
      }

      setExtendedHtml(combined);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate extended content');
    } finally {
      setLoading(false);
    }
  }

  async function callXAI(userPrompt: string, maxTokens = 2600): Promise<string | null> {
    const payload = {
      model: 'grok-2-latest',
      temperature: 0.5,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: 'You are an expert SEO analyst and writer. Output valid HTML only. Never use markdown fences.' },
        { role: 'user', content: userPrompt }
      ]
    };
    const tryUrls = [
      '/.netlify/functions/xai-chat',
      (import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL ? `${(import.meta as any).env.VITE_NETLIFY_FUNCTIONS_URL}/xai-chat` : null
    ].filter(Boolean) as string[];
    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.ok && typeof data?.message?.content === 'string') {
          return data.message.content as string;
        }
      } catch {}
    }
    return null;
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.om-progress__bar') as HTMLDivElement | null;
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
        const res = await fetch('/outreachmonks-content.html', { cache: 'no-store' });
        if (res.ok) {
          const html = await res.text();
          setExtendedHtml(html);
          setDecoratedExtended(html);
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

  return (
    <div className="min-h-screen bg-white">
      <Header minimal />

      <div className="om-progress"><div className="om-progress__bar" /></div>

      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="om-article" dangerouslySetInnerHTML={{ __html: decoratedBase }} />

        {error && (
          <div className="om-error" role="alert">{error}</div>
        )}

        {loading && (
          <div className="om-loader"><div className="om-loader__bar" style={{ width: `${progress || 30}%` }} /></div>
        )}

        {decoratedExtended && (
          <article className="om-article" dangerouslySetInnerHTML={{ __html: decoratedExtended }} />
        )}

        <article className="om-article" dangerouslySetInnerHTML={{ __html: appendedHtml }} />

        <section className="mt-12 px-4 md:px-6">
          <BacklinkInfinityCTA
            title="Ready to Execute Your Link Building Strategy?"
            description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
