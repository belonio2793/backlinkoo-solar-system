import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { ExternalLink, Sparkles, ShieldCheck, BarChart3, Globe2, Info, Link as LinkIcon, BookOpen } from 'lucide-react';
import FirstPageComparisons from '@/components/firstpagedigital/FirstPageComparisons';
import SeoRoiCalculator from '@/components/firstpagedigital/SeoRoiCalculator';
import PaidBreakEvenCalculator from '@/components/firstpagedigital/PaidBreakEvenCalculator';
import AnchorMixCalculator from '@/components/firstpagedigital/AnchorMixCalculator';
import VelocityPlanner from '@/components/firstpagedigital/VelocityPlanner';
import ContentBriefGenerator from '@/components/firstpagedigital/ContentBriefGenerator';
import PricingEstimator from '@/components/firstpagedigital/PricingEstimator';
import TestimonialsGrid from '@/components/firstpagedigital/TestimonialsGrid';
import FeatureGrid from '@/components/firstpagedigital/FeatureGrid';
import '@/styles/first-page-digital.css';

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

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
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

const metaTitle = 'First Page Digital: 2025 Independent Guide to Services, SEO Strategy, Paid Media, APAC Market and Case Studies';
const metaDescription = 'Original deep dive on First Page Digital with a comprehensive look at SEO, content, digital PR, paid media, CRO, analytics, Singapore and APAC nuances. Buyer playbooks, templates, governance, and sustainable link-building strategy.';

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ');

