export type SubmissionMethod = "manual" | "api" | "hybrid";

export type DescriptionAngle =
  | "roi"
  | "automation"
  | "analytics"
  | "authority"
  | "partnerships"
  | "integrations"
  | "agency";

export interface DirectoryBlueprint {
  slug: string;
  name: string;
  url: string;
  submissionMethod: SubmissionMethod;
  audienceLabel: string;
  descriptionAngle: DescriptionAngle;
  categoryOverrides: string[];
  keywordFocus: string[];
  manualSteps: string[];
  integrationNotes: string[];
  recommendedIntegrations: string[];
  supportsApiSubmission: boolean;
  apiEndpoint?: string;
  apiDocsUrl?: string;
  automationStrategy: string;
}

export const DIRECTORY_BLUEPRINTS: DirectoryBlueprint[] = [
  {
    slug: "g2",
    name: "G2",
    url: "https://sell.g2.com/add-product",
    submissionMethod: "manual",
    audienceLabel: "G2 software marketplace",
    descriptionAngle: "roi",
    categoryOverrides: [
      "SEO Software",
      "Marketing Analytics",
      "Link Building Platforms",
    ],
    keywordFocus: [
      "g2 reviews",
      "seo automation software",
      "marketing analytics",
      "backlink monitoring",
      "performance reporting",
    ],
    manualSteps: [
      "Sign in with a G2 vendor account at sell.g2.com.",
      "Select “Add a product” and choose the SEO category during onboarding.",
      "Paste the generated product description, tagline, and keyword set.",
      "Upload brand assets and submit the listing for G2 review.",
    ],
    integrationNotes: [
      "Listings require an approved vendor profile and at least one reviewer.",
      "Leverage Zapier to invite customers for reviews once the listing is live.",
    ],
    recommendedIntegrations: ["Zapier", "Notion"],
    supportsApiSubmission: false,
    automationStrategy:
      "Automate review outreach once approved; use exported payload for the onboarding wizard.",
  },
  {
    slug: "capterra",
    name: "Capterra",
    url: "https://vendors.capterra.com/vendor-request",
    submissionMethod: "manual",
    audienceLabel: "Capterra vendor portal",
    descriptionAngle: "authority",
    categoryOverrides: [
      "SEO Tools",
      "Marketing Platforms",
      "Link Building Software",
    ],
    keywordFocus: [
      "capterra listing",
      "seo link building",
      "marketing automation",
      "backlink outreach",
      "agency workflow",
    ],
    manualSteps: [
      "Apply for a vendor account via vendors.capterra.com/vendor-request.",
      "Provide the prepared business summary and contact details.",
      "Select categories matching SEO, marketing automation, and link building.",
      "Submit supporting evidence (case studies, screenshots) to expedite approval.",
    ],
    integrationNotes: [
      "Capterra validates manual submissions; expect a follow-up call or email.",
      "Maintain a Notion page with review requests to track Capterra feedback.",
    ],
    recommendedIntegrations: ["Notion", "Zapier"],
    supportsApiSubmission: false,
    automationStrategy:
      "Use the exported JSON for the Capterra intake form and sync updates to CRM via Zapier.",
  },
  {
    slug: "getapp",
    name: "GetApp",
    url: "https://vendors.getapp.com/register",
    submissionMethod: "manual",
    audienceLabel: "GetApp vendor portal",
    descriptionAngle: "analytics",
    categoryOverrides: [
      "Marketing Analytics",
      "SEO Platforms",
      "Link Acquisition Software",
    ],
    keywordFocus: [
      "getapp listing",
      "marketing insights",
      "backlink intelligence",
      "seo dashboards",
      "agency reporting",
    ],
    manualSteps: [
      "Register for a vendor profile at vendors.getapp.com/register.",
      "Paste the prepared elevator pitch and product description.",
      "Assign SEO, analytics, and marketing automation categories.",
      "Schedule a verification call with the GetApp onboarding team.",
    ],
    integrationNotes: [
      "GetApp shares data with Capterra and Software Advice; ensure messaging consistency.",
      "Automate review follow-ups through Zapier once listing goes live.",
    ],
    recommendedIntegrations: ["Zapier", "Supabase"],
    supportsApiSubmission: false,
    automationStrategy:
      "Mirror the payload across GetApp, Software Advice, and Capterra for consistency.",
  },
  {
    slug: "clutch",
    name: "Clutch",
    url: "https://vendor.clutch.co/register",
    submissionMethod: "manual",
    audienceLabel: "Clutch agency directory",
    descriptionAngle: "partnerships",
    categoryOverrides: [
      "SEO Agencies",
      "Link Building Services",
      "Digital Marketing Firms",
    ],
    keywordFocus: [
      "clutch seo",
      "link building agency",
      "backlink services",
      "off-page seo",
      "search visibility",
    ],
    manualSteps: [
      "Create a vendor account at vendor.clutch.co/register.",
      "Complete the service focus section using the generated categories and keywords.",
      "Upload portfolio items or campaign summaries showcasing backlink wins.",
      "Invite clients for Clutch-verified reviews to unlock higher rankings.",
    ],
    integrationNotes: [
      "Clutch prioritizes verified reviews; automate outreach once the profile is created.",
      "Maintain case study assets in Notion or Builder CMS for quick reference.",
    ],
    recommendedIntegrations: ["Notion", "Builder.io"],
    supportsApiSubmission: false,
    automationStrategy:
      "Pair the submission payload with a Clutch review workflow powered by Zapier or HubSpot.",
  },
  {
    slug: "goodfirms",
    name: "GoodFirms",
    url: "https://jobs.goodfirms.co/log-in",
    submissionMethod: "manual",
    audienceLabel: "GoodFirms research directory",
    descriptionAngle: "authority",
    categoryOverrides: [
      "Digital Marketing",
      "SEO Services",
      "Link Building Companies",
    ],
    keywordFocus: [
      "goodfirms seo",
      "authority backlinks",
      "marketing agencies",
      "white label link building",
      "organic growth",
    ],
    manualSteps: [
      "Register a vendor profile at GoodFirms and verify the business email.",
      "Populate the company overview with the provided description and differentiators.",
      "Add service focus percentages matching the suggested categories.",
      "Submit supporting documents and await editorial approval.",
    ],
    integrationNotes: [
      "GoodFirms requests proof of projects; link to detailed case studies hosted on Builder CMS.",
      "Leverage Supabase to store testimony snippets for rapid reuse.",
    ],
    recommendedIntegrations: ["Builder.io", "Supabase"],
    supportsApiSubmission: false,
    automationStrategy:
      "Use the structured data block for consistent messaging across research-driven directories.",
  },
  {
    slug: "saashub",
    name: "SaaSHub",
    url: "https://www.saashub.com/saas/app/new",
    submissionMethod: "manual",
    audienceLabel: "SaaSHub software directory",
    descriptionAngle: "automation",
    categoryOverrides: [
      "SEO Monitoring",
      "Marketing Automation",
      "Backlink Intelligence",
    ],
    keywordFocus: [
      "saashub listing",
      "seo monitoring",
      "automation workflows",
      "link tracking",
      "growth marketing",
    ],
    manualSteps: [
      "Open saashub.com/saas/app/new and authenticate with GitHub or Google.",
      "Fill the product basics using the generated payload.",
      "Provide the automation-focused description and keyword list.",
      "Submit the profile and monitor the approval email from SaaSHub.",
    ],
    integrationNotes: [
      "SaaSHub favors concise pitches; reuse the tagline for alternative-to style sites.",
      "Track traffic uplift in Supabase or your analytics stack once listed.",
    ],
    recommendedIntegrations: ["Supabase", "Zapier"],
    supportsApiSubmission: false,
    automationStrategy:
      "Repurpose the SaaSHub payload for AlternativeTo using the generated short copy variant.",
  },
  {
    slug: "alternativeto",
    name: "AlternativeTo",
    url: "https://alternativeto.net/register",
    submissionMethod: "manual",
    audienceLabel: "AlternativeTo community",
    descriptionAngle: "automation",
    categoryOverrides: [
      "SEO Tools",
      "Marketing Platforms",
      "Link Building Automation",
    ],
    keywordFocus: [
      "alternativeto listing",
      "marketing automation",
      "seo outreach",
      "link building software",
      "digital pr",
    ],
    manualSteps: [
      "Create an account or sign in at AlternativeTo.",
      "Click “Add new application” and enter the provided metadata.",
      "Use the short pitch variant for the summary field and the long description for details.",
      "Tag Backlink ∞ with marketing and SEO categories before submitting.",
    ],
    integrationNotes: [
      "Community votes impact visibility; schedule social posts encouraging upvotes.",
      "Keep AlternativeTo screenshots aligned with current UI to avoid rejection.",
    ],
    recommendedIntegrations: ["Zapier", "Netlify"],
    supportsApiSubmission: false,
    automationStrategy:
      "Push the exported payload to Product Hunt and SaaSHub in the same sprint for compounding signals.",
  },
  {
    slug: "producthunt",
    name: "Product Hunt",
    url: "https://www.producthunt.com/posts/new",
    submissionMethod: "manual",
    audienceLabel: "Product Hunt launch community",
    descriptionAngle: "integrations",
    categoryOverrides: [
      "Marketing",
      "SEO",
      "Automation",
    ],
    keywordFocus: [
      "product hunt launch",
      "seo automation",
      "marketing stack",
      "backlink growth",
      "agency enablement",
    ],
    manualSteps: [
      "Plan a launch slot and prepare assets one week in advance.",
      "Create the new post draft using the generated copy variants.",
      "Highlight integrations (Zapier, Supabase, Builder CMS) in the description.",
      "Coordinate with your community for day-of launch support.",
    ],
    integrationNotes: [
      "Use Notion to coordinate launch tasks and collect testimonials for the post.",
      "Embed the structured data snippet on backlinkoo.com to reinforce the pitch.",
    ],
    recommendedIntegrations: ["Notion", "Zapier"],
    supportsApiSubmission: false,
    automationStrategy:
      "Reuse the Product Hunt marketing copy for press kits and directory cross-posting.",
  },
  {
    slug: "crunchbase",
    name: "Crunchbase",
    url: "https://www.crunchbase.com/organizations/organization/new",
    submissionMethod: "manual",
    audienceLabel: "Crunchbase company database",
    descriptionAngle: "analytics",
    categoryOverrides: [
      "Marketing Technology",
      "SEO Software",
      "Analytics Platform",
    ],
    keywordFocus: [
      "crunchbase listing",
      "marketing analytics",
      "backlink platform",
      "seo data",
      "growth insights",
    ],
    manualSteps: [
      "Create or log in to a Crunchbase user profile.",
      "Use the “Add new organization” wizard and populate the company data.",
      "Provide funding status as “Private” and specify marketing technology categories.",
      "Submit for editorial review and respond to any verification emails.",
    ],
    integrationNotes: [
      "Crunchbase has a public API for data retrieval but not for free self-serve submission.",
      "Maintain consistent metadata across Crunchbase and LinkedIn company pages.",
    ],
    recommendedIntegrations: ["Notion", "Zapier"],
    supportsApiSubmission: false,
    automationStrategy:
      "Leverage the Crunchbase profile to enrich press releases and partnership decks.",
  },
  {
    slug: "betalist",
    name: "BetaList",
    url: "https://betalist.com/submit",
    submissionMethod: "manual",
    audienceLabel: "BetaList early access community",
    descriptionAngle: "automation",
    categoryOverrides: [
      "Marketing",
      "SEO",
      "Automation Tools",
    ],
    keywordFocus: [
      "betalist submission",
      "beta marketing",
      "link building automation",
      "seo launch",
      "growth beta",
    ],
    manualSteps: [
      "Complete the BetaList submission form with the generated pitch and descriptions.",
      "Emphasize the uniqueness of 24/7 backlink monitoring in the differentiator field.",
      "Choose marketing and SEO categories before submitting.",
      "Confirm the submission email and schedule promotional tweets on launch day.",
    ],
    integrationNotes: [
      "BetaList prefers concise copy; use the short pitch variant and tagline.",
      "Track waitlist signups generated from BetaList inside Supabase.",
    ],
    recommendedIntegrations: ["Supabase", "Zapier"],
    supportsApiSubmission: false,
    automationStrategy:
      "Align the BetaList blurb with Product Hunt and AlternativeTo summaries for consistency.",
  },
  {
    slug: "upcity",
    name: "UpCity",
    url: "https://upcity.com/sign-up",
    submissionMethod: "manual",
    audienceLabel: "UpCity service marketplace",
    descriptionAngle: "agency",
    categoryOverrides: [
      "SEO Agencies",
      "Digital Marketing",
      "Link Building",
    ],
    keywordFocus: [
      "upcity agency",
      "seo partner",
      "link building services",
      "marketing agencies",
      "credibility badges",
    ],
    manualSteps: [
      "Register an agency account at UpCity.",
      "Fill in the company profile using the prepared service breakdown.",
      "Upload proof of performance and specify service area as global/remote.",
      "Complete the verification call to activate public visibility.",
    ],
    integrationNotes: [
      "UpCity incentivizes partner badges; display the badge on backlinkoo.com when approved.",
      "Capture lead inquiries from UpCity via Zapier or Netlify Functions.",
    ],
    recommendedIntegrations: ["Zapier", "Netlify"],
    supportsApiSubmission: false,
    automationStrategy:
      "Feed UpCity leads into Supabase and trigger automated outreach sequences.",
  },
  {
    slug: "growthhackers",
    name: "GrowthHackers Projects",
    url: "https://growthhackers.com/experiments/new",
    submissionMethod: "manual",
    audienceLabel: "GrowthHackers community",
    descriptionAngle: "roi",
    categoryOverrides: [
      "Growth Marketing",
      "SEO",
      "Automation",
    ],
    keywordFocus: [
      "growth marketing",
      "seo experiments",
      "link building tests",
      "automation insights",
      "marketing roi",
    ],
    manualSteps: [
      "Sign in to GrowthHackers and create a new Project or Experiment entry.",
      "Use the ROI-focused narrative to describe Backlink ∞'s measurable impact.",
      "Attach KPI snapshots or benchmark charts from your analytics suite.",
      "Publish the project and invite collaborators for feedback.",
    ],
    integrationNotes: [
      "GrowthHackers rewards detailed experiments; host supporting docs in Notion or Builder CMS.",
      "Link back to Supabase dashboards for real-time metric transparency.",
    ],
    recommendedIntegrations: ["Notion", "Builder.io"],
    supportsApiSubmission: false,
    automationStrategy:
      "Repurpose the experiment outline for blog content and case study submissions.",
  },
];
