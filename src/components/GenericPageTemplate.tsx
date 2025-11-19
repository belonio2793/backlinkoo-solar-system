import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import '@/styles/generic-page.css';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface GenericPageProps {
  title: string;
  subtitle: string;
  htmlContent: string;
  keywords?: string;
  description?: string;
  schemaMarkup?: any;
}

export const GenericPageTemplate: React.FC<GenericPageProps> = ({
  title,
  subtitle,
  htmlContent,
  keywords = '',
  description = subtitle,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState<string>('');

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.pathname : '';
      return `${typeof window !== 'undefined' ? window.location.origin : ''}${base}`;
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    // Parse HTML content to extract sections
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    
    const extractedSections: Section[] = [];
    let currentSection: Section | null = null;
    let contentBuffer: string[] = [];

    // Helper to flush current section
    const flushSection = () => {
      if (currentSection && contentBuffer.length > 0) {
        currentSection.content = contentBuffer.join('\n');
        extractedSections.push(currentSection);
        contentBuffer = [];
      }
    };

    // Get all elements in order
    let currentNode = doc.body.firstChild;
    const sections: Array<{ type: 'heading' | 'content'; level?: number; text?: string; node?: Node }> = [];

    while (currentNode) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const el = currentNode as Element;
        if (el.tagName === 'H2' || el.tagName === 'H3') {
          sections.push({
            type: 'heading',
            level: parseInt(el.tagName[1]),
            text: el.textContent || '',
            node: currentNode,
          });
        } else {
          sections.push({ type: 'content', node: currentNode });
        }
      }
      currentNode = currentNode.nextSibling;
    }

    // Process sections
    let sectionIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      if (section.type === 'heading') {
        flushSection();
        const id = `section-${sectionIndex++}`;
        currentSection = {
          id,
          title: section.text || '',
          content: '',
        };
      } else if (currentSection && section.node) {
        const el = section.node as Element;
        contentBuffer.push(el.outerHTML);
      }
    }
    flushSection();

    setSections(extractedSections);
    if (extractedSections.length > 0) {
      setActive(extractedSections[0].id);
    }
  }, [htmlContent]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.href = canonical;

    const existingScript = document.getElementById('generic-page-jsonld');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'generic-page-jsonld';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        url: canonical,
        author: { '@type': 'Organization', name: 'Backlinkoo' },
      });
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonical]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(section.id);
          });
        },
        { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="generic-page">
        <div className="gp-hero">
          <div className="container">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 text-sm">
                <BookOpen className="h-4 w-4" /> Expert SEO Guide
              </div>
              <h1 className="gp-title">{title}</h1>
              <p className="gp-subtitle">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="container grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 py-10">
          <aside className="hidden lg:block">
            <Card className="sticky top-24 gp-toc">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> On this page
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map((s) => (
                    <div
                      key={s.id}
                      className={`gp-toc-entry ${active === s.id ? 'active' : ''}`}
                    >
                      <a href={`#${s.id}`} className="gp-toc-link font-medium">
                        {s.title}
                      </a>
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Quality Content
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Comprehensive, well-researched guide for modern SEO professionals.</p>
                <p>Backed by industry best practices and expert analysis.</p>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-8">
            {sections.map((section) => (
              <article id={section.id} key={section.id} className="gp-section">
                <h2 className="gp-h2">{section.title}</h2>
                <div
                  className="gp-content prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </article>
            ))}

            <Card>
              <CardContent className="py-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  Comprehensive guide with expert insights and actionable strategies.
                </div>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="outline"
                >
                  Back to top
                </Button>
              </CardContent>
            </Card>

            <section className="mt-12">
              <BacklinkInfinityCTA
                title="Ready to Build Authority With Quality Backlinks?"
                description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
              />
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GenericPageTemplate;
