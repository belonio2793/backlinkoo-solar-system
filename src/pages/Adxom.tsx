import React, { useEffect, useRef, useState } from 'react';
import Seo from "@/components/Seo";
import '@/styles/adxom.css';
import { ADXOM_HTML } from '@/content/adxomArticles';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      try {
        const el = document.documentElement;
        const total = Math.max(1, (el.scrollHeight || document.body.scrollHeight) - window.innerHeight);
        const scrolled = Math.min(total, Math.max(0, window.scrollY));
        setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
      } catch {
        setProgress(0);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('resize', onScroll as EventListener);
    };
  }, []);
  return progress;
}

export default function AdxomPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress();

  useEffect(() => {
    document.title = 'Adxom — Comprehensive SEO Analysis & Link Building Strategy';
    try {
      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Adxom — Comprehensive SEO Analysis & Link Building Strategy',
        description: 'A comprehensive, long‑form exploration of adxom, backlinks, and link building strategy.',
        url: typeof window !== 'undefined' ? `${window.location.origin}/adxom` : '/adxom'
      });
      document.head.appendChild(ld);
      return () => { try { ld.remove(); } catch {} };
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="adx-page">
      <Header />

      <div className="adx-progress" aria-hidden="true">
        <div className="adx-progress__bar" style={{ width: `${progress.toFixed(2)}%` }} />
      </div>

      <main className="adx-main" ref={containerRef}>
        <header className="adx-hero">
          <div className="adx-kicker">Curated Deep Dive</div>
          <h1 className="adx-title">Adxom — Comprehensive SEO Analysis & Link Building Strategy</h1>
          <p className="adx-subtitle">Expert, long‑form guide targeting the keyword <span className="adx-highlight-text">“adxom”</span>. We blend research, on‑page optimization, and backlink strategy into an elegant, Medium‑style reading experience.</p>
          <div className="adx-meta">
            <span className="adx-pill">Target: adxom</span>
            <span className="adx-pill">Live TOC • Progress Bar • Media</span>
          </div>
        </header>

        <section className="adx-layout" style={{ marginTop: '2.5rem' }}>
          <aside className="adx-toc">
            <div className="adx-toc__title">On this page</div>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#media">Media</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#backlinks">Backlinks</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#stories">Stories</a></li>
              <li><a href="#cases">Case Studies</a></li>
              <li><a href="#fit">Fit</a></li>
              <li><a href="#proscons">Pros & Cons</a></li>
              <li><a href="#risks">Risks</a></li>
              <li><a href="#checklist">Checklist</a></li>
              <li><a href="#alternatives">Alternatives</a></li>
              <li><a href="#glossary">Glossary</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#ctas">Get Started</a></li>
            </ul>
          </aside>

          <article className="adx-article">
            <div className="adx-longform" dangerouslySetInnerHTML={{ __html: ADXOM_HTML }} />
          </article>
        </section>

        <section className="mt-12">
          <BacklinkInfinityCTA
            title="Ready to Turn Strategy Into Rankings?"
            description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
