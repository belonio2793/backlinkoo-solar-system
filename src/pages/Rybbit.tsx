import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { ExternalLink, Shield, Zap, BarChart3, Lock, Code, Globe, ArrowRight, ChevronDown } from 'lucide-react';
import {
  rybbitHero,
  rybbitStats,
  rybbitSections,
  rybbitGlossary,
} from '@/data/rybbitContent';
import '@/styles/rybbit.css';

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

const metaTitle = 'Rybbit: 2025 Complete Guide to Privacy-First Open-Source Analytics';
const metaDescription =
  'Comprehensive independent review of Rybbit analytics platform: features, pricing, self-hosting, GDPR compliance, and comparison to Google Analytics, PostHog, Mixpanel, and Amplitude.';
const metaKeywords = 'Rybbit, privacy-first analytics, open-source analytics, alternative to Google Analytics, GDPR analytics, cookieless tracking, self-hosted analytics, web analytics';
const heroImage = 'https://images.pexels.com/photos/16129874/pexels-photo-16129874.jpeg';

export default function RybbitPage() {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/rybbit`;
    } catch {
      return '/rybbit';
    }
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

    injectJSONLD('rybbit-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'Website',
        url: 'https://backlinkoo.com',
        name: 'Backlinkoo',
      },
    });

    injectJSONLD('rybbit-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      image: heroImage,
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
      mainEntityOfPage: canonical,
    });

    injectJSONLD('rybbit-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Rybbit', item: canonical },
      ],
    });

    const faqItems = rybbitSections
      .filter((s) => s.id === 'faq')
      .flatMap((s) =>
        s.paragraphs.map((text) => {
          const questionMatch = text.match(/^([^.?!]+[.?!])/);
          const question = questionMatch ? questionMatch[1] : text.substring(0, 100) + '?';
          return {
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text },
          };
        })
      );

    injectJSONLD('rybbit-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems,
    });

    const allText = rybbitSections
      .flatMap((s) => [s.description, ...s.paragraphs])
      .join(' ');
    const words = allText.split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [canonical]);

  const coreFeatures = [
    {
      icon: Zap,
      title: 'Real-Time Analytics',
      description: 'Monitor user activity instantly with live dashboards and zero-delay visibility.',
    },
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Cookieless tracking with GDPR/CCPA compliance built in, no consent forms needed.',
    },
    {
      icon: BarChart3,
      title: 'Session Replay',
      description: 'Watch actual user sessions to understand experience and identify friction points.',
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'Fully transparent, auditable code with community-driven development.',
    },
    {
      icon: Lock,
      title: 'Self-Hosted',
      description: 'Deploy on your infrastructure for complete data control and sovereignty.',
    },
    {
      icon: Globe,
      title: 'Wide Compatibility',
      description: 'Works with React, Vue, Angular, Shopify, WordPress, and 50+ platforms.',
    },
  ];

  return (
    <div className="rybbit-page">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="rybbit-hero">
          <div className="rybbit-hero__container">
            <p className="rybbit-hero__kicker">Privacy-First Analytics Platform</p>
            <h1 className="rybbit-hero__title">{rybbitHero.title}</h1>
            <p className="rybbit-hero__subtitle">{rybbitHero.subtitle}</p>
            <div className="rybbit-hero__metrics">
              {rybbitStats.map((stat, idx) => (
                <div key={idx} className="rybbit-hero__metric">
                  <span className="rybbit-hero__metric-value">{stat.value}</span>
                  <span className="rybbit-hero__metric-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="rybbit-content">
          {/* Features Grid */}
          <section className="rybbit-section" style={{ '--index': 0 } as React.CSSProperties}>
            <h2 className="rybbit-section__title">Core Capabilities That Drive Results</h2>
            <div className="rybbit-features">
              {coreFeatures.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div key={idx} className="rybbit-feature-card">
                    <IconComponent className="w-10 h-10 text-blue-500 mb-3" />
                    <h3 className="rybbit-feature-card__title">{feature.title}</h3>
                    <p className="rybbit-feature-card__description">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Content Sections */}
          {rybbitSections.slice(0, 8).map((section, idx) => (
            <section
              key={section.id}
              className="rybbit-section"
              style={{ '--index': idx + 1 } as React.CSSProperties}
            >
              <h2 className="rybbit-section__title">{section.title}</h2>
              <p className="rybbit-section__description">{section.description}</p>
              <div className="rybbit-section__paragraphs">
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx} className="rybbit-section__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Pricing Section */}
          <section className="rybbit-section">
            <h2 className="rybbit-section__title">Transparent Pricing Structure</h2>
            <div className="rybbit-pricing">
              <div className="rybbit-pricing__grid">
                <div className="rybbit-pricing-tier">
                  <h3 className="rybbit-pricing-tier__name">Free</h3>
                  <div className="rybbit-pricing-tier__price">$0</div>
                  <p className="rybbit-pricing-tier__period">Forever free</p>
                  <ul className="rybbit-pricing-tier__features">
                    <li className="rybbit-pricing-feature">10,000 events/month</li>
                    <li className="rybbit-pricing-feature">1 website</li>
                    <li className="rybbit-pricing-feature">30-day retention</li>
                    <li className="rybbit-pricing-feature">Real-time analytics</li>
                    <li className="rybbit-pricing-feature">No credit card required</li>
                  </ul>
                </div>

                <div className="rybbit-pricing-tier rybbit-pricing-tier--featured">
                  <h3 className="rybbit-pricing-tier__name">Standard</h3>
                  <div className="rybbit-pricing-tier__price">$19</div>
                  <p className="rybbit-pricing-tier__period">Per month</p>
                  <ul className="rybbit-pricing-tier__features">
                    <li className="rybbit-pricing-feature">Unlimited websites</li>
                    <li className="rybbit-pricing-feature">Session replay</li>
                    <li className="rybbit-pricing-feature">Funnels & journeys</li>
                    <li className="rybbit-pricing-feature">1-year retention</li>
                    <li className="rybbit-pricing-feature">Event tracking</li>
                  </ul>
                </div>

                <div className="rybbit-pricing-tier">
                  <h3 className="rybbit-pricing-tier__name">Pro</h3>
                  <div className="rybbit-pricing-tier__price">$39</div>
                  <p className="rybbit-pricing-tier__period">Per month</p>
                  <ul className="rybbit-pricing-tier__features">
                    <li className="rybbit-pricing-feature">Everything in Standard</li>
                    <li className="rybbit-pricing-feature">5+ year retention</li>
                    <li className="rybbit-pricing-feature">Unlimited team members</li>
                    <li className="rybbit-pricing-feature">Priority support</li>
                    <li className="rybbit-pricing-feature">Advanced features</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="rybbit-section">
            <h2 className="rybbit-section__title">How Rybbit Compares to Alternatives</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="rybbit-comparison">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Rybbit</th>
                    <th>Google Analytics</th>
                    <th>PostHog</th>
                    <th>Mixpanel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Privacy-First Design</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                  <tr>
                    <td><strong>Cookieless Tracking</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                  <tr>
                    <td><strong>Open Source</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                  <tr>
                    <td><strong>Self-Hosted Option</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                  <tr>
                    <td><strong>Session Replay</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                  </tr>
                  <tr>
                    <td><strong>Real-Time Analytics</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                  </tr>
                  <tr>
                    <td><strong>GDPR Compliant by Default</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                  <tr>
                    <td><strong>Affordable Pricing</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                  <tr>
                    <td><strong>Free Tier</strong></td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__check">✓</td>
                    <td className="rybbit-comparison__cross">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="rybbit-section">
            <h2 className="rybbit-section__title">Frequently Asked Questions</h2>
            <div className="rybbit-faq">
              {rybbitSections
                .find((s) => s.id === 'faq')
                ?.paragraphs.slice(0, 10)
                .map((faqText, idx) => {
                  const parts = faqText.split(': ');
                  const question = parts[0];
                  const answer = parts.slice(1).join(': ');

                  return (
                    <div
                      key={idx}
                      className={`rybbit-faq-item ${expandedFaqIndex === idx ? 'open' : ''}`}
                    >
                      <div
                        className="rybbit-faq-question"
                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                      >
                        <span>{question}</span>
                        <span className="rybbit-faq-toggle">▼</span>
                      </div>
                      {expandedFaqIndex === idx && (
                        <div className="rybbit-faq-answer">{answer}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Glossary */}
          <section className="rybbit-section">
            <h2 className="rybbit-section__title">Analytics Terminology Glossary</h2>
            <p className="rybbit-section__description">
              Master the language of analytics with our comprehensive glossary of key terms and concepts.
            </p>
            <div className="rybbit-glossary">
              {rybbitGlossary.map((item, idx) => (
                <div key={idx} className="rybbit-glossary-term">
                  <div className="rybbit-glossary-term__word">{item.term}</div>
                  <div className="rybbit-glossary-term__definition">{item.definition}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Word Count Info */}
          <div style={{ textAlign: 'center', margin: '2rem 0', padding: '1.5rem', background: '#edf2f7', borderRadius: '8px', fontSize: '0.9rem', color: '#4a5568' }}>
            <strong>Comprehensive Content:</strong> This guide contains {wordCount.toLocaleString()} words of in-depth analysis, research, and insights about Rybbit analytics platform.
          </div>
        </div>

        {/* CTA Section */}
        <section className="rybbit-cta-section">
          <div className="rybbit-cta-container">
            <h2 className="rybbit-cta-title">Ready to Transform Your Analytics Strategy?</h2>
            <p className="rybbit-cta-description">
              Discover how Rybbit's privacy-first analytics can empower your data decisions while maintaining regulatory compliance. Start free today or explore how combined with high-quality backlinks, you can build unstoppable SEO authority.
            </p>
            <div className="rybbit-cta-button-group">
              <a
                href="https://backlinkoo.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="rybbit-cta-button rybbit-cta-button--primary"
              >
                Register for Backlink ∞ <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Backlink Infinity CTA */}
        <BacklinkInfinityCTA />
      </main>
      <Footer />
    </div>
  );
}
