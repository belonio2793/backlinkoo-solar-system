import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/bhw-sellers.css';

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

const metaTitle = 'BlackHatWorld SEO Sellers: Independent Buyer’s Guide, Vendor Profiles, and Risk Controls (2025)';
const metaDescription = 'Comprehensive guide to evaluating BlackHatWorld SEO sellers. Profiles for Beklink, 1SEOWarrior, BlackShield, Rionce, Harryw, netsoft, 420lounge, Pharex, Rulingseo, and Genesis PBN-style vendors. Includes governance, pricing signals, and a 90-day plan.';
const metaKeywords = 'blackhatworld seo sellers, BHW sellers, beklink, 1SEOWarrior, BlackShield, Rionce, Harryw, netsoft, 420lounge, Pharex, Rulingseo, Genesis PBN, link building, backlinks marketplace';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';

const toc = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'methodology', label: 'Methodology & Ethics' },
  { id: 'signals', label: 'Selection Signals' },
  { id: 'vendors', label: 'Vendor Profiles' },
  { id: 'pricing', label: 'Pricing & Cost Signals' },
  { id: 'quality', label: 'Quality & Risk Controls' },
  { id: 'sop', label: 'Operating SOP' },
  { id: 'playbook', label: '90‑Day Buyer Playbook' },
  { id: 'faq', label: 'FAQs' },
];

const vendors = [
  { id: 'beklink', name: 'Beklink' },
  { id: '1seowarrior', name: '1SEOWarrior' },
  { id: 'blackshield', name: 'BlackShield' },
  { id: 'rionce', name: 'Rionce' },
  { id: 'harryw', name: 'Harryw' },
  { id: 'netsoft', name: 'netsoft' },
  { id: '420lounge', name: '420lounge' },
  { id: 'pharex', name: 'Pharex (Pharex ID)' },
  { id: 'rulingseo', name: 'Rulingseo' },
  { id: 'genesis-pbn', name: 'Genesis PBN & Similar' },
];

