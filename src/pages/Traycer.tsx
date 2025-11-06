import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

const metaTitle = 'Traycer — Product Overview & Guide';
const metaDescription = 'Traycer overview: a concise product guide, features, use-cases, and quick-start information. Learn how Traycer helps teams ship faster.';

export default function Traycer() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/traycer`;
    } catch {
      return '/traycer';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Traycer, Traycer AI, product overview, features, reviews');
    upsertCanonical(canonical);

    injectJSONLD('traycer-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });
  }, [canonical]);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-2xl border border-border/60 bg-white p-6 md:p-8">
          <h1 className="text-3xl font-bold">Traycer — Product Overview</h1>
          <p className="mt-3 text-slate-700">This page is a concise product overview for Traycer. It includes feature highlights, typical use-cases, and quick guidance for teams evaluating the product. For in-depth comparisons or integrations, review product docs or contact the vendor.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3 bg-gray-50">
              <p className="text-xs font-semibold uppercase text-slate-500">Last Updated</p>
              <p className="mt-1 font-bold">{lastUpdated}</p>
            </div>
            <div className="rounded-lg border p-3 bg-gray-50">
              <p className="text-xs font-semibold uppercase text-slate-500">Primary Keyword</p>
              <p className="mt-1 font-bold">Traycer</p>
            </div>
            <div className="rounded-lg border p-3 bg-gray-50">
              <p className="text-xs font-semibold uppercase text-slate-500">Overview</p>
              <p className="mt-1 text-sm text-slate-700">Concise guide to features, pricing signals, and FAQs.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold">What Traycer does</h2>
          <p className="mt-3 text-slate-700">Traycer is designed to help teams with [product-specific capability]. This high-level overview summarizes typical features: automated insights, integrations, and developer-friendly SDKs. (This page is intentionally vendor-agnostic; replace with product specifics as needed.)</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="mt-3 text-slate-700">To evaluate Traycer, start with a short pilot: install any available SDK or trial, connect a single environment, and validate the core use-case. Track objective KPIs during the pilot—time saved, error reduction, or engagement lift—then expand scope if outcomes are positive.</p>
        </section>

        <section className="rounded-2xl border border-blue-200 bg-white">
          <h2 className="text-2xl font-semibold">Register for Backlink ∞ to Accelerate SEO</h2>
          <p className="mt-3 text-slate-700">If you want product pages like this to rank faster, build topical authority with quality backlinks. Register to get tailored backlink opportunities that increase organic reach and referral traffic.</p>
          <p className="mt-4">
            <a className="underline text-blue-700" href="https://backlinkoo.com/register" target="_blank" rel="nofollow noopener">Register for Backlink ∞</a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
