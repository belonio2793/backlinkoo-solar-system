import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/bazoom.css';

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

const metaTitle = 'Bazoom vs Outreach Labs: Complete Guide to Marketplace Link Building (2025)';
const metaDescription = 'Independent deep dive into Bazoom’s marketplace model and how it compares to Outreach Labs. Covers strategy, pricing signals, QA, AI-assisted selection, topical authority, and safe link velocity.';
const metaKeywords = 'bazoom, outreach labs, outreachlabs, link building marketplace, blogger outreach, guest posts, digital PR, link insertions, pricing, AI recommendations, 24/7 support, intelligent marketplace';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'bazoom-model', label: 'How the Bazoom Model Works' },
  { id: 'value', label: 'Value Propositions' },
  { id: 'ai', label: 'AI, Filters, and Selection' },
  { id: 'pricing', label: 'Pricing & Cost Signals' },
  { id: 'support', label: 'Support and Operations' },
  { id: 'quality', label: 'Quality & Risk Controls' },
  { id: 'strategy', label: 'Anchor Strategy & Topical Authority' },
  { id: 'comparisons', label: 'Bazoom vs Outreach Labs' },
  { id: 'playbook', label: '90-Day Marketplace Playbook' },
  { id: 'faq', label: 'FAQs' },
];

