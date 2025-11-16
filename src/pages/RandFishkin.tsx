import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ExternalLink, Target, Globe2, LineChart } from 'lucide-react';
import {
  randFishkinSections,
  randFishkinStats,
  randFishkinTimeline,
  randFishkinFaqs,
  randFishkinGlossary,
} from '@/data/randFishkinContent';

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

const metaTitle = 'Rand Fishkin: Definitive 10,000‑Word SEO Deep Dive (2025 Edition)';
const metaDescription =
  'An authoritative deep dive into Rand Fishkin—Moz, SparkToro, zero‑click research, audience discovery, and operator‑grade playbooks for ethical growth.';

export default function RandFishkin() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/randfishkin`;
    } catch {
      return '/randfishkin';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const text: string[] = [];
    randFishkinSections.forEach((s) => {
      text.push(s.summary);
      s.paragraphs.forEach((p) => text.push(p));
    });
    randFishkinStats.forEach((s) => text.push(s.description));
    randFishkinTimeline.forEach((t) => text.push(t.description));
    randFishkinFaqs.forEach((f) => text.push(f.answer));
    randFishkinGlossary.forEach((g) => text.push(g.definition));
    return text.join(' ').split(/\s+/).filter(Boolean).length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Rand Fishkin, SparkToro, Moz, Lost and Founder, zero‑click searches, audience research, Whiteboard Friday, SEO, link building');
    upsertCanonical(canonical);

    injectJSONLD('rand-fishkin-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('rand-fishkin-person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Rand Fishkin',
      sameAs: [
        'https://sparktoro.com/people/rand',
        'https://x.com/randfish',
        'https://www.linkedin.com/in/randfishkin/',
        'https://www.goodreads.com/book/show/36204996-lost-and-founder',
      ],
      jobTitle: 'Co‑founder, SparkToro; Co‑founder, Moz',
      worksFor: [
        { '@type': 'Organization', name: 'SparkToro', url: 'https://sparktoro.com/' },
        { '@type': 'Organization', name: 'Moz', url: 'https://moz.com/' },
      ],
      description:
        'Rand Fishkin is an entrepreneur and author whose work at Moz and SparkToro shaped modern SEO education and audience‑first marketing.',
    });

    injectJSONLD('rand-fishkin-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: randFishkinFaqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
    });

    const onScroll = () => {
      const progressBar = document.querySelector('.rand-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#rand-content') as HTMLElement | null;
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

  const tocItems = useMemo(() => randFishkinSections.map((s) => ({ id: s.id, label: s.title })), []);
  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="rand-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="rand-progress">
          <div className="rand-progress__bar" aria-hidden="true" />
        </div>

        <section className="rand-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="rand-hero__badge">
              <Target className="h-4 w-4" /> Definitive Rand Fishkin Keyword Resource
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Rand Fishkin: The Complete SEO and Audience Research Deep Dive
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                Explore the ideas, research, and systems popularized by Rand Fishkin—from Moz and Whiteboard Friday to SparkToro and audience‑first marketing.
                Meticulously structured to satisfy every intent behind the “Rand Fishkin” search.
              </p>
            </div>

            <div className="rand-meta-grid">
              <div className="rand-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Measured words across narrative, playbooks, FAQs, and glossary.</p>
              </div>
              <div className="rand-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Continuously refreshed to reflect evolving SERP and audience trends.</p>
              </div>
              <div className="rand-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Rand Fishkin</p>
                <p className="mt-2 text-sm text-slate-600">Exact‑match targeting with semantic clusters across Moz, SparkToro, and SEO.</p>
              </div>
              <div className="rand-meta-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Audience‑First</p>
                <p className="mt-2 text-sm text-slate-600">Operator‑grade guidance rooted in research, not hacks.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group">
                <a href="https://sparktoro.com/" target="_blank" rel="nofollow noopener">
                  Visit SparkToro
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800">
                <a href="https://x.com/randfish" target="_blank" rel="nofollow noopener">
                  Follow on X
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="rand-section" id="signature-signals">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="rand-section__title">Signature Signals & Proof Points</h2>
            <p className="rand-section__summary">Why the Rand Fishkin brand remains influential across SEO, audience research, and founder circles.</p>
          </header>
          <div className="rand-stats">
            {randFishkinStats.map((stat) => (
              <article key={stat.label} className="rand-stat">
                <p className="rand-stat__label">{stat.label}</p>
                <p className="rand-stat__value">{stat.value}</p>
                <p className="text-sm text-slate-700">{stat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="rand-toc">
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

          <article id="rand-content" className="flex flex-col gap-8 pb-12">
            {randFishkinSections.map((section) => (
              <section key={section.id} id={section.id} className="rand-section">
                <header className="mb-4">
                  <h2 className="rand-section__title">{section.title}</h2>
                  <p className="rand-section__summary">{section.summary}</p>
                </header>
                <div className="rand-section__body">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {section.id === 'timeline' ? (
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <LineChart className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-xl font-semibold text-slate-900">Representative Milestones</h3>
                    </div>
                    <div className="mt-6 rand-timeline">
                      {randFishkinTimeline.map((event) => (
                        <div key={event.year} className="rand-timeline__event">
                          <p className="rand-timeline__year">{event.year}</p>
                          <p className="rand-timeline__title">{event.title}</p>
                          <p className="rand-timeline__description">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ))}

            <section id="faq" className="rand-section">
              <header className="mb-4">
                <h3>Rand Fishkin FAQ</h3>
                <p className="rand-section__summary">Direct, people‑also‑ask‑style answers grounded in public sources and reproducible methods.</p>
              </header>
              <div className="rand-faq">
                <Accordion type="single" collapsible>
                  {randFishkinFaqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold text-slate-800">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-slate-700">
                        <p className="leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section id="glossary" className="rand-section">
              <header className="mb-4">
                <h2 className="rand-section__title">Glossary of Rand Fishkin Terminology</h2>
                <p className="rand-section__summary">A compact reference to terms frequently associated with Rand, Moz, and SparkToro.</p>
              </header>
              <div className="rand-glossary">
                {randFishkinGlossary.map((entry) => (
                  <article key={entry.term} className="rand-glossary__item">
                    <h3 className="rand-glossary__term">{entry.term}</h3>
                    <p className="text-sm text-slate-700">{entry.definition}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="cta" className="rand-cta text-white">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <Globe2 className="h-4 w-4" /> Put Research Into Motion
                </span>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">Run an Audience‑First Experiment This Week</h2>
                <p className="max-w-3xl text-lg text-white/85">
                  Choose one audience, list five sources of influence, and place a single high‑fit content snippet or sponsorship. Measure replies and qualified visits.
                  Then close the loop with email or product onboarding. Small, respectful experiments compound.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white">
                    <a href="https://sparktoro.com/" target="_blank" rel="nofollow noopener">
                      Explore SparkToro
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
                title="Run Your Audience-First Link Strategy"
                description="Register for Backlink ∞ to implement audience-first research methods and link-building strategies inspired by Rand Fishkin and SparkToro. Drive traffic and build authority with data-driven SEO."
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
