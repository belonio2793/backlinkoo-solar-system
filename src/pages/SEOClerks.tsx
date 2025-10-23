import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExternalLink, Sparkles, ShieldCheck, BarChart3, Globe2, CheckCircle2, Info, Link as LinkIcon, BookOpen } from 'lucide-react';
import '@/styles/seo-clerks.css';

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

const metaTitle = 'SEOClerks: Definitive 2025 Guide to the SEO Marketplace, Services, Quality Controls, and Buyer Playbooks';
const metaDescription = 'Independent, original 10k-style deep dive into SEOClerks: how the marketplace works, categories, vetting signals, buyer and seller workflows, risks, alternatives, and advanced link-building strategy with professional UI/UX.';

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ');

export default function SEOClerksPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');

  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/seoclerks`;
    } catch {
      return '/seoclerks';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'SEOClerks, SEO clerks, SEO marketplace, backlink marketplace, link building services, guest posts, niche edits, digital PR, SEO freelancers');
    upsertCanonical(canonical);

    injectJSONLD('seoclerks-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('seoclerks-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'SEOClerks: Definitive 2025 Guide',
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
      mainEntityOfPage: canonical,
    });

    injectJSONLD('seoclerks-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is SEOClerks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SEOClerks is a marketplace where freelancers list SEO-related microservices such as backlinks, guest posts, content, and audits. This page explains how to evaluate offers and minimize risk.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it safe to buy links from marketplaces?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Safety depends on editorial quality, relevance, placement context, and diversification. We provide a rigorous checklist, risk controls, and alternatives for sustainable results.',
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
        parts.push(`<section><h2>Overview</h2><p>SEOClerks is a marketplace for SEO services; this guide explains how to evaluate sellers, structure orders, mitigate risk, and integrate marketplace purchases into a sustainable strategy.</p></section>`);
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
      const bar = document.querySelector('.scl-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#scl-content') as HTMLElement | null;
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
      { id: 'how-it-works', label: 'How SEOClerks Works' },
      { id: 'buyer-guide', label: 'Buyer’s Guide' },
      { id: 'seller-guide', label: 'Seller Playbook' },
      { id: 'quality', label: 'Quality Signals' },
      { id: 'risk', label: 'Risk & Compliance' },
      { id: 'link-building', label: 'Link Building Strategy' },
      { id: 'alternatives', label: 'Alternatives' },
      { id: 'case-studies', label: 'Composite Case Studies' },
      { id: 'faq', label: 'FAQ' },
      { id: 'glossary', label: 'Glossary' },
      { id: 'cta', label: 'Get Started' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />

      <div className="scl-progress" aria-hidden="true"><div className="scl-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <section className="scl-hero">
          <div className="scl-hero__wrap">
            <div className="scl-hero__left">
              <Badge variant="secondary" className="scl-badge">Keyword Deep Dive</Badge>
              <h1 className="scl-title">SEOClerks — The Definitive Guide for Smart Buyers and Sellers</h1>
              <p className="scl-subtitle">
                SEOClerks (brand styling: SEOClerks) is a veteran marketplace for SEO and growth services. Buyers can source contextual links, guest posts, content, audits, technical help, and more. This page is an original, research‑driven deep dive that explains how to evaluate sellers, structure orders, mitigate risk, and integrate marketplace purchases into a sustainable search strategy. The North Star is reader value and durable results, not raw link counts.
              </p>
              <p className="scl-subtitle">
                What follows is a comprehensive guide: category analysis, editorial standards, buyer and seller playbooks, anchor and velocity strategy, pricing patterns, governance, legal, and measurement. We also include multi‑month implementation plans, composite case studies, and extensive FAQs and glossary entries for clarity. Use this as your operating manual for responsible marketplace‑assisted SEO.
              </p>
              <div className="scl-hero__meta">
                <span>Updated</span>
                <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
                <span>Words: ~{wordCount.toLocaleString()}</span>
              </div>
              <div className="scl-hero__cta">
                <Button asChild size="lg" className="group">
                  <a href="https://www.seoclerks.com" target="_blank" rel="nofollow noopener">
                    Visit seoclerks.com
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
            <div className="scl-hero__right">
              <div className="scl-proof">
                <div className="scl-proof__item"><Sparkles className="h-4 w-4" /> Editorial‑first philosophy</div>
                <div className="scl-proof__item"><ShieldCheck className="h-4 w-4" /> Risk‑aware recommendations</div>
                <div className="scl-proof__item"><BarChart3 className="h-4 w-4" /> Outcome‑oriented measurement</div>
                <div className="scl-proof__item"><Globe2 className="h-4 w-4" /> Global marketplace perspective</div>
              </div>
            </div>
          </div>
        </section>

        <div className="scl-layout">
          <nav className="scl-toc" aria-label="Table of contents">
            <div className="scl-toc__title">On this page</div>
            <ul>
              {toc.map((t) => (
                <li key={t.id} className={activeId === t.id ? 'active' : ''}><a href={`#${t.id}`}>{t.label}</a></li>
              ))}
            </ul>
          </nav>

          <article id="scl-content" ref={contentRef} className="scl-article" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />

            {error ? (
              <div className="scl-error">{error}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: html || '' }} />
            )}

            <section id="cta" className="scl-cta">
              <div className="scl-cta__inner">
                <div className="scl-cta__title">Make Better SEO Marketplace Decisions</div>
                <div className="scl-cta__grid">
                  <a className="scl-cta__button" href="https://www.seoclerks.com" target="_blank" rel="nofollow noopener">
                    Explore SEOClerks
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <a className="scl-cta__button scl-cta__button--ghost" href="/blog">
                    Learn Sustainable Link Building
                    <LinkIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <p className="scl-cta__note"><Info className="h-4 w-4 mr-1 inline" /> We prioritize reader safety: relevance, editorial standards, and brand protection over raw link volume.</p>
              </div>
            </section>

            <section id="faq" className="scl-section">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger className="text-left">Is SEOClerks suitable for beginners?</AccordionTrigger>
                  <AccordionContent>
                    SEOClerks lists a wide range of services. Beginners should start with educational content, audits, and small pilot engagements while following the quality and risk controls on this page.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger className="text-left">Can I safely buy backlinks?</AccordionTrigger>
                  <AccordionContent>
                    Safety depends on editorial integrity, topical relevance, and context. Favor content‑led placements with real readership, avoid footprints, and diversify anchors and landing pages.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger className="text-left">What alternatives should I consider?</AccordionTrigger>
                  <AccordionContent>
                    Consider digital PR boutiques, editorial outreach agencies, vetted marketplaces, and building in‑house partnerships. Choose based on goals, risk tolerance, and time‑to‑value.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section id="glossary" className="scl-section">
              <h2>Glossary</h2>
              <ul className="scl-glossary">
                <li><strong>Contextual Link:</strong> A link embedded within relevant body copy that adds value for readers.</li>
                <li><strong>Editorial Integrity:</strong> Standards that ensure content benefits readers, not just search engines.</li>
                <li><strong>Placement Velocity:</strong> The rate at which new links are acquired over time; avoid unnatural spikes.</li>
                <li><strong>Anchor Diversity:</strong> A natural mix of branded, topical, and descriptive anchors.</li>
              </ul>
            </section>

            <section aria-label="Proof of standards" className="scl-proofgrid">
              <div className="scl-proofgrid__item"><CheckCircle2 className="h-4 w-4" /> Relevance‑first targeting</div>
              <div className="scl-proofgrid__item"><CheckCircle2 className="h-4 w-4" /> Reader experience over metrics alone</div>
              <div className="scl-proofgrid__item"><CheckCircle2 className="h-4 w-4" /> Clear replacement policies</div>
              <div className="scl-proofgrid__item"><CheckCircle2 className="h-4 w-4" /> Outcome‑linked reporting</div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
