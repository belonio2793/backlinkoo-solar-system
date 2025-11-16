import React, { useEffect, useRef, useState } from 'react';
import Seo from "@/components/Seo";
import { BLAI_HTML } from '@/content/blaiArticles';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

export default function BlaiPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress();

  useEffect(() => {
    document.title = 'Blai: AI-Powered Crypto Trading Assistant for Smarter Investments';
    try {
      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Blai: AI-Powered Crypto Trading Assistant',
        description: 'Complete guide to Blai, the AI-powered cryptocurrency trading platform with multi-agent market intelligence, portfolio management, and real-time insights.',
        url: typeof window !== 'undefined' ? `${window.location.origin}/blai` : '/blai',
        publisher: {
          '@type': 'Organization',
          name: 'Backlink Infinity'
        }
      });
      document.head.appendChild(ld);
      return () => { try { ld.remove(); } catch {} };
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="blai-page">
      <Header />

      <div className="blai-progress" aria-hidden="true">
        <div className="blai-progress__bar" style={{ width: `${progress.toFixed(2)}%` }} />
      </div>

      <main className="blai-main" ref={containerRef}>
        <header className="blai-hero-section">
          <div className="blai-hero-content">
            <h1>Blai: The AI-Powered Crypto Trading Assistant Revolutionizing Digital Asset Management</h1>
            <p className="blai-hero-subtitle">Master cryptocurrency markets with intelligent AI-driven portfolio guidance, real-time market intelligence, and personalized trading recommendations designed for modern investors.</p>
          </div>
        </header>

        <section className="blai-layout" style={{ marginTop: '2.5rem' }}>
          <aside className="blai-toc">
            <div className="blai-toc__title">On this page</div>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#market-context">Market Context</a></li>
              <li><a href="#core-features">Core Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#features-detailed">Advanced Features</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#getting-started">Getting Started</a></li>
              <li><a href="#comparison">Comparison</a></li>
              <li><a href="#case-studies">Case Studies</a></li>
              <li><a href="#future-roadmap">Future Roadmap</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#conclusion">Conclusion</a></li>
            </ul>
          </aside>

          <article className="blai-article">
            <div className="blai-longform" dangerouslySetInnerHTML={{ __html: BLAI_HTML }} />
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
