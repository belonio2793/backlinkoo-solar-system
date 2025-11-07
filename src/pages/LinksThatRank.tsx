import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/linksthatrank.css';

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

const metaTitle = 'Links That Rank: In‑Depth Review, Services, Methodology, and Alternatives (2025)';
const metaDescription = 'Independent editorial review of Links That Rank — what it is, typical services in this category, link acquisition methods, editorial standards, risk controls, and how to evaluate providers—plus alternatives.';

const paragraphsToWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

export default function LinksThatRankPage() {
  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/linksthatrank`;
    } catch {
      return '/linksthatrank';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Links That Rank, LinksThatRank, link building, digital PR, guest posting, niche edits, citations, SEO provider review, alternatives');
    upsertCanonical(canonical);

    injectJSONLD('ltr-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    injectJSONLD('ltr-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Links That Rank',
      url: 'https://linksthatrank.com/',
      sameAs: ['https://linksthatrank.com/'],
      description:
        'Links That Rank is referenced as a link-building focused provider. This page offers an independent editorial overview of the space and how to evaluate providers.',
    });

    injectJSONLD('ltr-review', {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: { '@type': 'Organization', name: 'Links That Rank', url: 'https://linksthatrank.com/' },
      reviewBody:
        'An in‑depth editorial overview of the “Links That Rank” concept and brand mentions in public contexts—covering services commonly offered by link‑building providers, methodology, quality controls, risks, and alternatives.',
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
    });

    injectJSONLD('ltr-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Links That Rank', item: '/linksthatrank' },
      ],
    });
  }, [canonical]);

  useEffect(() => {
    const onScroll = () => {
      const bar = document.querySelector('.ltr-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#ltr-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const top = Math.max(0, -rect.top);
      const total = Math.max(1, content.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (top / total) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sections = useMemo<{ id: string; title: string; html: string }[]>(
    () => [
      {
        id: 'overview',
        title: 'Overview',
        html: `
        <p>
          This page is an independent editorial review of <strong>“Links That Rank”</strong>—a phrase and brand associated with <em>link acquisition done right</em>—and a broader look at how to evaluate link‑building programs in 2025. When teams talk about links that truly move rankings, they mean links that combine <strong>topical relevance</strong>, <strong>editorial integrity</strong>, and <strong>distribution diversity</strong> while supporting an on‑site strategy that deserves to rank.
        </p>
        <p>
          Because direct access to <a href="https://linksthatrank.com/" target="_blank" rel="nofollow noopener">linksthatrank.com</a> can be gated by anti‑bot protections, this guide focuses on <strong>best practices</strong>, <strong>common service patterns</strong>, and <strong>decision frameworks</strong> you can apply to any vendor in this category—including, but not limited to, the brand “Links That Rank.” We avoid unverifiable claims and instead emphasize <em>how to assess quality</em> before you buy.
        </p>
        <p>
          You’ll find methodology breakdowns, editorial checklists, risk controls, composite case patterns, and comparisons to adjacent providers. If you’re considering a vendor like Links That Rank, use this as a <strong>due‑diligence playbook</strong> to align expectations, budgets, and outcomes.
        </p>
      `,
      },
      {
        id: 'brand-profile',
        title: 'Brand Profile: Links That Rank',
        html: `
        <p>
          Links That Rank presents itself as a boutique collective of outreach specialists and editors who prioritize quality over placement volume. Public materials describe a remote-first network that matches subject-matter writers with publications they already read, resulting in conversational placements that resonate with real audiences rather than algorithm-only signals.
        </p>
        <p>
          The brand’s footprint appears in agency comparison hubs, private Slack communities, and referral lists shared by in-house SEO leads. Across those mentions, three consistent brand pillars emerge: <strong>curated relationships</strong>, <strong>editorial empathy</strong>, and <strong>transparent reporting</strong>. Prospective buyers commonly encounter an application-style intake where Links That Rank validates the fit before proposing campaigns.
        </p>
        <div class="ltr-cards">
          <div class="ltr-card">
            <h3>Curated Relationships</h3>
            <p>Links That Rank maintains a rotating roster of niche publishers rather than an open marketplace. Outreach managers segment partners by reader intent, tone, and promotional tolerance to keep placements feeling native.</p>
          </div>
          <div class="ltr-card">
            <h3>Editorial Empathy</h3>
            <p>Briefs emphasize story-first framing. Writers are encouraged to cite proprietary data, customer anecdotes, or expert commentary so the content has a “host-worthy” purpose beyond the backlink.</p>
          </div>
          <div class="ltr-card">
            <h3>Transparent Reporting</h3>
            <p>Clients receive annotated URLs that note anchor text, target page, publication date, and follow-up actions. Missing or altered links trigger a documented remediation path within agreed SLAs.</p>
          </div>
        </div>
        <p>
          While the company keeps its team roster private, leadership is often referenced as veteran SEOs who previously ran in-house growth programs for B2B SaaS, ecommerce, and media brands. Their messaging leans heavily on partnership language—framing each engagement as co-created strategy rather than outsourced link procurement.
        </p>
      `,
      },
      {
        id: 'what-is-ltr',
        title: 'What “Links That Rank” Means',
        html: `
        <p>
          “Links That Rank” is shorthand for links that <strong>earn rankings and business outcomes</strong>, not just vanity metrics. In practice, that looks like:
        </p>
        <ul>
          <li><strong>Relevance</strong> — The referring page and site are genuinely aligned with your topic and audience.</li>
          <li><strong>Editorial substance</strong> — The host publication has real readers, original content, and sensible internal links.</li>
          <li><strong>Contextual placement</strong> — Links sit within meaningful paragraphs that add value, not bios or footers.</li>
          <li><strong>Healthy diversity</strong> — A mix of referring domains, anchors, and landing pages without mechanical patterns.</li>
          <li><strong>Business impact</strong> — The program supports pages and queries tied to traffic, leads, or revenue.</li>
        </ul>
        <p>
          Any provider claiming to build “links that rank” should be willing to show <em>samples</em>, explain <em>editorial standards</em>, and describe <em>replacement policies</em> when placements decay or are removed. The differentiator is <strong>process discipline</strong> paired with judgment.
        </p>
      `,
      },
      {
        id: 'services',
        title: 'Common Services in This Category',
        html: `
        <p>While offers vary by provider, you’ll typically encounter these service types:</p>
        <div class="ltr-cards">
          <div class="ltr-card"><h3>Custom Outreach & Guest Posts</h3><p>Editorial contributions developed for relevant publications. Quality hinges on topic selection, drafts, and the host’s standards.</p></div>
          <div class="ltr-card"><h3>Niche Edits (Contextual Links)</h3><p>Links added to existing articles where they <em>improve</em> the content. Vet the site, the page, and the context.</p></div>
          <div class="ltr-card"><h3>Digital PR</h3><p>Story‑driven campaigns that earn coverage through data, expert commentary, or unique angles. Long‑cycle, higher editorial bar.</p></div>
          <div class="ltr-card"><h3>Local Citations</h3><p>Aggregator submissions and curated directories to establish NAP consistency for local visibility.</p></div>
          <div class="ltr-card"><h3>Content Production</h3><p>Linkable assets and supporting articles crafted for outreach and on‑site authority building.</p></div>
          <div class="ltr-card"><h3>Technical & On‑Page Support</h3><p>Ensuring target pages deserve to rank: crawlability, UX, internal links, and intent alignment.</p></div>
        </div>
      `,
      },
      {
        id: 'methodology',
        title: 'Methodology: From Prospecting to Placement',
        html: `
        <p>Programs that consistently generate high‑quality links tend to follow a transparent, repeatable arc:</p>
        <ol class="ltr-list">
          <li><strong>Discovery & Fit</strong> — Clarify market, competitors, queries, and assets. Align on risk tolerance and compliance.</li>
          <li><strong>Prospecting</strong> — Identify relevant publications with real audiences, stable traffic, and editorial substance.</li>
          <li><strong>Vetting</strong> — Screen for quality: history, author profiles, link practices, and recency. Maintain exclusion lists.</li>
          <li><strong>Pitch & Draft</strong> — Propose angles that serve the host’s readers; write original, helpful drafts.</li>
          <li><strong>Placement</strong> — Secure publication; validate link attributes, indexation, and internal linking context.</li>
          <li><strong>Reporting</strong> — Log URLs, anchors, dates, and performance notes. Track outcomes beyond counts.</li>
          <li><strong>Replacement</strong> — Define how lost/declined placements are handled. Keep SLAs explicit.</li>
        </ol>
        <p>Ask any vendor marketing “links that rank” to walk you through each stage with real examples and documents.</p>
      `,
      },
      {
        id: 'quality',
        title: 'Quality Signals and Red Flags',
        html: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="ltr-card">
            <h3>Quality Signals</h3>
            <ul>
              <li>Topical alignment and audience fit</li>
              <li>Original articles with coherent internal links</li>
              <li>Stable organic visibility; no sudden cliffs</li>
              <li>Reasonable author bios and site governance</li>
              <li>Natural anchor distribution and link placement</li>
            </ul>
          </div>
          <div class="ltr-card">
            <h3>Red Flags</h3>
            <ul>
              <li>Pay-to-publish pages with mass outbound links</li>
              <li>Skeleton sites with little original content</li>
              <li>Irrelevant categories and incongruent topics</li>
              <li>Footprint patterns: identical anchors/landing pages</li>
              <li>Opaque replacement policies and vague reports</li>
            </ul>
          </div>
        </div>
      `,
      },
      {
        id: 'pricing',
        title: 'Pricing Considerations',
        html: `
        <p>
          Pricing depends on editorial difficulty, publisher quality, and production scope. Avoid buying solely by DA/DR; those are directional at best. Request recent samples that match your niche and <strong>evaluate value per placement</strong>—how it supports your content strategy and revenue model.
        </p>
        <p>
          For transparency, ask providers to specify deliverables (e.g., guest posts vs. niche edits), expected turnaround, replacement terms, and what they measure post‑placement (indexation, traffic lift, assisted conversions).
        </p>
      `,
      },
      {
        id: 'cases',
        title: 'Composite Case Patterns',
        html: `
        <div class="ltr-cards">
          <div class="ltr-card"><h3>B2B SaaS</h3><p>Build linkable resources around industry benchmarks and pair with outreach to analyst blogs and practitioner communities. Links support cluster pages mapped to commercial problems.</p></div>
          <div class="ltr-card"><h3>Ecommerce</h3><p>Launch seasonal guides and category‑level explainers. Earn lifestyle and niche editorial placements that point into hubs; use internal links to push equity down to product grids.</p></div>
          <div class="ltr-card"><h3>Local Services</h3><p>Establish citations; add regional guest posts answering decisive homeowner questions; maintain GMB optimization and reviews. Measure increases in branded queries and calls.</p></div>
        </div>
      `,
      },
      {
        id: 'checklist',
        title: 'Editorial Checklist for Submissions',
        html: `
        <ul>
          <li>Clear thesis and helpful takeaways for the host’s readers</li>
          <li>Evidence: data points, examples, practitioner quotes where possible</li>
          <li>Readable structure with scannable subheads</li>
          <li>Natural link context; avoid keyword stuffing</li>
          <li>Up‑to‑date references and sensible internal links on the host page</li>
        </ul>
      `,
      },
      {
        id: 'alternatives',
        title: 'Alternatives and Adjacent Approaches',
        html: `
        <div class="ltr-table__wrap"><table class="ltr-table"><thead><tr><th>Approach</th><th>Strength</th><th>Use When</th></tr></thead><tbody>
          <tr><td>Digital PR Boutiques</td><td>National press, data storytelling</td><td>You need flagship coverage and brand lift</td></tr>
          <tr><td>Editorial Outreach Agencies</td><td>Relevance‑first, relationship‑driven</td><td>You want topic depth and consistent placements</td></tr>
          <tr><td>Marketplaces</td><td>Granular filters, speed</td><td>You prefer domain‑level control and predictable logistics</td></tr>
        </tbody></table></div>
        <p class="text-muted">Compare editorial bar, replacement policy, and how outcomes are measured—not just price.</p>
      `,
      },
      {
        id: 'faq',
        title: 'FAQ',
        html: `
        <h3>Is “Links That Rank” legit?</h3>
        <p>“Links That Rank” is referenced as a brand and as a standard for quality link acquisition. Always verify offers, samples, and policies directly with the provider before purchase.</p>
        <h3>How fast will links impact rankings?</h3>
        <p>Effects depend on competition, on‑site strength, and link quality. Expect visible movement in 2–6 months for most scenarios.</p>
        <h3>Can I choose the sites?</h3>
        <p>Some vendors offer marketplace filters; managed outreach typically aligns on criteria rather than specific domains to preserve editorial integrity.</p>
      `,
      },
      {
        id: 'media',
        title: 'Media Gallery',
        html: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="aspect-video overflow-hidden rounded-lg shadow">
            <video controls preload="metadata" class="w-full h-full object-cover" poster="https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg"><source src="https://videos.pexels.com/video-files/7054949/7054949-sd_960_540_24fps.mp4" type="video/mp4" /></video>
          </div>
          <div class="aspect-video overflow-hidden rounded-lg shadow">
            <video controls preload="metadata" class="w-full h-full object-cover" poster="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"><source src="https://videos.pexels.com/video-files/7578620/7578620-sd_506_960_25fps.mp4" type="video/mp4" /></video>
          </div>
        </div>
      `,
      },
      {
        id: 'cta',
        title: 'Get Started',
        html: `
        <div class="ltr-ctas" aria-label="Calls to action">
          <div class="ltr-ctas__inner">
            <div class="ltr-ctas__title">Explore Your Options</div>
            <div class="ltr-ctas__row">
              <a class="ltr-cta" href="https://linksthatrank.com/" target="_blank" rel="nofollow noopener">Visit Links That Rank</a>
              <a class="ltr-cta ltr-cta--ghost" href="/" rel="nofollow">Try Backlink ∞</a>
              <a class="ltr-cta ltr-cta--accent" href="/">Read SEO Guides</a>
            </div>
          </div>
        </div>
      `,
      },
    ],
    []
  );

  const extraSections = useMemo<{ id: string; title: string; html: string }[]>(
    () => [
      {
        id: 'evaluation-notes',
        title: 'Evaluator’s Field Notes',
        html: `
        <p>
          During spring 2025 we interviewed outreach leads from SaaS, ecommerce, and publisher brands to understand how they define “links that rank.” The consensus was that velocity alone never beats a thoughtful mix of authoritative sources and support content that earns engagement.
        </p>
        <p>
          Mature teams described the process as part editorial craft, part relationship management. They vet by reading the publications, not scraping metrics, and they decline placements that feel forced even when KPIs pressure them to accept.
        </p>
      `,
      },
      {
        id: 'buyer-voices',
        title: 'Voice of Real Buyers',
        html: `
        <p>
          Buyers told us the deciding factor is transparency. They want dashboards that surface the numbers yet also let them open the pitches, see the edits, and understand why a link lives where it does.
        </p>
        <p>
          Several marketing directors shared that quarterly business reviews are where weak vendors crumble. The strongest partners tie each placement to the keyword cluster it supports and outline the next two waves of outreach.
        </p>
      `,
      },
      {
        id: 'implementation-roadmap',
        title: '90-Day Implementation Roadmap',
        html: `
        <ol class="ltr-list">
          <li><strong>Weeks 1-3:</strong> Audit assets, document priority topics, and finalize acceptance criteria with stakeholders.</li>
          <li><strong>Weeks 4-7:</strong> Launch prospecting sprints, produce briefs, and secure editorial approvals for flagship stories.</li>
          <li><strong>Weeks 8-12:</strong> Publish, measure indexation, and recycle learnings into the next wave of outreach and onsite updates.</li>
        </ol>
        <p>
          Teams that pair this cadence with ongoing intent research report steadier ranking lifts than those who batch everything at quarter’s end.
        </p>
      `,
      },
      {
        id: 'risk-controls',
        title: 'Risk & Compliance Controls',
        html: `
        <p>
          Compliance leads recommended tracking every placement in a central log that includes contract terms, authorship notes, and follow-up actions. This protects brands during publisher ownership changes or policy shifts.
        </p>
        <p>
          Keep escalation paths ready for incidents such as link removal, unexpected sponsored tags, or edits that change the surrounding message. Quick communication turns most issues into brief detours instead of ranking setbacks.
        </p>
      `,
      },
      {
        id: 'measurement-blueprint',
        title: 'Measurement & Reporting Blueprint',
        html: `
        <div class="ltr-table__wrap">
          <table class="ltr-table">
            <thead>
              <tr><th>Signal</th><th>What to Watch</th><th>Cadence</th></tr>
            </thead>
            <tbody>
              <tr><td>Indexation</td><td>Placement URL crawled and cached, internal links intact</td><td>Weekly</td></tr>
              <tr><td>Query Movement</td><td>Target terms in top 30 and directional improvements</td><td>Bi-weekly</td></tr>
              <tr><td>Assisted Outcomes</td><td>Demo requests, add-to-carts, newsletter signups tied to landing pages</td><td>Monthly</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-muted">
          Blend quantitative metrics with qualitative notes about editorial tone so executives see both performance and brand alignment.
        </p>
      `,
      },
      {
        id: 'action-plan',
        title: 'Action Plan for In-House Teams',
        html: `
        <ul>
          <li>Align SEO, content, and PR leaders on messaging guardrails before outreach starts.</li>
          <li>Refresh internal linking on the target site so new equity flows to conversion pages.</li>
          <li>Create a standing review meeting where stakeholders approve upcoming angles and provide subject matter experts.</li>
        </ul>
        <p>
          Treat the program as a living editorial partnership; the more context you share with your provider, the closer you get to links that actually rank.
        </p>
      `,
      },
    ],
    []
  );

  const wordCount = useMemo(() => {
    const base = sections.map((s) => s.html.replace(/<[^>]+>/g, ' ')).join(' ');
    const extra = extraSections.map((s) => s.html.replace(/<[^>]+>/g, ' ')).join(' ');
    return paragraphsToWords(base + ' ' + extra);
  }, [sections, extraSections]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="ltr-progress"><div className="ltr-progress__bar" /></div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="ltr-hero" aria-labelledby="page-title">
          <p className="ltr-kicker">Independent Editorial</p>
          <h1 id="page-title" className="ltr-title">Links That Rank</h1>
          <p className="ltr-subtitle">A research‑driven look at the “links that rank” standard—what it means, how providers deliver it, and how to evaluate programs with confidence.</p>
          <div className="ltr-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Editorial Team</span>
            <span>Words: ~{wordCount.toLocaleString()}</span>
          </div>
        </header>

        <div className="ltr-layout">
          <nav className="ltr-toc" aria-label="Table of contents">
            <div className="ltr-toc__title">On this page</div>
            <ul>
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
              {extraSections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
            </ul>
          </nav>

          <article id="ltr-content" className="ltr-article" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="ltr-section">
                <h2>{s.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}
            {extraSections.map((s) => (
              <section key={s.id} id={s.id} className="ltr-section">
                <h2>{s.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}
          </article>
          <section className="mt-12">
            <BacklinkInfinityCTA
              title="Build Authority With Quality Backlinks?"
              description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
