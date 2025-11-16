import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Globe2, LineChart, Target, ExternalLink } from 'lucide-react';
import { stanVenturesSections, stanVenturesStats, stanVenturesFaqs } from '@/data/stanVenturesContent';

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

const metaTitle = 'Stan Ventures: Definitive SEO Deep Dive — Link Building, White‑Label SEO, and Managed Programs (2025)';
const metaDescription = 'A comprehensive, long‑form resource targeting the Stan Ventures keyword: services, quality controls, pricing context, workflows, and alternatives—optimized for intent satisfaction.';

export default function StanVentures() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/stanventures`;
    } catch {
      return '/stanventures';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    stanVenturesSections.forEach((section) => {
      textSegments.push(section.summary);
      section.paragraphs.forEach((p) => textSegments.push(p));
    });
    stanVenturesStats.forEach((s) => textSegments.push(s.description));
    stanVenturesFaqs.forEach((f) => textSegments.push(f.answer));
    const words = textSegments.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Stan Ventures, StanVentures, link building, white label SEO, blogger outreach, managed SEO, topical authority, backlink strategy');
    upsertCanonical(canonical);

    injectJSONLD('stan-ventures-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('stan-ventures-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Stan Ventures',
      url: 'https://stanventures.com/',
      sameAs: [
        'https://www.linkedin.com/company/stanventures/',
        'https://twitter.com/stanventures',
        'https://www.facebook.com/stanventures',
      ],
      description: 'SEO services including link building, white‑label SEO, and managed programs.',
    });

    injectJSONLD('stan-ventures-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: stanVenturesFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });

    injectJSONLD('stan-ventures-service', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Link Building and Managed SEO',
      provider: { '@type': 'Organization', name: 'Stan Ventures', url: 'https://stanventures.com/' },
      areaServed: 'Worldwide',
      serviceType: 'SEO, Link Building, White‑Label SEO',
      description: 'Outreach‑led link building, white‑label SEO fulfillment, and managed search programs aligned to topical authority and measurable outcomes.',
    });

    const onScroll = () => {
      const bar = document.querySelector('.stan-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#stan-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const total = Math.max(content.scrollHeight - window.innerHeight, 1);
      const distance = Math.min(Math.max(-rect.top, 0), total);
      const progress = Math.min(100, (distance / total) * 100);
      bar.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [canonical]);

  const tocItems = useMemo(
    () =>
      stanVenturesSections.map((s) => ({ id: s.id, label: s.title })),
    []
  );

  return (
    <div className="stan-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="stan-progress"><div className="stan-progress__bar" aria-hidden="true" /></div>

        <section className="stan-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="stan-hero__badge">
              <Target className="h-4 w-4" /> Keyword: Stan Ventures
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Stan Ventures: A Complete SEO Deep Dive for Buyers and Practitioners
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                Transparent, practitioner‑grade analysis of outreach, white‑label SEO, and managed programs—structured to satisfy every search intent for “Stan Ventures.”
              </p>
            </div>
            <div className="stan-meta-grid">
              <div className="stan-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Continuously expanded long‑form coverage tuned for clarity and intent satisfaction.</p>
              </div>
              <div className="stan-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Living document maintained to reflect current SEO realities and best practices.</p>
              </div>
              <div className="stan-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Stan Ventures</p>
                <p className="mt-2 text-sm text-slate-600">Exact‑match targeting supported by semantically related clusters and FAQs.</p>
              </div>
              <div className="stan-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Outreach & Authority</p>
                <p className="mt-2 text-sm text-slate-600">Link quality, publisher vetting, and on‑site readiness drive durable outcomes.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <a href="https://stanventures.com/" target="_blank" rel="nofollow noopener">
                  Visit StanVentures.com
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800">
                <a href="#workflow">
                  View Recommended Workflow
                  <Globe2 className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="stan-section" id="signals">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="stan-section__title">Signals & Proof Points</h2>
            <p className="stan-section__summary">Context on positioning, engagement models, and quality emphasis.</p>
          </header>
          <div className="stan-stats">
            {stanVenturesStats.map((s) => (
              <article key={s.label} className="stan-stat">
                <p className="stan-stat__label">{s.label}</p>
                <p className="stan-stat__value">{s.value}</p>
                <p className="text-sm text-slate-700">{s.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="stan-toc">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul>
              {tocItems.map((item) => (
                <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>
              ))}
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><a href="#cta">Take Action</a></li>
            </ul>
          </aside>

          <article id="stan-content" className="flex flex-col gap-8 pb-12">
            {stanVenturesSections.map((section) => (
              <section key={section.id} id={section.id} className="stan-section">
                <header className="mb-4">
                  <h2 className="stan-section__title">{section.title}</h2>
                  <p className="stan-section__summary">{section.summary}</p>
                </header>
                <div className="stan-section__body">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="faq" className="stan-section">
              <header className="mb-4">
                <h2 className="stan-section__title">Stan Ventures FAQ</h2>
                <p className="stan-section__summary">Answers aligned with common ‘People also ask’ patterns.</p>
              </header>
              <div className="stan-faq">
                <Accordion type="single" collapsible>
                  {stanVenturesFaqs.map((faq, index) => (
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

            <section id="cta" className="stan-cta text-white">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <LineChart className="h-4 w-4" /> Turn Insight Into Action
                </span>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">Plan Your Next Sprint With Confidence</h2>
                <p className="max-w-3xl text-lg text-white/85">
                  Use the workflow on this page to scope briefs, align anchors, and verify placements. Pair outreach with on‑site improvements to turn traffic into pipeline.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white">
                    <a href="#workflow">Open the Workflow</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                    <a href="https://stanventures.com/contact/" target="_blank" rel="nofollow noopener">Contact Stan Ventures</a>
                  </Button>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
