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

const metaTitle = 'Getillustrations — Premium, Editable Vector Illustrations for Web & App Design';
const metaDescription = 'Download premium vector illustrations at Getillustrations. Access a growing, royalty‑free SVG library with editable files, Figma integration, and commercial licensing for designers and teams.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'Getillustrations — Beautiful, Editable Vector Art for Modern Design',
    summary: 'Getillustrations provides high-quality, human-made vector illustrations tailored for web, app, and marketing design. The library focuses on editable source files, curated concepts, and a pragmatic commercial license that keeps your team flexible.',
    paragraphs: [
      'Getillustrations began from a simple observation: product and marketing teams constantly need polished visuals that match their brand without the cost or timeline of custom art. Designers want illustrations that are instantly usable, easy to edit, and legally safe for commercial use. Getillustrations answers that need with a growing library of SVG, AI, and EPS packs drawn by professionals and organized by theme, use case, and style.',
      'At its core, the product is about speed and craft. Instead of generic clip art or low-quality stock finds, Getillustrations curates scenes and characters that designers can quickly adapt. Each asset is shipped with the original vector source so color palettes, shapes, and composition can be adjusted without re-drawing from scratch. This makes the service ideal for teams that value consistent visual language across landing pages, dashboards, onboarding flows, and campaign creatives.',
      'This guide walks through the library, key workflows, real-world use cases, licensing details, and practical advice for integrating illustrations into design systems and marketing pipelines. Whether you are a solo designer, a product team, or an agency, this page will help you evaluate when to buy ready-made vectors and when to commission bespoke work.'
    ]
  },
  {
    id: 'why-illustrations-matter',
    title: 'Why Illustrations Matter for Product & Marketing Design',
    summary: 'Well-chosen illustrations amplify clarity, strengthen brand personality, and improve conversion by turning abstract ideas into immediate visuals.',
    paragraphs: [
      'Illustrations serve several important roles in digital products: they explain complex ideas quickly, create emotional resonance, and provide consistent visual anchors across touchpoints. A tasteful hero illustration can raise perceived product quality, while small in‑UI illustrations can reduce cognitive load by giving tasks a visual identity. For marketing, custom art helps a campaign stand out in a sea of templated creatives.',
      'However, high-quality illustration traditionally came with a time and cost premium. Agencies and illustrators produce beautiful work, but iterations and alignment with product copy often extend timelines. Getillustrations reduces this friction by offering editable vectors that designers can adapt in minutes—changing hues, reconfiguring scenes, or swapping elements to fit the copy and layout, enabling rapid experimentation.',
      'From a brand perspective, illustrations are an opportunity to craft a visual tone that is uniquely yours. Using a curated library with consistent stylistic choices across pages avoids the mismatch that happens when teams cobble together assets from disparate sources. Getillustrations emphasizes curated concepts and style families so teams can use multiple packs while maintaining cohesion.'
    ]
  },
  {
    id: 'features',
    title: 'Core Features — Editable, Curated, and License‑Friendly',
    summary: 'A practical, designer-friendly toolkit: editable vector files, frequent updates, curated themes, and commercial licensing that keeps legal concerns simple.',
    paragraphs: [
      'Editable Vectors: Every illustration comes with the original vector files—SVG, AI, and EPS—so you can recolor, reorganize layers, and scale without loss. This is essential for responsive design where illustrations must adapt to multiple breakpoints and contexts.',
      'Curated Concepts: The library is organized by themes and scenarios that designers commonly need—onboarding, analytics dashboards, team pages, empty states, and marketing hero scenes—so you can find fit-for-purpose art quickly without sifting through irrelevant bundles.',
      'Regular Updates: Design trends and UI needs change. Getillustrations publishes new collections and refreshes styles regularly, so teams always have fresh options that reflect current visual language—flat, outline, hand-drawn, 3D-ish, gradient-rich, and more.',
      'Commercial License: Purchases include a standard commercial license which grants wide usage rights: use in web pages, apps, marketing materials, and client projects without additional royalties. The licensing model avoids subscriptions for basic usage—once bought, the asset is yours to keep.',
      'Custom Design Services: If a team needs a unique direction or a larger set of illustrations, Getillustrations offers paid custom illustration services. Designers can commission new scenes in the same style as the library for seamless integration.',
      'Figma Plugin & Workflow Integration: A Figma plugin accelerates insertion and editing inside the design tool, letting teams pull SVG layers directly into frames and adapt colors via variables or styles. This tight integration speeds handoff between design and development.',
      'High-Resolution Exports & Tooling: Export options that fit production needs—optimized SVG for web, high-res PNGs for presentations, and layered source files for detailed adjustments—make the library useful across product, marketing and social channels.'
    ]
  },
  {
    id: 'styles-and-collections',
    title: 'Styles & Collections — Consistency at Scale',
    summary: 'Illustration styles shape perception. Getillustrations groups assets into coherent collections so you can build consistent visual systems across products and campaigns.',
    paragraphs: [
      'Style taxonomy matters. The library organizes art by visual treatment—flat minimal, line art, hand-made textures, colorful gradients, isometric scenes, and playful characters. Each collection maintains consistent proportions, stroke weights, and palette suggestions so mixing assets from the same collection feels intentional.',
      'Collections are practical for design systems. When building component libraries or marketing templates, choosing one collection per product line creates a recognisable visual tone. Getillustrations provides usage notes and suggested color palettes with many packs to help designers adapt assets to brand guidelines without losing the original charm.',
      'For teams that require multiple visual voices—enterprise dashboards and playful marketing campaigns, for example—the site recommends pairing a neutral, system-friendly collection for product UI with a more expressive, colorful collection for marketing touchpoints. This dual‑strategy keeps interfaces clean while letting brand moments feel more human and memorable.'
    ]
  },
  {
    id: 'figma-plugin',
    title: 'Figma Plugin — A Frictionless Design Workflow',
    summary: 'A dedicated Figma plugin bridges the gap between downloaded assets and in‑file editing, accelerating iterations and handoffs.',
    paragraphs: [
      'Why a plugin matters: Designers spend time reimporting SVGs, ungrouping layers, and correcting paths. A plugin simplifies this: insert, swap colors, and place art directly into frames, preserving layer structure and editable vectors. That reduces repetitive tasks and frees time for creative work.',
      'Plugin features: Many integrations include search by tag, quick insert into selected frames, and automatic application of color tokens. The plugin often synchronises with a team’s preferred palettes so designers can apply brand variables on the fly.',
      'Design system friendliness: Because the plugin preserves vector structure and groups, development handoffs are cleaner. Developers can inspect layers, extract SVG code, and use optimized assets for production without extra cleanup steps—saving time across the delivery pipeline.'
    ]
  },
  {
    id: 'custom-design',
    title: 'Custom Illustrations — When Ready‑Made Isn’t Enough',
    summary: 'Getillustrations provides custom work for teams that need a signature visual language or large, cohesive illustration sets.',
    paragraphs: [
      'Custom requests are useful when a brand needs an illustration language that scales beyond an off‑the‑shelf pack. Getillustrations offers commissioning services where their artists adapt an existing collection or create a new family of assets that matches brand look, tone, and platform constraints.',
      'The custom process generally follows a short briefing, rapid prototypes, and iterative reviews. Teams can expect consistent turnaround times with clear checkpoints, making custom work predictably integrable into product and campaign schedules.',
      'For many customers, a small custom extension to an existing pack—adding brand-specific characters or branded props—delivers the visual uniqueness teams need while preserving the efficiencies of working with a known style.'
    ]
  },
  {
    id: 'licensing',
    title: 'Licensing & Legal Clarity — Simple, Commercial‑Friendly Terms',
    summary: 'The frictionless commercial license is one of the product’s best features: clear, permanent usage rights without hidden clauses.',
    paragraphs: [
      'Commercial licensing is straightforward: when you purchase an illustration pack, you gain perpetual rights to use the assets in your projects within the bounds of the license. This includes use in websites, apps, social ads, presentations, and client deliverables without ongoing fees.',
      'Unlike subscription services that revoke access when a payment lapses, Getillustrations emphasizes one‑time purchases for permanent use. Teams that want a subscription for access to constantly updating libraries can evaluate that model, but the basic commercial license simplifies procurement for single projects and long-lived products.',
      'The license typically permits modification—recoloring, reconfiguring scenes, and integrating parts of illustrations into composite assets. That flexibility is essential for product teams that need to harmonize art with dynamic UI systems.'
    ]
  },
  {
    id: 'use-cases',
    title: 'Real‑World Use Cases — From Empty States to Hero Scenes',
    summary: 'Illustrations live in many places. Here are practical ways teams use Getillustrations across user journeys and marketing funnels.',
    paragraphs: [
      'Hero Illustrations: Landing pages and top-of-funnel pages benefit most from a unique visual that communicates value quickly. A single well-crafted hero scene can direct attention, set tone, and increase sign‑up conversions.',
      'Empty States & Microcopy: Small, context-specific illustrations soften empty states and error screens. An illustration paired with helpful microcopy reduces frustration and improves perceived polish.',
      'In-App Onboarding: Simple scenes and characters guide new users through first steps without relying solely on modal text. Visual metaphors can make abstract features feel concrete and approachable.',
      'Marketing Assets: Social graphics, blog headers, and email banners use adapted illustration snippets to build brand consistency across channels. Because vector art scales cleanly, the same asset can be used across multiple formats with minor adjustments.',
      'Presentations & Sales Collateral: High-resolution exports make illustrations a fast way to elevate decks and proposals, helping teams communicate product stories with clarity and style.'
    ]
  },
  {
    id: 'comparison',
    title: 'Comparing Alternatives — When to Buy vs. Build',
    summary: 'Choosing between ready-made libraries, browser extensions, or full custom design depends on cost, speed, and brand specificity.',
    paragraphs: [
      'Stock asset libraries are cheap and fast but often lack cohesion. Getillustrations sits between generic stock and custom illustration: curated packs that are cohesive and editable make them more flexible than scattershot downloads.',
      'Browser extensions and free resources sometimes offer convenience but carry inconsistent quality and unclear licensing. For commercial projects, the legal clarity of a paid pack removes procurement headaches and reduces legal risk.',
      'Hiring a freelance illustrator gives full control but at higher cost and longer timelines. When time-to-market matters or when teams need consistent illustration across many touchpoints, a curated library with optional custom work strikes the best balance.'
    ]
  },
  {
    id: 'testimonials',
    title: 'Designer Voices — What Customers Appreciate',
    summary: 'Feedback from designers highlights speed, editability, and the ability to match brand vibes as primary strengths.',
    paragraphs: [
      '“Amazing service, my illustrations got delivered exactly as specified within 1 day.” — Stefania Pizzichi. This kind of testimonial underscores the reliability of both the shop and the custom design offering when timelines matter.',
      'Teams often point to the editable vectors as a time-saver: being able to tweak a color token or change a character prop inside Figma saves hours compared to re-drawing or re-sourcing an asset.',
      'The curated nature of the collections also receives praise: designers appreciate not having to mix and match assets from different authors and then spend time harmonizing composition and tone.'
    ]
  },
  {
    id: 'pricing-and-purchase',
    title: 'Pricing & Purchase Options — One‑Time Purchases with Optional Upgrades',
    summary: 'Getillustrations typically offers one-time purchases for individual packs, with optional add-ons for extended rights or custom work. Pricing varies by pack complexity and included file types.',
    paragraphs: [
      'The marketplace approach means prices differ by collection: smaller packs and freebies are available at low price points, while comprehensive, multi-scene bundles command higher one-time fees. The central advantage is that purchased assets remain available to the buyer without recurring charges.',
      'For teams that need ongoing access to many packs, a negotiated bundle or enterprise arrangement may be available—contacting the vendor for a site or studio license is often the most efficient path.',
      'Custom commissions are priced separately based on scope, level of detail, and delivery timeframe. The vendor usually outlines milestones and revision rounds, which helps teams plan integration into sprints and campaigns.'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices — Integrating Illustrations into Design Systems',
    summary: 'Practical tips for using illustration assets consistently across product and marketing workflows.',
    paragraphs: [
      'Choose a primary collection for product UI and a secondary collection for marketing to maintain visual consistency without forcing identical tone everywhere. This allows product screens to remain pragmatic and marketing materials to be more expressive.',
      'Create a small token set for colors and apply them across illustrations so brand changes propagate quickly. Using shared color tokens or variables in Figma keeps palettes consistent and simplifies updates.',
      'When customizing, prefer non-destructive edits: duplicate source files before major alterations, and keep a record of modified assets so future team members understand what changed and why.',
      'Document usage patterns in your design system: hero usage guidelines, empty state sizing, token application, and recommended export settings help engineers and marketers use assets without repeated questions.'
    ]
  },
  {
    id: 'seo-and-marketing-benefits',
    title: 'SEO & Marketing Benefits — How Quality Visuals Improve Engagement',
    summary: 'Illustrations can improve on-page engagement, reduce bounce rates, and help convey complex ideas that otherwise rely on dense text.',
    paragraphs: [
      'Well-crafted hero art can increase time-on-page by giving visitors something visually interesting to explore while they absorb your headline and value proposition. That increased engagement often correlates with improved conversion rates on landing pages.',
      'Search engines evaluate user behavior signals; pages that retain attention and reduce pogo-sticking can indirectly benefit SEO. While illustrations do not directly change search rankings, they support user experience metrics that search algorithms consider.',
      'From a marketing standpoint, unique illustrations help campaigns stand out in social feeds and emails where templated visuals are common, improving click-through rates and brand recall.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Straight answers to common concerns about file formats, licensing, and customization.',
    paragraphs: [
      'What file types are included? Most packs include SVG, AI, and EPS. High-resolution PNG exports are often available for non-vector workflows.',
      'Can I modify the illustrations? Yes. The standard license permits modification so you can adapt colors, composition, and scale for your product or campaign.',
      'Do I need an account to purchase? Purchasing typically uses a checkout flow where you receive downloadable files tied to your email; enterprise or studio purchases may involve invoicing.',
      'What about refunds? Refund policies depend on the vendor and the platform used for purchase. For custom work, terms usually define revision rounds and acceptance criteria to avoid misunderstandings.'
    ]
  },
  {
    id: 'conclusion',
    title: 'Making the Right Choice for Your Team',
    summary: 'Getillustrations offers a practical middle path between expensive custom work and low-quality stock—providing editable, curated vectors that speed design without compromising on craft.',
    paragraphs: [
      'If your team values quick iterations, consistent visual language, and legally safe assets, a curated vector library like Getillustrations is a strong option. It reduces friction in design-to-development handoffs and shortens the time from concept to live page.',
      'For larger brand or product initiatives, consider combining a curated pack with a small custom commission to inject unique brand elements while maintaining the efficiency of ready-made art.',
      'Below you will find a direct way to amplify the reach of pages like this one: registration on Backlink ∞ which helps secure topical, authoritative backlinks to drive organic visibility and referral traffic.'
    ]
  }
];

export default function Getillustrations() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/getillustrations`;
    } catch {
      return '/getillustrations';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const parts: string[] = [];
    sections.forEach((s) => {
      parts.push(s.summary);
      s.paragraphs.forEach((p) => parts.push(p));
    });
    const words = parts.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Getillustrations, illustrations, vector illustrations, editable vectors, Figma plugin, commercial license');
    upsertCanonical(canonical);

    injectJSONLD('getillustrations-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('getillustrations-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Getillustrations — Premium Vector Illustrations for Designers',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: sections.map((s) => s.title)
    });

    const faqSection = sections.find((s) => s.id === 'faqs');
    const faqItems = faqSection ? faqSection.paragraphs : [];
    injectJSONLD('getillustrations-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((a) => ({ '@type': 'Question', name: a.split('?')[0].trim(), acceptedAnswer: { '@type': 'Answer', text: a } }))
    });
  }, [canonical]);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-50 via-white to-yellow-50 p-6 md:p-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">Getillustrations — Editable Vector Illustrations</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Getillustrations — Premium Vector Art for Web, Apps & Marketing</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">A curated, growing library of editable illustrations and illustration packs designed to help teams launch faster and keep visuals consistent across all touchpoints.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">In-depth guide to illustration workflows, licensing, and use cases.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Best practices for designers and product teams.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Getillustrations</p>
                <p className="mt-2 text-sm text-slate-600">Editable vectors • Figma plugin • commercial license</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="text-slate-700 hover:text-slate-900 hover:underline" href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#register">Register</a>
              </li>
            </ul>
          </aside>

          <article className="flex flex-col gap-10 pb-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
                <header className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-2 text-slate-700">{section.summary}</p>
                </header>
                <div className="prose max-w-none prose-slate">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="register" className="scroll-mt-24 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-yellow-50 p-6 shadow-sm md:p-8">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Boost Organic Reach</h2>
                <p className="mt-2 text-slate-700">If you want pages like this one to rank faster, backlinks from relevant and authoritative sites increase topical authority and drive referral traffic.</p>
              </header>
              <p className="text-lg text-slate-900">
                <a className="underline text-blue-700 hover:text-blue-800" href="https://backlinkoo.com/register" target="_blank" rel="nofollow noopener">Register for Backlink ∞</a>
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
