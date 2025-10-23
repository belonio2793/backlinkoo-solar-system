export type LongSection = { id: string; title: string; paragraphs: string[] };

export const lilyLongSections: LongSection[] = [
  {
    id: 'intro',
    title: 'Introduction: Why Lily Ray is a Reference Point for Modern SEO',
    paragraphs: [
      `Lily Ray is frequently referenced when practitioners discuss algorithmic clarity and high‑quality search results. Over years of public analysis, talk appearances, and detailed writeups, she has built a portfolio that blends forensic investigation with pragmatic guidance. This introduction frames the rest of the document: a set of practical playbooks, measurement strategies, and outreach recommendations that mirror the kinds of work Lily showcases.`,
      `This page has been constructed to serve multiple audiences: the in‑house SEO who wants tactical steps to recover from an algorithmic movement; the content leader who needs a template to scale authoritativeness; and the product manager who must understand how content signals interplay with product design. Each section includes clear examples, operational checklists, and suggested measurement endpoints.`
    ]
  },
  {
    id: 'background',
    title: 'Background and Public Work',
    paragraphs: [
      `Working across product and editorial boundaries, Lily’s public research often zooms into specific signals—like content quality indicators or snippet behavior—in ways that are immediately testable. She’s known for translating ambiguous public signals into crisp experiments that teams can run in production or in small testbeds.`,
      `Her background—split between rigorous research and an approachable public persona—makes her lessons widely applicable. The combination of attention to detail and a communicative voice is a model for practitioners who must push technical change inside larger organizations.`
    ]
  },
  {
    id: 'qrg-translation',
    title: 'Translating Guidelines into Actions: The QRG Link',
    paragraphs: [
      `The Quality Raters’ Guidelines are an interpretive lens, and Lily’s work emphasizes how to turn those interpretive signals into technical and editorial constraints. Rather than chasing the raters’ manual as if it were an algorithmic spec, she advocates a measured approach: use QRG to identify trust gaps, then instrument remediation as measurable experiments.`,
      `A sample workflow: (1) pick 30 representative pages across core templates; (2) rate them against a condensed QRG checklist; (3) synthesize the common negative signals; (4) run targeted fixes and track changes in impressions, CTR, and engagement. This converts subjective judgment into a replicable cycle of learning.`
    ]
  },
  {
    id: 'snippet-experiments',
    title: 'Snippet and SERP Experiments',
    paragraphs: [
      `Lily’s public discussions often call attention to the role of snippets and meta elements as both user-facing and algorithmic signals. Snippets influence CTR, and CTR can feed into engagement-driven ranking adjustments. For competitive topics, snippet tests are high leverage.`,
      `Implementation detail: prioritize pages with meaningful impressions but low CTR. Create two or three headline variations and use a phased rollout or server-side experiment to test which yields a higher qualified CTR (defined as clicks with favorable downstream engagement). Record the results and integrate the winning pattern into template defaults.`
    ]
  },
  {
    id: 'content-pruning',
    title: 'Content Pruning and Consolidation',
    paragraphs: [
      `One recurring pattern in algorithmic drops is content bloat and thin pages. Lily highlights consolidation as an antidote: identify pages with low or declining value and either improve them or consolidate into stronger hubs. The strategy reduces crawl budget waste and concentrates topical authority.`,
      `Practical steps: audit by traffic cohort, flag pages below a defined threshold of impressions and conversions, evaluate whether the content can be merged into a hub or expanded with evidence and data. Consolidation is not a cosmetic fix; it should be accompanied by canonicalization, redirects where appropriate, and content mapping to ensure internal equity is preserved.`
    ]
  },
  {
    id: 'technical-checklist',
    title: 'Technical Checklist for Algorithm Resilience',
    paragraphs: [
      `When preparing for or responding to algorithm updates, the technical foundation should be stable. Lily’s guidance often frames the technical bar as a set of necessary precautions: canonicalization sanity checks, hreflang correctness for international sites, correct robots directives, and a clear sitemap strategy.`,
      `Add automated checks to your CI that validate schema output, ensure canonical tags match expected URLs, and that no important templates are accidentally blocked by robots or meta noindex tags. Automated regression detection reduces the risk of human error during rapid launches.`
    ]
  },
  {
    id: 'ai-and-generative',
    title: 'AI, Generative Summaries and Content Strategy',
    paragraphs: [
      `As generative overviews and assistant-style responses appear in search, Lily’s perspective is to treat those features like another distribution channel. Make your content easily extractable (clear lead statements, summarized answers, and labeled sections) while preserving depth for users who want to dig deeper.`,
      `Add micro‑data artifacts: small tables, downloadables, and short code snippets or data visualizations that an assistant can cite or link back to. This increases the probability that your pages will be referenced by AI features and drive direct traffic.`
    ]
  },
  {
    id: 'link-building-modern',
    title: 'Modern Link Building and Editorial Value',
    paragraphs: [
      `Lily emphasizes editorial value: build assets worth citing. This may mean original data, novel experiments, or highly localised research that large publications will reference. Outreach then becomes a matter of relationship and relevance rather than volume.`,
      `Concretely: create content packages for outreach—brief summaries, PNG/JPEG charts, and short quote snippets that editors can embed quickly. Track not just link count but referral quality and topical relevance.`
    ]
  },
  {
    id: 'processes-and-team',
    title: 'Processes That Scale: Roles and Routines',
    paragraphs: [
      `A key part of Lily’s practical advice is embedding quality into workflows: assign topic owners, create a cadence for content refreshes, and document QA gates for publishing. These routines ensure that improvements persist beyond one-off interventions.`,
      `Set a review compass: monthly triage of high-impact pages, quarterly hub refreshes, and ad-hoc postmortems after traffic anomalies. Make sure each action has an owner and a measurement plan.`
    ]
  },
  {
    id: 'measurement-framework',
    title: 'Measurement: From Leading Indicators to Outcomes',
    paragraphs: [
      `Leading indicators—CTR by query cluster, scroll depth on pillar pages, citation velocity—provide early signs of traction. Lily’s work stresses creating dashboards that show these signals at a glance so teams can prioritize.`,
      `In postmortems, pair metrics with qualitative evidence—examples of SERP features lost or gained, known content changes, and external events. This multi-dimensional analysis is how organizations separate noise from causal factors.`
    ]
  },
  {
    id: 'case-study-examples',
    title: 'Detailed Case Studies and Before/After Examples',
    paragraphs: [
      `Case Study A: Publisher cleanup—Removed 1,200 thin pages that served little user value, redirected when necessary, and consolidated into topical hubs; within four months, impressions and CTR improved across key clusters.`,
      `Case Study B: Product documentation—Standardized authoring templates, injected schema, and converted duplicated FAQs into canonicalized guides; organic traffic for support queries improved while conversion rates increased.`
    ]
  },
  {
    id: 'seo-ops-playbook',
    title: 'SEO Operations Playbook: Sprint Templates and Checklists',
    paragraphs: [
      `Sprint template for QRG audit: Day 1 gather, Day 2-4 evaluate, Day 5 prioritize, Day 6-10 ship quick wins. Each sprint should yield measurable signals.`,
      `Snippet testing playbook: select candidates, generate variants, run micro experiments, analyze engagement metrics, and roll out winners.`
    ]
  },
  {
    id: 'design-and-ux',
    title: 'Design, Readability, and Accessibility',
    paragraphs: [
      `Readable pages win. Lily’s public content underlines the value of scannable structure: clear headings, short paragraphs, callouts, and accessible media. Good UX reduces pogo-sticking and keeps users on page longer—both positive signals.`,
      `Ensure accessible alt text, keyboard navigation, and semantic HTML. Build hero summaries that answer the query in the first 60-120 words while providing deeper sections for full context.`
    ]
  },
  {
    id: 'outreach-and-relationships',
    title: 'Building Relationships with Authors and Publishers',
    paragraphs: [
      `Long-term outreach focuses on relationships. Keep a lightweight CRM for editor contacts and update them when you publish new data that might interest them.`,
      `Personalized pitches that reference a specific article and include an embed-ready asset have higher success rates than generic link requests.`
    ]
  },
  {
    id: 'glossary-and-terms',
    title: 'Glossary: Key Terms and Why They Matter',
    paragraphs: [
      `E-E-A-T: signals that communicate credibility and trust.`,
      `Navboost: behavioral signals used to refine rankings.`,
      `Topical Authority: the breadth and depth of coverage on a subject.`
    ]
  },
  {
    id: 'faq',
    title: 'FAQ: Common Questions Practitioners Ask',
    paragraphs: [
      `Q: How do I prioritize fixes after an update? A: Identify large-impact templates first, run QRG-based samples, and fix critical trust signals immediately.`,
      `Q: Are snippet tests worth it? A: Yes—if done on pages with sufficient impressions, they provide actionable wins in CTR and engagement.`
    ]
  },
  {
    id: 'resources',
    title: 'Resources and Further Reading',
    paragraphs: [
      `Links to Lily’s articles, talks, and videos (see Lily’s site for canonical links).`,
      `Suggested tools: schema validators, snippet testing frameworks, and monitoring dashboards for leading indicators.`
    ]
  },
  {
    id: 'playbook-appendix',
    title: 'Appendix: Templates, Checklists and Example Tickets',
    paragraphs: [
      `Template: QRG condensed checklist for reviewers.`,
      `Checklist: Prepublish checks for hero summary, author credentials, schema presence, and snippet preview.`
    ]
  },
  {
    id: 'conclusion',
    title: 'Conclusion: Operate Quality as a System',
    paragraphs: [
      `Lily Ray’s public body of work demonstrates that quality is not a one-time effort. It requires continuous attention, measurement, and the embedding of clear routines into product and editorial workflows.`,
      `Use these playbooks as a starting point; adapt them to your organization and measure outcomes. The combination of evidence, small experiments, and sustainable routines will produce durable organic visibility.`
    ]
  }
];
