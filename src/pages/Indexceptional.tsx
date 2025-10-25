import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/styles/indexceptional.css';

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

const metaTitle = 'Indexceptional — Definitive Guide to Lightning‑Fast Indexing, Backlinks, and Link Building (2025)';
const metaDescription = 'A comprehensive, practitioner‑grade guide to Indexceptional: strategy, architecture, credit models, instant indexing, backlinks, link velocity, and technical SEO for durable rankings.';
const metaKeywords = 'indexceptional, indexing, instant indexing, backlinks, link building, technical seo, credit system, link velocity, indexation rate, search engine optimization';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'how-it-works', label: 'How Indexceptional Works' },
  { id: 'credit-system', label: 'Credit System & Operations' },
  { id: 'instant-indexing', label: 'Instant Indexing Mechanisms' },
  { id: 'architecture', label: 'System Architecture & Signals' },
  { id: 'backlinks', label: 'Backlinks, Anchors & Velocity' },
  { id: 'content', label: 'Content Playbooks & Clustering' },
  { id: 'measurement', label: 'Measurement & QA Frameworks' },
  { id: 'pricing', label: 'Pricing Models & ROI' },
  { id: 'use-cases', label: 'Use Cases by Industry' },
  { id: 'security', label: 'Security, Reliability & Compliance' },
  { id: 'power-features', label: 'Power Features & Automations' },
  { id: 'case-studies', label: 'Case Studies & Scenarios' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

export default function Indexceptional() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const targetWords = 10000;

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/indexceptional`;
    } catch {
      return '/indexceptional';
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

    injectJSONLD('indexceptional-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US'
    });

    const publisherUrlBase = canonical.replace('/indexceptional','/');

    injectJSONLD('publisher-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Backlink ∞',
      url: publisherUrlBase,
      logo: { '@type': 'ImageObject', url: publisherUrlBase + 'assets/logos/backlink-logo-white.svg' }
    });

    injectJSONLD('indexceptional-article', {
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

    const tocList = toc.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, url: `${canonical}#${t.id}` }));
    injectJSONLD('indexceptional-toc', { '@context': 'https://schema.org', '@type': 'ItemList', name: 'On this page', itemListElement: tocList });

    injectJSONLD('indexceptional-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Indexceptional?', acceptedAnswer: { '@type': 'Answer', text: 'Indexceptional is a platform for accelerating search engine indexation with a flexible credit system, operational tooling, and automation to support content and link building programs.' } },
        { '@type': 'Question', name: 'Does it replace link building?', acceptedAnswer: { '@type': 'Answer', text: 'No. It complements link building by improving indexation, stabilizing velocity, and helping search engines discover updates faster—so your content and backlinks compound more reliably.' } },
        { '@type': 'Question', name: 'How do credits work?', acceptedAnswer: { '@type': 'Answer', text: 'Credits fund indexing requests. Teams can batch, schedule, and allocate credits across campaigns with governance and reporting.' } }
      ]
    });
  }, [canonical]);

  const baseHtml = `
  <header class="ix-hero" aria-labelledby="page-title">
    <div class="ix-kicker">Independent Deep Dive</div>
    <h1 id="page-title" class="ix-title">Indexceptional — The Practitioner's Playbook for Instant Indexing, Backlinks, and Durable SEO</h1>
    <p class="ix-subtitle">This guide unpacks Indexceptional's model and shows how to combine rapid indexation, disciplined link velocity, and topic‑clustered content to achieve resilient rankings. We cover operating procedures, credit governance, architecture signals, and measurement frameworks used by advanced teams.</p>
    <div class="ix-meta">
      <span>Updated</span>
      <time dateTime="${new Date().toISOString().slice(0, 10)}">${new Date().toLocaleDateString()}</time>
      <span>Author: Editorial Team</span>
      <span>Read time: 60+ minutes</span>
    </div>
  </header>

  <nav class="ix-toc" aria-label="Table of Contents">
    <div class="ix-toc__title">On this page</div>
    <ul>
      ${toc.map((t) => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}
    </ul>
  </nav>

  <section id="overview" class="ix-section">
    <h2>Executive Overview</h2>
    <p>Search engines reward speed, clarity, and consistency. Indexceptional positions itself as an instant indexing accelerator with a flexible credit system and operational guardrails. Used correctly, it becomes the connective tissue between content publishing, link building, and analytics—helping teams stabilize discovery, compound topical authority, and iterate without guesswork.</p>
  </section>

  <section id="how-it-works" class="ix-section">
    <h2>How Indexceptional Works</h2>
    <p>Teams purchase credits, configure projects, submit URLs, and monitor status. The platform emphasizes rapid discovery of new and updated content, with controls for batching, scheduling, and retry logic. The practical takeaway: pair Indexceptional with clean sitemaps, coherent internal links, and anchor discipline so the system amplifies quality—not noise.</p>
  </section>

  <section id="credit-system" class="ix-section">
    <h2>Credit System & Operations</h2>
    <div class="ix-grid">
      <div>
        <h3>Governance</h3>
        <ul>
          <li>Allocate credits by campaign, URL type, or funnel stage.</li>
          <li>Batch high‑priority updates after major releases.</li>
          <li>Track cost‑per‑indexed URL, index latency, and retries.</li>
        </ul>
      </div>
      <div>
        <h3>Scheduling</h3>
        <ul>
          <li>Distribute credits to maintain natural discovery velocity.</li>
          <li>Align with publishing calendar and link acquisition cadence.</li>
          <li>Throttle bursts; avoid synthetic patterns.</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="instant-indexing" class="ix-section">
    <h2>Instant Indexing Mechanisms</h2>
    <p>Indexceptional focuses on accelerating crawl and indexation signals for previously unseen or recently updated content. Success correlates with content quality, crawlability, and strong contextual signals—so treat instant indexing as an amplifier for a robust technical base, not a replacement.</p>
  </section>

  <section id="architecture" class="ix-section">
    <h2>System Architecture & Signals</h2>
    <p>Outcomes are governed by: accessibility (status codes, canonical correctness), semantic clarity (headings, schema), link graph context (internal + external), and stability over time. Maintain clean feeds, avoid duplicate paths, and confirm each URL's role in a topic cluster.</p>
  </section>

  <section id="backlinks" class="ix-section">
    <h2>Backlinks, Anchors & Velocity</h2>
    <p>Indexceptional complements link programs by smoothing discovery and reinforcing momentum. Use branded and partial‑match anchors for baseline safety; reserve exact‑match for exceptional topical fits. Keep velocity aligned with your content cadence and real‑world attention curve.</p>
  </section>

  <section id="content" class="ix-section">
    <h2>Content Playbooks & Clustering</h2>
    <p>Build clusters around intent. Publish support articles that interlink to cornerstone pages, then route links so authority flows naturally. Indexceptional ensures fresh updates are discovered, allowing clusters to consolidate and rank faster.</p>
  </section>

  <section id="measurement" class="ix-section">
    <h2>Measurement & QA Frameworks</h2>
    <ol>
      <li>Baseline: index status, discovery latency, and referring domain growth to targets.</li>
      <li>Movement: priority keyword shifts and qualified traffic by page type.</li>
      <li>Impact: assisted conversions and cohort‑based attribution windows.</li>
    </ol>
  </section>

  <section id="pricing" class="ix-section">
    <h2>Pricing Models & ROI</h2>
    <p>Credits make costs predictable while scaling with needs. Evaluate ROI via marginal lift: reduced time‑to‑index, improved stability during updates, and lower cost per qualified visit to strategic pages.</p>
  </section>

  <section id="use-cases" class="ix-section">
    <h2>Use Cases by Industry</h2>
    <div class="ix-cards">
      <article class="ix-card"><h3>SaaS</h3><p>Accelerate documentation updates, changelogs, and product launches to keep pace with release notes and integrations.</p></article>
      <article class="ix-card"><h3>Ecommerce</h3><p>Speed up seasonal category refreshes and inventory changes while stabilizing discovery for faceted content.</p></article>
      <article class="ix-card"><h3>Fintech</h3><p>Ensure regulatory updates and pricing pages are crawled immediately without destabilizing the broader site.</p></article>
      <article class="ix-card"><h3>Health</h3><p>Surface editorially reviewed updates quickly with strict schema, citations, and author reputation.</p></article>
      <article class="ix-card"><h3>Media</h3><p>Align breaking coverage with immediate discovery to capture attention spikes and improve recrawl frequency.</p></article>
    </div>
  </section>

  <section id="security" class="ix-section">
    <h2>Security, Reliability & Compliance</h2>
    <p>Protect credentials, avoid exposing private endpoints, and monitor error rates. Maintain audit logs for governance and ensure opt‑in tracking. Stable operations and clean signals outperform hacks over time.</p>
  </section>

  <section id="power-features" class="ix-section">
    <h2>Power Features & Automations</h2>
    <ul class="ix-features">
      <li><strong>Instant Indexing:</strong> Rapid discovery for new and updated URLs.</li>
      <li><strong>Boosted Visibility:</strong> Aligns with publication cadence and outreach to amplify signals.</li>
      <li><strong>Scalable Growth:</strong> Credits scale from pilots to enterprise rollouts.</li>
      <li><strong>Comprehensive Support:</strong> Operational guardrails, replacement policies, and reporting.</li>
    </ul>
  </section>

  <section id="case-studies" class="ix-section">
    <h2>Case Studies & Scenarios</h2>
    <p>Examples include launch weeks with synchronized content, outreach, and indexation; remediation sprints for historically under‑indexed sections; and internationalization rollouts coordinated with hreflang updates and localized anchors.</p>
  </section>

  <section id="faq" class="ix-section">
    <h2>Frequently Asked Questions</h2>
    <details>
      <summary>Will this fix weak content?</summary>
      <p>No. Indexceptional accelerates discovery. Quality, relevance, and a coherent link graph still determine rankings.</p>
    </details>
    <details>
      <summary>How do we avoid risky patterns?</summary>
      <p>Use natural anchors, keep velocity consistent with real activity, and avoid repeating thin templates or duplicate paths.</p>
    </details>
    <details>
      <summary>What should we monitor weekly?</summary>
      <p>Indexation rates by section, discovery latency, target keyword movement, and assisted conversions for pages under active work.</p>
    </details>
  </section>
  `;

  function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }

  function sanitizeExtended(html: string): string {
    // Remove doctype and top-level html/head/body/style tags
    return html
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/(html|head|body)>/gi, '')
      .replace(/<html[^>]*>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.ix-progress__bar') as HTMLDivElement | null;
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

  async function callXAI(userPrompt: string, maxTokens = 2800): Promise<string | null> {
    const payload = {
      model: 'grok-2-latest',
      temperature: 0.5,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: 'You are an expert SEO analyst and technical writer. Output valid HTML only with semantic headings and paragraphs. Do not include markdown fences.' },
        { role: 'user', content: userPrompt }
      ]
    };
    const tryUrls = [
      '/api/xai-chat',
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

  async function generateExtended(minWords = 7000) {
    try {
      setLoading(true);
      setError('');
      setProgress(0);
      const prompts = [
        'Indexceptional deep dive: end-to-end instant indexing workflows, credit governance, batching, scheduling, retry logic, and operational safeguards. HTML only.',
        'Backlinks + Indexceptional synergy: anchor governance, link velocity alignment, topic clustering, internal link blueprints, and quarterly iteration cycles. HTML only.',
        'Industry-specific playbooks (SaaS, Ecommerce, Fintech, Health, Media): publisher archetypes, schema guidance, measurement templates, and risk controls. HTML only.',
        'Case studies and scenarios: launch week coordination, remediation sprints for under-indexed archives, internationalization + hreflang rollouts. HTML only.'
      ];

      let combined = '';
      for (let i = 0; i < prompts.length; i++) {
        const chunk = await callXAI(prompts[i], 2800);
        if (chunk) combined += `\n<section class="ix-section">${chunk}</section>`;
        setProgress(Math.round(((i + 1) / prompts.length) * 100));
      }

      if (!combined) throw new Error('AI expansion unavailable');

      let loops = 0;
      while (countWords(combined) < minWords && loops < 3) {
        const extra = await callXAI('Extended Indexceptional guide: measurement frameworks, reporting templates, replacement policy details, and internationalization nuances. HTML only.', 2600);
        if (extra) combined += `\n<section class="ix-section">${extra}</section>`;
        loops += 1;
      }

      setExtendedHtml(prev => prev + combined);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate extended content');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setProgress(10);
        // Try loading pre-generated extended content from public
        let pre = '';
        try {
          const res = await fetch('/indexceptional-content.html', { cache: 'no-store' });
          if (res.ok) pre = await res.text();
        } catch {}
        if (pre) {
          const cleaned = sanitizeExtended(pre);
          setExtendedHtml(cleaned);
          pre = cleaned;
        }
        const baseCount = countWords(baseHtml) + countWords(pre);
        if (baseCount < targetWords) {
          await generateExtended(Math.min(8500, targetWords - baseCount + 800));
        }
        setProgress(100);
      } catch (e: any) {
        setError('Failed to generate extended content automatically.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalWords = countWords(baseHtml) + countWords(extendedHtml);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <Header minimal />

      <div className="ix-progress"><div className="ix-progress__bar" /></div>

      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="ix-article" dangerouslySetInnerHTML={{ __html: baseHtml }} />

        {error && (
          <div className="ix-error" role="alert">{error}</div>
        )}

        {loading && (
          <div className="ix-loader"><div className="ix-loader__bar" style={{ width: `${progress || 30}%` }} /></div>
        )}

        {extendedHtml && (
          <article className="ix-article" dangerouslySetInnerHTML={{ __html: extendedHtml }} />
        )}

        <div className="mt-6 text-sm text-slate-500">Approximate word count: {totalWords.toLocaleString()}</div>
      </main>

      <Footer />
    </div>
  );
}
