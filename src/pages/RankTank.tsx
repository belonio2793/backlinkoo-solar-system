import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/ranktank.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) { el = document.createElement('link'); el.setAttribute('rel','canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; el.text = text; document.head.appendChild(el); }
  else { el.text = text; }
}

const metaTitle = 'Rank Tank: In‑Depth RankTank Review, Keyword Rank Checker, Backlinks, and SEO Playbook (2025)';
const metaDescription = 'A comprehensive, original guide to RankTank (rank tank) — how its keyword position tools work, Sheet Extension vs Original Sheet, pricing, UULE geo‑targeting, mobile vs desktop rankings, and advanced backlink/anchor strategies with 90‑day playbooks.';
const metaKeywords = 'rank tank, ranktank, keyword position tool, google sheets rank checker, UULE, mobile desktop rankings, backlinks, link building, seo playbook, pricing, features, faq';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'how-it-works', label: 'How RankTank Works' },
  { id: 'features', label: 'Features & Capabilities' },
  { id: 'products', label: 'Sheet Extension vs Original Sheet' },
  { id: 'geo-ua', label: 'GEO/UULE & Device Targeting' },
  { id: 'pricing', label: 'Pricing & Plans' },
  { id: 'workflows', label: 'Setup & Workflows' },
  { id: 'anchors', label: 'Anchors, Internal Links, Velocity' },
  { id: 'backlinks', label: 'Backlink Strategy Integrations' },
  { id: 'measurement', label: 'Measurement & Reporting' },
  { id: 'playbook', label: '90‑Day SEO Playbook' },
  { id: 'faq', label: 'FAQs' },
];

