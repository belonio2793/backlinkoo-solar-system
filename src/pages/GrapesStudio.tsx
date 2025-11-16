import { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const metaTitle = 'Grapes Studio — AI-First HTML Website Builder: Import, Edit & Export Clean HTML';
const metaDescription = 'Grapes Studio is an AI-powered, HTML-first website builder that imports live sites, enables visual editing, and outputs clean HTML & CSS for ownership and portability. Learn features, workflows, pricing, and best practices.';

export default function GrapesStudioPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/grapes-studio`;
    } catch {
      return '/grapes-studio';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Grapes Studio, AI website builder, HTML first, GrapesJS, website importer, export HTML');
    upsertCanonical(canonical);

    injectJSONLD('grapes-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('grapes-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('grapes-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Grapes Studio?', acceptedAnswer: { '@type': 'Answer', text: 'Grapes Studio is an AI-assisted, HTML-first website builder that imports live websites and enables visual editing while producing clean HTML and CSS for deployment anywhere.' } },
        { '@type': 'Question', name: 'Can I export code from Grapes Studio?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Grapes Studio emphasizes ownership and portability by exporting standard HTML, CSS, and assets without locking you into a proprietary platform.' } },
        { '@type': 'Question', name: 'Who is Grapes Studio for?', acceptedAnswer: { '@type': 'Answer', text: 'Small businesses, agencies, designers, and developers who want a fast way to recreate, edit, and own web projects with AI-assisted tools.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Grapes Studio — The Practical Guide to AI-First, HTML-First Website Building</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">How Grapes Studio helps teams import live sites, edit visually with AI assistance, and export clean HTML & CSS so you retain full ownership of your website—plus workflows, use cases, and SEO best practices.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">AI Website Builder</Badge>
            <Badge className="bg-slate-100 text-slate-800">HTML First</Badge>
            <Badge className="bg-slate-100 text-slate-800">Import & Export</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Grapes Studio?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Creator workflow</a>
                  <a href="#seo" className="block text-blue-700">SEO & performance</a>
                  <a href="#pricing" className="block text-blue-700">Pricing & plans</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Grapes Studio combines AI-assisted editing with an HTML-first export model—import an existing site, visually edit with assistive tools, and export clean, portable code for hosting anywhere.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Grapes Studio?</h2>
              <p>Grapes Studio is an AI-augmented web editor that centers on HTML and CSS as first-class outputs. Instead of locking content inside a proprietary system, it emphasizes portability: creators import existing pages or start from templates, edit visually with AI suggestions, and then export clean, standards-compliant HTML and CSS. This approach is designed to bridge the gap between designers who want visual tools and developers who need maintainable code.</p>

              <p>At its core, Grapes Studio builds on the philosophy of using web standards rather than proprietary abstractions. The product is aimed at small teams, freelancers, and agencies that need to rebuild or modernize websites quickly, teams that require full ownership of assets, and developers who want an accelerated handoff from visual design to production-ready code.</p>

              <p>The product also leans into an "import-first" workflow: rather than starting from scratch, users can pull an existing website into the editor, apply targeted changes—such as updating hero sections, adjusting typography, or adding pricing blocks—and then export the refined HTML. This reduces rework, preserves SEO value, and speeds up iteration.</p>
            </section>

            <section id="features">
              <h2>Core Features & What Makes It Different</h2>

              <h3>One-click Import from Live Sites</h3>
              <p>Grapes Studio offers a fast importer that captures HTML, CSS, and assets from a live URL and reconstructs a visual editing canvas. This means teams can take control of an existing site without rebuilding components from scratch.</p>

              <h3>AI-Assisted Visual Editing</h3>
              <p>Built-in AI tools assist users with common tasks: rewriting copy to match tone, suggesting color palettes from existing branding, automating layout adjustments for responsiveness, and generating content blocks such as feature sections or pricing tables. AI suggestions are presented as editable options, maintaining transparency and control.</p>

              <h3>HTML-First Export & Ownership</h3>
              <p>Unlike many visual builders that introduce proprietary layers, Grapes Studio outputs standard HTML and CSS. This makes the exported site portable, easy to host on any platform, and friendly to developers who prefer to maintain code in version control.</p>

              <h2>Clean, Semantic Markup</h2>
              <p>Exported code aims to be semantic and readable—class names, structural elements, and asset organization are preserved in a way that minimizes the cleanup required for production use.</p>

              <h3>Template Library & Blocks</h3>
              <p>A curated library of responsive templates and modular sections accelerates common tasks. Designers can assemble pages from building blocks and then fine-tune content, spacing, and interactions.</p>

              <h3>Collaboration & Team Features</h3>
              <p>Team plans typically include role-based access, project sharing, and version history, facilitating collaboration between stakeholders without sacrificing code quality.</p>

              <h3>Developer-Friendly Integrations</h3>
              <p>Grapes Studio is designed to fit into existing developer workflows with asset exports, clean CSS, and compatibility with static site hosts, CDN deployments, and headless CMSs.</p>
            </section>

            <section id="how-it-works">
              <h2>How Grapes Studio Works — A Practical Overview</h2>

              <p>The platform follows a straightforward flow that balances automated assistance and manual control. High-level steps include:</p>
              <ol>
                <li><strong>Import:</strong> Provide a URL or upload HTML to reconstruct the page within the editor. The importer maps assets, inlines where appropriate, and recreates the structure for visual editing.</li>
                <li><strong>Analyze:</strong> AI analyzes layout, typography, color palette, and content hierarchy to suggest improvements and generate editable components.</li>
                <li><strong>Edit:</strong> Use drag-and-drop tools and contextual AI suggestions to modify sections, rewrite text, or adjust responsive behavior.</li>
                <li><strong>Preview:</strong> Inspect the page across breakpoints and simulate real-world scenarios (slow networks, accessibility checks, SEO metadata).
                </li>
                <li><strong>Export:</strong> Download clean HTML, CSS, and assets, or push to a connected host. Exported projects include a clear file structure ready for deployment.</li>
              </ol>

              <p>Beyond the core pipeline, Grapes Studio often integrates with content workflows and versioning systems to ensure repeatable, auditable changes across releases.</p>
            </section>

            <section id="use-cases">
              <h2>Who Benefits Most: Primary Use Cases</h2>

              <h2>Small Businesses Modernizing Sites</h2>
              <p>Small businesses with legacy sites can import an existing presence, refresh design and messaging, and export deployable code—all without hefty developer hours. This is ideal for businesses that need quick turnaround on seasonal promotions or a brand refresh.</p>

              <h3>Designers & Agencies</h3>
              <p>Design teams can prototype visually and hand off production-ready HTML to clients or developers. The HTML-first approach reduces miscommunication and speeds up launch timelines.</p>

              <h3>Developers Who Want Faster Handoffs</h3>
              <p>Developers who need readable output—rather than locked-in formats—can accept exports with minimal cleanup, enabling rapid integration into existing repositories or static site generators.</p>

              <h3>Marketing Teams & Content Creators</h3>
              <p>Marketers can iterate on landing pages, update hero content, and test variants without opening a code editor. AI copy suggestions and block templates accelerate A/B testing and campaign launches.</p>

              <h2>Migration & Replatforming Projects</h2>
              <p>Teams migrating away from monolithic CMS platforms can use Grapes Studio to capture site structure and generate portable assets for migration planning and phased launches.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: Example Project</h2>

              <p>Here’s a practical workflow for a mid-size project migrating a marketing site:</p>
              <ol>
                <li><strong>Inventory & prioritize:</strong> Crawl the existing site, list high-traffic pages and assets, and prioritize pages for migration.</li>
                <li><strong>Import & audit:</strong> Import pages into Grapes Studio, audit the generated markup, and flag dynamic elements that need manual integration (forms, scripts, complex widgets).</li>
                <li><strong>Design & refine:</strong> Use AI to suggest consistent spacing, typography scale, and color adjustments. Replace outdated sections with modern blocks from the library.</li>
                <li><strong>Developer integration:</strong> Export HTML and merge into the repository. Replace placeholder scripts with production-ready integrations and connect forms to backend services.</li>
                <li><strong>QA & SEO:</strong> Run accessibility and SEO checks inside the editor, validate structured data, and ensure metadata is intact.</li>
                <li><strong>Deploy & monitor:</strong> Push to a static host or server, monitor traffic, and iterate using analytics and A/B results.</li>
              </ol>

              <p>This workflow keeps the migration controlled, reduces surprises in handoffs, and preserves the site’s SEO value by minimizing downtime and content reshuffling.</p>
            </section>

            <section id="seo">
              <h2>SEO, Accessibility & Performance Considerations</h2>

              <p>Exporting clean HTML is only part of the equation. Here are recommended practices to preserve and improve search visibility when using visual editing tools:</p>
              <ul>
                <li><strong>Preserve URL structure:</strong> Maintain existing URLs where possible to avoid broken links and preserve accumulated search equity.</li>
                <li><strong>Meta & structured data:</strong> Ensure title tags, meta descriptions, canonical links, and structured data are preserved or enhanced during export.</li>
                <li><strong>Semantic markup:</strong> Use proper heading hierarchy and ARIA attributes to improve accessibility and search engines' understanding of content.</li>
                <li><strong>Optimize assets:</strong> Compress images, use responsive images (srcset), and employ modern formats like WebP to reduce page weight.</li>
                <li><strong>Server & hosting:</strong> Host on fast infrastructure, use CDNs, and enable caching headers for better performance.</li>
                <li><strong>Monitor & iterate:</strong> Track the effect of design changes on rankings using analytics and rank-tracking tools, and iterate accordingly.</li>
              </ul>

              <p>Grapes Studio’s approach to outputting standards-compliant HTML simplifies many of these practices because developers can inspect and adjust exported markup before deploying.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & Developer Tools</h2>

              <p>To fit into production workflows, Grapes Studio typically supports or pairs well with:</p>
              <ul>
                <li><strong>Static hosts:</strong> Netlify, Vercel, GitHub Pages, or any static server for immediate deployment.</li>
                <li><strong>Headless CMS:</strong> Connect exported templates to headless CMSs for dynamic content management.</li>
                <li><strong>CI/CD:</strong> Use export artifacts as artifacts in CI pipelines for automated deployments and tests.</li>
                <li><strong>Version control:</strong> Commit exported code to git repositories to track changes, collaborate, and roll back when necessary.</li>
                <li><strong>Design systems:</strong> Map extracted styles to your design tokens and integrate with component libraries when converting to React or other frameworks.</li>
              </ul>
            </section>

            <section id="pricing">
              <h2>Pricing, Plans & Team Options</h2>

              <p>Tools like Grapes Studio often provide tiered plans to serve hobbyists, professional creators, and enterprises. Typical tiers include:</p>
              <ul>
                <li><strong>Free or trial tier:</strong> Limited imports or exports for evaluating the editor.</li>
                <li><strong>Creator plan:</strong> Monthly subscription with increased export credits, templates, and basic team access.</li>
                <li><strong>Team plan:</strong> Collaboration features, role-based permissions, and priority support.</li>
                <li><strong>Enterprise:</strong> Custom SLAs, SSO, dedicated onboarding, and enhanced export/hosting options.</li>
              </ul>

              <p>When evaluating a plan, prioritize export limits, collaboration features, and the fidelity of exported code rather than just editor features—those determine long-term maintainability and hosting flexibility.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Real-World Examples</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Local Retailer — Rapid Landing Page Refresh</CardTitle>
                </CardHeader>
                <CardContent>
                  "A small retail business used Grapes Studio to import their legacy site, modernize the homepage for a seasonal campaign, and export deployable HTML within a single day. The visual editor removed the need for a developer for the landing-page update, saving both time and cost." — Marketing Lead
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Design Agency — Faster Prototypes, Cleaner Handoffs</CardTitle>
                </CardHeader>
                <CardContent>
                  "Designers created interactive prototypes and exported semantic HTML for developers. The improved handoff reduced confusion about spacing, breakpoints, and component structure, accelerating the build phase." — Agency Creative Director
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Startup — Migration Without Lock-In</CardTitle>
                </CardHeader>
                <CardContent>
                  "During a platform migration, the team used Grapes Studio to capture pages and iterate on content while the engineering team prepared backend integrations. The portability of the exported code meant there was no surprise vendor lock-in." — CTO
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>What Users Say</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Importing our site into Grapes Studio and making visual edits saved us weeks of dev time. The exported HTML was surprisingly clean and easy to integrate." — Product Manager</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"AI suggestions for copy and layout were genuinely useful — we shipped a landing page faster without sacrificing quality." — Senior Designer</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The tool respects developer workflows. We were able to commit exported code straight into our repo and continue working with our build pipeline." — Frontend Engineer</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When to Use Caution</h2>

              <p>While Grapes Studio's importer and AI assistance are powerful, there are scenarios that need careful handling:</p>
              <ul>
                <li><strong>Complex dynamic apps:</strong> Highly interactive single-page applications with heavy client-side logic may require manual refactoring after export to map interactions and state management into your framework of choice.</li>
                <li><strong>Third-party integrations:</strong> Forms, analytics, and third-party scripts may need configuration after export to ensure they are connected to the correct backend services.</li>
                <li><strong>Accessibility edge cases:</strong> While the editor can surface accessibility issues, some interactive patterns require expert review and manual fixes to meet strict compliance standards.</li>
              </ul>

              <p>In most content-driven scenarios, however, the combination of visual editing and manual developer review leads to efficient, production-ready outcomes.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Production-Ready Projects</h2>
              <ol>
                <li>Run an export QA checklist: verify metadata, structured data, and responsive behavior across breakpoints.</li>
                <li>Maintain assets in a central bucket and rewrite asset URLs during deployment to use a CDN for performance.</li>
                <li>Integrate exported code into your CI/CD pipeline for consistent builds and rollbacks.</li>
                <li>Use modular blocks from the template library to keep pages consistent and maintainable.</li>
                <li>Document the changes and store exported versions in version control to track iterations.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Is Grapes Studio free to try?</summary><p className="mt-2">Many editors offer a free tier or trial period to evaluate imports and exports—check the provider’s pricing page for current limits and trial conditions.</p></details>

              <details className="mb-3"><summary className="font-semibold">Will exported code work with my existing CMS?</summary><p className="mt-2">Exported HTML and assets are portable and can be integrated with most CMS or static-site setups, though dynamic functionality (server forms, auth) may need additional wiring.</p></details>

              <details className="mb-3"><summary className="font-semibold">Does AI rewrite my copy automatically?</summary><p className="mt-2">AI suggestions are optional. You can accept, edit, or ignore rewrites. The editor keeps content editable so you remain in control of tone and messaging.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is Grapes Studio open source?</summary><p className="mt-2">Grapes Studio is built on the open-source ethos and has roots in open tooling, but the product’s licensing and open-source details should be reviewed on the official site.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Grow Discovery & Traffic for Your New Site</h2>
              <p>If you’ve modernized your site with Grapes Studio and want more people to find it, Backlink ∞ helps publishers, creators, and businesses build targeted backlinks and implement SEO strategies that drive organic traffic and improve visibility.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Grapes Studio represents a pragmatic evolution in visual web tooling: it blends automated assistance with a commitment to standards and ownership. For teams that want rapid iteration without sacrificing production code quality, an HTML-first editor is a strong middle ground between pure visual builders and manual development.</p>

              <p className="text-gray-700 leading-relaxed mb-4">Adopt a controlled workflow: import selectively, validate exports, and integrate into your version control and CI processes. When used thoughtfully, Grapes Studio can meaningfully reduce time-to-launch and lower the cost of maintaining web presence while preserving flexibility for developers.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
