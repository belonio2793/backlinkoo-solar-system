import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layers, Sparkles, Code2, Zap, Users, Rocket } from 'lucide-react';
import '@/styles/kiboui.css';

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
  let el = document.head.querySelector(`script[data-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('data-jsonld', id);
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

export default function KiboUI() {
  useEffect(() => {
    const title = 'Kibo UI - Free Open-Source Component Library for shadcn/ui | 1000+ Components';
    const description = 'Kibo UI is a comprehensive, free open-source component registry with 1000+ composable, accessible components built on shadcn/ui. Speed up your React development with pre-built blocks, patterns, and UI elements.';
    const keywords = 'kibo ui, component library, shadcn/ui, open source components, react components, ui library, tailwind css, accessible components, free components';

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('keywords', keywords);
    upsertMeta('viewport', 'width=device-width, initial-scale=1.0');
    upsertMeta('theme-color', '#000000');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', 'https://backlinkoo.com/kiboui');
    upsertPropertyMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    upsertCanonical('https://backlinkoo.com/kiboui');

    injectJSONLD('schema-org', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Kibo UI',
      applicationCategory: 'DeveloperApplication',
      description: description,
      url: 'https://www.kibo-ui.com',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        price: '0'
      }
    });
  }, []);

  return (
    <div className="kiboui-page">
      <Header />
      
      {/* Hero Section */}
      <section className="kiboui-hero">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <p className="text-sm font-medium text-slate-600">Free Open-Source Component Library</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight">
              Kibo UI: Build Faster with 1000+ Components
            </h1>
            
            <p className="text-lg md:text-xl text-slate-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              The most comprehensive collection of free, composable, and accessible UI components built on shadcn/ui. Accelerate your React development with pre-built blocks, patterns, and fully customizable components.
            </p>
            
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-slate-900">1000+</div>
                <p className="text-sm text-slate-600 mt-2">Components & Blocks</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <p className="text-sm text-slate-600 mt-2">Free & Open Source</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">3.2K</div>
                <p className="text-sm text-slate-600 mt-2">GitHub Stars</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Kibo UI Section */}
      <section className="kiboui-what py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">What is Kibo UI?</h2>
            
            <div className="space-y-6 mb-12">
              <p className="text-lg text-slate-700 leading-relaxed">
                Kibo UI is a revolutionary component registry designed to extend and complement shadcn/ui with over 1000 free, open-source, fully composable components. Created to address the gap between basic UI primitives and complex production-ready components, Kibo UI empowers developers to build sophisticated interfaces faster without sacrificing customization or accessibility.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                Unlike traditional component libraries that lock you into specific design systems, Kibo UI embraces the shadcn/ui philosophy of composability and developer freedom. Every component is built on industry-standard technologies—React, TypeScript, Tailwind CSS, Radix UI primitives, and Lucide icons—ensuring compatibility and predictability across your projects.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                Whether you're building a simple form, a complex dashboard, or an intricate data visualization interface, Kibo UI provides the building blocks you need. The library covers everything from basic buttons and inputs to advanced components like color pickers, code editors, drag-and-drop zones, QR code generators, image zoom tools, and sophisticated data visualization patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Layers className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">1000+ Components</h3>
                    <p className="text-slate-600">A comprehensive collection covering everything from basic inputs to complex interactive patterns and pre-built blocks ready to copy and use.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Fully Composable</h3>
                    <p className="text-slate-600">Build, customize, and extend every component to match your exact needs. Composability is at the core of Kibo UI's design philosophy.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="kiboui-features py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-slate-900">Comprehensive Component Categories</h2>
            <p className="text-xl text-slate-700 text-center mb-16">Kibo UI organizes thousands of components into intuitive categories, making it easy to find exactly what you need.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Code2 className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">Form Components</h3>
                    <p className="text-slate-600 text-sm">Complete collection of form inputs, selects, checkboxes, radio groups, date pickers, and multi-step form patterns with validation support.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Code2 className="w-8 h-8 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">Code & Text Components</h3>
                    <p className="text-slate-600 text-sm">Syntax-highlighted code blocks, code editors, markdown editors, text areas, and rich text components with copy-to-clipboard functionality.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">Interactive Blocks</h3>
                    <p className="text-slate-600 text-sm">Advanced components including color pickers modeled after Figma, QR code generators, image zoom tools, and drag-and-drop dropzones.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Layers className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">Data Visualization</h3>
                    <p className="text-slate-600 text-sm">Gantt charts, Kanban boards, progress indicators, tables with advanced sorting and filtering, and roadmap viewers.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">Collaboration Patterns</h3>
                    <p className="text-slate-600 text-sm">Collaborative canvas components, real-time interaction patterns, avatar stacks, and user presence indicators.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Rocket className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">Dashboard Blocks</h3>
                    <p className="text-slate-600 text-sm">Pre-built dashboard sections, metrics cards, charts, analytics displays, and complete dashboard layout patterns.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kibo UI Section */}
      <section className="kiboui-why py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-slate-900">Why Choose Kibo UI?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Completely Free and Open Source</h3>
                <p className="text-slate-700 leading-relaxed">
                  Kibo UI is licensed under the MIT license and available on GitHub. No paid tiers, no licensing restrictions, no hidden costs. Use it freely in any project—commercial or personal.
                </p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Built on Battle-Tested Technologies</h3>
                <p className="text-slate-700 leading-relaxed">
                  React, TypeScript, Tailwind CSS, Radix UI, and Lucide icons are the foundation of every component. You get production-ready quality with industry-standard tools.
                </p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Accessibility as a First-Class Citizen</h3>
                <p className="text-slate-700 leading-relaxed">
                  Every component is built with accessibility in mind. ARIA attributes, keyboard navigation, and screen reader support are implemented by default.
                </p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">True Composability Without Restrictions</h3>
                <p className="text-slate-700 leading-relaxed">
                  Unlike other libraries, you own the code. Modify, extend, and customize every component without worrying about versioning or API changes breaking your implementation.
                </p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Accelerates Development Timeline</h3>
                <p className="text-slate-700 leading-relaxed">
                  Skip weeks of UI development. Copy components directly into your project and focus on unique business logic and features that matter most.
                </p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Active Community and Regular Updates</h3>
                <p className="text-slate-700 leading-relaxed">
                  Active community contributions, regular updates with new components, bug fixes, and enhanced features keep Kibo UI modern and relevant.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="kiboui-use-cases py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-slate-900">Perfect for Every Project</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">📊</span>
                  Admin Dashboards
                </h3>
                <p className="text-slate-700">Build comprehensive dashboards, analytics interfaces, and admin panels with pre-built data visualization components and complex UI patterns.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">🛍️</span>
                  E-Commerce Platforms
                </h3>
                <p className="text-slate-700">Create beautiful product galleries, shopping carts, checkout flows, and customer management interfaces with form and interactive components.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">🎨</span>
                  Design Tools & Editors
                </h3>
                <p className="text-slate-700">Leverage components like color pickers, drag-and-drop zones, and advanced editors to build creative applications without reinventing the wheel.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">📱</span>
                  Mobile Apps & PWAs
                </h3>
                <p className="text-slate-700">Build responsive interfaces that work seamlessly across devices with fully accessible, mobile-optimized components.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">🗂️</span>
                  Project Management Tools
                </h3>
                <p className="text-slate-700">Create sophisticated project management interfaces with Kanban boards, Gantt charts, task lists, and collaborative components.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">📚</span>
                  Educational Platforms
                </h3>
                <p className="text-slate-700">Build learning management systems, course platforms, and educational content viewers with code blocks, markdown editors, and interactive components.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="kiboui-cta py-20 md:py-32 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Ready to Build Faster?</h2>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Start using Kibo UI's 1000+ components today. Free, open-source, and built for developers who care about quality and efficiency.
            </p>
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
              Visit Kibo UI Website
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
