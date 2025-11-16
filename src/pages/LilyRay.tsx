import React, { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { ArrowRight, ExternalLink, Globe2, Target } from 'lucide-react';
import { lilySections, lilyStats, lilyTimeline, lilyFaqs, lilyGlossary } from '@/data/lilyRayContent';
import { lilyLongSections } from '@/data/lilyRayLongContent';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}
function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.text = text;
    document.head.appendChild(element);
  } else {
    element.text = text;
  }
}

const metaTitle = 'Lily Ray: SEO Research, E-E-A-T & Practical Playbooks (2025)';
const metaDescription = 'Comprehensive resource on Lily Ray: biography, SEO research, E-E-A-T insights, snippet tests, consolidation playbooks, and measurement guidance.';

export default function LilyRay() {
  const canonical = useMemo(() => {
    try { return `${typeof window !== 'undefined' ? window.location.origin : ''}/lilyray`; } catch { return '/lilyray'; }
  }, []);

  const contentRef = useRef<HTMLElement | null>(null);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    lilySections.forEach((section) => { textSegments.push(section.summary); section.paragraphs.forEach(p => textSegments.push(p)); });
    lilyStats.forEach(s => textSegments.push(s.description));
    lilyTimeline.forEach(e => textSegments.push(e.description));
    lilyFaqs.forEach(f => textSegments.push(f.answer));
    lilyGlossary.forEach(g => textSegments.push(g.definition));
    lilyLongSections.forEach(ls => ls.paragraphs.forEach(p => textSegments.push(p)));
    return textSegments.join(' ').split(/\s+/).filter(Boolean).length;
  }, []);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Lily Ray, SEO, E-E-A-T, snippet testing, content pruning, topical authority');
    upsertCanonical(canonical);

    injectJSONLD('lily-webpage', { '@context': 'https://schema.org', '@type': 'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage: 'en' });
    injectJSONLD('lily-person', { '@context': 'https://schema.org', '@type': 'Person', name: 'Lily Ray', url: 'https://lilyray.nyc/', sameAs: [], jobTitle: 'SEO Researcher & Strategist', description: 'SEO researcher, speaker, and public voice on algorithmic clarity and content quality.' });
    injectJSONLD('lily-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: lilyFaqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });

    const onScroll = () => {
      const bar = document.querySelector('.lily-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#lily-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const totalHeight = Math.max(content.scrollHeight - window.innerHeight, 1);
      const distance = Math.min(Math.max(-rect.top, 0), totalHeight);
      bar.style.width = `${Math.min(100, (distance / totalHeight) * 100)}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [canonical]);

  return (
    <div className="lily-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="lily-progress"><div className="lily-progress__bar" aria-hidden="true" /></div>

        <section className="lily-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="lily-hero__badge"><Target className="h-4 w-4" /> Lily Ray Resource</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Lily Ray: Research, Strategy & Playbooks</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">A practical anthology of Lily Ray’s approaches to algorithmic clarity, E-E-A-T, and resilient SEO operations.</p>
            </div>

            <div className="lily-meta-grid">
              <div className="lily-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p><p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p><p className="mt-2 text-sm text-slate-600">Intent-driven, research-backed, and operational.</p></div>
              <div className="lily-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p><p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p><p className="mt-2 text-sm text-slate-600">Refreshed with best practices and playbooks.</p></div>
              <div className="lily-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p><p className="mt-1 text-2xl font-bold text-slate-900">Lily Ray</p><p className="mt-2 text-sm text-slate-600">Exact-match targeting with semantic clusters.</p></div>
              <div className="lily-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p><p className="mt-1 text-2xl font-bold text-slate-900">Evidence-First</p><p className="mt-2 text-sm text-slate-600">Research, tests, and reproducible playbooks.</p></div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group"><a href="https://lilyray.nyc/" target="_blank" rel="nofollow noopener">Visit LilyRay.nyc<ExternalLink className="ml-2 h-4 w-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800"><a href="/contact" rel="noopener">Contact for Speaking<ArrowRight className="ml-2 h-4 w-4"/></a></Button>
            </div>
          </div>
        </section>

        <section className="lily-section" id="signals"><header className="mb-6 flex flex-col gap-2"><h2 className="lily-section__title">Signature Signals & Proof Points</h2><p className="lily-section__summary">Why Lily’s research is referenced across search communities.</p></header>
          <div className="lily-stats">{lilyStats.map(stat => (<article key={stat.label} className="lily-stat"><p className="lily-stat__label">{stat.label}</p><p className="lily-stat__value">{stat.value}</p><p className="text-sm text-slate-700">{stat.description}</p></article>))}</div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="lily-toc"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p><ul>{lilySections.map(s => (<li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>))}<li><a href="#faq">Frequently Asked Questions</a></li><li><a href="#glossary">Glossary</a></li><li><a href="#cta">Take Action</a></li></ul></aside>

          <article id="lily-content" ref={contentRef} className="flex flex-col gap-8 pb-12">
            {lilySections.map(section => (
              <section key={section.id} id={section.id} className="lily-section"><header className="mb-4"><h2 className="lily-section__title">{section.title}</h2><p className="lily-section__summary">{section.summary}</p></header><div className="lily-section__body">{section.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}</div></section>
            ))}

            {lilyLongSections.map(ls => (
              <section key={ls.id} id={ls.id} className="lily-section">
                <header className="mb-4">
                  <h2 className="lily-section__title">{ls.title}</h2>
                </header>
                <div className="lily-section__body">{ls.paragraphs.map((p, idx) => (<p key={idx}>{p}</p>))}</div>
              </section>
            ))}

            <section id="faq" className="lily-section"><header className="mb-4"><h2 className="lily-section__title">Lily Ray FAQ</h2><p className="lily-section__summary">Practical answers for teams and practitioners.</p></header><div className="lily-faq"><Accordion type="single" collapsible>{lilyFaqs.map((faq, i) => (<AccordionItem key={faq.question} value={`faq-${i}`}><AccordionTrigger className="text-left text-base font-semibold text-slate-800">{faq.question}</AccordionTrigger><AccordionContent className="text-slate-700"><p className="leading-relaxed">{faq.answer}</p></AccordionContent></AccordionItem>))}</Accordion></div></section>

            <section id="glossary" className="lily-section"><header className="mb-4"><h2 className="lily-section__title">Glossary</h2><p className="lily-section__summary">Key terms and their meaning in modern SEO.</p></header><div className="lily-glossary">{lilyGlossary.map(entry => (<article key={entry.term} className="lily-glossary__item"><h3 className="lily-glossary__term">{entry.term}</h3><p className="text-sm text-slate-700">{entry.definition}</p></article>))}</div></section>

            <section id="cta" className="lily-cta text-white"><div className="relative z-10 flex flex-col gap-4"><span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"><Globe2 className="h-4 w-4"/> Put Research Into Motion</span><h2 className="text-3xl font-black tracking-tight md:text-4xl">Operationalize Research and Build Durable Visibility</h2><p className="max-w-3xl text-lg text-white/85">Start with a QRG sampling, run snippet experiments, and create one link‑worthy data asset. Measure leading indicators and iterate rapidly.</p><div className="flex flex-wrap gap-3 pt-2"><Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white"><a href="/contact" rel="noopener">Contact for Advisory<ExternalLink className="ml-2 h-4 w-4"/></a></Button><Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10"><a href="/blog" rel="noopener">Explore SEO Research<ArrowRight className="ml-2 h-4 w-4"/></a></Button></div></div></section>
          </article>
          <section className="mt-12">
            <BacklinkInfinityCTA
              title="Implement E-E-A-T Link Building Strategy"
              description="Register for Backlink ∞ to apply the E-E-A-T frameworks you've learned from Lily Ray. Access quality backlinks, advanced SEO strategies, and expert guidance to build authority and achieve better rankings."
              variant="card"
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
