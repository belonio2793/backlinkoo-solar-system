import React, { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { ArrowRight, ExternalLink, Globe2, Target, LineChart } from 'lucide-react';
import { marieSections, marieStats, marieTimeline, marieFaqs, marieGlossary } from '@/data/marieHaynesContent';
import { marieLongSections } from '@/data/marieHaynesLongContent';
import '@/styles/marie-haynes.css';

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

const metaTitle = 'Marie Haynes: Google Algorithms, QRG & AI Search Guide (2025)';
const metaDescription = 'An in‑depth resource on Marie Haynes: Quality Rater Guidelines, algorithm updates, Navboost, AI Search readiness, consulting, and practical playbooks.';

export default function MarieHaynes() {
  const canonical = useMemo(() => {
    try { return `${typeof window !== 'undefined' ? window.location.origin : ''}/mariehaynes`; } catch { return '/mariehaynes'; }
  }, []);

  const contentRef = useRef<HTMLElement | null>(null);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    marieSections.forEach((section) => { textSegments.push(section.summary); section.paragraphs.forEach(p => textSegments.push(p)); });
    marieStats.forEach(s => textSegments.push(s.description));
    marieTimeline.forEach(e => textSegments.push(e.description));
    marieFaqs.forEach(f => textSegments.push(f.answer));
    marieGlossary.forEach(g => textSegments.push(g.definition));
    return textSegments.join(' ').split(/\s+/).filter(Boolean).length;
  }, []);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Marie Haynes, Quality Raters Guidelines, Navboost, Gemini era, AI Search, E-E-A-T, algorithm updates');
    upsertCanonical(canonical);

    injectJSONLD('marie-webpage', { '@context': 'https://schema.org', '@type': 'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage: 'en' });
    injectJSONLD('marie-person', { '@context': 'https://schema.org', '@type': 'Person', name: 'Marie Haynes', url: 'https://www.mariehaynes.com/', sameAs: ['https://twitter.com/marie_haynes'], jobTitle: 'SEO Consultant', description: 'Expert on Google algorithms, E-E-A-T, and site quality.' });
    injectJSONLD('marie-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: marieFaqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });

    const onScroll = () => {
      const bar = document.querySelector('.marie-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#marie-content') as HTMLElement | null;
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
    <div className="marie-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="marie-progress"><div className="marie-progress__bar" aria-hidden="true" /></div>

        <section className="marie-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="marie-hero__badge"><Target className="h-4 w-4" /> Marie Haynes Resource</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Marie Haynes: Algorithms, QRG & AI Search</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Biography, practical audits, and playbooks to adapt to Google’s algorithmic systems and the AI era.</p>
            </div>

            <div className="marie-meta-grid">
              <div className="marie-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p><p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p><p className="mt-2 text-sm text-slate-600">Structured for depth and practical value.</p></div>
              <div className="marie-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p><p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p><p className="mt-2 text-sm text-slate-600">Continuously updated to reflect new signals.</p></div>
              <div className="marie-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p><p className="mt-1 text-2xl font-bold text-slate-900">Marie Haynes</p><p className="mt-2 text-sm text-slate-600">Exact match focus with semantic clusters.</p></div>
              <div className="marie-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p><p className="mt-1 text-2xl font-bold text-slate-900">Operator‑First</p><p className="mt-2 text-sm text-slate-600">Actionable steps for teams, not just theory.</p></div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group"><a href="https://www.mariehaynes.com/" target="_blank" rel="nofollow noopener">Visit MarieHaynes.com<ExternalLink className="ml-2 h-4 w-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800"><a href="https://www.mariehaynes.com/products/qrg-workbook-2025/" target="_blank" rel="nofollow noopener">View QRG Workbook<ArrowRight className="ml-2 h-4 w-4"/></a></Button>
            </div>
          </div>
        </section>

        <section className="marie-section" id="signals"><header className="mb-6 flex flex-col gap-2"><h2 className="marie-section__title">Signature Signals & Proof Points</h2><p className="marie-section__summary">Why Marie’s research and work are central for modern quality‑focused SEO.</p></header>
          <div className="marie-stats">{marieStats.map(stat => (<article key={stat.label} className="marie-stat"><p className="marie-stat__label">{stat.label}</p><p className="marie-stat__value">{stat.value}</p><p className="text-sm text-slate-700">{stat.description}</p></article>))}</div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="marie-toc"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p><ul>{marieSections.map(s => (<li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>))}<li><a href="#faq">Frequently Asked Questions</a></li><li><a href="#glossary">Glossary</a></li><li><a href="#cta">Take Action</a></li></ul></aside>

          <article id="marie-content" ref={contentRef} className="flex flex-col gap-8 pb-12">
            {marieSections.map(section => (
              <section key={section.id} id={section.id} className="marie-section"><header className="mb-4"><h2 className="marie-section__title">{section.title}</h2><p className="marie-section__summary">{section.summary}</p></header><div className="marie-section__body">{section.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}</div></section>
            ))}

            {marieLongSections.map(ls => (
              <section key={ls.id} id={ls.id} className="marie-section">
                <header className="mb-4">
                  <h2 className="marie-section__title">{ls.title}</h2>
                </header>
                <div className="marie-section__body">
                  {ls.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="timeline" className="marie-section"><header className="mb-4"><h2 className="marie-section__title">Milestones</h2><p className="marie-section__summary">Key phases shaping Marie’s contributions and community impact.</p></header><div className="mt-2 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl"><div className="marie-timeline">{marieTimeline.map(e => (<div key={e.year} className="marie-timeline__event"><p className="marie-timeline__year">{e.year}</p><p className="marie-timeline__title">{e.title}</p><p className="marie-timeline__description">{e.description}</p></div>))}</div></div></section>

            <section id="faq" className="marie-section"><header className="mb-4"><h2 className="marie-section__title">Marie Haynes FAQ</h2><p className="marie-section__summary">Direct answers for teams and operators.</p></header><div className="marie-faq"><Accordion type="single" collapsible>{marieFaqs.map((faq, i) => (<AccordionItem key={faq.question} value={`faq-${i}`}><AccordionTrigger className="text-left text-base font-semibold text-slate-800">{faq.question}</AccordionTrigger><AccordionContent className="text-slate-700"><p className="leading-relaxed">{faq.answer}</p></AccordionContent></AccordionItem>))}</Accordion></div></section>

            <section id="glossary" className="marie-section"><header className="mb-4"><h2 className="marie-section__title">Glossary</h2><p className="marie-section__summary">Core terms for algorithmic and AI search readiness.</p></header><div className="marie-glossary">{marieGlossary.map(entry => (<article key={entry.term} className="marie-glossary__item"><h3 className="marie-glossary__term">{entry.term}</h3><p className="text-sm text-slate-700">{entry.definition}</p></article>))}</div></section>

            <section id="cta" className="marie-cta text-white"><div className="relative z-10 flex flex-col gap-4"><span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"><Globe2 className="h-4 w-4"/> Put Quality Into Motion</span><h2 className="text-3xl font-black tracking-tight md:text-4xl">Operationalize QRG and AI Search Readiness</h2><p className="max-w-3xl text-lg text-white/85">Start with audits on high‑value templates, run snippet experiments, and codify a refresh cadence. Align content with user tasks and instrument outcomes.</p><div className="flex flex-wrap gap-3 pt-2"><Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white"><a href="https://www.mariehaynes.com/products/qrg-workbook-2025/" target="_blank" rel="nofollow noopener">View QRG Workbook<ExternalLink className="ml-2 h-4 w-4"/></a></Button><Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10"><a href="/contact" rel="noopener">Contact for Consulting<ArrowRight className="ml-2 h-4 w-4"/></a></Button></div></div></section>
          </article>
          <section className="mt-12">
            <BacklinkInfinityCTA
              title="Apply QRG-Aligned Link Building"
              description="Register for Backlink ∞ to implement Quality Rater Guideline-aligned link-building strategies inspired by Marie Haynes. Access premium backlinks and expert guidance to optimize for search quality and AI readiness."
              variant="card"
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
