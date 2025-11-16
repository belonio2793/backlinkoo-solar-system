import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Shield, Target, Layers } from 'lucide-react';
import {
  abHero,
  abSections,
  abStats,
  abGlossary,
} from '@/data/authorityBuildersContent';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[property="${property}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

const metaTitle = 'Authority Builders: 2025 Marketplace Review, Links, Pricing, and Strategy';
const metaDescription =
  'Independent deep dive on Authority Builders: marketplace model, link quality, pricing, anchor strategy, measurement, risk controls, and how to maximize SEO outcomes.';
const heroImage = 'https://images.pexels.com/photos/6476252/pexels-photo-6476252.jpeg';
const metaKeywords = 'Authority Builders, AuthorityBuilders, Authority Builders review, link building marketplace, guest posts, link insertions, backlinks, SEO';

export default function AuthorityBuilders() {
  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/authoritybuilders`;
    } catch {
      return '/authoritybuilders';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const pool: string[] = [];
    abSections.forEach((s) => {
      pool.push(s.description);
      s.paragraphs.forEach((p) => pool.push(p));
    });
    const words = pool.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
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

    injectJSONLD('ab-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US',
    });

    injectJSONLD('ab-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Authority Builders', item: canonical },
      ],
    });

    injectJSONLD('ab-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: abSections
        .filter((s) => s.id === 'faq')
        .flatMap((s) =>
          s.paragraphs.map((q, i) => ({
            '@type': 'Question',
            name: q.split('?')[0] + '?',
            acceptedAnswer: { '@type': 'Answer', text: q },
          }))
        ),
    });
  }, [canonical]);

  return (
    <div className="ab-page">
      <Header minimal />
      <main>
        <section className="ab-hero">
          <div className="ab-hero__container">
            <p className="ab-hero__kicker">Independent Editorial Analysis</p>
            <h1 className="ab-hero__title">{abHero.title}</h1>
            <p className="ab-hero__subtitle">{abHero.subtitle}</p>
            <div className="ab-hero__metrics">
              <div className="ab-hero__metric">
                <h3>Estimated Words</h3>
                <span>{combinedWordCount.toLocaleString()}</span>
                <p className="mt-3 text-sm text-slate-600">Long‑form content designed to satisfy broad search intent.</p>
              </div>
              {abHero.metrics.map((m) => (
                <div key={m.label} className="ab-hero__metric">
                  <h3>{m.label}</h3>
                  <span>{m.value}</span>
                  <p className="mt-3 text-sm text-slate-600">{m.note}</p>
                </div>
              ))}
            </div>
            <div className="ab-hero__actions">
              <Button asChild className="bg-[#111827] hover:bg-[#0b1220] text-white font-semibold px-6 py-3 rounded-xl">
                <a href="https://authority.builders/" target="_blank" rel="nofollow noopener">
                  Visit Authority Builders <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-slate-800 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold px-6 py-3 rounded-xl">
                <a href="/contact">Talk to Backlink ∞</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="ab-content">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8" id="ab-review-content">
            <aside className="ab-toc">
              <p className="ab-toc__title">On this page</p>
              <ul>
                {abSections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
                <li>
                  <a href="#glossary">Glossary</a>
                </li>
                <li>
                  <a href="#cta">Take Action</a>
                </li>
              </ul>
            </aside>

            <div>
              <div className="ab-stats">
                {abStats.map((s) => (
                  <article key={s.label} className="ab-stat">
                    <p className="ab-stat__label">{s.label}</p>
                    <p className="ab-stat__value">{s.value}</p>
                    <p className="ab-stat__desc">{s.description}</p>
                  </article>
                ))}
              </div>

              <figure className="ab-media" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
                <img src={heroImage} alt="Marketers evaluating Authority Builders marketplace inventory" loading="lazy" />
                <figcaption>Editorial illustration representing a team mapping Authority Builders placements to topic clusters and anchors.</figcaption>
                <meta itemProp="name" content="Authority Builders marketplace analysis" />
                <meta itemProp="description" content="Visual representation of evaluating publisher inventory and contextual link quality." />
                <meta itemProp="contentUrl" content={heroImage} />
              </figure>

              {abSections.map((section) => (
                <section key={section.id} id={section.id} className="ab-section" aria-labelledby={`${section.id}-title`}>
                  <div className="ab-section__header">
                    <span className="ab-section__eyebrow">{section.eyebrow}</span>
                    <h2 className="ab-section__title" id={`${section.id}-title`}>
                      {section.title}
                    </h2>
                    <p className="ab-section__description">{section.description}</p>
                  </div>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    {section.paragraphs.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section id="glossary" className="ab-section" aria-labelledby="glossary-title">
                <div className="ab-section__header">
                  <span className="ab-section__eyebrow">Definitions</span>
                  <h2 className="ab-section__title" id="glossary-title">
                    Glossary of Authority Builders Terminology
                  </h2>
                  <p className="ab-section__description">Key terms used throughout this guide to align teams on vocabulary and execution.</p>
                </div>
                <div className="ab-glossary">
                  {abGlossary.map((entry) => (
                    <article key={entry.term} className="ab-glossary__item">
                      <h3 className="ab-glossary__term">{entry.term}</h3>
                      <p className="text-sm text-slate-700">{entry.definition}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="cta" className="ab-cta">
                <div className="relative z-10 flex flex-col gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                    <Shield className="h-4 w-4" /> Execute With Confidence
                  </span>
                  <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                    Plan Your Next 12 Weeks of Authority Builders Placements
                  </h2>
                  <p className="max-w-3xl text-lg text-white/85">
                    Use the workflow, anchor guardrails, and measurement framework from this page to deploy a safe, compounding link strategy. When you need bespoke outreach or digital PR, pair marketplace links with targeted campaigns.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white">
                      <a href="https://authority.builders/" target="_blank" rel="nofollow noopener">
                        Open the Marketplace <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                      <a href="/contact">
                        Get a Backlink ∞ Strategy Session <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="ab-cta__icons" aria-hidden="true">
                  <Target className="ab-cta__icon" />
                  <Layers className="ab-cta__icon" />
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
