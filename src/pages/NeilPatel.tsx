import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, ExternalLink, Target, Globe2, LineChart } from 'lucide-react';
import {
  neilPatelSections,
  neilPatelStats,
  neilPatelTimeline,
  neilPatelFaqs,
  neilPatelGlossary,
} from '@/data/neilPatelContent';

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

const metaTitle = 'Neil Patel: Definitive 10,000-Word SEO Deep Dive (2025 Edition)';
const metaDescription =
  'An authoritative 10,000-word deep dive into Neil Patel, NP Digital, Ubersuggest, marketing frameworks, case studies, and future outlook—crafted for the "Neil Patel" keyword.';

export default function NeilPatel() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/neilpatel`;
    } catch {
      return '/neilpatel';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    neilPatelSections.forEach((section) => {
      textSegments.push(section.summary);
      section.paragraphs.forEach((paragraph) => textSegments.push(paragraph));
    });
    neilPatelStats.forEach((stat) => textSegments.push(stat.description));
    neilPatelTimeline.forEach((event) => textSegments.push(event.description));
    neilPatelFaqs.forEach((faq) => textSegments.push(faq.answer));
    neilPatelGlossary.forEach((entry) => textSegments.push(entry.definition));
    const words = textSegments
      .join(' ')
      .split(/\s+/)
      .filter(Boolean);
    return words.length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta(
      'keywords',
      'Neil Patel, NP Digital, Neil Patel SEO, Ubersuggest, Neil Patel marketing, Neil Patel agency review, Neil Patel blog, Neil Patel tools'
    );
    upsertCanonical(canonical);

    injectJSONLD('neil-patel-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('neil-patel-person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Neil Patel',
      url: 'https://neilpatel.com/',
      sameAs: [
        'https://www.linkedin.com/in/neilkpatel/',
        'https://twitter.com/neilpatel',
        'https://www.instagram.com/neilpatel/',
        'https://www.youtube.com/user/neilvkpatel',
      ],
      jobTitle: 'Co-founder, NP Digital',
      worksFor: {
        '@type': 'Organization',
        name: 'NP Digital',
        url: 'https://npdigital.com/',
      },
      description:
        'Neil Patel is a marketer, entrepreneur, and co-founder of NP Digital known for educational content, marketing software, and growth frameworks.',
    });

    injectJSONLD('neil-patel-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NP Digital',
      url: 'https://npdigital.com/',
      founder: {
        '@type': 'Person',
        name: 'Neil Patel',
      },
      sameAs: ['https://neilpatel.com/'],
      description: 'NP Digital is a global marketing agency founded by Neil Patel and Mike Kamo, delivering SEO, paid media, content, and analytics services.',
    });

    injectJSONLD('neil-patel-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: neilPatelFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });

    const onScroll = () => {
      const progressBar = document.querySelector('.neil-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#neil-content') as HTMLElement | null;
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
      neilPatelSections.map((section) => ({
        id: section.id,
        label: section.title,
      })),
    []
  );

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="neil-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="neil-progress">
          <div className="neil-progress__bar" aria-hidden="true" />
        </div>

        <section className="neil-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="neil-hero__badge">
              <Target className="h-4 w-4" />
              Definitive Neil Patel Keyword Resource
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Neil Patel: The Complete 10,000-Word SEO Deep Dive
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                Explore the history, methodologies, tools, and future of Neil Patel, NP Digital, and Ubersuggest. This page combines research, frameworks, and
                storytelling to satisfy every intent behind the “Neil Patel” search query.
              </p>
            </div>

            <div className="neil-meta-grid">
              <div className="neil-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Meticulously crafted words optimized for clarity, depth, and intent satisfaction.</p>
              </div>
              <div className="neil-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Continuously refreshed to reflect the latest guidance from Neil Patel and NP Digital.</p>
              </div>
              <div className="neil-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Neil Patel</p>
                <p className="mt-2 text-sm text-slate-600">Exact-match targeting with semantic clusters covering tools, services, and frameworks.</p>
              </div>
              <div className="neil-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Global Perspective</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">6+ Regions</p>
                <p className="mt-2 text-sm text-slate-600">Insights reflecting NP Digital’s international operations and localized marketing wins.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <a href="https://neilpatel.com/" target="_blank" rel="nofollow noopener">
                  Visit NeilPatel.com
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800">
                <a href="https://npdigital.com/" target="_blank" rel="nofollow noopener">
                  Explore NP Digital
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="neil-section" id="signature-signals">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="neil-section__title">Signature Signals & Proof Points</h2>
            <p className="neil-section__summary">
              Awards, adoption metrics, and media recognition that demonstrate why the Neil Patel brand leads global conversations about modern marketing.
            </p>
          </header>
          <div className="neil-stats">
            {neilPatelStats.map((stat) => (
              <article key={stat.label} className="neil-stat">
                <p className="neil-stat__label">{stat.label}</p>
                <p className="neil-stat__value">{stat.value}</p>
                <p className="text-sm text-slate-700">{stat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="neil-toc">
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

          <article id="neil-content" className="flex flex-col gap-8 pb-12">
            {neilPatelSections.map((section) => (
              <section key={section.id} id={section.id} className="neil-section">
                <header className="mb-4">
                  <h2 className="neil-section__title">{section.title}</h2>
                  <p className="neil-section__summary">{section.summary}</p>
                </header>
                <div className="neil-section__body">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {section.id === 'timeline' ? (
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <LineChart className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-xl font-semibold text-slate-900">Neil Patel Milestones</h3>
                    </div>
                    <div className="mt-6 neil-timeline">
                      {neilPatelTimeline.map((event) => (
                        <div key={event.year} className="neil-timeline__event">
                          <p className="neil-timeline__year">{event.year}</p>
                          <p className="neil-timeline__title">{event.title}</p>
                          <p className="neil-timeline__description">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {section.id === 'tools' ? (
                  <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-xl md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
                      <h3 className="text-lg font-semibold text-slate-900">Ubersuggest Starter Workflow</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Launch keyword projects, connect Google Search Console, audit technical issues, cluster opportunities, and export insights ready for stakeholder
                        decks.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
                      <h3 className="text-lg font-semibold text-slate-900">Automation & Alerts Checklist</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Configure anomaly detection, backlink monitoring, and content decay alerts to respond faster than competitors when signals shift.
                      </p>
                    </div>
                  </div>
                ) : null}
              </section>
            ))}

            <section id="faq" className="neil-section">
              <header className="mb-4">
                <h2 className="neil-section__title">Neil Patel FAQ</h2>
                <p className="neil-section__summary">
                  Transparent answers to the most common questions raised in “People also ask” and community conversations about Neil Patel and NP Digital.
                </p>
              </header>
              <div className="neil-faq">
                <Accordion type="single" collapsible>
                  {neilPatelFaqs.map((faq, index) => (
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

            <section id="glossary" className="neil-section">
              <header className="mb-4">
                <h2 className="neil-section__title">Glossary of Neil Patel Terminology</h2>
                <p className="neil-section__summary">
                  Key concepts referenced throughout Neil Patel’s content, tools, and agency workflows so readers can align vocabulary with execution.
                </p>
              </header>
              <div className="neil-glossary">
                {neilPatelGlossary.map((entry) => (
                  <article key={entry.term} className="neil-glossary__item">
                    <h3 className="neil-glossary__term">{entry.term}</h3>
                    <p className="text-sm text-slate-700">{entry.definition}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="cta" className="neil-cta text-white">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <Globe2 className="h-4 w-4" /> Go Beyond Reading
                </span>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                  Partner with NP Digital or Explore the Neil Patel Ecosystem Today
                </h2>
                <p className="max-w-3xl text-lg text-white/85">
                  Whether you are validating your first funnel, scaling to new markets, or orchestrating enterprise transformation, Neil Patel’s frameworks and NP
                  Digital’s execution arm provide the momentum you need. Dive into the official site, enroll in an unlocked course, or schedule a growth workshop.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white">
                    <a href="https://neilpatel.com/blog/" target="_blank" rel="nofollow noopener">
                      Read the Latest Insights
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                    <a href="https://npdigital.com/contact/" target="_blank" rel="nofollow noopener">
                      Schedule an NP Digital Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Ready to Build Your Link Authority?"
                description="Register for Backlink ∞ to access quality backlinks, drive traffic through proven SEO strategies, and apply the frameworks you learned from Neil Patel and NP Digital."
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
