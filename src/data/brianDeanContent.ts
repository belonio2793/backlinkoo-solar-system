export type Section = {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
};

export type Stat = {
  label: string;
  value: string;
  description: string;
};

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export const brianDeanSections: Section[] = [
  {
    id: 'overview',
    title: 'Brian Dean: A Complete SEO Deep Dive',
    summary:
      'A comprehensive exploration of Brian Dean, Backlinko, and the ideas that shaped modern link building, content strategy, and technical SEO.',
    paragraphs: [
      'Brian Dean is widely known for practical, high‑leverage search strategies that combine quality content, rigorous on‑page optimization, and data‑driven link acquisition. His work popularized frameworks that help teams move beyond tactics into repeatable roadmaps that actually scale.',
      'This page consolidates the most useful knowledge for the “Brian Dean” search intent. It brings together a biography, landmark methods, case studies, workflows, and up‑to‑date recommendations so readers can execute with confidence.',
      'Our approach emphasizes clarity over hype: what to do first, how to measure progress, where compounding gains come from, and how to adapt as ranking systems evolve. The goal is decision‑ready guidance—complete, current, and practical.',
    ],
  },
  {
    id: 'who-is-brian-dean',
    title: 'Who Is Brian Dean?',
    summary:
      'An entrepreneur, educator, and researcher known for translating complex SEO into clear playbooks that marketers can execute at any stage.',
    paragraphs: [
      'Brian Dean built credibility by demonstrating repeatable results, documenting each step, and publishing evidence‑backed posts that earned broad adoption across the industry. His educational focus made advanced concepts accessible to in‑house teams, freelancers, and founders.',
      'Beyond articles, his body of work includes long‑form training, video breakdowns, templates, and benchmark studies. These assets influenced on‑page standards, content architecture, and earned‑media strategies now seen across high‑performing sites.',
    ],
  },
  {
    id: 'signature-methods',
    title: 'Signature Methods and Mental Models',
    summary:
      'Core ideas that shaped modern content quality, link outreach, and user‑first optimization.',
    paragraphs: [
      'Content that ranks is content that solves problems completely. The editorial bar is not word count—it is task completion. Pages that anticipate follow‑up questions, structure answers cleanly, and offer credible sources outperform thin summaries.',
      'Link acquisition scales when the underlying asset is worth citing. The most reliable outreach starts with something risk‑free for the recipient: unique data, practical frameworks, or examples that raise the quality of their own pages.',
      'Technical discipline lowers friction. Clean HTML, fast rendering, stable layout, and accessible components create a foundation where great content can be discovered, consumed, and shared without resistance.',
    ],
  },
  {
    id: 'content-architecture',
    title: 'Content Architecture That Wins',
    summary:
      'A simple structure for satisfying search intent, improving dwell time, and clarifying topical authority.',
    paragraphs: [
      'Open with a crisp promise that matches the query, then deliver a scannable overview that sets expectations. Use visual hierarchy to guide reading: headings, callouts, checklists, and expandable sections.',
      'Group related tasks into sections that can stand alone. A reader who scrolls to “Outreach Templates,” for example, should find a complete mini‑guide they can apply immediately.',
      'Close with next steps that reduce uncertainty: workflows, tool setups, and metrics to track. Clarity keeps users engaged longer and makes word of mouth more likely.',
    ],
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research and Topic Discovery',
    summary:
      'From seed terms to semantic clusters, here is a practical research flow that aligns content with demand.',
    paragraphs: [
      'Start with business‑critical topics, not just high volume. Look for queries tied to real problems buyers face: how‑to tasks, comparisons, and troubleshooting. Use these terms to seed tools like Search Console, keyword databases, and SERP scraping.',
      'Cluster by intent and job‑to‑be‑done. A successful cluster offers one definitive hub page and several focused spokes that answer tightly scoped questions. Internal links reinforce relationships and guide users through the journey.',
      'Validate with first‑party data. Prioritize terms viewers already search on your site, customer questions in support logs, and email replies. These signals reduce guesswork and speed up traction.',
    ],
  },
  {
    id: 'on-page-optimization',
    title: 'On‑Page Optimization: The Practical Checklist',
    summary:
      'A modern, user‑first checklist for titles, headings, media, and structured data.',
    paragraphs: [
      'Write titles for clarity and curiosity. Include the primary concept early, avoid truncation, and make the outcome obvious. Meta descriptions should preview answers, not repeat headlines.',
      'Headings are landmarks. Each H2 should represent a complete idea; H3s expand details. Keep paragraphs tight. Use descriptive alt text, compressed images, and captions that add insight. Cite sources where relevant.',
      'Add schema where it helps searchers: FAQPage, HowTo, Product, and Article. Structured data should reflect the visible content faithfully and pass validation cleanly.',
    ],
  },
  {
    id: 'link-building',
    title: 'Link Building That Compounds',
    summary:
      'Editorial links come from value, timing, and frictionless collaboration.',
    paragraphs: [
      'Lead with something people want to reference. Examples include industry benchmarks, original surveys, teardown analyses, and interactive tools. When an asset fills a knowledge gap, outreach feels like sharing—not asking.',
      'Personalize with context. Reference the specific section where your contribution fits, explain the benefit to their readers, and keep your ask small. Offer ready‑made snippets or charts to reduce workload for editors.',
      'Make follow‑through effortless. Track responses, send concise reminders, and offer alternatives like quotes, datasets, or visuals. Respectfully persistent outreach outperforms spray‑and‑pray.',
    ],
  },
  {
    id: 'technical-foundation',
    title: 'Technical Foundation and Performance',
    summary:
      'Speed, stability, and accessibility are ranking multipliers because they amplify user satisfaction.',
    paragraphs: [
      'Keep pages lightweight: minify assets, optimize images, remove render‑blocking scripts, and embrace server hints. Stable layout prevents layout shifts that frustrate readers.',
      'Design for accessibility. Semantic markup, focus states, legible contrast, and keyboard navigation expand reach and lower bounce rates. Accessibility is both inclusive and economically rational.',
      'Monitor with real data. Use field metrics (Core Web Vitals), error logs, and crawl reports to identify regressions quickly and prioritize fixes with the highest impact on users.',
    ],
  },
  {
    id: 'content-upgrades',
    title: 'Content Upgrades and Refresh Cycles',
    summary:
      'Maintenance is leverage: updates preserve rankings and create new link opportunities.',
    paragraphs: [
      'Schedule refreshes for pages that matter: update screenshots, expand examples, replace outdated tactics, and clarify steps that caused confusion. Each upgrade is a reason to notify audiences and collaborators.',
      'Add new sections when queries evolve. If readers increasingly ask for AI prompts, API workflows, or privacy considerations, expand the guide to address them in depth.',
      'Document changes and results. Over time you will learn which edits move KPIs and which are cosmetic, making future updates faster and more targeted.',
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement and Benchmarks',
    summary:
      'Define success by outcomes: qualified traffic, engagement, conversions, and durable rankings.',
    paragraphs: [
      'Track a minimal set of leading indicators: impressions for target clusters, scroll depth on cornerstone pages, referenced links from relevant domains, and conversion rate from informational posts.',
      'Use rolling cohorts to see if refreshes and links stick. Compare performance across clusters to focus effort on the topics with the most business value.',
      'Pair dashboards with narrative. Report what changed, why it changed, and what you will do next. Clear communication keeps teams aligned and stakeholders supportive.',
    ],
  },
  {
    id: 'case-studies',
    title: 'Field‑Tested Case Studies',
    summary:
      'Patterns from campaigns that grew organic traffic and captured competitive positions.',
    paragraphs: [
      'A B2B SaaS team consolidated thin posts into one topic hub, added a technical integration guide, and launched a small data study. The result: higher dwell time, organic links from partner blogs, and a net lift in demos without increasing ad spend.',
      'An ecommerce brand rebuilt category pages with richer specs, comparison tables, and owner‑submitted photos. Paired with selective digital PR, the site captured non‑brand queries and reduced reliance on marketplace traffic.',
      'A publisher created a glossary attached to pillar content. Internal links improved topical clarity and pages won “People also ask” boxes as the glossary scaled.',
    ],
  },
  {
    id: 'future',
    title: 'The Future of SEO According to First Principles',
    summary:
      'Amid algorithmic changes, the durable advantage is still helpful content, cited by real people, delivered on fast pages.',
    paragraphs: [
      'Automation will keep accelerating production, but trust is human. Credible sources, expert reviewers, and first‑party evidence will separate great pages from generic summaries.',
      'SERP features will change, yet intent will not. The fastest path to resilience is to create resources people would bookmark even if search disappeared. Those assets naturally collect mentions, shares, and direct visits.',
      'Organizations that instrument learning—testing, documenting, and shipping upgrades—compound faster than those memorizing tactics. This operating system outlives any single update.',
    ],
  },
  {
    id: 'resources',
    title: 'Starter Resources and Workflows',
    summary:
      'Use these practical checklists to operationalize research, on‑page quality, and link outreach.',
    paragraphs: [
      'Research Workflow: define ICP problems, gather SERP snapshots, cluster by intent, map hub/spoke coverage, and create a publishing queue with owners and due dates.',
      'On‑Page QA: title clarity, intro promise, section completeness, media optimization, schema validation, accessibility pass, and internal links to relevant pages.',
      'Outreach Cadence: shortlist relevant sites, craft context‑aware messages, offer a ready‑to‑embed asset, schedule two short reminders, and close the loop with a thank‑you and optional follow‑up idea.',
    ],
  },
];

export const brianDeanStats: Stat[] = [
  { label: 'Primary Topic', value: 'SEO & Link Building', description: 'Known for frameworks that simplify complex SEO into clear actions.' },
  { label: 'Education Focus', value: 'Step‑by‑Step Guides', description: 'Actionable, example‑driven tutorials and templates.' },
  { label: 'Core Strength', value: 'Evidence‑Backed Content', description: 'Original research, teardowns, and benchmark studies.' },
  { label: 'Audience', value: 'Marketers & Operators', description: 'In‑house teams, founders, agencies, and freelancers.' },
];

export const brianDeanTimeline: TimelineEvent[] = [
  { year: 'Early Career', title: 'From experiments to frameworks', description: 'Hands‑on testing informed a playbook approach—small wins repeated consistently.' },
  { year: 'Backlinko Launch', title: 'Educational brand emerges', description: 'In‑depth posts and case studies build a loyal audience of practitioners.' },
  { year: 'Courses & Research', title: 'Scaling education', description: 'Structured training and original studies expand reach and industry impact.' },
  { year: 'Today', title: 'Systems over hacks', description: 'Emphasis on durable systems, user‑first design, and measured execution.' },
];

export const brianDeanFaqs: FAQ[] = [
  {
    question: 'What is Brian Dean known for?',
    answer:
      'He is known for translating complex SEO—especially link building and content strategy—into practical frameworks that teams can apply step by step.',
  },
  {
    question: 'How does his approach differ from common tactics?',
    answer:
      'It prioritizes complete problem‑solving content, credible sources, and value‑first outreach, supported by clean technical foundations and continuous refresh cycles.',
  },
  {
    question: 'Is link building still effective?',
    answer:
      'Yes—when the asset is inherently worth citing. Editorial links grow naturally from research, tools, and examples that improve other people’s pages.',
  },
  {
    question: 'What should beginners do first?',
    answer:
      'Pick one cluster that matters to the business, ship one great hub, and publish three spokes. Measure, refresh, then expand. Momentum beats volume.',
  },
];

export const brianDeanGlossary: GlossaryEntry[] = [
  { term: 'Cornerstone Content', definition: 'Definitive pages that anchor a topic cluster and attract links over time.' },
  { term: 'Topic Cluster', definition: 'A hub‑and‑spoke architecture that satisfies a whole set of related search intents.' },
  { term: 'Editorial Link', definition: 'A natural citation from a relevant page earned by merit, not by manipulation.' },
  { term: 'Schema Markup', definition: 'Structured data that helps search engines understand page meaning and eligibility for rich results.' },
  { term: 'Core Web Vitals', definition: 'Field metrics for loading, interactivity, and visual stability that correlate with user satisfaction.' },
];
