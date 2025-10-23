export type CyrusHighlight = {
  title: string;
  subtitle: string;
  description: string;
  linkLabel?: string;
  href?: string;
};

export type CyrusArticle = {
  title: string;
  href: string;
  category: string;
  year: string;
  summary: string;
};

export type CyrusFramework = {
  title: string;
  summary: string;
  checklist: string[];
};

export const cyrusHighlights: CyrusHighlight[] = [
  {
    title: 'Experiment-First Playbooks',
    subtitle: 'Evidence in Every Recommendation',
    description: 'Cyrus Shepard insists on measurable hypotheses, query-cluster dashboards, and instrumentation checklists before scaling any SEO tactic. He delivers frameworks teams can replay quarter after quarter without guesswork.',
    linkLabel: 'Review Experiment Design Advice',
    href: '#measurement-and-reporting'
  },
  {
    title: 'Moz Roots, Modern Impact',
    subtitle: 'From Whiteboard Friday to Zyppy',
    description: 'Years spent leading Moz’s SEO education stack taught Cyrus how to translate complex discoveries into plain language. Zyppy carries that legacy forward with ready-to-ship governance and stakeholder decks.',
    linkLabel: 'Explore the Moz Era Timeline',
    href: '#moz-era-contributions'
  },
  {
    title: 'Ethical Link Ecosystems',
    subtitle: 'Relationship-Driven, Not Transactional',
    description: 'Instead of mass pitching, Cyrus builds selective link priority matrices, HARO alternatives, and reporter-friendly assets. The result: defensible mentions that withstand manual reviews and core updates.',
    linkLabel: 'See Link Outreach Frameworks',
    href: '#link-earning-and-digital-pr'
  },
  {
    title: 'Future-Ready Measurement',
    subtitle: 'Dashboards Executives Actually Use',
    description: 'From leading indicators to AI Overviews impact modeling, Cyrus equips teams with narratives and visuals that secure buy-in, budget, and engineering bandwidth for long-term SEO wins.',
    linkLabel: 'Inspect the Measurement Stack',
    href: '#measurement-and-reporting'
  }
];

