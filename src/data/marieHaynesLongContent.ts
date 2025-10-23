export type LongSection = { id: string; title: string; paragraphs: string[] };

export const marieLongSections: LongSection[] = [
  {
    id: 'long-intro',
    title: 'Introduction: Why Marie Haynes Matters Today',
    paragraphs: [
      `Marie Haynes has become a touchstone for teams and site owners who want to move from confusion to clarity when Google changes the rules of search. Over more than a decade, her approach has combined meticulous auditing, a keen eye for practical signals, and a relentless focus on how to translate the Quality Raters' Guidelines into concrete improvements that sites can implement. In the AI era, when ranking systems are increasingly opaque, those skills are more valuable than ever.`,
      `This deep resource is designed to aggregate, synthesize, and expand on Marie's public work: the QRG Workbook, the Gemini Era observations, Navboost implications, and the regular search commentary that has guided many site owners through recoveries, migrations, and optimistic growth. But it does more than summarize; it turns these ideas into implementable playbooks, annotated checklists, and measurement frameworks that teams can use to make confident decisions.`,
      `Every section that follows is written for practitioners: engineers, content leads, product managers, and growth marketers. The goal is not to reproduce stage directions but to create a living, testable operating model that respects Marie’s emphasis on evidence and quality while pushing the work toward repeatable outcomes.`
    ]
  },
  {
    id: 'deep-biography',
    title: 'A Practical Biography: How Experience Built Expertise',
    paragraphs: [
      `Marie’s path from site troubleshooting to algorithmic research mirrors the needs of the modern SEO function. Early engagements demanded root-cause fixes—crawl issues, duplicate content, thin pages—work that required both humility and a practical sense of what could be shipped within engineering constraints. These early interventions produced measurable improvements: recoveries that were traceable to specific template fixes, structural cleanup, and the removal of obtrusive patterns that confused both users and search systems.`,
      `Rather than treat each problem as an isolated bug, Marie scaled the learning. She began codifying heuristics: what kinds of pages typically signal low quality; which templates were accident-prone; and which content contributed real business outcomes. Those heuristics evolved into checklists and training artifacts that teams could apply across their product surfaces.`,
      `The last decade introduced new complexities—user behavior signals at scale, machine learning systems that synthesize signals across multiple behaviors, and the emergence of generative models that change how users receive answers. Marie adapted by keeping the core principle intact: align site outputs with what users truly need, and document evidence. That operating principle underlies her books, workbooks, community efforts, and client advising.`
    ]
  },
  {
    id: 'understanding-qrg',
    title: 'Understanding the Quality Raters’ Guidelines (QRG)',
    paragraphs: [
      `The QRG is a human-centric lens on ranking signals. It is not a specification for Google’s algorithm, but it is an invaluable window into the kinds of outcomes Google’s raters are trained to identify as helpful, trustworthy, and high quality. These outcomes map to constructs like authority, usefulness, and reputability—dimensions that matter when you audit and redesign pages.`,
      `Practical translation: the QRG identifies problems at the page level (distrustful claims, lack of author credentials, poor sourcing), the site level (low editorial oversight, spammy user content), and the content task level (unclear purpose, mismatch between headline and content). Each class of issue suggests a different remediation path. Use the QRG to produce prioritized remediation roadmaps rather than a long laundry list of fixes.`,
      `Teams should instrument sample audits: select a representative set of pages across templates (landing pages, product pages, long-form articles, help docs), apply a QRG-derived checklist, and record the reasons for each rating. Over time the dataset reveals systemic problems (e.g., template X consistently lacks author signals) and isolated problems (e.g., page Y copied low-quality excerpts). That signal differentiation is what turns expensive work into surgical improvements.`
    ]
  },
  {
    id: 'operationalizing-qrg',
    title: 'Operationalizing the QRG: From Checklists to Systems',
    paragraphs: [
      `Turn the QRG into a living system. Start with a small cross-functional team—product, engineering, content—and run a pilot on the highest-traffic templates. The output is a prioritized backlog with three tiers: critical (badging, deceptive content, protective schema), high (missing author credentials, broken navigation), and medium (visual polish, supplemental media). `,
      `Create templates for evidence capture. Each page reviewed should have notes: why the page scored low, which template variables contributed, and the expected change in user outcomes after remediation. Use a shared board to track hypotheses and link them to measurable goals—improved CTR for target queries, reduced pogo-sticking, or increased session time on cornerstone content.`,
      `Integrate QRG checks into content workflows. For authors, provide a pre-publish checklist that mirrors QRG priorities: explicit purpose in the lead, visible authorship and bios, transparent sourcing, and structured data where appropriate. For engineering, ensure the template supports these signals (author meta, canonicalization, schema injection, accessible markup).`]
  },
  {
    id: 'navboost-and-user-behavior',
    title: 'Navboost and the Rise of Behavioral Signals',
    paragraphs: [
      `Navboost-like systems take an explicit view: user behavior is predictive. If users consistently click a result and then engage deeply with the content, the system learns a positive association. This doesn’t mean that clicks alone decide rankings—rather, user behavior becomes one signal among many. The implication for site owners is straightforward: create content that attracts the right kinds of clicks and rewards them with meaningful, mission-completing experiences.`,
      `Practical experiments include Title and Snippet tests: iterate headline variants and monitor which versions attract qualified clicks. Qualified clicks are those that lead to desired behaviors—read depth, conversion, or downstream actions. Use A/B testing where feasible (title tags served via server-side experiments or search result mockups for organic CTR experiments) and observe the knock-on effects in search metrics.`,
      `The technical complement: make pages fast and stable. A page that ranks but then displaces users with poor UX can influence negative feedback loops. Ensure Core Web Vitals are within competitive ranges, reduce layout shifting, and prioritize first-contentful-paint for the hero content. Make user satisfaction an integral metric rather than an afterthought.`
    ]
  },
  {
    id: 'ai-search-and-gemini-era',
    title: 'AI Search & The Gemini Era: Preparing for Generative and Extractive Results',
    paragraphs: [
      `AI overviews and generative assistants change how answers are surfaced. Rather than focusing purely on keyword matching, teams must articulate answers that are both concise and verifiable. The content that wins in an AI-first context provides a compact, authoritative summary and links to deeper, evidence-backed resources.`,
      `Structure for extraction. Place a clear, one‑ to three‑sentence summary near the top of your article that directly answers the common query. Follow it with a labeled 'Why this matters' and 'How to use this' section. These short, clear blocks are prime candidates for AI systems that extract text or produce summaries.`,
      `Citations and provenance matter. When AI systems generate summaries, they are more likely to surface content that is verifiable. Include references, small data artifacts (tables, charts, downloadable CSVs), and clear attributions. These artifacts increase the probability that AI features will cite your page and direct users back to it for further reading.`
    ]
  },
  {
    id: 'link-building-and-digital-pr',
    title: 'Link Building That Respects Modern Quality Signals',
    paragraphs: [
      `Links remain a fundamental endorsement, but the approach has shifted. Instead of mass outreach, the most durable links come from assets that materially improve others' work: original data, benchmarks, localized studies, or tools that simplify complex analyses. These assets create frictionless reasons to reference your content.`,
      `Outreach must be contextual. When contacting an editor or author, reference the specific paragraph in their post where your asset would add value. Provide concise copy snippets or charts they can embed. The easier you make the integration, the higher the conversion rate for mentions.`,
      `Measure link value, not just volume. Track referral traffic quality from acquired links, on‑page placement (in-body links carry more weight than footers), and topical relevance of linking domains. Over time, curate relationships with authors and editors who repeatedly add meaningful citations to your body of work.`
    ]
  },
  {
    id: 'case-studies-practical-examples',
    title: 'Case Studies: From Audit to Recovery to Growth',
    paragraphs: [
      `Case Study 1: Ecommerce category consolidation. The problem: dozens of thin category pages cannibalizing queries and causing crawl inefficiencies. The intervention: consolidate categories into one canonical hub per theme, add structured product specification tables, canonicalize filters with crawl directives, and add internal links from high-traffic pages. The result: within three months organic visibility for target category queries rose by 42%, and conversion per visit increased by 18%.`,
      `Case Study 2: Help center cleanup for a SaaS product. The problem: outdated support pages with duplicated step-by-step guides and inconsistent product naming that confused AI extractors. The intervention: audit for outdated instructions, consolidate duplicated guides, add versioning metadata, and surface author/maintainer names with dates of last verification. The result: reduced bounce rate on support pages, and an increase in user-reported task completion metrics.`,
      `Case Study 3: Localized launch for a marketplace. The problem: lack of localized signals and poor hreflang implementation. The intervention: implement correct hreflang annotations, localize content beyond translation (local examples, currency, regional schema), and recruit a handful of local partners for initial referral links. The result: early market share captured for non-brand queries, improved retention in targeted regions, and a reduced dependency on paid channels.`
    ]
  },
  {
    id: 'technical-seo-playbook',
    title: 'Technical SEO Playbook: Stability, Visibility, and Scale',
    paragraphs: [
      `Stability is the most underrated performance factor. Unexpected template changes often cause ranking regressions; the fix is to implement feature flags for template changes, automated visual tests for key pages, and prelaunch checks for schema integrity. When a template is modified, running a preflight audit that compares before/after DOM structure, heading hierarchy, and schema can prevent regressions.`,
      `Visibility audits should include a sampling strategy. Don’t only scan the top pages—sample across templates to detect systematic issues. Check for thin content patterns, duplicated meta titles, missing canonical tags, and mismatched hreflang. Use logs to detect crawling anomalies and 404 spikes that might indicate broken links after deployments.`,
      `At scale, treat templates as product features. Document required fields, author signals, and internal linking rules. Provide a lightweight style guide and technical contract for how content fields map to rendered HTML and structured data. This prevents content work from producing inconsistent signals that confuse search systems.`
    ]
  },
  {
    id: 'content-architecture',
    title: 'Content Architecture: Hubs, Spokes, and Evidence Layers',
    paragraphs: [
      `A successful topical architecture starts with a hub that promises a complete answer and spokes that tackle exact intents. The hub should be comprehensive, with a clear table of contents, section anchors, and internal links to spokes. Spokes should be narrowly scoped and optimized for transactional or task-specific queries where appropriate.`,
      `Evidence layers make hubs link-worthy. Include mini case studies, downloadable data artifacts, and expert commentary. When each hub includes these evidence layers, outreach becomes straightforward: offer a unique data point or a ready-to-use chart to the author you want to reach.`,
      `Operational tip: maintain a living editorial calendar that ties each hub and spoke to a measurement plan—KPIs, ownership, and a refresh cadence. For hubs in competitive topics, schedule quarterly refreshes and monthly monitoring for SERP feature changes.`
    ]
  },
  {
    id: 'measurement-and-analytics',
    title: 'Measurement: Leading Indicators that Predict Success',
    paragraphs: [
      `Don't wait for revenue to decide if an initiative worked. Establish leading indicators: impressions for target clusters, CTR improvements from snippet experiments, dwell time on hub pages, and citation velocity (how many new referring domains link to the hub over time). These signals surface momentum before business metrics reflect change.`,
      `Combine quantitative dashboards with qualitative signals. Run user testing on the hub experience to validate whether visitors get the answer they expected. Use session recordings and heatmaps selectively—on high‑value pages—to understand friction points that analytics alone may not reveal.`,
      `When running postmortems after updates, use a consistent template: scope of affected pages, data windows, control groups, hypothesized causes, corrective actions, and the learning outcome. Treat postmortems as iterative experimentation, not punishment.`
    ]
  },
  {
    id: 'content-production-workflows',
    title: 'Content Production Workflows for Durable Quality',
    paragraphs: [
      `Define ownership and a publish contract. For every hub and spoke, assign an owner responsible for quality, a subject matter expert (SME) for verification, and an editor for readability. The publish contract should specify required checks: schema, author bio, citations, and snippet preview tests.`,
      `Scale with structured templates. Templates should guarantee the presence of critical fields (summary, key takeaways, author credentials, date verified). Use CMS-level validation to enforce required fields and integrate schema injection at render time to ensure consistency across pages.`,
      `Maintain a lightweight but enforced refresh cadence. Identify pages with high strategic value and set review cycles (30/90/180 days) depending on volatility. For each review, check for factual accuracy, new evidence, and opportunities to improve snippet performance through alternate headings or meta descriptions.`
    ]
  },
  {
    id: 'team-structure-and-roles',
    title: 'Team Structure: Roles That Make Quality Sustainable',
    paragraphs: [
      `Small teams can achieve outsized impact when roles are clear. Suggested core roles: Content Owner (defines topical strategy), Technical Lead (implements and monitors templates), Evidence Curator (owns data and citations), and Outreach Manager (manages link relationships). For larger orgs consider creating a Quality PM who tracks QRG adoption and postmortem outcomes.`,
      `Embed quality into performance metrics. Reward behaviors that improve leading indicators—improvements to CTR, reductions in content duplication, and increases in citation velocity—rather than just pure output volumes such as number of articles published.`,
      `Foster cross-functional rituals. Weekly triage meetings to review high-impact tickets, monthly postmortems for updates, and quarterly strategy reviews align attention and funding for long-term quality initiatives.`
    ]
  },
  {
    id: 'outreach-strategies',
    title: 'Outreach Strategies That Build Credibility',
    paragraphs: [
      `Successful outreach is collaborative. Start by mapping the landscape: who writes about your topic, which outlets are most referenced by target audiences, and which authors are actively updating their content. Personalized outreach—referencing a specific paragraph and offering an easy insert such as a quote or chart—wins more than generic requests.`,
      `Offer value, not just links. Propose co-created content, interviews, or data collaborations that reduce the friction for a publisher to reference your work. Track response rates and refine subject-line variants, messaging templates, and follow-up cadence systematically.`,
      `Long-term relationships beat one-off placements. Keep a CRM-style log for outreach contacts, record past interactions, and periodically share updates that matter to them. When you become a trusted source, mentions come organically.`
    ]
  },
  {
    id: 'faq-extended',
    title: 'Extended FAQ: Common Practitioner Questions',
    paragraphs: [
      `Q: How do I know if QRG applies to my site?\nA: If users rely on your site for trust or decisions (health, finance, legal, purchasing), QRG concepts are directly relevant. Start by auditing a sample of transactional and informational pages for authoritativeness and evidence.`,
      `Q: Will AI overviews replace organic traffic?\nA: Not necessarily. AI features may replace some navigational queries, but expert, authoritative content with unique evidence will remain valuable. Focus on distribution strategies that capture AI citations back to your deep resources.`,
      `Q: How should we prioritize fixes after an algorithm update?\nA: First, identify the templates with the largest traffic declines; second, run QRG audits on those templates; third, implement the highest-leverage technical and content changes that restore trust (author bios, clearer purpose, removing thin pages). Always measure impact post-change.`
    ]
  },
  {
    id: 'resources-and-tools',
    title: 'Practical Resources and Tools Mentioned',
    paragraphs: [
      `1) QRG Workbook: Use as a team-playbook to standardize audits and evidence capture.`,
      `2) Snippet Testing Tools: Lightweight server-side experiments for title/description variants to improve qualified CTR.`,
      `3) Schema Validators: Always validate JSON-LD for Article, FAQ, and HowTo where appropriate.`,
      `4) Data Artifacts: Small downloadable CSVs and mini-dashboards that let journalists and authors reference your findings in one click.`,
      `5) Monitoring Dashboards: Custom views that highlight leading indicators per topical cluster (impressions, CTR, dwell time, citation velocity).`]
  },
  {
    id: 'appendix-playbooks',
    title: 'Appendix: Actionable Playbooks (Templates, Checklists, Timelines)',
    paragraphs: [
      `Playbook 1: QRG Audit Sprint (Two Weeks)\nDay 1-2: Select templates and gather sample pages.\nDay 3-6: Perform QRG checklist audits and tag issues.\nDay 7-9: Prioritize the backlog into critical/high/medium.\nDay 10-14: Implement critical fixes and measure immediate signals (indexing, render errors, meta fixes).\nPost Sprint: Share results and schedule next review.`,
      `Playbook 2: Hub Launch (90 Days)\nWeek 1-2: Topic research and stakeholder alignment.\nWeek 3-6: Content production for hub and 3 spokes, data artifact preparation, schema planning.\nWeek 7-8: Prelaunch tests—template preview, schema validation, snippet previews.\nWeek 9-12: Launch monitoring and outreach.\nOngoing: Quarterly refreshes and outreach cycles.`,
      `Playbook 3: Post-Update Recovery\nPhase 1: Rapid triage—identify affected templates and geographies.\nPhase 2: QRG sampling on affected templates.\nPhase 3: Quick fixes (meta, canonical, blocking problematic crawlers) and staged rollouts.\nPhase 4: Postmortem and long-term remediation plan.`
    ]
  },
  {
    id: 'final-thoughts',
    title: 'Final Thoughts: Quality as a Competitive Advantage',
    paragraphs: [
      `The common thread across Marie Haynes’ work is this: quality is operational. It is not a marketing badge nor a checklist applied once. High-quality sites are the result of processes, measurement, and cultural attention. Those organizations that treat content and technical health as ongoing product investments win durable visibility.`,
      `In an era of rapid algorithmic change and AI-driven distribution, the organizations that win will be those who can document, measure, and iterate on quality at scale. Use the playbooks above as a starting point; adapt them to your context, keep learning, and maintain a bias toward evidence.`
    ]
  }
];
