import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, ShieldCheck, BarChart3, Globe2, Info, Link as LinkIcon, BookOpen } from 'lucide-react';
import '@/styles/ignite-visibility.css';

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

const metaTitle = 'Ignite Visibility: Comprehensive 2025 Guide to Services, SEO Strategy, Paid Media, Analytics and Case Studies';
const metaDescription = 'Independent deep dive into Ignite Visibility, their services and the modern performance marketing stack—SEO, paid media, analytics, CRO, and measurement. Original analysis, buyer guidance, playbooks, alternatives, and sustainable link-building strategy.';

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ');

export default function IgniteVisibilityPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');

  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/ignitevisibility`;
    } catch {
      return '/ignitevisibility';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Ignite Visibility, IgniteVisibility, SEO agency, digital marketing agency, link building, paid media, PPC, social media, analytics, CRO');
    upsertCanonical(canonical);

    injectJSONLD('ignite-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('ignite-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Ignite Visibility: In-Depth 2025 Analysis',
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
      mainEntityOfPage: canonical,
    });

    injectJSONLD('ignite-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Ignite Visibility?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ignite Visibility is a full-service digital marketing agency providing SEO, paid media, creative, analytics, and lifecycle marketing. This page offers an original, independent analysis and guide for prospective buyers.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Ignite Visibility offer link-building?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Agencies commonly provide content-led, editorial link acquisition and digital PR. We outline safe playbooks, measurement, and risk controls for sustainable outcomes.',
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
      const bar = document.querySelector('.iv-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#iv-content') as HTMLElement | null;
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
      { id: 'technical-seo', label: 'Technical SEO' },
      { id: 'seo-methodology', label: 'SEO Methodology' },
      { id: 'content-program', label: 'On‑Page Content' },
      { id: 'content-digital-pr', label: 'Content & Digital PR' },
      { id: 'digital-pr', label: 'Digital PR & Links' },
      { id: 'paid-media', label: 'Paid Media' },
      { id: 'analytics', label: 'Analytics & Measurement' },
      { id: 'local-international', label: 'Local & International' },
      { id: 'governance', label: 'Governance' },
      { id: 'templates', label: 'Templates' },
      { id: 'serp-features', label: 'SERP Features & E‑E‑A‑T' },
      { id: 'link-strategy', label: 'Link Strategy' },
      { id: 'checklists', label: 'Checklists' },
      { id: 'case-studies', label: 'Case Studies' },
      { id: 'plans', label: '90/180-Day Plans' },
      { id: 'pricing', label: 'Pricing & Engagement' },
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
    <div className="min-h-screen bg-white">
      <Header />

      <div className="iv-progress" aria-hidden="true"><div className="iv-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <section className="iv-hero">
          <div className="iv-hero__wrap">
            <div className="iv-hero__left">
              <Badge variant="secondary" className="iv-badge">Agency Deep Dive</Badge>
              <h1 className="iv-title">Ignite Visibility — Independent Analysis, Services, and Buyer’s Guide</h1>
              <p className="iv-subtitle">
                An original, comprehensive analysis of Ignite Visibility and the modern performance marketing stack—SEO, content, digital PR, paid media, lifecycle, analytics, and CRO. Learn how to evaluate agency fit, structure engagements, mitigate risk, and measure outcomes.
              </p>
              <p className="iv-subtitle">
                This page prioritizes reader value and durable results over vanity metrics. It includes playbooks, implementation plans, sample briefs, measurement frameworks, and extensive FAQs. Use it as your operating manual for responsible, outcomes‑driven growth.
              </p>
              <div className="iv-hero__meta">
                <span>Updated</span>
                <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
                <span>Words: ~{wordCount.toLocaleString()}</span>
              </div>
              <div className="iv-hero__cta">
                <Button asChild size="lg" className="group">
                  <a href="https://ignitevisibility.com/" target="_blank" rel="nofollow noopener">
                    Visit ignitevisibility.com
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/">
                    Read SEO Guides
                    <BookOpen className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="iv-hero__right">
              <div className="iv-proof">
                <div className="iv-proof__item"><Sparkles className="h-4 w-4" /> Editorial‑first methodology</div>
                <div className="iv-proof__item"><ShieldCheck className="h-4 w-4" /> Risk‑aware recommendations</div>
                <div className="iv-proof__item"><BarChart3 className="h-4 w-4" /> Outcome‑linked measurement</div>
                <div className="iv-proof__item"><Globe2 className="h-4 w-4" /> Full‑funnel perspective</div>
              </div>
            </div>
          </div>
        </section>

        <div className="iv-layout">
          <nav className="iv-toc" aria-label="Table of contents">
            <div className="iv-toc__title">On this page</div>
            <ul>
              {toc.map((t) => (
                <li key={t.id} className={activeId === t.id ? 'active' : ''}><a href={`#${t.id}`}>{t.label}</a></li>
              ))}
            </ul>
          </nav>

          <article id="iv-content" ref={contentRef} className="iv-article" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            {error ? (
              <div className="iv-error">{error}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: html || '' }} />
            )}

            <section id="cta" className="iv-cta">
              <div className="iv-cta__inner">
                <div className="iv-cta__title">Make Better Agency Decisions</div>
                <div className="iv-cta__grid">
                  <a className="iv-cta__button" href="https://ignitevisibility.com/" target="_blank" rel="nofollow noopener">
                    Explore Ignite Visibility
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <a className="iv-cta__button iv-cta__button--ghost" href="/">
                    Learn Sustainable SEO
                    <LinkIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <p className="iv-cta__note"><Info className="h-4 w-4 mr-1 inline" /> We emphasize relevance, editorial standards, and brand safety over raw counts or vanity metrics.</p>
              </div>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
