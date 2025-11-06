import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ContentContainer from '@/components/ContentContainer';

const SparkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 19v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.9 4.9l2.1 2.1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 17l2.1 2.1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12h3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 12h3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.9 19.1l2.1-2.1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 7l2.1-2.1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
  </svg>
);

export default function GensparkPage() {
  useEffect(() => {
    const title = 'Genspark — AI Workbench for Rapid Product & Content Generation';
    const description = 'Genspark is an AI-powered workbench that helps founders and product teams prototype features, generate content, and iterate quickly. Learn how Genspark accelerates ideation, prototypes, and content workflows.';

    document.title = title;

    const upsertMeta = (name: string, content: string) => {
      if (typeof document === 'undefined') return;
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const upsertPropertyMeta = (property: string, content: string) => {
      if (typeof document === 'undefined') return;
      let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    upsertMeta('description', description);
    upsertMeta('keywords', 'Genspark, genspark.ai, AI workbench, product prototyping AI, content generation AI, rapid prototyping');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', typeof window !== 'undefined' ? window.location.href : '/genspark');

    try {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        description,
        applicationCategory: 'DeveloperTool',
        url: typeof window !== 'undefined' ? window.location.href : '/genspark'
      };
      let script = document.head.querySelector('script[data-jsonld="genspark-seo"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('data-jsonld', 'genspark-seo');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(ld);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="genspark-page bg-background text-foreground">
      <Header />

      <ContentContainer variant="wide" hero={(
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white">
            <SparkIcon className="w-5 h-5" />
            <span className="text-sm font-medium">AI workbench • rapid prototyping</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight">Genspark — Build, Prototype, and Ship with AI-Accelerated Workflows</h1>
          <p className="mt-3 text-lg text-slate-700 max-w-2xl mx-auto">Genspark combines a suite of AI tools for founders, product builders, and content teams to prototype product features, generate marketing-ready copy, and iterate on ideas faster. This guide explains the capabilities, workflows, and best practices to integrate Genspark into your product process.</p>
        </div>
      )}>

        <article className="prose prose-slate lg:prose-lg">
          <section>
            <h2>What is Genspark?</h2>
            <p>
              Genspark is an AI-first workbench designed to reduce the time between idea and usable output. Rather than a single-purpose generator, it provides a collection of composable tools: feature scaffolding, wireframe generation, sample data creation, and content templates that help teams move from concept to validation in hours instead of days.
            </p>
          </section>

          <section>
            <h2>Core pillars: Prototype, Validate, Produce</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="p-5 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold">Prototype</h3>
                <p className="mt-2 text-sm text-slate-600">Quickly scaffold UI flows, generate realistic seed data, and wire up example interactions so you can demo concepts without a full build.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold">Validate</h3>
                <p className="mt-2 text-sm text-slate-600">Create user-facing prototypes and sample content to test on early users, gather feedback, and iterate on the product-market fit before heavy engineering investment.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold">Produce</h3>
                <p className="mt-2 text-sm text-slate-600">Generate marketing copy, docs, and social snippets that are ready to publish or A/B test, accelerating go-to-market activities.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mt-6">How teams use Genspark</h2>
            <ol className="list-decimal ml-6 mt-3">
              <li><strong>Idea to demo:</strong> Draft the feature description, scaffold UI mocks, and populate with sample data for a clickable demo.</li>
              <li><strong>Content-first growth:</strong> Ship blog posts, landing page variants, and ad copy generated from short prompts to test messaging.</li>
              <li><strong>Research and insights:</strong> Generate competitor summaries, product requirement outlines, and acceptance criteria from a single brief.</li>
            </ol>
          </section>

          <section>
            <h2 className="mt-6">Key features and examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-6 rounded-xl border bg-white/60 shadow-sm">
                <h4 className="font-semibold">Feature scaffolding</h4>
                <p className="mt-2 text-sm text-slate-600">Describe a feature in a sentence; Genspark generates wireframe suggestions, component lists, and sample API contracts to accelerate handoffs between design and engineering.</p>
              </div>

              <div className="p-6 rounded-xl border bg-white/60 shadow-sm">
                <h4 className="font-semibold">Content templates</h4>
                <p className="mt-2 text-sm text-slate-600">From landing pages to email sequences, Genspark offers templates that can be customized and exported, saving time on repetitive writing tasks.</p>
              </div>

              <div className="p-6 rounded-xl border bg-white/60 shadow-sm">
                <h4 className="font-semibold">Data generators</h4>
                <p className="mt-2 text-sm text-slate-600">Create realistic seed datasets and mock CSVs for demos and tests—no manual spreadsheet work required.</p>
              </div>

              <div className="p-6 rounded-xl border bg-white/60 shadow-sm">
                <h4 className="font-semibold">Collaboration snippets</h4>
                <p className="mt-2 text-sm text-slate-600">Generate concise PR descriptions, changelogs, and release notes to keep communication crisp across teams.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mt-6">Best practices for integrating Genspark</h2>
            <p>
              To get the most value, embed Genspark into short feedback loops: prototype small features, show them to users or teammates, collect actionable feedback, and iterate. Use generated content as a starting point—always refine for your brand voice and audience needs.
            </p>
            <ul className="mt-3">
              <li>Keep prompts specific and example-rich for predictable outputs.</li>
              <li>Use generated prototypes to test hypotheses quickly, not as final products.</li>
              <li>Combine seed data generation with end-to-end demos to validate flows under realistic conditions.</li>
            </ul>
          </section>

          <section>
            <h2 className="mt-6">Legal & ethical considerations</h2>
            <p>
              AI-generated material should be reviewed for accuracy and IP compliance. Use generated content to accelerate human work, but always verify facts and ensure any third-party data usage follows licensing and privacy rules.
            </p>
          </section>

          <section>
            <h2 className="mt-6">Performance and product-fit signals</h2>
            <p>
              Teams that use rapid prototyping tools like Genspark often report faster learning cycles and better early demos with users or investors. Track performance by measuring demo conversion, prototype feedback velocity, and the time between concept and shipped experiment.
            </p>
          </section>

          <section className="mt-8">
            <h2>Conclusion — When to choose a workbench like Genspark</h2>
            <p>
              If your team prioritizes speed of iteration, early validation, and a content-first approach to growth, a workbench that combines prototyping and content generation can be a force-multiplier. Genspark offers a set of tools that let you move faster from idea to validated experiment.
            </p>
          </section>

          <section className="mt-6">
            <h2>Grow your reach with targeted backlinks</h2>
            <p>
              Publishing great content is only part of the equation—getting authoritative backlinks amplifies visibility and trust. Register for Backlink ∞ to acquire high-quality links and drive more organic traffic: <a href="https://backlinkoo.com/register" className="text-blue-600 underline">Register for Backlink ∞</a>.
            </p>
          </section>
        </article>

      </ContentContainer>

      <Footer />
    </div>
  );
}