export const cyrusArticles: CyrusArticle[] = [
  {
    title: 'How AI Overviews Shift Traffic From Publishers to Google',
    href: 'https://zyppy.com/google-ai-overviews-traffic-shift/',
    category: 'SERP Innovation',
    year: '2024',
    summary: 'Cyrus measures how the new AI Overviews module reroutes clicks, highlights who loses visibility first, and outlines mitigation tactics anchored in satisfying intent faster.'
  },
  {
    title: 'What Is Neil Hiding? Bankrupt FTX Sues Neil Patel to Recover Millions in Payments',
    href: 'https://zyppy.com/neil-patel-ftx-lawsuit/',
    category: 'Industry Analysis',
    year: '2024',
    summary: 'A forensic dive into court filings that reveals the business mechanics behind high-profile marketing deals and what ethical boundaries marketers should observe.'
  },
  {
    title: 'Announcing Zyppy List: A Next-Level Directory For Marketing Pros',
    href: 'https://zyppy.com/zyppy-list-directory/',
    category: 'Product Updates',
    year: '2023',
    summary: 'Introduces a curated marketplace of vetted marketing partners, complete with scoring rubrics Cyrus uses when vetting outreach partners for clients.'
  },
  {
    title: 'Google’s Index Size Revealed: 400 Billion Docs (& Changing)',
    href: 'https://zyppy.com/google-index-size/',
    category: 'Technical SEO',
    year: '2023',
    summary: 'Combines patent research, data scraping, and interviews to estimate Google’s active index size and what it means for crawling budgets.'
  },
  {
    title: 'I Disavowed Every Link To My Website. Here’s What Happened',
    href: 'https://zyppy.com/disavow-every-link/',
    category: 'Link Experiments',
    year: '2020',
    summary: 'Cyrus documents the full recovery timeline, visibility dips, and reporting gaps triggered by removing every backlink—an experiment few would risk.'
  },
  {
    title: 'How Sites With Less SEO Win Google + 4 More SEO Tips',
    href: 'https://zyppy.com/how-sites-with-less-seo-win/',
    category: 'Organic Strategy',
    year: '2023',
    summary: 'Explains why intent satisfaction beats sheer volume of optimizations and showcases publishers thriving with lighter SEO footprints.'
  },
  {
    title: 'How Recent Google Updates Punish Good SEO: 50-Site Case Study',
    href: 'https://zyppy.com/google-updates-punish-good-seo/',
    category: 'Algorithm Updates',
    year: '2024',
    summary: 'Aggregates 50 post-update stories to show how helpful content can still get hit—and how to adapt without abandoning best practices.'
  },
  {
    title: 'Link Building With HARO Alternatives + How to Implement Ranch-Style SEO',
    href: 'https://zyppy.com/haro-alternatives/',
    category: 'Digital PR',
    year: '2022',
    summary: 'Outlines sourcing channels beyond HARO and includes scripts Cyrus uses to build genuine journalist relationships.'
  },
  {
    title: 'Ranking Higher by Satisfying Intent Quicker + 5 More SEO Tips',
    href: 'https://zyppy.com/satisfy-intent-faster/',
    category: 'Content Strategy',
    year: '2023',
    summary: 'Demonstrates how design, copy hierarchy, and internal links can shorten time-to-answer and boost engagement metrics.'
  },
  {
    title: 'A New Google Page Quality Rating Scorecard + Top 2024 SEO Tips',
    href: 'https://zyppy.com/page-quality-scorecard/',
    category: 'Quality Frameworks',
    year: '2024',
    summary: 'Provides a downloadable scorecard mirroring Google’s rater guidelines so teams can grade templates before releases.'
  },
  {
    title: 'Google Rewrites 61% of Page Title Tags [SEO Study]',
    href: 'https://zyppy.com/google-rewrites-title-tags/',
    category: 'On-Page SEO',
    year: '2021',
    summary: 'Breaks down the triggers behind title rewrites and shares guardrails to preserve brand messaging in SERPs.'
  },
  {
    title: '23 Million Internal Links – SEO Case Study',
    href: 'https://zyppy.com/23-million-internal-links/',
    category: 'Site Architecture',
    year: '2021',
    summary: 'Analyzes millions of internal links to show how navigation choices influence crawl depth, authority flow, and user satisfaction.'
  }
];

export const cyrusFrameworks: CyrusFramework[] = [
  {
    title: 'Experiment Design Canvas',
    summary: 'A one-page canvas Cyrus uses to align stakeholders on hypotheses, timelines, instrumentation, and criteria for rollout.',
    checklist: [
      'Define the search or UX problem with baseline metrics and affected URLs.',
      'Draft a falsifiable hypothesis that connects controls, variants, and expected directional change.',
      'Assign reporting owners, dashboards, and alert thresholds before launch.'
    ]
  },
  {
    title: 'Selective Link Priority Matrix',
    summary: 'Filters outreach targets by topical fit, editorial history, relationship status, and growth potential to keep link earning defensible.',
    checklist: [
      'Score publications by topical alignment, organic visibility, and editorial standards.',
      'Document relationship warmth and unique value you can offer each editor.',
      'Map anchor text targets to funnel stages to avoid over-optimized clusters.'
    ]
  },
  {
    title: 'Intent Acceleration Blueprint',
    summary: 'Cyrus’s approach to satisfying searcher intent faster through content design, layout sequencing, and internal link scaffolding.',
    checklist: [
      'Front-load task completion elements (tables, calculators, TL;DR summaries) above the fold.',
      'Use supporting modules to deepen expertise signals—citations, author credentials, schema.',
      'Embed contextual internal links that anticipate “next best step” journeys across the site.'
    ]
  },
  {
    title: 'Executive Reporting Narrative',
    summary: 'Transforms raw dashboards into a story executives can act on, emphasizing risk, opportunity, and next experiments.',
    checklist: [
      'Lead with the business question, not the metric—why the data matters right now.',
      'Visualize leading indicators alongside owned experiments to show progress before rankings move.',
      'Close with the next test queue, resource asks, and what support is required from leadership.'
    ]
  }
];