export default function Bazoom() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const targetWords = 10000;
  const [decoratedExtended, setDecoratedExtended] = useState<string>('');
  const currentWords = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/bazoom`;
    } catch {
      return '/bazoom';
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

    injectJSONLD('bazoom-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US'
    });

    const publisherUrlBase = canonical.replace('/bazoom','/');

    injectJSONLD('publisher-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Backlink ∞',
      url: publisherUrlBase,
      logo: { '@type': 'ImageObject', url: publisherUrlBase + 'assets/logos/backlink-logo-white.svg' }
    });

    injectJSONLD('reviewed-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Bazoom',
      url: 'https://www.bazoom.com/',
      sameAs: ['https://www.bazoom.com/']
    });

    injectJSONLD('bazoom-article', {
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

    injectJSONLD('bazoom-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: publisherUrlBase },
        { '@type': 'ListItem', position: 2, name: 'Bazoom', item: canonical }
      ]
    });

    const tocList = toc.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, url: `${canonical}#${t.id}` }));
    injectJSONLD('bazoom-toc', { '@context': 'https://schema.org', '@type': 'ItemList', name: 'On this page', itemListElement: tocList });

    injectJSONLD('bazoom-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Bazoom?', acceptedAnswer: { '@type': 'Answer', text: 'Bazoom is a global marketplace for purchasing editorial backlinks and content placements with transparent pricing and tooling for selection, filtering, and fulfillment.' } },
        { '@type': 'Question', name: 'Is there a subscription?', acceptedAnswer: { '@type': 'Answer', text: 'Bazoom advertises pay-per-placement with no subscription fees; buyers pay only for the links ordered, typically including content and publication.' } },
        { '@type': 'Question', name: 'How does this compare to Outreach Labs?', acceptedAnswer: { '@type': 'Answer', text: 'Bazoom offers a self-serve marketplace; Outreach Labs operates a managed service model. Teams often use a hybrid approach—marketplace for volume and a managed partner for complex or PR-led campaigns.' } }
      ]
    });
  }, [canonical]);

  const baseHtml = `
  <header class="bz-hero" aria-labelledby="page-title">
    <div class="bz-kicker">Independent Marketplace Review</div>
    <h1 id="page-title" class="bz-title">Bazoom Marketplace — A Practitioner’s Guide for Outreach Labs Buyers</h1>
    <p class="bz-subtitle">This guide examines Bazoom’s marketplace model through the lens of professional link builders and in-house SEO teams comparing it with managed services like <strong>Outreach Labs</strong>. We cover strategy, selection, pricing signals, QA, and a 90-day execution plan that compounds topical authority instead of chasing vanity metrics.</p>
    <div class="bz-meta">
      <span>Updated</span>
      <time dateTime="${new Date().toISOString().slice(0, 10)}">${new Date().toLocaleDateString()}</time>
      <span>Author: Editorial Team</span>
      <span>Read time: 60+ minutes</span>
    </div>
  </header>

  <nav class="bz-toc" aria-label="Table of Contents">
    <div class="bz-toc__title">On this page</div>
    <ul>
      ${toc.map((t) => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}
    </ul>
  </nav>

  <section id="overview" class="bz-section">
    <h2>Executive Overview</h2>
    <p>Marketplace link building promises scale and transparency. Bazoom positions itself as a global network with fast fulfillment, content included, and straightforward pricing—attributes attractive to growth teams who want to operationalize outreach. At the same time, experienced buyers know that selection, anchor governance, and link velocity determine outcomes more than raw volume. The thesis of this guide is simple: combine marketplace efficiency with editorial discipline and you can rival the performance of fully managed programs.</p>
  </section>

  <section id="bazoom-model" class="bz-section">
    <h2>How the Bazoom Model Works</h2>
    <p>Buyers browse and filter publishers, scope content, place orders, and track publication. Strong filters—topic, language, traffic, and domain signals—reduce noise, while AI suggestions and saved lists accelerate repeatable purchasing. The practical trade‑off is that vetting and anchor planning shift to the buyer. Teams that treat Bazoom as a procurement layer but retain editorial control see the most reliable outcomes.</p>
  </section>

  <section id="value" class="bz-section">
    <h2>Core Value Propositions</h2>
    <div class="bz-grid">
      <div>
        <h3>Speed and Predictability</h3>
        <ul>
          <li>Pay-per-placement with content and publication included</li>
          <li>Clear turnaround windows and 24/7 support expectations</li>
          <li>Invoice handling centralized; repeatable ordering across projects</li>
        </ul>
      </div>
      <div>
        <h3>Control and Relevance</h3>
        <ul>
          <li>Granular filtering by topic, category, language, and region</li>
          <li>Approval workflow over anchors and landing pages</li>
          <li>Ability to curate persistent lists of preferred publishers</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="ai" class="bz-section">
    <h2>AI, Filters, and Selection</h2>
    <p>Use AI recommendations to surface potential fits, then validate with human judgment. Prioritize topical alignment and genuine editorial context over domain metrics alone. Maintain a short SOP: confirm indexable placement, on‑topic surrounding text, and a natural anchor. Save high‑performing publishers to a house list and revisit quarterly.</p>
  </section>

  <section id="pricing" class="bz-section">
    <h2>Pricing & Cost Signals</h2>
    <p>Bazoom highlights transparent pricing without subscriptions. Cost should be evaluated against durable outcomes: indexation, traffic to target pages, ranking movement, and assisted conversions. Track cost per qualified visit and cost per improved keyword position instead of fixating on unit price.</p>
  </section>

  <section id="support" class="bz-section">
    <h2>Support and Operations</h2>
    <p>Round‑the‑clock support and dedicated managers are meaningful when orders scale. Establish a cadence for approvals and feedback within 24–48 hours to keep momentum, and document replacement policies before launch. Centralized reporting that lists URL, anchor, live date, and indexation status is essential for governance.</p>
  </section>

  <section id="quality" class="bz-section">
    <h2>Quality & Risk Controls</h2>
    <div class="bz-grid">
      <div>
        <h3>Quality Controls</h3>
        <ul>
          <li>Publisher relevance validated against intent and audience</li>
          <li>Natural anchors, surrounded by genuinely useful copy</li>
          <li>Thresholds for traffic/visibility to avoid orphaned placements</li>
        </ul>
      </div>
      <div>
        <h3>Risk Management</h3>
        <ul>
          <li>Favor branded/partial‑match anchors; reserve exact‑match for exceptional fits</li>
          <li>Keep link velocity consistent with your publishing cadence</li>
          <li>Monitor indexation and request timely remediations</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="strategy" class="bz-section">
    <h2>Anchor Strategy & Topical Authority</h2>
    <p>Treat each purchase as reinforcement of a topic cluster. Map anchors to intent, ensure your target pages are supported by related guides, and interlink so authority flows through a coherent knowledge graph. This approach compounds performance and protects against volatility during core updates.</p>
  </section>

  <section id="comparisons" class="bz-section">
    <h2>Bazoom vs Outreach Labs</h2>
    <div class="bz-compare">
      <div class="bz-card">
        <h3>Bazoom (Marketplace)</h3>
        <p>Transparent, fast, and scalable for teams comfortable running selection and QA. Best used with strong internal SOPs, anchor governance, and content support.</p>
      </div>
      <div class="bz-card">
        <h3>Outreach Labs (Managed Service)</h3>
        <p>Hands‑on strategy, relationship‑driven placements, and collaborative approvals. Ideal when campaigns require nuanced editorial judgment or PR‑style narratives.</p>
      </div>
    </div>
  </section>

  <section id="playbook" class="bz-section">
    <h2>90‑Day Marketplace Playbook</h2>
    <ol>
      <li>Weeks 0–2: audit anchors and landing pages; define clusters; publish missing support content.</li>
      <li>Weeks 3–6: place a pilot set of orders across tiers; approve drafts within 48 hours; verify indexation.</li>
      <li>Weeks 7–10: rebalance anchors; expand purchases on topics with early traction.</li>
      <li>Weeks 11–13: document learnings into SOPs; scale budgets; refresh internal links and CTAs.</li>
    </ol>
  </section>

  <section id="faq" class="bz-section">
    <h2>Frequently Asked Questions</h2>
    <details>
      <summary>Can I use this alongside Outreach Labs?</summary>
      <p>Yes. Many teams use a hybrid approach: marketplace for repeatable placements at scale and a managed partner for advanced, PR‑led, or highly curated work.</p>
    </details>
    <details>
      <summary>What metrics should we track?</summary>
      <p>Indexation rate, referring domain growth to target pages, movement for priority keywords, qualified traffic, and assisted conversions. Unit price alone is not predictive.</p>
    </details>
  </section>
  `;

  function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.bz-progress__bar') as HTMLDivElement | null;
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

  async function generateExtended(minWords = 6000) {
    try {
      setLoading(true);
      setError('');
      setProgress(0);
      const prompts = [
        'Bazoom marketplace technical deep dive: inventory composition, pricing levers, AI recommendations, filtering heuristics, publisher vetting, and SLA expectations. Output valid HTML only.',
        'Strategy guide for using Bazoom alongside Outreach Labs: hybrid operating model, anchor governance, topic clustering, and quarterly iteration loops. Output valid HTML only.',
        'Industry playbooks for SaaS, ecommerce, fintech, health, and B2B services—publisher archetypes, risk considerations, and KPIs to track. Output valid HTML only.',
        'Case studies: examples of anchor distributions by funnel stage, internal linking blueprints, and remediation workflows for replacements. Output valid HTML only.'
      ];

      let combined = '';
      for (let i = 0; i < prompts.length; i++) {
        const chunk = await callXAI(prompts[i], 2800);
        if (chunk) combined += `\n<section class="bz-section">${chunk}</section>`;
        setProgress(Math.round(((i + 1) / prompts.length) * 100));
      }

      if (!combined) throw new Error('AI expansion unavailable');

      let loops = 0;
      while (countWords(combined) < minWords && loops < 3) {
        const extra = await callXAI('Extended Bazoom marketplace guide: measurement frameworks, reporting templates, replacement policy details, and internationalization nuances. HTML only.', 2600);
        if (extra) combined += `\n<section class="bz-section">${extra}</section>`;
        loops += 1;
      }

      setExtendedHtml(prev => prev + combined);
      setDecoratedExtended(prev => prev + combined);
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
        const res = await fetch('/bazoom-content.html', { cache: 'no-store' });
        if (res.ok) {
          const raw = await res.text();
          const cleaned = raw.split('\n').filter(l => !l.includes('©') && !l.toLowerCase().includes('&copy;')).join('\n');
          setExtendedHtml(cleaned);
          setDecoratedExtended(cleaned);
          setProgress(70);
          const baseCount = countWords(baseHtml) + countWords(cleaned);
          if (baseCount < targetWords) {
            await generateExtended(Math.min(7000, targetWords - baseCount + 500));
          }
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <Header minimal />

      <div className="bz-progress"><div className="bz-progress__bar" /></div>

      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="bz-article" dangerouslySetInnerHTML={{ __html: baseHtml }} />

        {error && (
          <div className="bz-error" role="alert">{error}</div>
        )}

        {loading && (
          <div className="bz-loader"><div className="bz-loader__bar" style={{ width: `${progress || 30}%` }} /></div>
        )}

        {extendedHtml && (
          <article className="bz-article" dangerouslySetInnerHTML={{ __html: extendedHtml }} />
        )}

        <div className="mt-6 text-sm text-slate-500">Approximate word count: {totalWords.toLocaleString()}</div>
      </main>

      <Footer />
    </div>
  );
}
