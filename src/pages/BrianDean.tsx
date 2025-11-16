import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ExternalLink, Target, Globe2, LineChart } from 'lucide-react';
import {
  brianDeanSections,
  brianDeanStats,
  brianDeanTimeline,
  brianDeanFaqs,
  brianDeanGlossary,
} from '@/data/brianDeanContent';
import '@/styles/brian-dean.css';

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

const metaTitle = 'Brian Dean: Definitive 10,000-Word SEO Deep Dive (2025 Edition)';
const metaDescription =
  'An authoritative resource on Brian Dean and Backlinko: methods, frameworks, link building, case studies, and future‑proof SEO recommendations.';

export default function BrianDean() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/briandean`;
    } catch {
      return '/briandean';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    brianDeanSections.forEach((section) => {
      textSegments.push(section.summary);
      section.paragraphs.forEach((p) => textSegments.push(p));
    });
    brianDeanStats.forEach((s) => textSegments.push(s.description));
    brianDeanTimeline.forEach((e) => textSegments.push(e.description));
    brianDeanFaqs.forEach((f) => textSegments.push(f.answer));
    brianDeanGlossary.forEach((g) => textSegments.push(g.definition));
    const words = textSegments.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta(
      'keywords',
      'Brian Dean, Backlinko, Brian Dean SEO, link building, SEO frameworks, Brian Dean methods, Brian Dean blog, outreach templates'
    );
    upsertCanonical(canonical);

    injectJSONLD('brian-dean-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('brian-dean-person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Brian Dean',
      url: 'https://backlinko.com/',
      sameAs: [
        'https://www.linkedin.com/in/brian-dean-seo/',
        'https://twitter.com/Backlinko',
        'https://www.youtube.com/c/backlinko',
      ],
      jobTitle: 'Founder',
      worksFor: {
        '@type': 'Organization',
        name: 'Backlinko',
        url: 'https://backlinko.com/',
      },
      description:
        'Brian Dean is an SEO educator and founder of Backlinko known for content quality frameworks, link building strategies, and research‑based tutorials.',
    });

    injectJSONLD('brian-dean-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Backlinko',
      url: 'https://backlinko.com/',
      founder: {
        '@type': 'Person',
        name: 'Brian Dean',
      },
      sameAs: ['https://backlinko.com/'],
      description: 'Backlinko publishes in‑depth guides on SEO, link building, and content marketing for practitioners and teams.',
    });

    injectJSONLD('brian-dean-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: brianDeanFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });

    const onScroll = () => {
      const progressBar = document.querySelector('.brian-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#brian-content') as HTMLElement | null;
      if (!progressBar || !content) return;
      const rect = content.getBoundingClientRect();
      const totalHeight = Math.max(content.scrollHeight - window.innerHeight, 1);
      const distance = Math.min(Math.max(-rect.top, 0), totalHeight);
      const progress = Math.min(100, (distance / totalHeight) * 100);
      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [canonical]);

  const tocItems = useMemo(
    () =>
      brianDeanSections.map((section) => ({
        id: section.id,
        label: section.title,
      })),
    []
  );

  const lastUpdated = useMemo(
    () => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
    []
  );

  return (
    <div className="brian-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="brian-progress">
          <div className="brian-progress__bar" aria-hidden="true" />
        </div>

        <section className="brian-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="brian-hero__badge">
              <Target className="h-4 w-4" /> Definitive Brian Dean Keyword Resource
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Brian Dean: The Complete 10,000‑Word SEO Deep Dive
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                Explore the history, ideas, and enduring frameworks behind Brian Dean and Backlinko. This page aligns with the “Brian Dean” query and serves
                operators who want clarity, not clichés.
              </p>
            </div>

            <div className="brian-meta-grid">
              <div className="brian-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Meticulously crafted words optimized for depth and intent satisfaction.</p>
              </div>
              <div className="brian-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Continuously refreshed to reflect best practices and reliable patterns.</p>
              </div>
              <div className="brian-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Brian Dean</p>
                <p className="mt-2 text-sm text-slate-600">Exact‑match targeting with semantic clusters across SEO and link building.</p>
              </div>
              <div className="brian-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Practitioner‑First</p>
                <p className="mt-2 text-sm text-slate-600">Designed for teams shipping work weekly, not theorizing from the sidelines.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <a href="https://backlinko.com/" target="_blank" rel="nofollow noopener">
                  Visit Backlinko
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800">
                <a href="https://backlinko.com/blog" target="_blank" rel="nofollow noopener">
                  Explore the Blog
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="brian-section" id="signature-signals">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="brian-section__title">Signature Signals & Proof Points</h2>
            <p className="brian-section__summary">Why the Brian Dean and Backlinko brand remain influential for modern SEO practitioners.</p>
          </header>
          <div className="brian-stats">
            {brianDeanStats.map((stat) => (
              <article key={stat.label} className="brian-stat">
                <p className="brian-stat__label">{stat.label}</p>
                <p className="brian-stat__value">{stat.value}</p>
                <p className="text-sm text-slate-700">{stat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="brian-toc">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul>
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
              <li>
                <a href="#faq">Frequently Asked Questions</a>
              </li>
              <li>
                <a href="#glossary">Glossary</a>
              </li>
              <li>
                <a href="#cta">Take Action</a>
              </li>
            </ul>
          </aside>

          <article id="brian-content" className="flex flex-col gap-8 pb-12">
            {brianDeanSections.map((section) => (
              <section key={section.id} id={section.id} className="brian-section">
                <header className="mb-4">
                  <h2 className="brian-section__title">{section.title}</h2>
                  <p className="brian-section__summary">{section.summary}</p>
                </header>
                <div className="brian-section__body">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {section.id === 'case-studies' ? (
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <LineChart className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-xl font-semibold text-slate-900">Representative Wins</h3>
                    </div>
                    <p className="mt-3 text-slate-700">
                      These examples illustrate how content quality, clear structure, and selective outreach compound into durable rankings and revenue.
                    </p>
                  </div>
                ) : null}
              </section>
            ))}

            <section id="timeline" className="brian-section">
              <header className="mb-4">
                <h3>Milestones</h3>
                <p className="brian-section__summary">Key phases that shaped the Backlinko approach and its long‑term influence.</p>
              </header>
              <div className="mt-2 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                <div className="brian-timeline">
                  {brianDeanTimeline.map((event) => (
                    <div key={event.year} className="brian-timeline__event">
                      <p className="brian-timeline__year">{event.year}</p>
                      <p className="brian-timeline__title">{event.title}</p>
                      <p className="brian-timeline__description">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="faq" className="brian-section">
              <header className="mb-4">
                <h2 className="brian-section__title">Brian Dean FAQ</h2>
                <p className="brian-section__summary">Direct answers to common questions raised by searchers and practitioners.</p>
              </header>
              <div className="brian-faq">
                <Accordion type="single" collapsible>
                  {brianDeanFaqs.map((faq, index) => (
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

            <section id="glossary" className="brian-section">
              <header className="mb-4">
                <h2 className="brian-section__title">Glossary</h2>
                <p className="brian-section__summary">Key terms used throughout this page and across modern SEO workflows.</p>
              </header>
              <div className="brian-glossary">
                {brianDeanGlossary.map((entry) => (
                  <article key={entry.term} className="brian-glossary__item">
                    <h3 className="brian-glossary__term">{entry.term}</h3>
                    <p className="text-sm text-slate-700">{entry.definition}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="cta" className="brian-cta text-white">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <Globe2 className="h-4 w-4" /> Put Ideas Into Motion
                </span>
                <h3>Execute the Backlinko‑Inspired Playbook</h3>
                <p className="max-w-3xl text-lg text-white/85">
                  Pick one topic cluster, publish one definitive hub, and support it with three spokes. Add a small data asset and invite a handful of relevant sites
                  to reference it. Measure, refresh, and repeat. Small consistent wins become authority.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white">
                    <a href="https://backlinko.com/seo-marketing-hub" target="_blank" rel="nofollow noopener">
                      Browse Educational Hubs
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

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Execute Your Link Building Strategy"
                description="Register for Backlink ∞ to implement the link-building frameworks you've learned from Brian Dean and Backlinko. Access quality backlinks, rank tracking, and expert SEO guidance."
                variant="card"
              />
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
