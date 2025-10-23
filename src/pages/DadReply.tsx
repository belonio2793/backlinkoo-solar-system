import React, { useEffect, useRef, useState } from 'react';
import Seo from "@/components/Seo";
import '@/styles/dadreply.css';
import { DAD_REPLY_HTML } from '@/content/dadReplyArticles';
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

export default function DadReplyPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress();

  useEffect(() => {
    document.title = 'Dad Reply: Email Productivity Tool for One-Click Responses';
    try {
      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Dad Reply: Email Productivity Tool for One-Click Responses',
        description: 'Complete guide to Dad Reply, the Chrome extension that enables one-click email responses, emoji acknowledgments, and email productivity automation for Gmail users.',
        url: typeof window !== 'undefined' ? `${window.location.origin}/dadreply` : '/dadreply',
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
    <div className="dadreply-page">
      <Header />

      <div className="dadreply-progress" aria-hidden="true">
        <div className="dadreply-progress__bar" style={{ width: `${progress.toFixed(2)}%` }} />
      </div>

      <main className="dadreply-main" ref={containerRef}>
        <header className="dadreply-hero-section">
          <div className="dadreply-hero-content">
            <h1>Dad Reply: Revolutionizing Email Communication with One-Click Efficiency</h1>
            <p className="dadreply-hero-subtitle">Discover how Dad Reply transforms email productivity by eliminating typing, reducing email fatigue, and enabling smarter email triage with powerful one-click responses and personalized emoji automation.</p>
          </div>
        </header>

        <section className="dadreply-layout" style={{ marginTop: '2.5rem' }}>
          <aside className="dadreply-toc">
            <div className="dadreply-toc__title">On this page</div>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#email-problem">Email Problem</a></li>
              <li><a href="#core-features">Core Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#features-comparison">Free vs Pro</a></li>
              <li><a href="#use-cases">Use Cases</a></li>
              <li><a href="#implementation">Implementation</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#industry-impact">Industry Impact</a></li>
              <li><a href="#alternatives-comparison">Alternatives</a></li>
              <li><a href="#future-outlook">Future Outlook</a></li>
              <li><a href="#conclusion">Conclusion</a></li>
            </ul>
          </aside>

          <article className="dadreply-article">
            <div className="dadreply-longform" dangerouslySetInnerHTML={{ __html: DAD_REPLY_HTML }} />
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
