import React, { useEffect, useRef, useState } from 'react';
import Seo from "@/components/Seo";
import { ANDROIDIFY_HTML } from '@/content/androidifyArticles';
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

export default function AndroidifyPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress();

  useEffect(() => {
    document.title = 'Androidify: Create Your Personalized AI-Powered Android Bot Avatar';
    try {
      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Androidify: Create Your Personalized AI-Powered Android Bot Avatar',
        description: 'Complete guide to Androidify, Google\'s AI-powered bot creator enabling personalized Android avatars from selfies or text prompts with customization, animation, and sharing.',
        url: typeof window !== 'undefined' ? `${window.location.origin}/androidify` : '/androidify',
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
    <div className="androidify-page">
      <Header />

      <div className="androidify-progress" aria-hidden="true">
        <div className="androidify-progress__bar" style={{ width: `${progress.toFixed(2)}%` }} />
      </div>

      <main className="androidify-main" ref={containerRef}>
        <header className="androidify-hero-section">
          <div className="androidify-hero-content">
            <h1>Androidify: Create Your Personalized AI-Powered Android Bot Avatar</h1>
            <p className="androidify-hero-subtitle">Transform selfies and text prompts into unique, customizable Android bot avatars with advanced Google AI models—no technical skills required. Enter your bot era today.</p>
          </div>
        </header>

        <section className="androidify-layout" style={{ marginTop: '2.5rem' }}>
          <aside className="androidify-toc">
            <div className="androidify-toc__title">On this page</div>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#problem-solution">Problem & Solution</a></li>
              <li><a href="#core-features">Core Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#use-cases">Use Cases</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#technical-details">Technical Details</a></li>
              <li><a href="#customization-depth">Customization</a></li>
              <li><a href="#sharing-social">Sharing & Social</a></li>
              <li><a href="#comparison-alternatives">Comparison</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#future-possibilities">Future Possibilities</a></li>
              <li><a href="#conclusion">Conclusion</a></li>
            </ul>
          </aside>

          <article className="androidify-article">
            <div className="androidify-longform" dangerouslySetInnerHTML={{ __html: ANDROIDIFY_HTML }} />
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
