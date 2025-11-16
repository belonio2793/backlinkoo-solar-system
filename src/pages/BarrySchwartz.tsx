import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ExternalLink, Target, Globe2, LineChart } from 'lucide-react';
import {
  barrySchwartzSections,
  barrySchwartzStats,
  barrySchwartzTimeline,
  barrySchwartzFaqs,
  barrySchwartzGlossary,
} from '@/data/barrySchwartzContent';

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

const metaTitle = 'Barry Schwartz: Definitive 10,000‑Word SEO News Deep Dive (2025 Edition)';
const metaDescription = 'An authoritative deep dive into Barry Schwartz—Search Engine Roundtable, RustyBrick, editorial standards, and operator playbooks for reacting to search updates.';

export default function BarrySchwartz() {
  const canonical = useMemo(() => {
    try { const origin = typeof window !== 'undefined' ? window.location.origin : ''; return `${origin}/barryschwartz`; } catch { return '/barryschwartz'; }
  }, []);

  const combinedWordCount = useMemo(() => {
    const text: string[] = [];
    barrySchwartzSections.forEach((s) => { text.push(s.summary); s.paragraphs.forEach((p) => text.push(p)); });
    barrySchwartzStats.forEach((s) => text.push(s.description));
    barrySchwartzTimeline.forEach((t) => text.push(t.description));
    barrySchwartzFaqs.forEach((f) => text.push(f.answer));
    barrySchwartzGlossary.forEach((g) => text.push(g.definition));
    return text.join(' ').split(/\s+/).filter(Boolean).length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Barry Schwartz, Search Engine Roundtable, RustyBrick, SEO news, Google updates, search ranking volatility, SMX, interviews');
    upsertCanonical(canonical);

    injectJSONLD('barry-schwartz-webpage', { '@context': 'https://schema.org', '@type': 'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage: 'en' });
    injectJSONLD('barry-schwartz-person', {
      '@context': 'https://schema.org', '@type': 'Person', name: 'Barry Schwartz',
      sameAs: [
        'https://www.seroundtable.com/',
        'https://www.linkedin.com/in/rustybrick',
        'https://x.com/rustybrick',
        'https://www.rustybrick.com/',
      ],
      jobTitle: 'Founder, Search Engine Roundtable; CEO, RustyBrick',
      worksFor: [ { '@type': 'Organization', name: 'Search Engine Roundtable', url: 'https://www.seroundtable.com/' }, { '@type': 'Organization', name: 'RustyBrick', url: 'https://www.rustybrick.com/' } ],
      description: 'Barry Schwartz is a search industry reporter and publisher, known for timely, transparent coverage of search changes and community insights.',
    });
    injectJSONLD('barry-schwartz-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: barrySchwartzFaqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });

    const onScroll = () => {
      const progressBar = document.querySelector('.barry-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#barry-content') as HTMLElement | null;
      if (!progressBar || !content) return;
      const rect = content.getBoundingClientRect();
      const totalHeight = Math.max(content.scrollHeight - window.innerHeight, 1);
      const distance = Math.min(Math.max(-rect.top, 0), totalHeight);
      const progress = Math.min(100, (distance / totalHeight) * 100);
      progressBar.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [canonical]);

  const tocItems = useMemo(() => barrySchwartzSections.map((s) => ({ id: s.id, label: s.title })), []);
  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="barry-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="barry-progress"><div className="barry-progress__bar" aria-hidden="true" /></div>

        <section className="barry-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="barry-hero__badge"><Target className="h-4 w-4" /> Definitive Barry Schwartz Keyword Resource</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Barry Schwartz: The Complete SEO News & Industry Reporting Deep Dive</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Explore the history, methods, and industry role of Barry Schwartz—from Search Engine Roundtable to RustyBrick—crafted to satisfy every intent behind the “Barry Schwartz” search.</p>
            </div>
            <div className="barry-meta-grid">
              <div className="barry-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p><p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p><p className="mt-2 text-sm text-slate-600">Measured across narrative, playbooks, FAQs, and glossary.</p></div>
              <div className="barry-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p><p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p><p className="mt-2 text-sm text-slate-600">Refreshed to reflect current reporting patterns and themes.</p></div>
              <div className="barry-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p><p className="mt-1 text-2xl font-bold text-slate-900">Barry Schwartz</p><p className="mt-2 text-sm text-slate-600">Exact‑match targeting with semantic clusters across SER, RustyBrick, and search coverage.</p></div>
              <div className="barry-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p><p className="mt-1 text-2xl font-bold text-slate-900">Reporter‑First</p><p className="mt-2 text-sm text-slate-600">Operator guidance derived from observed editorial standards.</p></div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group"><a href="https://www.seroundtable.com/" target="_blank" rel="nofollow noopener">Visit Search Engine Roundtable<ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800"><a href="https://www.linkedin.com/in/rustybrick" target="_blank" rel="nofollow noopener">Connect on LinkedIn<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a></Button>
            </div>
          </div>
        </section>

        <section className="barry-section" id="signature-signals">
          <header className="mb-6 flex flex-col gap-2"><h2 className="barry-section__title">Signature Signals & Proof Points</h2><p className="barry-section__summary">What makes Barry Schwartz a durable reference point for practitioners and reporters.</p></header>
          <div className="barry-stats">{barrySchwartzStats.map((s) => (<article key={s.label} className="barry-stat"><p className="barry-stat__label">{s.label}</p><p className="barry-stat__value">{s.value}</p><p className="text-sm text-slate-700">{s.description}</p></article>))}</div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="barry-toc">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul>
              {tocItems.map((item) => (<li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>))}
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><a href="#glossary">Glossary</a></li>
              <li><a href="#cta">Take Action</a></li>
            </ul>
          </aside>

          <article id="barry-content" className="flex flex-col gap-8 pb-12">
            {barrySchwartzSections.map((section) => (
              <section key={section.id} id={section.id} className="barry-section">
                <header className="mb-4"><h2 className="barry-section__title">{section.title}</h2><p className="barry-section__summary">{section.summary}</p></header>
                <div className="barry-section__body">{section.paragraphs.map((p, i) => (<p key={i}>{p}</p>))}</div>
                {section.id === 'timeline' ? (
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3"><LineChart className="h-5 w-5 text-emerald-600" /><h3 className="text-xl font-semibold text-slate-900">Representative Milestones</h3></div>
                    <div className="mt-6 barry-timeline">{barrySchwartzTimeline.map((e) => (<div key={e.year} className="barry-timeline__event"><p className="barry-timeline__year">{e.year}</p><p className="barry-timeline__title">{e.title}</p><p className="barry-timeline__description">{e.description}</p></div>))}</div>
                  </div>
                ) : null}
              </section>
            ))}

            <section id="faq" className="barry-section">
              <header className="mb-4"><h3>Barry Schwartz FAQ</h3><p className="barry-section__summary">Direct, people‑also‑ask‑style answers grounded in public sources and reproducible methods.</p></header>
              <div className="barry-faq">
                <Accordion type="single" collapsible>
                  {barrySchwartzFaqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold text-slate-800">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-slate-700"><p className="leading-relaxed">{faq.answer}</p></AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section id="glossary" className="barry-section">
              <header className="mb-4"><h2 className="barry-section__title">Glossary of Search Reporting Terminology</h2><p className="barry-section__summary">A compact reference to terms frequently used across Barry’s coverage and industry analysis.</p></header>
              <div className="barry-glossary">
                {barrySchwartzGlossary.map((entry) => (
                  <article key={entry.term} className="barry-glossary__item"><h3 className="barry-glossary__term">{entry.term}</h3><p className="text-sm text-slate-700">{entry.definition}</p></article>
                ))}
              </div>
            </section>

            <section id="cta" className="barry-cta text-white">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"><Globe2 className="h-4 w-4" /> Turn News Into Action</span>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">Adopt a Calm, Evidence‑First Update Process</h2>
                <p className="max-w-3xl text-lg text-white/85">Establish monitoring, triage, and communication rituals. Test small, document learning, and align on what matters: users and durable visibility. Credibility compounds.</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white"><a href="https://www.seroundtable.com/" target="_blank" rel="nofollow noopener">Read Latest Coverage<ExternalLink className="ml-2 h-4 w-4" /></a></Button>
                  <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10"><a href="/rank-tracker" rel="noopener">Track Rankings Here<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
                </div>
              </div>
            </section>
          </article>
          <section className="mt-12">
            <BacklinkInfinityCTA
              title="Stay Ahead With Link Building"
              description="Register for Backlink ∞ to apply the latest SEO strategies from Barry Schwartz and Search Engine Roundtable. Access quality backlinks, drive traffic, and stay informed with expert guidance on algorithm updates."
              variant="card"
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
