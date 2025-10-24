import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Code2, Palette, Zap, Lock, Layers, GitBranch, Sparkles, CheckCircle, ArrowRight, Users, Rocket, BookOpen, Github } from 'lucide-react';
import '@/styles/kiboui.css';

// Fix text colors: replace light gray (text-gray-300/400) with dark slate (text-slate-600/700) for visibility on white bg
const colorFixes = true;

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
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '3200'
      },
      author: {
        '@type': 'Person',
        name: 'Hayden Bleasel'
      }
    });

    return () => {
      // Cleanup if needed
    };
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
            
            <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed max-w-3xl mx-auto">
              The most comprehensive collection of free, composable, and accessible UI components built on shadcn/ui. Accelerate your React development with pre-built blocks, patterns, and fully customizable components.
            </p>
            

            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-slate-900">1000+</div>
                <p className="text-sm text-slate-500 mt-2">Components & Blocks</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <p className="text-sm text-slate-500 mt-2">Free & Open Source</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">3.2K</div>
                <p className="text-sm text-slate-500 mt-2">GitHub Stars</p>
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
            
            <div className="prose max-w-none mb-12">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Kibo UI is a revolutionary component registry designed to extend and complement shadcn/ui with over 1000 free, open-source, fully composable components. Created to address the gap between basic UI primitives and complex production-ready components, Kibo UI empowers developers to build sophisticated interfaces faster without sacrificing customization or accessibility.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Unlike traditional component libraries that lock you into specific design systems, Kibo UI embraces the shadcn/ui philosophy of composability and developer freedom. Every component is built on industry-standard technologies—React, TypeScript, Tailwind CSS, Radix UI primitives, and Lucide icons—ensuring compatibility and predictability across your projects.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                Whether you're building a simple form, a complex dashboard, or an intricate data visualization interface, Kibo UI provides the building blocks you need. The library covers everything from basic buttons and inputs to advanced components like color pickers, code editors, drag-and-drop zones, QR code generators, image zoom tools, and sophisticated data visualization patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Layers className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">1000+ Components</h3>
                    <p className="text-gray-400">A comprehensive collection covering everything from basic inputs to complex interactive patterns and pre-built blocks ready to copy and use.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-pink-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Fully Composable</h3>
                    <p className="text-gray-400">Build, customize, and extend every component to match your exact needs. Composability is at the core of Kibo UI's design philosophy.</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Comprehensive Component Categories</h2>
            <p className="text-xl text-gray-400 text-center mb-16">Kibo UI organizes thousands of components into intuitive categories, making it easy to find exactly what you need.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: Palette,
                  title: 'Form Components',
                  description: 'Complete collection of form inputs, selects, checkboxes, radio groups, date pickers, and multi-step form patterns with validation support.'
                },
                {
                  icon: Code2,
                  title: 'Code & Text Components',
                  description: 'Syntax-highlighted code blocks, code editors, markdown editors, text areas, and rich text components with copy-to-clipboard functionality.'
                },
                {
                  icon: Zap,
                  title: 'Interactive Blocks',
                  description: 'Advanced components including color pickers modeled after Figma, QR code generators, image zoom tools, and drag-and-drop dropzones.'
                },
                {
                  icon: Layers,
                  title: 'Data Visualization',
                  description: 'Gantt charts, Kanban boards, progress indicators, tables with advanced sorting and filtering, and roadmap viewers.'
                },
                {
                  icon: Users,
                  title: 'Collaboration Patterns',
                  description: 'Collaborative canvas components, real-time interaction patterns, avatar stacks, and user presence indicators.'
                },
                {
                  icon: Rocket,
                  title: 'Dashboard Blocks',
                  description: 'Pre-built dashboard sections, metrics cards, charts, analytics displays, and complete dashboard layout patterns.'
                }
              ].map((feature, idx) => (
                <Card key={idx} className="bg-white border border-slate-200 p-6">
                  <div className="flex items-start gap-4">
                    <feature.icon className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Kibo UI Section */}
      <section className="kiboui-why py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Why Choose Kibo UI?</h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Completely Free and Open Source</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Kibo UI is 100% free, forever. With its open-source license, you have complete freedom to use, modify, and distribute components in your projects without any licensing restrictions or hidden costs. The community-driven development model ensures continuous improvements and new features.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Built on Battle-Tested Technologies</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Every Kibo UI component leverages proven technologies: React for component architecture, TypeScript for type safety, Tailwind CSS for styling, Radix UI for accessible primitives, and Lucide icons for consistent iconography. This foundation ensures reliability and integrates seamlessly with modern development workflows.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Accessibility as a First-Class Citizen</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Every component in Kibo UI is built with accessibility in mind. Full keyboard navigation support, proper ARIA attributes, semantic HTML structure, and adherence to WCAG guidelines ensure your applications are usable by everyone, regardless of ability or assistive technology.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">True Composability Without Restrictions</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Kibo UI embraces the shadcn/ui philosophy where components are yours to own and customize. Copy components directly into your codebase, modify them to your exact specifications, combine them in unlimited ways, and build exactly what your application needs without vendor lock-in.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Accelerates Development Timeline</h3>
                  <p className="text-gray-300 leading-relaxed">
                    With 1000+ pre-built components and patterns, Kibo UI dramatically reduces development time. Instead of building common UI patterns from scratch, you can copy production-ready components and focus on business logic and unique features that differentiate your application.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Active Community and Regular Updates</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The Kibo UI community is vibrant and engaged, with regular additions of new components and patterns. The GitHub repository shows active development with thousands of stars, ensuring the library stays current with modern design trends and web standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="kiboui-use-cases py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Perfect for Every Project</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  SaaS Applications
                </h3>
                <p className="text-gray-300">Build comprehensive dashboards, analytics interfaces, and admin panels with pre-built data visualization components and complex UI patterns.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🛍️</span>
                  E-Commerce Platforms
                </h3>
                <p className="text-gray-300">Create beautiful product galleries, shopping carts, checkout flows, and customer management interfaces with form and interactive components.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  Design Tools & Editors
                </h3>
                <p className="text-gray-300">Leverage components like color pickers, drag-and-drop zones, and advanced editors to build creative applications without reinventing the wheel.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  Mobile Apps & Progressive Web Apps
                </h3>
                <p className="text-gray-300">Build responsive interfaces that work seamlessly across devices with fully accessible, mobile-optimized components.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  Project Management Tools
                </h3>
                <p className="text-gray-300">Create sophisticated project management interfaces with Kanban boards, Gantt charts, task lists, and collaborative components.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  Educational Platforms
                </h3>
                <p className="text-gray-300">Build learning management systems, course platforms, and educational content viewers with code blocks, markdown editors, and interactive components.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Components Showcase */}
      <section className="kiboui-components py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Featured Components</h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">🎨</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Color Picker</h3>
                  <p className="text-gray-400">Professional color selection component modeled after Figma's color picker. Includes color spectrum, HEX/RGB input fields, and real-time preview.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">🔍</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Image Zoom</h3>
                  <p className="text-gray-400">Advanced image zoom functionality with smooth zoom controls, pan support, and touch gestures for mobile devices.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">📱</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">QR Code Generator</h3>
                  <p className="text-gray-400">Generate QR codes dynamically from any string or URL. Includes customization options for colors, size, and format.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">💻</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Code Block</h3>
                  <p className="text-gray-400">Syntax-highlighted code blocks with language detection, line numbers, copy-to-clipboard functionality, and theme customization.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">📤</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Dropzone</h3>
                  <p className="text-gray-400">Drag-and-drop file upload area with click-to-upload fallback, file type validation, and visual feedback during upload.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">📊</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Gantt Chart</h3>
                  <p className="text-gray-400">Interactive project timeline visualization with drag-to-resize tasks, multiple view modes (Gantt, Calendar, List, Kanban), and real-time updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="kiboui-tech py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Built on Modern Stack</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {[
                { name: 'React', icon: '⚛️' },
                { name: 'TypeScript', icon: '📘' },
                { name: 'Tailwind CSS', icon: '🎨' },
                { name: 'Radix UI', icon: '⚙️' },
                { name: 'Lucide Icons', icon: '✨' },
                { name: 'shadcn/ui', icon: '🏗️' }
              ].map((tech, idx) => (
                <Card key={idx} className="bg-white border border-slate-200 p-6 text-center">
                  <div className="text-4xl mb-3">{tech.icon}</div>
                  <h3 className="font-bold text-white">{tech.name}</h3>
                </Card>
              ))}
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Kibo UI is built on a carefully curated technology stack that prioritizes quality, compatibility, and developer experience. Each technology choice was made intentionally to ensure components work seamlessly together.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                React provides the component architecture, TypeScript ensures type safety and better developer tooling, Tailwind CSS handles styling with utility-first approach, Radix UI supplies accessible primitives, and Lucide icons provide a consistent icon system. This combination creates a powerful, cohesive development experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="kiboui-getting-started py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Getting Started is Easy</h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600/30 border border-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-purple-400">1</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Visit Kibo UI Website</h3>
                  <p className="text-gray-400">Browse the comprehensive component library at kibo-ui.com. Explore thousands of components, patterns, and blocks organized by category.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-600/30 border border-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-pink-400">2</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Choose Your Components</h3>
                  <p className="text-gray-400">Find the components you need for your project. Each component includes a live preview, code example, and detailed documentation.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-600/30 border border-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-cyan-400">3</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Copy and Customize</h3>
                  <p className="text-gray-400">Copy the component code directly into your project. Since components are yours to own, customize them exactly as needed for your application.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600/30 border border-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-green-400">4</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">Build Your App</h3>
                  <p className="text-gray-400">Compose, combine, and integrate components into your application. Enjoy faster development time and focus on unique business logic.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="kiboui-comparison py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Why Kibo UI Stands Out</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-lg font-bold">Feature</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-purple-400">Kibo UI</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-gray-400">Component Libraries</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-gray-400">UI Frameworks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Component Count</td>
                    <td className="text-center py-4 px-4 text-purple-300">1000+</td>
                    <td className="text-center py-4 px-4 text-gray-500">100-500</td>
                    <td className="text-center py-4 px-4 text-gray-500">200-400</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Free Forever</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Some</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Open Source</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Most</td>
                    <td className="text-center py-4 px-4">Most</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Composable</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Varies</td>
                    <td className="text-center py-4 px-4">Partial</td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Accessible</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Most</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">Copy & Own</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Some</td>
                    <td className="text-center py-4 px-4">Partial</td>
                  </tr>
                  <tr className="hover:bg-gray-900/30">
                    <td className="py-4 px-4 font-semibold">shadcn/ui Based</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4">No</td>
                    <td className="text-center py-4 px-4">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Backlink Infinity */}
      <section className="kiboui-cta py-20 md:py-32 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Amplify Your Project's Reach</h2>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Building with Kibo UI gives you powerful components, but reaching your target audience requires a different strategy. Backlink ∞ helps you dominate search rankings, build domain authority, and drive quality organic traffic to your projects and websites.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white border border-slate-200 p-6">
                <Rocket className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Rank Higher</h3>
                <p className="text-sm text-gray-400">Strategic backlinks signal authority to search engines, improving your rankings for competitive keywords and driving organic visibility.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <BookOpen className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Build Authority</h3>
                <p className="text-sm text-gray-400">Quality backlinks from authoritative domains enhance your site's credibility and domain authority, creating a strong foundation for long-term growth.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Drive Traffic</h3>
                <p className="text-sm text-gray-400">Higher rankings lead to consistent organic traffic from users actively searching for solutions you provide.</p>
              </Card>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Why Choose Backlink ∞?</h3>
              <ul className="text-left space-y-3 text-gray-300 max-w-2xl mx-auto">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Vetted, high-authority domains for maximum SEO impact
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Contextually relevant backlinks that add genuine value
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  White-hat SEO strategies that build lasting results
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Transparent reporting and dedicated support
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-300">
                Combine powerful components from Kibo UI with strategic SEO. Build better, rank higher, drive more traffic.
              </p>
              <Button 
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 rounded-md font-semibold text-white flex items-center gap-3 mx-auto"
                onClick={() => window.open('https://backlinkoo.com/register', '_blank')}
              >
                <span>Register for Backlink ∞</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Start building authority and dominating your niche with quality backlinks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="kiboui-final-cta py-16 md:py-20 border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Build Faster?</h3>
            <p className="text-slate-600 mb-6">Start using Kibo UI's 1000+ components today. Free, open-source, and built for developers who care about quality and efficiency.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
