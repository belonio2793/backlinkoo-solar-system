import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github, ArrowRight } from 'lucide-react';

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
    const title = 'Kibo UI - High Quality shadcn/ui Components Built with React';
    const description = 'Kibo UI is a custom registry of composable, accessible and extensible components designed for use with shadcn/ui. Free and open source, forever.';
    const keywords = 'kibo ui, shadcn/ui, react components, component library, free components, open source';

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
      <section className="kiboui-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              High quality shadcn/ui components built with React
            </h1>
            
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Kibo UI is a custom registry of composable, accessible and extensible components designed for use with shadcn/ui. Free and open source, forever.
            </p>

            {/* Technology badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700">React</div>
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700">TypeScript</div>
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700">Tailwind CSS</div>
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700">Lucide</div>
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700">Radix UI</div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                Browse Components
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Github className="w-4 h-4 mr-2" />
                GitHub
                <span className="ml-2 bg-slate-100 px-2 py-1 rounded text-xs font-semibold">3.3K</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Functional & Composable Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Functional and fully composable
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                Kibo UI components are designed to be fully composable so you can build, customize and extend them to your own needs.
              </p>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Explore Components
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border border-slate-200 p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Color Picker</h3>
                <p className="text-slate-700 mb-4">
                  Allows users to select a color. Modeled after the color picker in Figma.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-32 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Color Picker UI</span>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Image Zoom</h3>
                <p className="text-slate-700 mb-4">
                  Image zoom is a component that allows you to zoom in on an image.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-32 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Image Zoom UI</span>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <h3 className="text-xl font-bold mb-2 text-slate-900">QR Code</h3>
                <p className="text-slate-700 mb-4">
                  QR Code is a component that generates a QR code from a string.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-32 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">QR Code UI</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Building Blocks Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Building blocks for interfaces
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Get your apps and websites up and running quickly with precomposed and animated blocks.
            </p>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white mb-12">
              Explore Blocks
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200 p-6">
                <h2>Collaborative Canvas</h2>
                <p className="text-slate-700 text-sm mb-4">
                  Build collaborative interfaces with real-time interactions and presence indicators.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-24 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Canvas UI</span>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-bold mb-2 text-slate-900">Form</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Complete form blocks with validation, multi-step forms, and field components.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-24 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Form UI</span>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-bold mb-2 text-slate-900">Pricing Table</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Responsive pricing table layouts with features, pricing tiers, and CTA buttons.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-24 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Pricing UI</span>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-bold mb-2 text-slate-900">Roadmap</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Interactive roadmap and timeline visualization with Gantt-like components.
                </p>
                <div className="bg-slate-100 border border-slate-200 rounded h-24 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Roadmap UI</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What People Are Saying Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              What people are saying
            </h2>
            <p className="text-lg text-slate-700 mb-12">
              We're proud to have a community of users who love using Kibo UI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200 p-6 text-left">
                <div className="mb-4">
                  <p className="text-slate-700 font-semibold">Kibo UI has been a game changer for our React projects.</p>
                  <p className="text-slate-600 text-sm mt-2">The components are high quality, well-documented, and so easy to customize.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Developer</p>
                    <p className="text-xs text-slate-600">@developer</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6 text-left">
                <div className="mb-4">
                  <p className="text-slate-700 font-semibold">The best shadcn/ui component collection out there.</p>
                  <p className="text-slate-600 text-sm mt-2">Free, open source, and constantly growing with new components.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Designer</p>
                    <p className="text-xs text-slate-600">@designer</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6 text-left">
                <div className="mb-4">
                  <p className="text-slate-700 font-semibold">Kibo UI saved us weeks of development time.</p>
                  <p className="text-slate-600 text-sm mt-2">The components are accessible, well-tested, and production-ready.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Engineer</p>
                    <p className="text-xs text-slate-600">@engineer</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6 text-left">
                <div className="mb-4">
                  <p className="text-slate-700 font-semibold">Composability at its finest.</p>
                  <p className="text-slate-600 text-sm mt-2">You own the code. Customize and extend components exactly as you need.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Creator</p>
                    <p className="text-xs text-slate-600">@creator</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started with Kibo UI
            </h2>
            <p className="text-lg text-slate-300 mb-12">
              Install your first component in seconds with the Kibo UI CLI.
            </p>

            <Card className="bg-slate-800 border border-slate-700 p-8 text-left mb-8 font-mono">
              <div className="text-slate-400 text-sm">
                <div>$ npx kibo-ui add avatar-stack</div>
                <div className="text-slate-300 mt-2">✔ Component installed successfully</div>
              </div>
            </Card>

            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              View Documentation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              Ready to build better interfaces?
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Start using Kibo UI today. Free, open source, and designed for developers who care about quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                Browse All Components
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
