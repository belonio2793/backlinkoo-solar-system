import React, { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ExternalLink, Globe2, Target, LineChart } from 'lucide-react';
import {
  aleydaSections,
  aleydaStats,
  aleydaTimeline,
  aleydaFaqs,
  aleydaGlossary,
} from '@/data/aleydaSolisContent';
import '@/styles/aleyda-solis.css';
import { aleydaLongSections } from '@/data/aleydaSolisLongContent';

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

const metaTitle = 'Aleyda Solis: Definitive International SEO & AI Search Guide (2025)';
const metaDescription =
  'A practitioner‑grade deep dive into Aleyda Solis: methods, international SEO frameworks, AI search (GEO/AEO/LLMO), link building, resources, and FAQs.';

export default function AleydaSolis() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/aleydasolis`;
    } catch {
      return '/aleydasolis';
    }
  }, []);

  const contentRef = useRef<HTMLElement | null>(null);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    aleydaSections.forEach((section) => {
      textSegments.push(section.summary);
      section.paragraphs.forEach((p) => textSegments.push(p));
    });
    aleydaStats.forEach((s) => textSegments.push(s.description));
    aleydaTimeline.forEach((e) => textSegments.push(e.description));
    aleydaFaqs.forEach((f) => textSegments.push(f.answer));
    aleydaGlossary.forEach((g) => textSegments.push(g.definition));
    aleydaLongSections.forEach((ls) => ls.paragraphs.forEach((p) => textSegments.push(p)));
    const words = textSegments.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  const lastUpdated = useMemo(
    () => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
    []
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta(
      'keywords',
      'Aleyda Solis, International SEO, SEOFOMO, LearningSEO, Crawling Mondays, AI Search, GEO, AEO, LLMO, link building, entity SEO'
    );
    upsertCanonical(canonical);

    injectJSONLD('aleyda-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('aleyda-person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Aleyda Solis',
      url: 'https://www.aleydasolis.com/',
      sameAs: [
        'https://www.linkedin.com/in/aleyda/',
        'https://twitter.com/aleyda',
        'https://www.youtube.com/c/crawlingmondaysbyaleyda',
      ],
      jobTitle: 'International SEO Consultant',
      worksFor: {
        '@type': 'Organization',
        name: 'Orainti',
        url: 'https://www.orainti.com/',
      },
      description:
        'Award‑winning International SEO consultant, author, and speaker. Founder of Orainti, SEOFOMO, LearningSEO.io, and Crawling Mondays.',
    });

    injectJSONLD('aleyda-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Orainti',
      url: 'https://www.orainti.com/',
      founder: {
        '@type': 'Person',
        name: 'Aleyda Solis',
      },
      sameAs: ['https://www.aleydasolis.com/'],
      description:
        'Orainti is a boutique SEO consultancy specializing in international, ecommerce, and SaaS search programs for high‑growth teams.',
    });

    injectJSONLD('aleyda-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: aleydaFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });

    const onScroll = () => {
      const bar = document.querySelector('.aleyda-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#aleyda-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const totalHeight = Math.max(content.scrollHeight - window.innerHeight, 1);
      const distance = Math.min(Math.max(-rect.top, 0), totalHeight);
      const progress = Math.min(100, (distance / totalHeight) * 100);
      bar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [canonical]);

  return (
    <div className="aleyda-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="aleyda-progress"><div className="aleyda-progress__bar" aria-hidden="true" /></div>

        <section className="aleyda-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="aleyda-hero__badge">
              <Target className="h-4 w-4" /> Authoritative Aleyda Solis Resource
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Aleyda Solis: International SEO & AI Search Deep Dive
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                Biography, frameworks, and field‑tested recommendations aligned with the “Aleyda Solis” query—built for operators who want clarity and results.
              </p>
            </div>

            <div className="aleyda-meta-grid">
              <div className="aleyda-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Substantive copy optimized for depth, intent satisfaction, and readability.</p>
              </div>
              <div className="aleyda-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Refreshed periodically to align with evolving search experiences.</p>
              </div>
              <div className="aleyda-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Aleyda Solis</p>
                <p className="mt-2 text-sm text-slate-600">Exact‑match targeting with semantic clusters across SEO, AI search, and links.</p>
              </div>
              <div className="aleyda-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Operator‑First</p>
                <p className="mt-2 text-sm text-slate-600">Designed for teams shipping work weekly—not theory for its own sake.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <a href="https://www.aleydasolis.com/en/" target="_blank" rel="nofollow noopener">
                  Visit AleydaSolis.com
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800">
                <a href="https://learningseo.io/" target="_blank" rel="nofollow noopener">
                  Explore LearningSEO.io
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="aleyda-section" id="signals">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="aleyda-section__title">Signature Signals & Proof Points</h2>
            <p className="aleyda-section__summary">Why Aleyda’s work remains influential for modern SEO and AI search operators.</p>
          </header>
          <div className="aleyda-stats">
            {aleydaStats.map((stat) => (
              <article key={stat.label} className="aleyda-stat">
                <p className="aleyda-stat__label">{stat.label}</p>
                <p className="aleyda-stat__value">{stat.value}</p>
                <p className="text-sm text-slate-700">{stat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="aleyda-toc">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul>
              {aleydaSections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><a href="#glossary">Glossary</a></li>
              <li><a href="#cta">Take Action</a></li>
            </ul>
          </aside>

          <article id="aleyda-content" ref={contentRef} className="flex flex-col gap-8 pb-12">
            {aleydaSections.map((section) => (
              <section key={section.id} id={section.id} className="aleyda-section">
                <header className="mb-4">
                  <h2 className="aleyda-section__title">{section.title}</h2>
                  <p className="aleyda-section__summary">{section.summary}</p>
                </header>
                <div className="aleyda-section__body">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {section.id === 'resources' ? (
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <LineChart className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-xl font-semibold text-slate-900">Representative Education Hubs</h3>
                    </div>
                    <ul className="mt-3 list-inside list-disc text-slate-700">
                      <li><a className="underline decoration-indigo-400 underline-offset-4 hover:text-indigo-600" href="https://hub.seofomo.co/" target="_blank" rel="nofollow noopener">SEOFOMO Newsletter</a> — curated weekly SEO updates, jobs, tools, and trends.</li>
                      <li><a className="underline decoration-indigo-400 underline-offset-4 hover:text-indigo-600" href="https://learningseo.io/" target="_blank" rel="nofollow noopener">LearningSEO.io</a> — structured beginner‑to‑advanced learning roadmap.</li>
                      <li><a className="underline decoration-indigo-400 underline-offset-4 hover:text-indigo-600" href="https://www.youtube.com/c/crawlingmondaysbyaleyda" target="_blank" rel="nofollow noopener">Crawling Mondays</a> — interviews and tutorials for technical and strategic topics.</li>
                    </ul>
                  </div>
                ) : null}
              </section>
            ))}

            {aleydaLongSections.map((ls) => (
              <section key={ls.id} id={ls.id} className="aleyda-section">
                <header className="mb-4">
                  <h2 className="aleyda-section__title">{ls.title}</h2>
                </header>
                <div className="aleyda-section__body">
                  {ls.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="timeline" className="aleyda-section">
              <header className="mb-4">
                <h2 className="aleyda-section__title">Milestones</h2>
                <p className="aleyda-section__summary">Key phases shaping Aleyda’s approach and its impact across the industry.</p>
              </header>
              <div className="mt-2 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                <div className="aleyda-timeline">
                  {aleydaTimeline.map((event) => (
                    <div key={event.year} className="aleyda-timeline__event">
                      <p className="aleyda-timeline__year">{event.year}</p>
                      <p className="aleyda-timeline__title">{event.title}</p>
                      <p className="aleyda-timeline__description">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="faq" className="aleyda-section">
              <header className="mb-4">
                <h2 className="aleyda-section__title">Aleyda Solis FAQ</h2>
                <p className="aleyda-section__summary">Direct answers to common questions for decision‑makers and practitioners.</p>
              </header>
              <div className="aleyda-faq">
                <Accordion type="single" collapsible>
                  {aleydaFaqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold text-slate-800">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-700">
                        <p className="leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section id="glossary" className="aleyda-section">
              <header className="mb-4">
                <h2 className="aleyda-section__title">Glossary</h2>
                <p className="aleyda-section__summary">Key terms used across international SEO and AI search workflows.</p>
              </header>
              <div className="aleyda-glossary">
                {aleydaGlossary.map((entry) => (
                  <article key={entry.term} className="aleyda-glossary__item">
                    <h3 className="aleyda-glossary__term">{entry.term}</h3>
                    <p className="text-sm text-slate-700">{entry.definition}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="cta" className="aleyda-cta text-white">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <Globe2 className="h-4 w-4" /> Put Strategy Into Motion
                </span>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">Operationalize International & AI Search SEO</h2>
                <p className="max-w-3xl text-lg text-white/85">
                  Start with one market, one topic cluster, and one link‑worthy asset. Instrument learning, refresh monthly, and expand. Durable visibility is built—then protected.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white">
                    <a href="https://hub.seofomo.co/" target="_blank" rel="nofollow noopener">
                      Join SEOFOMO
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                    <a href="/rank-tracker" rel="noopener">
                      Track Rankings Here
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </section>
          </article>
        </div>
        <section className="mt-12">
          <BacklinkInfinityCTA
            title="Build International Authority With Backlinks"
            description="Register for Backlink ∞ to execute international SEO and link-building strategies informed by Aleyda Solis. Access quality backlinks, drive global traffic, and build E-E-A-T authority."
            variant="card"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
