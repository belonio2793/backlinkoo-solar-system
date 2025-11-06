import { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/proximity-lock-system.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
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

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
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

const metaTitle = 'Amp Free — Lightweight, Secure Serverless Apps: Fast, Free, and Open';
const metaDescription = 'Amp Free provides a lightweight platform for building, deploying, and running serverless applications. Learn how Amp Free simplifies deployment, performance optimization, developer experience, and hosting strategies.';

export default function AmpFreePage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/amp-free`;
    } catch {
      return '/amp-free';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Amp Free, serverless app, static site, ampcode, hosting, deploy');
    upsertCanonical(canonical);

    injectJSONLD('ampfree-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('ampfree-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('ampfree-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Amp Free?', acceptedAnswer: { '@type': 'Answer', text: 'Amp Free is a lightweight platform and toolkit for building and deploying fast, minimal, serverless applications and static sites with a focus on simplicity and performance.' } },
        { '@type': 'Question', name: 'Is Amp Free actually free?', acceptedAnswer: { '@type': 'Answer', text: 'Amp Free refers to a free tier or open offering for lightweight deployments — check the provider’s terms for usage limits and commercial options.' } },
        { '@type': 'Question', name: 'Who should use Amp Free?', acceptedAnswer: { '@type': 'Answer', text: 'Developers, hobbyists, and small teams looking for a fast, low-cost way to deploy static sites, landing pages, and microservices with minimal configuration.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Amp Free — Build Fast, Deploy Simple, Scale When Ready</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Amp Free is designed for teams and creators who want to launch lightweight, performant applications quickly — focusing on developer experience, minimal runtime cost, and predictable performance.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">Serverless</Badge>
            <Badge className="bg-slate-100 text-slate-800">Static & Edge</Badge>
            <Badge className="bg-slate-100 text-slate-800">Developer Friendly</Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 sticky top-28 self-start">
            <Card>
              <CardHeader>
                <CardTitle>On this page</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="text-sm space-y-2">
                  <a href="#what" className="block text-blue-700">What is Amp Free?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Developer workflow</a>
                  <a href="#pricing" className="block text-blue-700">Pricing & limits</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Amp Free offers a fast path from local development to production with serverless hosting, edge delivery, and minimal configuration—ideal for marketing sites, prototypes, and lightweight microservices.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Amp Free?</h2>

              <p>Amp Free is the lightweight offering for teams that want to deploy minimal, performant applications without the complexity of traditional server stacks. It typically bundles a simple build flow, static asset hosting, optional serverless function support, and edge caching to ensure fast global delivery.</p>

              <p>The core idea behind Amp Free is pragmatic: reduce the cognitive load on developers by removing infrastructure friction. Rather than managing servers, SSL, or heavy orchestration, teams deploy artifacts—HTML, CSS, JS, and small serverless handlers—and the platform handles distribution, scaling, and security.</p>

              <p>This approach is not new, but Amp Free distinguishes itself by emphasizing an exceptional developer experience, clear limits for free usage, and sensible defaults that lead to fast launch times and predictable costs during growth.</p>
            </section>

            <section id="features">
              <h2>Core Features & Capabilities</h2>

              <h3>Simple Deployment</h3>
              <p>Deploy from CLI, Git, or drag-and-drop with a single command or push. The deployment pipeline optimizes assets, generates immutable artifact URLs, and provisions edge caching automatically.</p>

              <h3>Edge Caching & CDN</h3>
              <p>Static assets and pre-rendered pages are cached at the edge, delivering sub-200ms responses to users worldwide. Cache invalidation is integrated into the deployment model for safe rollouts.</p>

              <h3>Serverless Function Support</h3>
              <p>Run small, event-driven functions for APIs, form handlers, or webhook endpoints. The functions follow a pay-per-use model and are optimized for cold-start performance and memory-efficient execution.</p>

              <h3>Automatic HTTPS & Security</h3>
              <p>Automatic TLS provisioning and security headers are applied by default. The platform can also integrate WAF rules and rate-limiting for high-traffic endpoints.</p>

              <h3>Asset Optimization</h3>
              <p>Built-in tooling compresses images, generates responsive srcsets, and bundles JS with tree-shaking to keep payloads small and improve time-to-interactive.</p>

              <h3>Environment & Secrets Management</h3>
              <p>Developers can define environment variables and secrets through an admin console or CLI, enabling safe configuration of API keys and service integrations without leaking sensitive data into builds.</p>

              <h3>Observability & Logs</h3>
              <p>Amp Free provides logs and usage metrics to troubleshoot serverless functions and monitor bandwidth, latency, and error rates. Integrations to common monitoring platforms are typically available for deeper analysis.</p>
            </section>

            <section id="how-it-works">
              <h2>How Amp Free Works — Behind the Scenes</h2>

              <p>The platform is opinionated to keep things simple. At a high level:</p>
              <ol>
                <li><strong>Build:</strong> A build process compiles assets and optional server code into deployable artifacts.
                </li>
                <li><strong>Deploy:</strong> Artifacts are pushed to an artifact store; the platform updates edge caches and routes traffic to the nearest POP (point of presence).
                </li>
                <li><strong>Serve:</strong> Static content is served from cache; dynamic routes are handled by lightweight functions that scale on demand.
                </li>
                <li><strong>Observe:</strong> Logs, metrics, and error tracking help you optimize performance and reliability.
                </li>
              </ol>

              <p>This pipeline is designed to be secure by default and simple enough that developers can reason about performance without specialized DevOps knowledge.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases — Where Amp Free Shines</h2>

              <h3>Marketing Sites & Landing Pages</h3>
              <p>Fast builds, global edge delivery, and image optimization make Amp Free ideal for marketing campaigns and landing pages where performance directly impacts conversion rates.</p>

              <h3>Product Documentation & Blogs</h3>
              <p>Static content with CDN backing provides reliable, fast documentation hosting. Built-in search indexing and versioned deployments support content teams' needs.</p>

              <h3>Proofs-of-Concept & Prototypes</h3>
              <p>Developers and designers can ship working prototypes that behave like production apps without provisioning infrastructure or managing servers.</p>

              <h3>Microservices & Webhooks</h3>
              <p>Small APIs and webhook handlers benefit from serverless functions—ample for integrations, form processing, and event-driven tasks.</p>

              <h3>Static E-commerce Front-Ends</h3>
              <p>Static front-ends paired with headless commerce backends can serve product catalogs at scale while delegating checkout or cart operations to secure serverless endpoints.</p>
            </section>

            <section id="workflow">
              <h2>Developer Workflow — From Local to Live</h2>

              <p>Here’s a pragmatic workflow to get the most out of Amp Free:</p>
              <ol>
                <li><strong>Local development:</strong> Start with a minimal framework or static site generator; run a local dev server that mirrors edge caching behavior when feasible.</li>
                <li><strong>CI integration:</strong> Wire up Git to trigger builds and deployments automatically on merge to main; use preview environments for pull requests.</li>
                <li><strong>Progressive enhancement:</strong> Prioritize static rendering and only use serverless functions for necessary dynamic features to minimize cold-start surprises.</li>
                <li><strong>Monitoring:</strong> Add simple alerting on error rates and latency to catch regressions early.</li>
                <li><strong>Iterate:</strong> Use A/B testing and performance budgets to guide optimization; automate image transforms and code-splitting where it helps metrics.</li>
              </ol>

              <p>This workflow balances speed with reliability and keeps developer focus on product features instead of infrastructure maintenance.</p>
            </section>

            <section id="pricing">
              <h2>Pricing, Limits & When to Upgrade</h2>

              <p>Amp Free typically represents a free tier that gives teams reasonable bandwidth, build minutes, and function invocations to experiment and launch small projects. Common upgrade paths include higher bandwidth, longer function execution time, and dedicated edge capacity for large-scale apps.</p>

              <p>When evaluating plans, consider the cost of traffic (bandwidth), function execution costs, and the value of preview environments and SLAs. Start with the free tier for prototypes and move to paid plans as you need guaranteed performance or enterprise features.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Examples</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Startup Launch — Lightning-Fast Landing Page</CardTitle>
                </CardHeader>
                <CardContent>
                  "A pre-launch startup used Amp Free to host their landing page and beta signup form. Fast load times and optimized images improved conversion, and they avoided DevOps overhead entirely." — Founder
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Open Source Project — Documentation Hosting</CardTitle>
                </CardHeader>
                <CardContent>
                  "We migrated docs to Amp Free and reduced hosting costs while improving page responsiveness for global contributors." — Maintainer
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Agency Prototype — Rapid Client Demos</CardTitle>
                </CardHeader>
                <CardContent>
                  "The agency used Amp Free to spin up client demos for multiple prospects. Quick previews and simple redirects made A/B ideas easy to validate in real scenarios." — Creative Director
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Amp Free let us deploy a campaign site in minutes and handle worldwide traffic with no configuration." — Growth Lead</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"We moved docs to the platform and noticed immediate improvements in crawlability and page speed." — Docs Engineer</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The predictable free tier was perfect for prototyping without getting surprised by bills." — Indie Developer</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When to Choose Something Else</h2>

              <p>Amp Free is optimized for simple, fast experiences. Consider alternative architectures for:</p>
              <ul>
                <li><strong>Heavy compute workloads:</strong> Long-running jobs, heavy data processing, or GPU tasks are better suited to dedicated compute clusters.</li>
                <li><strong>Complex stateful applications:</strong> Apps that require persistent connections or complex state orchestration may need managed backends or container platforms.</li>
                <li><strong>Strict compliance needs:</strong> Regulated industries may require specific data residency and compliance controls that go beyond free tiers.</li>
              </ul>

              <p>For teams that outgrow the free tier, most platforms provide clear migration paths to paid plans or enterprise offerings that preserve the deployment model while adding capacity and controls.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Fast, Reliable Sites</h2>
              <ol>
                <li>Prefer pre-rendering and static HTML for performance-critical pages.</li>
                <li>Use serverless functions sparingly and cache their results when possible.</li>
                <li>Optimize images and use responsive formats (WebP/AVIF) and srcset attributes.</li>
                <li>Monitor performance and set budgets to avoid regressions during feature launches.</li>
                <li>Use preview environments for testing and QA to reduce surprises at deploy time.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Is Amp Free suitable for production?</summary><p className="mt-2">Amp Free is suitable for many production use cases, especially low-to-medium traffic sites and microservices. For enterprise-scale workloads, consider paid plans with SLAs and dedicated capacity.</p></details>

              <details className="mb-3"><summary className="font-semibold">How do I deploy?</summary><p className="mt-2">Deploy via CLI or connect a Git repository to the platform. CI integrations typically allow for preview environments on pull requests and automatic production deploys on merge.</p></details>

              <details className="mb-3"><summary className="font-semibold">Are there limits on bandwidth or execution?</summary><p className="mt-2">Free tiers often include bandwidth and execution limits. Review the provider's quota documentation and upgrade paths to plan for growth.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Get More Traffic for Your Projects</h2>
              <p>After deploying with Amp Free, driving traffic and discoverability is the next step. Backlink ∞ helps startups, creators, and maintainers gain visibility through targeted backlink campaigns and SEO strategies that increase organic reach.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Amp Free is a pragmatic choice for teams that prioritize speed, cost-effectiveness, and developer experience. It removes infrastructure friction while delivering solid defaults for performance and security. Use it to prototype, launch campaigns, and host static assets; then scale to paid plans when your traffic and feature needs grow.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
