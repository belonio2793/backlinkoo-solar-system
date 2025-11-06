import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/stellar-seo.css';

// Small helper to safely upsert a tag in <head>
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

const metaTitle = 'Stellar SEO Review: Pricing, Services, Link Building, Pros & Cons (2025)';
const metaDescription =
  'Independent Stellar SEO review covering services, pricing, link building quality, process, case studies, and alternatives. Learn whether Stellar SEO is right for your goals.';

export default function StellarSEO() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/stellar-seo`;
    } catch {
      return '/stellar-seo';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Stellar SEO, Stellar SEO review, Stellar SEO pricing, Stellar SEO services, link building agency, blogger outreach, guest posting, niche edits, white label link building');
    upsertCanonical(canonical);

    // WebPage
    injectJSONLD('stellar-seo-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    // Videos (royalty‑free stock used for educational context)
    injectJSONLD('stellar-seo-video-1', {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'SEO Analytics & Reporting Overview',
      description: 'Short stock video demonstrating analytics visuals relevant to SEO reporting.',
      thumbnailUrl: ['https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg'],
      uploadDate: new Date().toISOString().slice(0, 10),
      contentUrl: 'https://videos.pexels.com/video-files/7054949/7054949-sd_960_540_24fps.mp4',
      embedUrl: 'https://videos.pexels.com/video-files/7054949/7054949-sd_960_540_24fps.mp4'
    });
    injectJSONLD('stellar-seo-video-2', {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Marketing Charts & Collaboration',
      description: 'Stock video illustrating collaboration, charts, and growth planning.',
      thumbnailUrl: ['https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg'],
      uploadDate: new Date().toISOString().slice(0, 10),
      contentUrl: 'https://videos.pexels.com/video-files/7578620/7578620-sd_506_960_25fps.mp4',
      embedUrl: 'https://videos.pexels.com/video-files/7578620/7578620-sd_506_960_25fps.mp4'
    });

    // Review of Organization (no rating to avoid misrepresentation)
    injectJSONLD('stellar-seo-review', {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Organization',
        name: 'Stellar SEO',
        url: 'https://stellarseo.com/',
        sameAs: ['https://stellarseo.com/'],
      },
      reviewBody:
        'An in-depth editorial review of Stellar SEO covering services, pricing, link-building quality, methodology, case studies, ideal fit, risks, and alternatives.',
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
    });

    // Breadcrumbs
    injectJSONLD('stellar-seo-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Stellar SEO Review', item: '/stellar-seo' },
      ],
    });

    // FAQPage
    injectJSONLD('stellar-seo-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What services does Stellar SEO offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Stellar SEO focuses on custom link building and complementary SEO services including blogger outreach, guest posting, niche edits, white-label link building for agencies, consulting, and industry-specific SEO (law, finance, real estate).',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Stellar SEO cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Public pricing commonly highlights two monthly packages (Foundation Builder ~$2,500/mo and Growth Accelerator ~$5,000/mo at time of writing), plus custom plans. Verify current pricing on stellarseo.com.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Stellar SEO a good link-building agency?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'They emphasize high-quality, relevance-first outreach with transparent reporting and case studies showing long-term growth. Success depends on fit, budget, and execution consistency.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are alternatives to Stellar SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Alternatives include agencies like Page One Power, Siege Media, Loganix, FatJoe, and Authority Builders. Evaluate editorial standards, sourcing methods, transparency, and risk controls.',
          },
        },
      ],
    });

    const onScroll = () => {
      const el = document.querySelector('.stellar-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#stellar-content') as HTMLElement | null;
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
  }, [canonical]);

  const t = {
    en: {
      kicker: 'Independent Review',
      title: 'Stellar SEO Review',
      subtitle:
        'A critical, research-driven review of Stellar SEO—services, pricing, process, case studies, risks, and best-fit scenarios for link-building and SEO growth.',
      onThisPage: 'On this page',
      ctas: {
        header: 'Considering Stellar SEO?',
        primary: 'Visit Stellar SEO',
        secondary: 'Try Backlink ∞',
      },
    },
    es: {
      kicker: 'Reseña Independiente',
      title: 'Reseña de Stellar SEO',
      subtitle:
        'Un análisis crítico de Stellar SEO: servicios, precios, proceso, estudios de caso, riesgos y cuándo es la mejor opción.',
      onThisPage: 'En esta página',
      ctas: {
        header: '¿Considerando Stellar SEO?',
        primary: 'Visitar Stellar SEO',
        secondary: 'Probar Backlink ∞',
      },
    },
  } as const;

  const nav = [
    { id: 'intro', label: lang === 'en' ? 'Overview' : 'Introducción' },
    { id: 'media', label: lang === 'en' ? 'Media' : 'Medios' },
    { id: 'pricing', label: lang === 'en' ? 'Pricing' : 'Precios' },
    { id: 'services', label: lang === 'en' ? 'Services' : 'Servicios' },
    { id: 'backlinks', label: lang === 'en' ? 'Backlink Types' : 'Tipos de Backlinks' },
    { id: 'process', label: lang === 'en' ? 'Process' : 'Proceso' },
    { id: 'stories', label: lang === 'en' ? 'Stories' : 'Historias' },
    { id: 'cases', label: lang === 'en' ? 'Case Studies' : 'Casos de Estudio' },
    { id: 'testimonials', label: lang === 'en' ? 'Testimonials' : 'Testimonios' },
    { id: 'fit', label: lang === 'en' ? 'Who It’s For' : 'Para Quién' },
    { id: 'proscons', label: lang === 'en' ? 'Pros & Cons' : 'Ventajas y Desventajas' },
    { id: 'risks', label: lang === 'en' ? 'Risk Playbook' : 'Riesgos' },
    { id: 'checklist', label: lang === 'en' ? 'Editorial Checklist' : 'Lista Editorial' },
    { id: 'comparisons', label: lang === 'en' ? 'Alternatives' : 'Alternativas' },
    { id: 'glossary', label: lang === 'en' ? 'Glossary' : 'Glosario' },
    { id: 'faq', label: 'FAQ' },
    { id: 'ctas', label: lang === 'en' ? 'Get Started' : 'Comenzar' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Reading progress */}
      <div className="stellar-progress">
        <div className="stellar-progress__bar" />
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="stellar-hero" aria-labelledby="page-title">
          <div className="stellar-lang">
            <button
              className={`stellar-lang__btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >EN</button>
            <button
              className={`stellar-lang__btn ${lang === 'es' ? 'active' : ''}`}
              onClick={() => setLang('es')}
              aria-pressed={lang === 'es'}
            >ES</button>
          </div>
          <p className="stellar-kicker">{t[lang].kicker}</p>
          <h1 id="page-title" className="stellar-title">
            {t[lang].title}
          </h1>
          <p className="stellar-subtitle">
            {t[lang].subtitle}
          </p>
          <div className="stellar-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Editorial Team</span>
            <span>Read time: 60+ minutes</span>
          </div>
        </header>

        <div className="stellar-layout">
          <nav className="stellar-toc" aria-label="Table of contents">
            <div className="stellar-toc__title">{t[lang].onThisPage}</div>
            <ul>
              {nav.map((n) => (
                <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>
              ))}
            </ul>
          </nav>

          <article id="stellar-content" className="stellar-article" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            {/* Intro */}
            <section id="intro" className="stellar-section">
              <h2>Stellar SEO Review: Summary</h2>
              <p>
                This independent Stellar SEO review examines the agency’s core focus—custom link building—and related SEO services as presented on{' '}
                <a href="https://stellarseo.com/" target="_blank" rel="nofollow noopener">stellarseo.com</a>. We evaluate the quality and sourcing of
                backlinks, pricing transparency, reporting, process rigor, and long-term outcomes claimed in their case studies. Our goal is to help you decide
                whether Stellar SEO aligns with your budget, timeline, and risk tolerance.
              </p>
              <p>
                If you are seeking <strong>relevant, editorially earned backlinks</strong> and you value <strong>transparent reporting</strong> with a
                long‑term, compounding approach, Stellar SEO positions itself as a fit. If you want low-cost, high-volume links or purely transactional guest
                posts, you should carefully evaluate fit and risks.
              </p>
            </section>

            {/* Media */}
            <section id="media" className="stellar-section">
              <h2>Media Gallery: Videos & Images</h2>
              <p>Explore short videos and visuals illustrating SEO reporting, analytics, and collaboration. All media are royalty‑free stock for educational context.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video overflow-hidden rounded-lg shadow">
                  <video controls preload="metadata" className="w-full h-full object-cover" poster="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg">
                    <source src="https://videos.pexels.com/video-files/7054949/7054949-sd_960_540_24fps.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="aspect-video overflow-hidden rounded-lg shadow">
                  <video controls preload="metadata" className="w-full h-full object-cover" poster="https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg">
                    <source src="https://videos.pexels.com/video-files/7578620/7578620-sd_506_960_25fps.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <img className="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/8060424/pexels-photo-8060424.jpeg" alt="Outreach and collaboration visual" />
                <img className="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg" alt="Analytics dashboard and reporting" />
                <img className="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg" alt="Digital PR and publication context" />
                <img className="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/34086082/pexels-photo-34086082.jpeg" alt="Team strategy session" />
                <img className="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg" alt="SEO reports and growth graphs" />
              </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="stellar-section">
              <h2>Stellar SEO Pricing</h2>
              <p>
                Pricing visibility is a strong signal for agency-market fit. Public references commonly highlight two managed link-building packages, plus
                custom plans depending on scope and competitiveness. Always verify current pricing directly on{' '}
                <a href="https://stellarseo.com/" target="_blank" rel="nofollow noopener">stellarseo.com</a> as offers can change.
              </p>
              <div className="stellar-cards">
                <div className="stellar-card" aria-label="Foundation Builder Pricing">
                  <h3>Foundation Builder — ~$2,500/mo</h3>
                  <ul>
                    <li>8 links per month</li>
                    <li>6 links DR 30+, 2 links DR 40+</li>
                    <li>Do-follow links with 27-point quality check</li>
                    <li>~750+ words of relevant supporting content</li>
                    <li>No sponsored tags (as stated)</li>
                  </ul>
                </div>
                <div className="stellar-card" aria-label="Growth Accelerator Pricing">
                  <h3>Growth Accelerator — ~$5,000/mo</h3>
                  <ul>
                    <li>16 links per month</li>
                    <li>10 links DR 30+, 5 links DR 40+, 1 link DR 50+</li>
                    <li>Do-follow links with 27-point quality check</li>
                    <li>~750+ words of relevant supporting content</li>
                    <li>No sponsored tags (as stated)</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted">
                Note: Domain Rating (DR) is a third‑party metric; relevance and editorial standards typically matter more than DR alone.
              </p>
            </section>

            {/* Services */}
            <section id="services" className="stellar-section">
              <h2>Stellar SEO Services</h2>
              <div className="stellar-grid">
                <div>
                  <h3>Custom Outreach Link Building</h3>
                  <p>
                    Bespoke, goal-driven campaigns to earn links from relevant publications. Expect prospect research, personalized outreach, and content
                    collaboration rather than pure pay‑to‑post placements.
                  </p>
                </div>
                <div>
                  <h3>Blogger Outreach & Guest Posting</h3>
                  <p>
                    Links placed via editorial contributions on vetted sites. Evaluate topical fit, editorial quality, and avoidance of sponsored/paid tags
                    when assessing value.
                  </p>
                </div>
                <div>
                  <h3>Niche Edits (In‑Content Links)</h3>
                  <p>
                    Contextual link placements on existing relevant articles. Effective when sites are vetted for quality and link context truly adds value to
                    readers.
                  </p>
                </div>
                <div>
                  <h3>White‑Label Link Building (Agencies)</h3>
                  <p>
                    Agency partnerships to scale link acquisition under your brand. Vet workflows, QA standards, and reporting rigor for client‑facing needs.
                  </p>
                </div>
                <div>
                  <h3>Consulting & Industry SEO</h3>
                  <p>
                    Advisory and execution in verticals like legal, financial services, real estate, and e‑commerce, often paired with technical SEO, on‑page
                    optimization, and content strategy.
                  </p>
                </div>
                <div>
                  <h3>Technical & On‑Page SEO</h3>
                  <p>
                    Complementary audits and on‑page work to ensure links compound. Expect attention to crawlability, internal linking, and search experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Backlink Types */}
            <section id="backlinks" className="stellar-section">
              <h2>Backlink Types & Editorial Standards</h2>
              <p>Based on publicly available information on <a href="https://stellarseo.com/" target="_blank" rel="nofollow noopener">stellarseo.com</a>, these are the primary backlink approaches emphasized, along with guidance for evaluation.</p>
              <div className="stellar-grid">
                <div>
                  <h3>Custom Outreach Links</h3>
                  <ul>
                    <li>One‑to‑one outreach to relevant publications</li>
                    <li>Editorial alignment, topic fit, and valuable context</li>
                    <li>Pros: highest relevance, stronger long‑term value</li>
                    <li>Cons: slower, requires strong assets and collaboration</li>
                  </ul>
                </div>
                <div>
                  <h3>Blogger Outreach & Guest Posts</h3>
                  <ul>
                    <li>Editorial contributions on vetted sites</li>
                    <li>Avoid sponsored tags; ensure genuine editorial review</li>
                    <li>Pros: scalable and versatile</li>
                    <li>Cons: variable site quality—QA is critical</li>
                  </ul>
                </div>
                <div>
                  <h3>Niche Edits (Contextual)</h3>
                  <ul>
                    <li>Inserted links within existing, relevant articles</li>
                    <li>Ensure the addition improves reader experience</li>
                    <li>Pros: quick wins when context is strong</li>
                    <li>Cons: risk if over‑optimized or poorly placed</li>
                  </ul>
                </div>
                <div>
                  <h3>Resource Pages & Guides</h3>
                  <ul>
                    <li>Links from curated lists and evergreen resources</li>
                    <li>Pros: durable, often informational intent</li>
                    <li>Cons: competitive; requires standout assets</li>
                  </ul>
                </div>
                <div>
                  <h3>Digital PR</h3>
                  <ul>
                    <li>Data‑driven stories pitched to journalists</li>
                    <li>Pros: high authority, brand lift and mentions</li>
                    <li>Cons: hit‑rate variability; needs unique data or angles</li>
                  </ul>
                </div>
                <div>
                  <h3>White‑Label for Agencies</h3>
                  <ul>
                    <li>Client‑facing reporting and consistent QA</li>
                    <li>Pros: scale for multi‑client portfolios</li>
                    <li>Cons: governance and standards must be explicit</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted">Anchor strategy should prioritize branded and partial‑match anchors; avoid exact‑match overuse.</p>
            </section>

            {/* Process */}
            <section id="process" className="stellar-section">
              <h2>Process & Reporting</h2>
              <ol className="stellar-list">
                <li>
                  <strong>Goals → Strategy:</strong> Start with growth targets and map link objectives to revenue, not just DR.
                </li>
                <li>
                  <strong>Data‑Driven Research:</strong> Analyze competitors, identify editorial gaps, and build outreach lists by topical fit.
                </li>
                <li>
                  <strong>Custom Plan:</strong> Calibrate link velocity, anchor strategy, and target page mix (pillars, hubs, money pages).
                </li>
                <li>
                  <strong>Execution:</strong> Earn high‑quality, relevant links via collaborative content and digital PR style outreach.
                </li>
                <li>
                  <strong>Transparent Reporting:</strong> Track placements, context, anchors, and outcomes; adjust with feedback loops.
                </li>
              </ol>
            </section>

            {/* Stories */}
            <section id="stories" className="stellar-section">
              <h2>Angles, Variations, and Real‑World Stories</h2>
              <div className="stellar-grid">
                <div>
                  <h3>Turning Thin Category Pages into Revenue Drivers</h3>
                  <p>Pair category clean‑up with link support to subcategories; add FAQ/HowTo schema; use comparison blocks to reduce pogo‑sticking.</p>
                </div>
                <div>
                  <h3>Local Services Breaking Out of Page‑2 Prison</h3>
                  <p>Refine NAP consistency, add location schema, publish unique city pages, and secure regional news/blog links.</p>
                </div>
                <div>
                  <h3>SaaS Capturing Feature‑Intent Queries</h3>
                  <p>Build feature hubs, interlink support docs, and pitch how‑to editorial to tech publications for contextual placements.</p>
                </div>
                <div>
                  <h3>Marketplace Fixing Crawl Waste</h3>
                  <p>Remove parameter bloat, canonicals for filters, prune dead‑end pages, then direct link equity to money hubs.</p>
                </div>
                <div>
                  <h3>Finance: Trust Through EEAT</h3>
                  <p>Credentialed bylines, citations, and compliance notes; links from finance editors and resource libraries.</p>
                </div>
                <div>
                  <h3>Health: Reviews Flywheel</h3>
                  <p>Location pages + local PR + patient resources; review acquisition cadence boosts map pack visibility.</p>
                </div>
              </div>
            </section>

            {/* Case Studies */}
            <section id="cases" className="stellar-section">
              <h2>Case Studies (Selected)</h2>
              <div className="stellar-cases">
                <div className="stellar-case">
                  <h3>E‑commerce (12 Months)</h3>
                  <ul>
                    <li>Links Built: 217</li>
                    <li>Before Traffic: 18,347 / mo → After: 42,912 / mo</li>
                    <li>Traffic Increase: ~134%</li>
                  </ul>
                  <p>Focus: category/subcategory link support, relevance-first outreach, and content reinforcement.</p>
                </div>
                <div className="stellar-case">
                  <h3>Law Firm (30 Months)</h3>
                  <ul>
                    <li>Links Built: 432</li>
                    <li>Before Traffic: 3,872 / mo → After: 20,659 / mo</li>
                    <li>Traffic Increase: ~434%</li>
                  </ul>
                  <p>Focus: local authority, regional publications, and long‑horizon compounding strategy.</p>
                </div>
                <div className="stellar-case">
                  <h3>Global SaaS (2.5 Years)</h3>
                  <ul>
                    <li>Links Built: 719</li>
                    <li>Before Traffic: 12,482 / mo → After: 74,903 / mo</li>
                    <li>Traffic Increase: ~500%</li>
                  </ul>
                  <p>Focus: tech publications, industry blogs, and blended content + broken link tactics.</p>
                </div>
              </div>
              <p className="text-muted">Source: public case-study summaries on stellarseo.com. Results vary by industry and baseline authority.</p>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="stellar-section">
              <h2>Testimonials & Social Proof Roundup</h2>
              <p>According to public case summaries and external review sites (e.g., Clutch), customers frequently highlight:</p>
              <div className="stellar-grid">
                <div>
                  <ul>
                    <li>Consistent communication and transparency in reporting</li>
                    <li>Relevance of placements and measurable traffic gains</li>
                    <li>Strategic guidance beyond link quantity (anchors, targets, content alignment)</li>
                  </ul>
                </div>
                <div>
                  <ul>
                    <li>Professionalism and reliable timelines</li>
                    <li>White‑label collaboration that withstands client scrutiny</li>
                    <li>Long‑term compounding effects vs. short‑term spikes</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted">For verbatim quotes, see the public reviews and case studies on stellarseo.com and their linked review partners.</p>
            </section>

            {/* Fit */}
            <section id="fit" className="stellar-section">
              <h2>Who Is Stellar SEO Best For?</h2>
              <div className="stellar-grid">
                <div>
                  <h3>Good Fit</h3>
                  <ul>
                    <li>Brands that value relevance and editorial standards over raw link counts</li>
                    <li>Companies with mid‑to‑high budgets and 6–12 month horizons</li>
                    <li>Agencies seeking reliable white‑label link building at editorial quality</li>
                  </ul>
                </div>
                <div>
                  <h3>Less Ideal</h3>
                  <ul>
                    <li>Buyers seeking the lowest cost per link regardless of site quality</li>
                    <li>Short‑term campaigns demanding guaranteed, immediate rankings</li>
                    <li>Teams unwilling to pair link building with content/technical work</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Pros & Cons */}
            <section id="proscons" className="stellar-section">
              <h2>Pros & Cons</h2>
              <div className="stellar-grid">
                <div>
                  <h3>Pros</h3>
                  <ul>
                    <li>Relevance‑first, editorial link placements over purely transactional posts</li>
                    <li>Transparent reporting and long‑term case studies across industries</li>
                    <li>White‑label options for agencies and flexible engagement models</li>
                    <li>Complementary SEO (technical/on‑page) to support link ROI</li>
                  </ul>
                </div>
                <div>
                  <h3>Cons</h3>
                  <ul>
                    <li>Not the cheapest—packages suggest mid‑market budgets</li>
                    <li>Link volume is capped by editorial standards (a good constraint, but slower)</li>
                    <li>Outcomes depend on content/technical alignment and category competitiveness</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Risk Playbook */}
            <section id="risks" className="stellar-section">
              <h2>Risk Playbook & Due Diligence</h2>
              <ol className="stellar-list">
                <li>Request sample placements with traffic estimates and editorial policies.</li>
                <li>Confirm no sponsored/paid tags where do‑follow signals are promised.</li>
                <li>Review anchor distribution; avoid exact‑match saturation.</li>
                <li>Ask about governance for white‑label engagements.</li>
                <li>Ensure content and technical foundations are addressed alongside links.</li>
              </ol>
            </section>

            {/* Editorial Checklist */}
            <section id="checklist" className="stellar-section">
              <h2>Editorial Checklist for High‑Quality Links</h2>
              <ul>
                <li>Is the site relevant to your topic and audience?</li>
                <li>Does the page gain organic traffic and have real readership?</li>
                <li>Is the placement contextually useful and non‑spammy?</li>
                <li>Are there clear editorial standards and contributor guidelines?</li>
                <li>Is the anchor text natural and varied?</li>
              </ul>
            </section>

            {/* Alternatives */}
            <section id="comparisons" className="stellar-section">
              <h2>Alternatives & Comparisons</h2>
              <div className="stellar-table__wrap">
                <table className="stellar-table" aria-label="Stellar SEO alternatives comparison">
                  <thead>
                    <tr>
                      <th>Agency</th>
                      <th>Focus</th>
                      <th>Engagement Style</th>
                      <th>Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Stellar SEO</td>
                      <td>Custom link building, editorial outreach, white‑label</td>
                      <td>Monthly packages + custom</td>
                      <td>Relevance‑first link acquisition and long‑term growth</td>
                    </tr>
                    <tr>
                      <td>Siege Media</td>
                      <td>Content marketing + digital PR</td>
                      <td>Retainers (content + links)</td>
                      <td>Content‑led link earning and brand‑building</td>
                    </tr>
                    <tr>
                      <td>Page One Power</td>
                      <td>Outreach and content‑driven link building</td>
                      <td>Retainers</td>
                      <td>Balanced editorial outreach and on‑site content support</td>
                    </tr>
                    <tr>
                      <td>Authority Builders / FatJoe</td>
                      <td>More transactional placements</td>
                      <td>Pay‑per‑link</td>
                      <td>Budget‑sensitive needs (evaluate quality controls)</td>
                    </tr>
                    <tr>
                      <td>Loganix</td>
                      <td>Local + link packages</td>
                      <td>Packages</td>
                      <td>Local SEO and a la carte needs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted">Always validate editorial standards, sourcing methods, and link context before committing.</p>
            </section>

            {/* Glossary */}
            <section id="glossary" className="stellar-section">
              <h2>Glossary</h2>
              <dl className="stellar-glossary">
                <dt>Digital PR</dt>
                <dd>Using data‑driven stories and expert commentary to earn editorial links from publications.</dd>
                <dt>Niche Edit</dt>
                <dd>Adding a contextual link to an existing, relevant article where it improves reader experience.</dd>
                <dt>White‑Label</dt>
                <dd>Agency service delivered under another brand with client‑ready reporting and QA.</dd>
                <dt>EEAT</dt>
                <dd>Experience, Expertise, Authoritativeness, and Trustworthiness signals in content and brand.</dd>
              </dl>
            </section>

            {/* FAQ */}
            <section id="faq" className="stellar-section">
              <h2>Frequently Asked Questions</h2>
              <h3>Is Stellar SEO safe and compliant?</h3>
              <p>
                The agency emphasizes white‑hat, relevance‑first methods and risk management. As with any provider, review sample placements and ensure anchors
                and context are natural.
              </p>
              <h3>How fast will I see results?</h3>
              <p>
                Most programs require 60–120 days to show visible improvements. Expect compounding gains when links support high‑quality content and a sound
                technical foundation.
              </p>
              <h3>Can they work with regulated industries?</h3>
              <p>
                Yes, public materials reference experience in legal, finance, and other sensitive verticals with appropriate editorial standards.
              </p>
              <h3>Do they provide white‑label services?</h3>
              <p>
                Yes—white‑label link building is a core offering for agencies requiring client‑facing reporting.
              </p>
            </section>
          </article>
        </div>
      </main>

      <section id="ctas" className="stellar-ctas">
        <div className="stellar-ctas__inner">
          <h2 className="stellar-ctas__title">{t[lang].ctas.header}</h2>
          <div className="stellar-ctas__row">
            <a className="stellar-cta" href="https://stellarseo.com/" target="_blank" rel="nofollow noopener">{t[lang].ctas.primary}</a>
            <a className="stellar-cta stellar-cta--ghost" href="/">{t[lang].ctas.secondary}</a>
          </div>
          <p className="text-xs text-muted mt-2">We are not affiliated with Stellar SEO. This is an independent review based on publicly available information.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