export default function BlackhatworldSEOSellers() {
  const [extendedHtml, setExtendedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const targetWords = 10000;

  const canonical = useMemo(() => {
    try { const base = typeof window !== 'undefined' ? window.location.origin : ''; return `${base}/blackhatworld-seo-sellers`; } catch { return '/blackhatworld-seo-sellers'; }
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

    injectJSONLD('bhw-webpage', { '@context': 'https://schema.org', '@type': 'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage: 'en-US' });
    const publisherUrlBase = canonical.replace('/blackhatworld-seo-sellers','/');
    injectJSONLD('publisher-org', { '@context': 'https://schema.org', '@type': 'Organization', name: 'Backlink ∞', url: publisherUrlBase, logo: { '@type': 'ImageObject', url: publisherUrlBase + 'assets/logos/backlink-logo-white.svg' } });
    injectJSONLD('bhw-article', { '@context': 'https://schema.org', '@type': 'Article', headline: metaTitle, description: metaDescription, mainEntityOfPage: canonical, image: [heroImage], datePublished: new Date().toISOString(), dateModified: new Date().toISOString(), author: { '@type': 'Organization', name: 'Backlink ∞' }, publisher: { '@type': 'Organization', name: 'Backlink ∞' } });
    const tocList = toc.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, url: `${canonical}#${t.id}` }));
    injectJSONLD('bhw-toc', { '@context': 'https://schema.org', '@type': 'ItemList', name: 'On this page', itemListElement: tocList });
    injectJSONLD('bhw-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'How do I evaluate BHW SEO sellers?', acceptedAnswer: { '@type': 'Answer', text: 'Check historic threads, delivery proofs, indexation outcomes, anchor governance, and replacement policies. Favor relevance and editorial quality over raw metrics.' } },
      { '@type': 'Question', name: 'Are ratings or guarantees provided here?', acceptedAnswer: { '@type': 'Answer', text: 'No ratings or guarantees are offered. This is an independent guide focused on due diligence and risk controls.' } },
      { '@type': 'Question', name: 'Can I combine marketplace buys with managed services?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Many teams use marketplaces for repeatable orders and pair them with managed partners for narrative/PR-led campaigns.' } }
    ] });
  }, [canonical]);

  const baseHtml = `
  <header class="bhw-hero" aria-labelledby="page-title">
    <div class="bhw-kicker">Independent Buyer’s Guide</div>
    <h1 id="page-title" class="bhw-title">BlackHatWorld SEO Sellers — Vendor Profiles, Selection Signals, and Risk Controls</h1>
    <p class="bhw-subtitle">A comprehensive, ethics‑aware guide for evaluating <strong>BlackHatWorld SEO sellers</strong>. We outline selection heuristics, governance, and a vendor‑agnostic framework. Profiles included for: Beklink, 1SEOWarrior, BlackShield, Rionce, Harryw, netsoft, 420lounge, Pharex, Rulingseo, and Genesis‑style PBN vendors. No ratings, no guarantees—just operating clarity.</p>
    <div class="bhw-meta"><span>Updated</span><time dateTime="${new Date().toISOString().slice(0,10)}">${new Date().toLocaleDateString()}</time><span>Author: Editorial Team</span><span>Read time: 60+ minutes</span></div>
  </header>

  <nav class="bhw-toc" aria-label="Table of Contents"><div class="bhw-toc__title">On this page</div><ul>${toc.map(t=>`<li><a href="#${t.id}">${t.label}</a></li>`).join('')}</ul></nav>

  <section id="overview" class="bhw-section">
    <h2>Executive Overview</h2>
    <p>Marketplaces and community forums make it easier to procure backlinks, but outcomes hinge on selection, anchors, content quality, and velocity discipline—not the act of purchasing itself. This guide teaches buyers how to evaluate <em>fit</em> and <em>durability</em> so each placement supports real search journeys instead of chasing vanity metrics.</p>
  </section>

  <section id="methodology" class="bhw-section">
    <h2>Methodology & Ethics</h2>
    <p>We assess public offer patterns, common deliverables, reporting norms, and risk management language. We avoid speculative claims, star ratings, or unverifiable guarantees. Use these heuristics to conduct your own due diligence, and document your assumptions before spending budget.</p>
  </section>

  <section id="signals" class="bhw-section">
    <h2>Selection Signals</h2>
    <ul>
      <li>Editorial context over raw DR/DA—do articles help readers achieve something?</li>
      <li>Anchor governance—prefer branded/partial‑match; reserve exact‑match for exceptional editorial fits.</li>
      <li>Indexation and visibility—track at 30/90 days and annotate learnings.</li>
      <li>Replacement and remediation windows—clarify upfront.</li>
      <li>Publisher relevance—topic, language, region, and audience alignment.</li>
    </ul>
  </section>

  <section id="vendors" class="bhw-section">
    <h2>Vendor Profiles</h2>
    <div class="bhw-grid">
      ${vendors.map(v=>`
        <article id="${v.id}" class="bhw-card" aria-labelledby="${v.id}-title">
          <h3 id="${v.id}-title">${v.name}</h3>
          <p>Community‑referenced vendor. Evaluate based on thread history, delivery proofs, indexation outcomes, and replacement policies. Align anchors with intent and ensure on‑page content is worth linking to. Document what works so you can repeat it.</p>
          <ul>
            <li>Common offerings: guest posts, link insertions, niche placements</li>
            <li>What to verify: editorial context, indexability, anchor fit</li>
            <li>Signals to track: live URL, date, status, topic alignment</li>
          </ul>
        </article>
      `).join('')}
    </div>
  </section>

  <section id="pricing" class="bhw-section">
    <h2>Pricing & Cost Signals</h2>
    <p>Compare cost against durable outcomes, not just unit price. A fairly priced placement that indexes, drives qualified traffic, and supports a cluster is cheaper than a bargain placement that never contributes to visibility.</p>
  </section>

  <section id="quality" class="bhw-section">
    <h2>Quality & Risk Controls</h2>
    <div class="bhw-grid">
      <div class="bhw-card">
        <h3>Quality Controls</h3>
        <ul>
          <li>Publisher/topic relevance validated by intent and readership</li>
          <li>Natural anchors placed within useful paragraphs</li>
          <li>Thresholds for visibility to avoid orphaned placements</li>
        </ul>
      </div>
      <div class="bhw-card">
        <h3>Risk Management</h3>
        <ul>
          <li>Conservative anchors during volatility; prefer brand/partial</li>
          <li>Consistent link velocity tied to publishing cadence</li>
          <li>Explicit remediation playbook with timelines</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="sop" class="bhw-section">
    <h2>Operating SOP</h2>
    <ol>
      <li>Define clusters and target pages; fix on‑page gaps first.</li>
      <li>Set anchor rules by intent and guardrails for velocity.</li>
      <li>Short checklist for vetting offers; save high performers.</li>
      <li>Report: URL, anchor, topic, live date, indexation status, next action.</li>
      <li>Review monthly; rebalance anchors; refresh internal links.</li>
    </ol>
  </section>

  <section id="playbook" class="bhw-section">
    <h2>90‑Day Buyer Playbook</h2>
    <ol>
      <li>Weeks 0–2: audit content, define clusters, and anchor map.</li>
      <li>Weeks 3–6: pilot purchases; approve drafts fast; verify indexation.</li>
      <li>Weeks 7–10: expand on wins; prune underperformers; diversify anchors.</li>
      <li>Weeks 11–13: document SOPs; scale budgets; improve internal linking.</li>
    </ol>
  </section>

  <section id="faq" class="bhw-section">
    <h2>Frequently Asked Questions</h2>
    <details><summary>Is BlackHatWorld safe for buyers?</summary><p>It depends on your diligence. Validate vendors through thread history, proofs, and clear remediation terms. Avoid unrealistic claims and prioritize relevance and editorial quality.</p></details>
    <details><summary>Do you endorse specific sellers?</summary><p>No. This guide offers vendor‑agnostic criteria and neutral profiles so you can evaluate fit for your goals.</p></details>
  </section>
  `;

  function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }

  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.bhw-progress__bar') as HTMLDivElement | null;
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

  async function generateExtended(minWords = 6000) {
    try {
      setLoading(true); setError(''); setProgress(0);
      const prompts = [
        'Long-form, ethics-aware guide to evaluating BlackHatWorld SEO sellers. Include selection heuristics, governance, documentation practices, and vendor-agnostic checklists. HTML only.',
        'Vendor profiles expansion for Beklink, 1SEOWarrior, BlackShield, Rionce, Harryw, netsoft, 420lounge, Pharex, Rulingseo, and Genesis-style PBN sellers. Neutral tone, no ratings, focus on what to verify and how to measure outcomes. HTML only.',
        'Advanced playbooks: anchor governance by funnel stage, internal linking blueprints, indexation tracking, remediation workflows, and monthly review cadence. HTML only.',
        'Case studies and templates: reporting fields, procurement SOPs, risk matrices, and internationalization considerations (language/geo). HTML only.'
      ];
      let combined = '';
      for (let i = 0; i < prompts.length; i++) {
        const chunk = await callXAI(prompts[i], 2800);
        if (chunk) combined += `\n<section class=\"bhw-section\">${chunk}</section>`;
        setProgress(Math.round(((i + 1) / prompts.length) * 100));
      }
      if (!combined) throw new Error('AI expansion unavailable');
      let loops = 0;
      while (countWords(combined) < minWords && loops < 3) {
        const extra = await callXAI('Additional technical depth for BHW buyer’s guide: measurable KPIs, portfolio management, and realistic expectations by niche competitiveness. HTML only.', 2600);
        if (extra) combined += `\n<section class=\"bhw-section\">${extra}</section>`;
        loops += 1;
      }
      setExtendedHtml(prev => prev + combined);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate extended content');
    } finally { setLoading(false); }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setProgress(10);
        const res = await fetch('/blackhatworld-seo-sellers-content.html', { cache: 'no-store' });
        if (res.ok) {
          const raw = await res.text();
          const cleaned = raw.split('\n').filter(l => !l.includes('©') && !l.toLowerCase().includes('&copy;')).join('\n');
          setExtendedHtml(cleaned); setProgress(70);
          const baseCount = countWords(baseHtml) + countWords(cleaned);
          if (baseCount < targetWords) {
            await generateExtended(Math.min(7000, targetWords - baseCount + 500));
          }
          setProgress(100);
        } else { setError('Extended content not found.'); }
      } catch (e: any) { setError('Failed to load extended content file.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const totalWords = countWords(baseHtml) + countWords(extendedHtml);

  return (
    <div className="min-h-screen bg-white">
      <Header minimal />
      <div className="bhw-progress" aria-hidden="true"><div className="bhw-progress__bar" /></div>
      <main ref={contentRef} className="container mx-auto max-w-7xl px-4 py-8">
        <article className="bhw-article" dangerouslySetInnerHTML={{ __html: baseHtml }} />
        {loading && (<div className="bhw-loader"><div className="bhw-loader__bar" style={{ width: `${progress || 30}%` }} /></div>)}
        {extendedHtml && (<article className="bhw-article" dangerouslySetInnerHTML={{ __html: extendedHtml }} />)}
        <div className="mt-6 text-sm text-slate-500">Approximate word count: {totalWords.toLocaleString()}</div>

        <section className="mt-12 px-4 md:px-6">
          <BacklinkInfinityCTA
            title="Ready to Build Authority With Quality Backlinks?"
            description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