export default function RankTank() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const targetWords = 10000;

  const canonical = useMemo(() => {
    try { const base = typeof window !== 'undefined' ? window.location.origin : ''; return `${base}/ranktank`; } catch { return '/ranktank'; }
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

    injectJSONLD('ranktank-webpage', { '@context': 'https://schema.org', '@type': 'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage: 'en-US' });
    const publisherUrlBase = canonical.replace('/ranktank','/');
    injectJSONLD('publisher-org', { '@context': 'https://schema.org', '@type': 'Organization', name: 'Backlink ∞', url: publisherUrlBase, logo: { '@type': 'ImageObject', url: publisherUrlBase + 'assets/logos/backlink-logo-white.svg' } });
    injectJSONLD('reviewed-org', { '@context': 'https://schema.org', '@type': 'Organization', name: 'RankTank', url: 'https://ranktank.net/', sameAs: ['https://ranktank.net/'] });
    injectJSONLD('ranktank-article', { '@context': 'https://schema.org', '@type': 'Article', headline: metaTitle, description: metaDescription, mainEntityOfPage: canonical, image: [heroImage], datePublished: new Date().toISOString(), dateModified: new Date().toISOString(), author: { '@type': 'Organization', name: 'Backlink ∞' }, publisher: { '@type': 'Organization', name: 'Backlink ∞' } });
    const tocList = toc.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, url: `${canonical}#${t.id}` }));
    injectJSONLD('ranktank-toc', { '@context': 'https://schema.org', '@type': 'ItemList', name: 'On this page', itemListElement: tocList });
    injectJSONLD('ranktank-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is RankTank (rank tank)?', acceptedAnswer: { '@type': 'Answer', text: 'RankTank provides real‑time keyword rank checking that runs inside Google Sheets via a Sheet Extension and an Original Sheet, with geo‑targeting and device selection for precise SERP checks.' } },
      { '@type': 'Question', name: 'Which RankTank product should I use?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Sheet Extension for smaller tabs (~1,000 keywords) and rapid, flexible scans. Use the Original Sheet for very large keyword lists (10,000+) and consistent 100‑result scans.' } },
      { '@type': 'Question', name: 'Does RankTank replace a full SEO stack?', acceptedAnswer: { '@type': 'Answer', text: 'No. RankTank is a rank checking layer. Pair it with keyword research, content optimization, link building, and analytics to form a complete growth stack.' } }
    ] });
  }, [canonical]);

  const baseHtml = `
  <header class="rt-hero" aria-labelledby="page-title">
    <div class="rt-kicker">Independent Deep Dive</div>
    <h1 id="page-title" class="rt-title">Rank Tank — In‑Depth RankTank Review, Keyword Rank Checker, and SEO Playbooks</h1>
    <p class="rt-subtitle">This guide is a comprehensive study of <strong>rank tank</strong> and the RankTank ecosystem. We analyze the product model, reverse‑engineer page structure and positioning from public materials, and present original, expanded guidance on rank tracking, anchors, backlinks, velocity, and reporting. Built for practitioners who want violently accurate execution.</p>
    <div class="rt-meta"><span>Updated</span><time dateTime="${new Date().toISOString().slice(0,10)}">${new Date().toLocaleDateString()}</time><span>Author: Editorial Team</span><span>Read time: 60+ minutes</span></div>
  </header>

  <nav class="rt-toc" aria-label="Table of Contents"><div class="rt-toc__title">On this page</div><ul>${toc.map(t=>`<li><a href="#${t.id}">${t.label}</a></li>`).join('')}</ul></nav>

  <section id="overview" class="rt-section">
    <h2>Executive Overview</h2>
    <p><strong>RankTank</strong> focuses on <em>real‑time</em> keyword position checks that run directly inside Google Sheets. Instead of waiting for batch updates, you see current SERPs for your keywords and domains, including options for GEO (UULE) and device (desktop/mobile). This real‑time posture pairs well with iterative SEO: write, interlink, acquire links, then validate movements as they happen.</p>
    <p>To get full value, integrate rank checking with disciplined anchor strategies, internal links, and a publishing cadence. Treat RankTank as the measurement heartbeat while content and backlinks compound topical authority.</p>
  </section>

  <section id="how-it-works" class="rt-section">
    <h2>How RankTank Works</h2>
    <p>RankTank delivers live Google SERP checks via two primary products: a <strong>Sheet Extension</strong> from the Google Workspace Marketplace and an <strong>Original Sheet</strong> that operates through Google Apps Script. Both support device targeting and location parameters so you can replicate the searcher’s context accurately.</p>
  </section>

  <section id="features" class="rt-section">
    <h2>Features & Capabilities</h2>
    <div class="rt-grid">
      <div class="rt-card">
        <h3>Real‑Time SERP Rank Checks</h3>
        <ul>
          <li>Live positions for your keywords relative to a domain or URL</li>
          <li>On‑demand scans without waiting for daily batch jobs</li>
          <li>Ideal for iterative tests, on‑page tweaks, and link acquisition validation</li>
        </ul>
      </div>
      <div class="rt-card">
        <h3>Sheets‑Native Workflow</h3>
        <ul>
          <li>All data lives in Google Sheets, easy to share with teams</li>
          <li>Filter, chart, and annotate directly in your workbook</li>
          <li>Automate summaries with simple formulas and Apps Script triggers</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="products" class="rt-section">
    <h2>Sheet Extension vs Original Sheet</h2>
    <div class="rt-grid">
      <div class="rt-card">
        <h3>RT Sheet Extension</h3>
        <ul>
          <li>Best for ~1,000 keywords per tab and ad‑hoc scans</li>
          <li>Flexible depth (10–100 results), desktop & mobile user agents</li>
          <li>Precise location via UULE; optional Ads and Local 3‑Pack visibility</li>
        </ul>
      </div>
      <div class="rt-card">
        <h2>RT Original Sheet</h2>
        <ul>
          <li>Best for very large sets (10,000+ keywords per sheet)</li>
          <li>Default depth of 100 results, desktop & mobile agents</li>
          <li>Organic rankings primarily; region‑level location inputs</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="geo-ua" class="rt-section">
    <h2>GEO/UULE & Device Targeting</h2>
    <p>Location matters. UULE encoding lets you specify a precise geo so RankTank simulates a searcher in that area. Pair this with desktop/mobile user agents to catch intent shifts, mobile‑first SERPs, and local‑pack changes. For franchises and service businesses, this precision is often the difference between noise and signal.</p>
  </section>

  <section id="pricing" class="rt-section">
    <h2>Pricing & Plans</h2>
    <p>RankTank pricing reflects two usage patterns: flexible scans in the Extension and larger, consistent batches in the Original Sheet. Evaluate plans against <em>outcomes</em>—indexation, rank movement on priority terms, and assisted conversions—rather than unit price alone.</p>
  </section>

  <section id="workflows" class="rt-section">
    <h2>Setup & Workflows</h2>
    <ol>
      <li>Audit target pages and map keywords by intent and cluster.</li>
      <li>Define anchor rules: branded/partial‑match baseline; exact‑match only on exceptional fits.</li>
      <li>Set scanning cadence tied to publishing and link acquisition windows.</li>
      <li>Report in Sheets: keyword, URL, rank, date, device, location, and next action.</li>
    </ol>
    <p>For in‑app rank tracking, explore our <a href="/rank-tracker">Rank Tracker</a> and <a href="/keyword-research">Keyword Research</a> tools for complementary workflows.</p>
  </section>

  <section id="anchors" class="rt-section">
    <h2>Anchors, Internal Links, Velocity</h2>
    <p>Ranking is a systems problem. Govern anchors with intent, keep link velocity aligned to your publishing cadence, and reinforce clusters with internal links. RankTank validates whether these choices move needles in the SERPs you actually care about.</p>
  </section>

  <section id="backlinks" class="rt-section">
    <h2>Backlink Strategy Integrations</h2>
    <div class="rt-grid">
      <div class="rt-card">
        <h3>Marketplace + Managed Hybrid</h3>
        <p>Use marketplaces for repeatable placements and a managed partner for narrative/PR‑led campaigns. Validate each batch with RankTank scans to prove contribution to target clusters.</p>
      </div>
      <div class="rt-card">
        <h3>Topic Clusters & Interlinks</h3>
        <p>Each link should reinforce a cluster. Publish related guides, interlink with descriptive anchors, and route authority to the money pages that convert.</p>
      </div>
    </div>
  </section>

  <section id="measurement" class="rt-section">
    <h2>Measurement & Reporting</h2>
    <ul>
      <li>Track rank by keyword, device, and UULE location</li>
      <li>Annotate content releases and link batches in the same sheet</li>
      <li>Monitor indexation, impressions, and assisted conversions alongside ranks</li>
    </ul>
  </section>

  <section id="playbook" class="rt-section">
    <h2>90‑Day SEO Playbook</h2>
    <ol>
      <li>Weeks 0–2: cluster audit; fix on‑page gaps; establish anchor rules; set scan templates.</li>
      <li>Weeks 3–6: publish support content; place a pilot link batch; scan desktop and mobile across priority geos.</li>
      <li>Weeks 7–10: double‑down on topics with movement; rebalance anchors; refresh internal links.</li>
      <li>Weeks 11–13: operationalize wins into SOPs; scale budgets; automate report rollups.</li>
    </ol>
  </section>

  <section id="faq" class="rt-section">
    <h2>Frequently Asked Questions</h2>
    <details><summary>Is RankTank the same as a full SEO platform?</summary><p>No. It is a precise rank checking layer. Combine it with research, content optimization, link acquisition, and analytics to form a complete growth stack.</p></details>
    <details><summary>How often should I scan?</summary><p>Tie scans to your release cadence. Scan before changes (baseline), 48–72 hours after, and then weekly until stabilization.</p></details>
    <details><summary>Should I track mobile and desktop?</summary><p>Yes. Device intent and SERPs differ. Many categories are mobile‑first; validate both.</p></details>
  </section>
  `;

  function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.rt-progress__bar') as HTMLDivElement | null;
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
      model: 'grok-2-latest', temperature: 0.5, max_tokens: maxTokens,
      messages: [
        { role: 'system', content: 'You are an expert SEO analyst and technical writer. Output valid HTML only with semantic headings and paragraphs. No markdown fences.' },
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
        if (res.ok && data?.ok && typeof data?.message?.content === 'string') return data.message.content as string;
      } catch {}
    }
    const w: any = typeof window !== 'undefined' ? window : {};
    const xKey = w.X_API || w.GROK_API_KEY || localStorage.getItem('grok_api_key');
    if (xKey) {
      try {
        const resp = await fetch('https://api.x.ai/v1/chat/completions', { method: 'POST', headers: { 'Authorization': `Bearer ${xKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await resp.json().catch(() => ({}));
        const html = data?.choices?.[0]?.message?.content || '';
        if (html) return html as string;
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
        'RankTank (rank tank) deep dive: product architecture, Sheets integrations, UULE geo targeting, device agents, and operational trade‑offs. Output valid HTML only.',
        'Comparison of RT Sheet Extension vs RT Original Sheet for different keyword volumes, workflows, and teams. Output valid HTML only.',
        'Advanced rank tracking playbooks: baselines, annotations, QA of SERP anomalies, and tying scans to link batches. Output valid HTML only.',
        'Backlink strategy integration: anchors by intent, internal links, link velocity governance, and measurement frameworks. Output valid HTML only.'
      ];

      let combined = '';
      for (let i = 0; i < prompts.length; i++) {
        const chunk = await callXAI(prompts[i], 2800);
        if (chunk) combined += `\n<section class=\"rt-section\">${chunk}</section>`;
        setProgress(Math.round(((i + 1) / prompts.length) * 100));
      }

      if (!combined) throw new Error('AI expansion unavailable');

      let loops = 0;
      while (countWords(combined) < minWords && loops < 3) {
        const extra = await callXAI('Extended RankTank guide: reporting templates, team SOPs, international deployments, and mobile‑first nuances. HTML only.', 2600);
        if (extra) combined += `\n<section class=\"rt-section\">${extra}</section>`;
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
        setProgress(15);
        await generateExtended(Math.min(7500, targetWords - countWords(baseHtml) + 500));
        setProgress(100);
      } catch (e: any) {
        setError('Failed to generate extended content.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalWords = countWords(baseHtml) + countWords(extendedHtml);

  return (
    <div className="min-h-screen bg-white">
      <Header minimal />

      <div className="rt-progress"><div className="rt-progress__bar" /></div>

      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="rt-article" dangerouslySetInnerHTML={{ __html: baseHtml }} />

        {error && (<div className="rt-error" role="alert">{error}</div>)}
        {loading && (<div className="rt-loader"><div className="rt-loader__bar" style={{ width: `${progress || 30}%` }} /></div>)}
        {extendedHtml && (<article className="rt-article" dangerouslySetInnerHTML={{ __html: extendedHtml }} />)}

        <div className="mt-6 text-sm text-slate-500">Approximate word count: {totalWords.toLocaleString()}</div>
        <section className="mt-12">
          <BacklinkInfinityCTA
            title="Track Rankings & Build Authority With Backlinks"
            description="Register for Backlink ∞ to track your keyword rankings and execute rank-tracking-informed link-building strategies. Access quality backlinks and expert guidance to accelerate your SEO growth."
            variant="card"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