export default function FirstPageDigitalPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');

  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/firstpagedigital`;
    } catch {
      return '/firstpagedigital';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'First Page Digital, FirstPageDigital, SEO agency Singapore, APAC SEO, link building, digital PR, PPC, paid media, analytics, CRO');
    upsertCanonical(canonical);

    injectJSONLD('fpd-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('fpd-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'First Page Digital: In-Depth 2025 Analysis',
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
      mainEntityOfPage: canonical,
    });

    injectJSONLD('fpd-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is First Page Digital?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A digital marketing agency operating across SEO, paid media, content, and analytics with a strong APAC and Singapore presence. This page is an original, independent analysis for prospective buyers.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does First Page Digital approach link-building?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Modern agencies emphasize editorial content, digital PR, and partnerships. We outline safe playbooks, governance, and measurement for sustainable outcomes.',
          },
        },
      ],
    });
  }, [canonical]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const parts: string[] = [];
        parts.push(`<section><h2>Overview</h2><p>${metaDescription}</p></section>`);
        const text = parts.join('\n');
        if (!cancelled) setHtml(text);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector('.fpd-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#fpd-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const top = Math.max(0, -rect.top);
      const total = Math.max(1, content.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (top / total) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const headings = Array.from(container.querySelectorAll('h2[id],h3[id]')) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActiveId(top.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [html]);

  const wordCount = useMemo(() => {
    if (!html) return 0;
    return stripHtml(html).split(/\s+/).filter(Boolean).length;
  }, [html]);

  const toc: { id: string; label: string }[] = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'company', label: 'Company' },
      { id: 'services', label: 'Services' },
      { id: 'singapore-market', label: 'Singapore & APAC' },
      { id: 'technical-seo', label: 'Technical SEO' },
      { id: 'content-program', label: 'On‑Page Content' },
      { id: 'digital-pr', label: 'Digital PR & Links' },
      { id: 'paid-media', label: 'Paid Media' },
      { id: 'analytics', label: 'Analytics & Measurement' },
      { id: 'local-international', label: 'Local/International' },
      { id: 'governance', label: 'Governance' },
      { id: 'templates', label: 'Templates' },
      { id: 'serp-features', label: 'SERP & E‑E‑A‑T' },
      { id: 'link-strategy', label: 'Link Strategy' },
      { id: 'checklists', label: 'Checklists' },
      { id: 'comparisons', label: 'Comparisons' },
      { id: 'calculators', label: 'Calculators' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'unique-features', label: 'Unique Features' },
      { id: 'toolbox', label: 'Operator Toolbox' },
      { id: 'case-studies', label: 'Case Studies' },
      { id: 'plans', label: '90/180-Day Plans' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'faq', label: 'FAQ' },
      { id: 'faq-extended', label: 'Extended FAQ' },
      { id: 'glossary', label: 'Glossary' },
      { id: 'glossary-extended', label: 'Extended Glossary' },
      { id: 'resources', label: 'Resources' },
      { id: 'cta', label: 'Get Started' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />

      <div className="fpd-progress" aria-hidden="true"><div className="fpd-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <section className="fpd-hero">
          <div className="fpd-hero__wrap">
            <div className="fpd-hero__left">
              <Badge variant="secondary" className="fpd-badge">Agency Deep Dive</Badge>
              <h1 className="fpd-title">First Page Digital — Independent Analysis, Services, and Buyer’s Guide</h1>
              <p className="fpd-subtitle">
                An original analysis of First Page Digital and the APAC performance marketing stack—SEO, content, digital PR, paid media, lifecycle, analytics, and CRO.
                Learn how to evaluate agency fit, structure engagements, mitigate risk, and measure outcomes.
              </p>
              <p className="fpd-subtitle">
                This page prioritizes reader value and durable results. It includes playbooks, implementation plans, sample briefs, measurement frameworks, and FAQs.
              </p>
              <div className="fpd-hero__meta">
                <span>Updated</span>
                <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
                <span>Words: ~{wordCount.toLocaleString()}</span>
              </div>
              <div className="fpd-hero__cta">
                <Button asChild size="lg" className="group">
                  <a href="https://www.firstpagedigital.sg/" target="_blank" rel="nofollow noopener">
                    Visit firstpagedigital.sg
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/blog">
                    Read SEO Guides
                    <BookOpen className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="fpd-hero__right">
              <div className="fpd-proof">
                <div className="fpd-proof__item"><Sparkles className="h-4 w-4" /> Editorial‑first methodology</div>
                <div className="fpd-proof__item"><ShieldCheck className="h-4 w-4" /> Risk‑aware recommendations</div>
                <div className="fpd-proof__item"><BarChart3 className="h-4 w-4" /> Outcome‑linked measurement</div>
                <div className="fpd-proof__item"><Globe2 className="h-4 w-4" /> APAC‑savvy perspective</div>
              </div>
            </div>
          </div>
        </section>

        <div className="fpd-layout">
          <nav className="fpd-toc" aria-label="Table of contents">
            <div className="fpd-toc__title">On this page</div>
            <ul>
              {toc.map((t) => (
                <li key={t.id} className={activeId === t.id ? 'active' : ''}><a href={`#${t.id}`}>{t.label}</a></li>
              ))}
            </ul>
          </nav>

          <article id="fpd-content" ref={contentRef} className="fpd-article" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            {error ? (
              <div className="fpd-error">{error}</div>
            ) : (
              <div className="fpd-reading" dangerouslySetInnerHTML={{ __html: html || '' }} />
            )}

            <section id="comparisons" className="fpd-section">
              <h2>Comparisons</h2>
              <FirstPageComparisons />
            </section>

            <section id="calculators" className="fpd-section">
              <h2>ROI Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SeoRoiCalculator />
                <PaidBreakEvenCalculator />
              </div>
            </section>

            <section id="toolbox" className="fpd-section">
              <h2>Operator Toolbox</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnchorMixCalculator />
                <VelocityPlanner />
                <ContentBriefGenerator />
                <PricingEstimator />
              </div>
            </section>

            <section id="testimonials" className="fpd-section">
              <h2>Client Testimonials</h2>
              <TestimonialsGrid />
            </section>

            <section id="unique-features" className="fpd-section">
              <h2>Unique Features</h2>
              <FeatureGrid />
            </section>

            <section id="cta" className="fpd-cta">
              <div className="fpd-cta__inner">
                <div className="fpd-cta__title">Make Better Agency Decisions</div>
                <div className="fpd-cta__grid">
                  <a className="fpd-cta__button" href="https://www.firstpagedigital.sg/" target="_blank" rel="nofollow noopener">
                    Explore First Page Digital
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <a className="fpd-cta__button fpd-cta__button--ghost" href="/blog">
                    Learn Sustainable SEO
                    <LinkIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <p className="fpd-cta__note"><Info className="h-4 w-4 mr-1 inline" /> We emphasize relevance, editorial standards, and brand safety over vanity metrics.</p>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
