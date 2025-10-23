import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ExternalLink, Globe2, Target, Link as LinkIcon } from 'lucide-react';
import { cyrusSections, cyrusStats, cyrusTimeline, cyrusFaqs, cyrusGlossary, cyrusSameAs } from '@/data/cyrusShepardContent';
import { cyrusLongSections } from '@/data/cyrusShepardLongContent';
import '@/styles/cyrus-shepard.css';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { interlinkTargets } from '@/data/interlinkTargets';

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

function normalizeText(input: string): string {
  let s = (input ?? '').replace(/[\t\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  // Punctuation spacing
  s = s.replace(/\s+([,;:.!?])/g, '$1');
  s = s.replace(/([,;:!?])(?!\s|$)/g, '$1 ');
  s = s.replace(/\.([^\s\d\W])/g, '. $1');
  // Dashes
  s = s.replace(/\s?--\s?/g, ' — ');
  s = s.replace(/\s+—\s+/g, ' — ');
  // Parentheses spacing
  s = s.replace(/\s*\(\s*/g, ' (').replace(/\s*\)\s*/g, ') ');
  // Pronoun capitalization
  s = s.replace(/\bi\b/g, 'I');
  // Leading capitalization
  if (s.length > 0) {
    s = s.charAt(0).toUpperCase() + s.slice(1);
  }
  // Ensure terminal punctuation
  if (!/[.!?]$/.test(s) && s.length > 0) s += '.';
  // Final collapse + trim
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

const metaTitle = 'Cyrus Shepard: SEO Strategy, Testing & Link Building Playbooks (2025)';
const metaDescription = 'Comprehensive resource on Cyrus Shepard: biography, research-backed SEO approaches, link building playbooks, and measurable experiments for modern search.';

export default function CyrusShepard() {
  const canonical = useMemo(() => {
    try { return `${typeof window !== 'undefined' ? window.location.origin : ''}/cyrusshepard`; } catch { return '/cyrusshepard'; }
  }, []);

  const contentRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');
  const [fontScale, setFontScale] = useState<number>(1);
  const [comfort, setComfort] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');

  const formatted = useMemo(() => {
    return {
      sections: cyrusSections.map(sec => ({
        ...sec,
        title: normalizeText(sec.title).replace(/[.!?]$/, ''),
        summary: normalizeText(sec.summary),
        paragraphs: sec.paragraphs.map(normalizeText),
      })),
      longSections: cyrusLongSections.map(ls => ({
        ...ls,
        title: normalizeText(ls.title).replace(/[.!?]$/, ''),
        paragraphs: ls.paragraphs.map(normalizeText),
      })),
      stats: cyrusStats.map(s => ({ ...s, description: normalizeText(s.description) })),
      timeline: cyrusTimeline.map(t => ({ ...t, description: normalizeText(t.description) })),
      faqs: cyrusFaqs.map(f => ({ ...f, answer: normalizeText(f.answer) })),
      glossary: cyrusGlossary.map(g => ({ ...g, definition: normalizeText(g.definition) })),
    } as const;
  }, []);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    formatted.sections.forEach((section) => { textSegments.push(section.summary); section.paragraphs.forEach(p => textSegments.push(p)); });
    formatted.stats.forEach(s => textSegments.push(s.description));
    formatted.timeline.forEach(e => textSegments.push(e.description));
    formatted.faqs.forEach(f => textSegments.push(f.answer));
    formatted.glossary.forEach(g => textSegments.push(g.definition));
    formatted.longSections.forEach(ls => ls.paragraphs.forEach(p => textSegments.push(p)));
    return textSegments.join(' ').split(/\s+/).filter(Boolean).length;
  }, [formatted]);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);
  const [displayWordCount, setDisplayWordCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const to = combinedWordCount;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOut
      setDisplayWordCount(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [combinedWordCount]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Cyrus Shepard, SEO, Zyppy, link building, content strategy, experiments');
    upsertCanonical(canonical);

    injectJSONLD('cyrus-webpage', { '@context': 'https://schema.org', '@type': 'WebPage', name: metaTitle, url: canonical, description: metaDescription, inLanguage: 'en' });
    injectJSONLD('cyrus-person', { '@context': 'https://schema.org', '@type': 'Person', name: 'Cyrus Shepard', url: 'https://zyppy.com/cyrus/', sameAs: cyrusSameAs, jobTitle: 'SEO Strategist & Researcher', description: 'SEO strategist, speaker, and author of practical experiments and link building frameworks.' });
    injectJSONLD('cyrus-faq', { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: formatted.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });

    // Generate Article schema for each long-form section so search engines can better understand individual assets
    try {
      const articles = formatted.longSections.map((ls) => ({
        '@type': 'Article',
        headline: ls.title,
        author: { '@type': 'Person', name: 'Cyrus Shepard' },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${canonical}#${ls.id}` },
        url: `${canonical}#${ls.id}`,
        description: (ls.paragraphs && ls.paragraphs[0]) ? ls.paragraphs[0].slice(0, 300) : metaDescription,
        inLanguage: 'en',
        publisher: { '@type': 'Organization', name: (typeof window !== 'undefined' ? window.location.hostname : 'example.com') }
      }));

      injectJSONLD('cyrus-articles', { '@context': 'https://schema.org', '@graph': articles });
    } catch (err) {
      // silently fail schema generation if any unexpected data appears
      console.warn('Article schema injection failed', err);
    }

    const onScroll = () => {
      const bar = document.querySelector('.cyrus-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#cyrus-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const totalHeight = Math.max(content.scrollHeight - window.innerHeight, 1);
      const distance = Math.min(Math.max(-rect.top, 0), totalHeight);
      bar.style.width = `${Math.min(100, (distance / totalHeight) * 100)}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [canonical]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sections = Array.from(document.querySelectorAll('#cyrus-content .cyrus-section')) as HTMLElement[];
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        if (entry.isIntersecting && id) setActiveId(id);
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: 0.01 });
    sections.forEach((sec) => sectionObserver.observe(sec));

    const paragraphs = Array.from(document.querySelectorAll('#cyrus-content .reveal')) as HTMLElement[];
    const paraObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.1 });
    paragraphs.forEach((p) => paraObserver.observe(p));

    return () => { sectionObserver.disconnect(); paraObserver.disconnect(); };
  }, []);

  const copyLink = (id: string) => {
    const url = `${canonical}#${id}`;
    try { navigator.clipboard?.writeText(url); } catch {}
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  // Deterministic PRNG for stable link selection
  function hashSeed(seed: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed: string) {
    let s = hashSeed(seed) || 1;
    return () => {
      // xorshift32
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return ((s >>> 0) % 1_000_000) / 1_000_000;
    };
  }
  function pickLinks(seed: string, count: number, excludeUrl?: string) {
    const r = rng(seed);
    const pool = interlinkTargets.filter(t => !excludeUrl || t.url !== excludeUrl);
    const chosen: { url: string; anchor: string }[] = [];
    const used = new Set<string>();
    let attempts = 0;
    while (chosen.length < count && attempts < 200 && pool.length > 0) {
      attempts++;
      const t = pool[Math.floor(r() * pool.length)];
      const key = `${t.url}::${t.anchor}`;
      if (!used.has(key)) {
        used.add(key);
        chosen.push({ url: t.url, anchor: t.anchor });
      }
    }
    return chosen;
  }

  const InterlinkBlock: React.FC<{ seed: string }> = ({ seed }) => null;

  return (
    <div className="cyrus-page min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <div className="cyrus-progress"><div className="cyrus-progress__bar" aria-hidden="true" /></div>

        <section className="cyrus-hero text-slate-900">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="cyrus-hero__badge"><Target className="h-4 w-4" /> Cyrus Shepard Resource</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Cyrus Shepard: Research, Strategy & Link Building Playbooks</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">A comprehensive anthology of Cyrus Shepard’s approaches to SEO, experiments, link acquisition, and durable visibility.</p>
            </div>

            <div className="cyrus-meta-grid">
              <div className="cyrus-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p><p className="mt-1 text-2xl font-bold text-slate-900">{displayWordCount.toLocaleString()}</p><p className="mt-2 text-sm text-slate-600">Intent-driven, research-backed, and link-focused.</p></div>
              <div className="cyrus-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p><p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p><p className="mt-2 text-sm text-slate-600">Refreshed with playbooks and experiments.</p></div>
              <div className="cyrus-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p><p className="mt-1 text-2xl font-bold text-slate-900">Cyrus Shepard</p><p className="mt-2 text-sm text-slate-600">Exact-match targeting with semantic clusters.</p></div>
              <div className="cyrus-meta-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perspective</p><p className="mt-1 text-2xl font-bold text-slate-900">Experiment-First</p><p className="mt-2 text-sm text-slate-600">Testing, measurement, and reproducible outreach.</p></div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group"><a href="https://zyppy.com/cyrus/" target="_blank" rel="nofollow noopener">Visit Source<ExternalLink className="ml-2 h-4 w-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="group border-slate-300 text-slate-800"><a href="/contact" rel="noopener">Contact for Advisory<ArrowRight className="ml-2 h-4 w-4"/></a></Button>
            </div>
          </div>
        </section>

        <section className="cyrus-tools" aria-label="Reading tools"><div className="cyrus-tools__row"><div className="tool"><label htmlFor="font-size" className="text-sm font-medium text-slate-700">Text size</label><input id="font-size" type="range" min="0.9" max="1.15" step="0.01" value={fontScale} onChange={(e) => setFontScale(parseFloat(e.target.value))} /><span className="tool__value">{Math.round(fontScale * 100)}%</span></div><div className="tool"><Label htmlFor="comfort-mode" className="text-sm mr-2">Comfort mode</Label><Switch id="comfort-mode" checked={comfort} onCheckedChange={(v) => setComfort(Boolean(v))} /></div></div></section>

        <section className="cyrus-section" id="signals"><header className="mb-6 flex flex-col gap-2"><h2 className="cyrus-section__title">Signature Signals & Proof Points</h2><p className="cyrus-section__summary">Why Cyrus’s work is referenced across search communities.</p></header>
          <div className="cyrus-stats">{formatted.stats.map(stat => (<article key={stat.label} className="cyrus-stat"><p className="cyrus-stat__label">{stat.label}</p><p className="cyrus-stat__value">{stat.value}</p><p className="text-sm text-slate-700">{stat.description}</p></article>))}</div>
        </section>

        <section className="cyrus-section" id="timeline">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="cyrus-section__title">Timeline</h2>
            <p className="cyrus-section__summary">Milestones that shaped Cyrus Shepard’s research and leadership.</p>
          </header>
          <ol className="grid gap-3 md:gap-4">
            {formatted.timeline.map((e, i) => (
              <li key={`${e.year}-${i}`} className="rounded-md border border-slate-200 bg-white p-3 md:p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">{e.year}</div>
                  <div>
                    <p className="font-semibold text-slate-900">{e.title}</p>
                    <p className="text-sm text-slate-700">{e.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="cyrus-toc"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p><ul><li><a href="#signals" className={activeId==='signals' ? 'active' : ''}>Signature Signals</a></li><li><a href="#timeline" className={activeId==='timeline' ? 'active' : ''}>Timeline</a></li>{formatted.sections.map(s => (<li key={s.id}><a href={`#${s.id}`} className={activeId===s.id ? 'active' : ''}>{s.title}</a></li>))}<li><a href="#faq" className={activeId==='faq' ? 'active' : ''}>Frequently Asked Questions</a></li><li><a href="#glossary" className={activeId==='glossary' ? 'active' : ''}>Glossary</a></li><li><a href="#cta" className={activeId==='cta' ? 'active' : ''}>Take Action</a></li></ul></aside>

          <article id="cyrus-content" ref={contentRef} className={`flex flex-col gap-8 pb-12 ${comfort ? 'comfort-mode' : ''}`} style={{ ['--content-font-scale' as any]: fontScale }}>
            {formatted.sections.map(section => (
              <section key={section.id} id={section.id} className="cyrus-section"><header className="mb-4"><div className="cyrus-section__head"><h2 className="cyrus-section__title">{section.title}</h2></div><p className="cyrus-section__summary">{section.summary}</p></header><div className="cyrus-section__body">{section.paragraphs.map((p, idx) => (
                <React.Fragment key={idx}>
                  <p className="reveal">{p}</p>
                  {(idx % 3 === 2) && <InterlinkBlock seed={`${section.id}-${idx}`} />}
                </React.Fragment>
              ))}</div></section>
            ))}

            {formatted.longSections.map(ls => (
              <section key={ls.id} id={ls.id} className="cyrus-section">
                <header className="mb-4">
                  <div className="cyrus-section__head"><h2 className="cyrus-section__title">{ls.title}</h2></div>
                </header>
                <div className="cyrus-section__body">{ls.paragraphs.map((p, idx) => (
                  <React.Fragment key={idx}>
                    <p className="reveal">{p}</p>
                    {(idx % 4 === 3) && <InterlinkBlock seed={`${ls.id}-${idx}`} />}
                  </React.Fragment>
                ))}</div>
              </section>
            ))}

            <section id="faq" className="cyrus-section"><header className="mb-4"><h2 className="cyrus-section__title">Cyrus Shepard FAQ</h2><p className="cyrus-section__summary">Practical answers for teams and practitioners.</p></header><div className="cyrus-faq"><Accordion type="single" collapsible>{formatted.faqs.map((faq, i) => (<AccordionItem key={faq.question} value={`faq-${i}`}><AccordionTrigger className="text-left text-base font-semibold text-slate-800">{faq.question}</AccordionTrigger><AccordionContent className="text-slate-700"><p className="leading-relaxed">{faq.answer}</p></AccordionContent></AccordionItem>))}</Accordion></div></section>

            <section id="glossary" className="cyrus-section"><header className="mb-4"><h2 className="cyrus-section__title">Glossary</h2><p className="cyrus-section__summary">Key terms and their meaning in modern SEO.</p></header><div className="cyrus-glossary"><div className="cyrus-glossary__tools"><input type="search" value={glossaryQuery} onChange={(e)=>setGlossaryQuery(e.target.value)} placeholder="Search glossary…" aria-label="Search glossary" /></div>{formatted.glossary.filter(entry => entry.term.toLowerCase().includes(glossaryQuery.toLowerCase()) || entry.definition.toLowerCase().includes(glossaryQuery.toLowerCase())).map(entry => (<article key={entry.term} className="cyrus-glossary__item"><h3 className="cyrus-glossary__term">{entry.term}</h3><p className="text-sm text-slate-700">{entry.definition}</p></article>))}</div></section>

            <section id="cta" className="cyrus-cta text-white"><div className="relative z-10 flex flex-col gap-4"><span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"><Globe2 className="h-4 w-4"/> Put Research Into Motion</span><h2 className="text-3xl font-black tracking-tight md:text-4xl">Operationalize Experiments and Build Durable Visibility</h2><p className="max-w-3xl text-lg text-white/85">Start with controlled snippet experiments, prioritize high-impact pages, and pair link acquisition with data-rich assets.</p><div className="flex flex-wrap gap-3 pt-2"><Button asChild size="lg" variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-900 hover:bg-white"><a href="/contact" rel="noopener">Contact for Advisory<ExternalLink className="ml-2 h-4 w-4"/></a></Button><Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10"><a href="/blog" rel="noopener">Explore SEO Research<ArrowRight className="ml-2 h-4 w-4"/></a></Button></div></div></section>
          </article>
        </div>
        <section className="mt-12">
          <BacklinkInfinityCTA
            title="Test & Refine Your Link Strategy"
            description="Register for Backlink ∞ to apply Cyrus Shepard's testing and iterative link-building frameworks. Access quality backlinks and expert guidance to optimize your SEO performance."
            variant="card"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
