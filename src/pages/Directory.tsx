import { useMemo, useState } from "react";
import {
  DIRECTORY_BLUEPRINTS,
  type DescriptionAngle,
  type DirectoryBlueprint,
} from "@/data/directoryTargets";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DirectoryFinder from "@/components/directory/DirectoryFinder";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileJson,
  Play,
  RotateCcw,
} from "lucide-react";

const DEFAULT_PROFILE_FORM: ProfileFormState = {
  name: "Backlink ∞",
  website: "https://backlinkoo.com",
  email: "support@backlinkoo.com",
  phone: "+1 778-308-1489",
  addressLine1: "#113-14088 Riverport Way",
  city: "Richmond",
  region: "British Columbia",
  country: "Canada",
  hours: "24/7 • Always online",
  tagline: "Always-on backlink intelligence for growth marketers",
  categories:
    "SEO Automation, Link Building Intelligence, Digital Marketing Software, Agency Enablement",
  keywords:
    "backlink automation, seo workflow, link monitoring, authority building, marketing analytics",
};

const AUTOMATION_BASE_URL =
  typeof import.meta.env.VITE_NETLIFY_FUNCTIONS_URL === "string" &&
  import.meta.env.VITE_NETLIFY_FUNCTIONS_URL.trim().length > 0
    ? import.meta.env.VITE_NETLIFY_FUNCTIONS_URL.trim()
    : "/.netlify/functions";

type FieldGroup = "Business" | "Contact" | "Marketing" | "Operations";

type ProfileFormState = {
  name: string;
  website: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  region: string;
  country: string;
  hours: string;
  tagline: string;
  categories: string;
  keywords: string;
};

interface BusinessProfile {
  name: string;
  website: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    city: string;
    region: string;
    country: string;
  };
  categories: string[];
  primaryKeywords: string[];
  hours: string;
  tagline: string;
}

interface DescriptionSet {
  long: string;
  short: string;
  tagline: string;
  differentiators: string[];
  proofPoints: string[];
}

interface SubmissionField {
  key: string;
  label: string;
  value: string;
  group: FieldGroup;
  multiline?: boolean;
}

interface DirectoryEntry {
  slug: string;
  name: string;
  submissionMethod: string;
  categories: string[];
  keywords: string[];
  description: DescriptionSet;
  manualSteps: string[];
  integrationNotes: string[];
  recommendedIntegrations: string[];
  automationStrategy: string;
  fields: SubmissionField[];
  payload: Record<string, string>;
  structuredData: Record<string, unknown>;
  automationSnippet: string;
  manualPortals: string[];
  apiDocsUrl?: string;
  url: string;
  supportsApiSubmission: boolean;
}

type FieldOverrides = Record<string, string>;
type DirectoryOverrides = Record<string, FieldOverrides>;

function buildDescription(
  angle: DescriptionAngle,
  profile: BusinessProfile,
  blueprint: DirectoryBlueprint
): DescriptionSet {
  const audience = blueprint.audienceLabel;
  const anchorCategory = blueprint.categoryOverrides[0] ?? "SEO";

  switch (angle) {
    case "roi":
      return {
        long: `${profile.name} equips ${audience} with verifiable backlink ROI by unifying prospect discovery, outreach, and live reporting inside one automation-first workspace. Teams see the revenue impact of every earned mention, identify compounding authority opportunities, and course-correct campaigns in real time without leaving the platform.`,
        short: `${profile.name} proves backlink ROI with real-time analytics and automated follow-through tailored for ${audience}.`,
        tagline: `${anchorCategory} automation with measurable revenue impact.`,
        differentiators: [
          "Direct attribution dashboards tie backlinks to pipeline, rankings, and revenue.",
          `Automated campaigns surface the highest-authority opportunities for ${audience}.`,
          "Always-on monitoring safeguards link health and resolves issues before rankings slip.",
        ],
        proofPoints: [
          "Tracks anchor text distribution, authority, and referral traffic in one view.",
          "Exports executive-ready ROI reports for stakeholders in seconds.",
          "Supports agency and in-house collaboration with role-based access.",
        ],
      };
    case "automation":
      return {
        long: `${profile.name} streamlines backlink operations for ${audience} by orchestrating prospect discovery, outreach cadences, and quality assurance without manual spreadsheets. Intelligent workflows triage opportunities, launch personalized outreach, and log placements automatically so growth teams stay focused on strategy instead of upkeep.`,
        short: `Automation-first backlink workflows that keep ${audience} shipping campaigns around the clock.`,
        tagline: "Hands-free link building, human-grade results.",
        differentiators: [
          "Playbooks convert keyword intents into vetted outreach targets instantly.",
          "Sequenced outreach adapts messaging based on publisher engagement signals.",
          `Real-time alerts help ${audience} rescue at-risk placements before they decay.`,
        ],
        proofPoints: [
          "Eliminates manual data entry with native CRM and spreadsheet exporters.",
          "Works across agencies, in-house teams, and reseller programs via permissions.",
          "Supports global delivery with 24/7 monitoring and SLA-friendly notifications.",
        ],
      };
    case "analytics":
      return {
        long: `${profile.name} delivers deep backlink analytics for ${audience}, combining authority scoring, competitive benchmarking, and change alerts in a single dashboard. Teams can diagnose ranking swings, quantify channel impact, and surface the next best opportunities using the same data layer that powers campaign execution.`,
        short: `One analytics hub that helps ${audience} translate backlink signals into growth decisions.`,
        tagline: "Analytics-grade visibility for every backlink touchpoint.",
        differentiators: [
          "Machine-learned scoring highlights the authority moves worth prioritizing.",
          "Competitor diffing reveals fresh link gaps as soon as they emerge.",
          "Historical tracking shows how every campaign compounds organic visibility.",
        ],
        proofPoints: [
          "Exports slices tailored for C-suite, marketing ops, and client summaries.",
          "Links directly to campaign artifacts so analysts can validate execution.",
          `Supports SQL-ready exports for ${audience} data teams that need deeper modeling.`,
        ],
      };
    case "authority":
      return {
        long: `${profile.name} positions brands as authority leaders by pairing premium backlink placements with editorial-quality outreach. ${audience} gain credibility fast thanks to curated publisher relationships, structured knowledge assets, and automated follow-through that keeps every mention current.`,
        short: `Authority-building backlinks without sacrificing editorial quality for ${audience}.`,
        tagline: "Credibility compounding on autopilot.",
        differentiators: [
          "Includes newsroom-ready briefs to accelerate publisher approvals.",
          "Feeds authority metrics back into campaign planning for smarter targeting.",
          `Protects reputation with constant monitoring of placements important to ${audience}.`,
        ],
        proofPoints: [
          "Bundles outreach collateral, tracking, and reporting in a single workspace.",
          "Supports co-marketing and PR teams via shared editorial calendars.",
          "Delivers agency-ready decks summarizing trust signals and social proof.",
        ],
      };
    case "partnerships":
      return {
        long: `${profile.name} unlocks partnership-grade backlink programs for ${audience} by aligning publishers, influencers, and co-marketing allies inside one orchestrated system. Every collaboration is tracked from pitch to live link, with automated nudges and context so relationships stay warm and mutually valuable.`,
        short: `Relationship-driven backlink campaigns with automation guardrails built for ${audience}.`,
        tagline: "Partnership motion meets backlink scale.",
        differentiators: [
          "Maintains partner profiles, outreach history, and negotiation context.",
          "Routes deliverables to the right stakeholder the moment a publisher says yes.",
          `Shared dashboards keep ${audience} and partners aligned on outcomes.`,
        ],
        proofPoints: [
          "Tracks co-authored assets, earned placements, and revenue influence in one loop.",
          "Highlights dormant partners and suggests timely re-engagement tactics.",
          "Supports white-label collaboration for agencies managing multiple brands.",
        ],
      };
    case "integrations":
      return {
        long: `${profile.name} fits seamlessly into marketing stacks by syncing backlink performance with CRMs, data warehouses, and workflow tools. ${audience} can trigger automations from new placements, enrich lifecycle campaigns with authority data, and surface insights downstream without juggling exports.`,
        short: `Launch backlink campaigns that plug straight into the tools ${audience} already use.`,
        tagline: "Connected backlink intelligence for modern stacks.",
        differentiators: [
          "Native webhooks fire when placements publish or status changes.",
          "Prebuilt templates for Zapier, Supabase, and Netlify orchestrate follow-ups.",
          `Granular permissions keep ${audience} in control of sensitive data shares.`,
        ],
        proofPoints: [
          "Supports JSON, CSV, and API pushes for flexible downstream consumption.",
          "Bridges backlink metrics into campaign attribution models automatically.",
          "Keeps audit logs so RevOps can validate every automation touchpoint.",
        ],
      };
    case "agency":
      return {
        long: `${profile.name} gives agencies and service marketplaces a scalable backbone for backlink delivery. ${audience} can launch client campaigns quickly, enforce process consistency, track fulfilment, and share transparent results that drive retention and referrals.`,
        short: `Agency-grade backlink delivery with white-label controls for ${audience}.`,
        tagline: "Client-ready backlink ops from intake to reporting.",
        differentiators: [
          "Role-based workspaces segment client data while sharing core automations.",
          "White-label portals let agencies showcase live progress without extra tooling.",
          `SLA alerts notify ${audience} before deadlines slip, keeping satisfaction high.`,
        ],
        proofPoints: [
          "Generates branded reports and dashboards automatically.",
          "Automates invoice support by logging deliverables against client scopes.",
          "Integrates with CRMs to keep sales and delivery teams aligned.",
        ],
      };
    default:
      return buildDescription("automation", profile, blueprint);
  }
}

function dedupeList(list: string[]): string[] {
  return Array.from(new Set(list.map((item) => item.trim()).filter(Boolean)));
}

function parseList(value: string): string[] {
  if (!value) return [];
  return dedupeList(value.split(/[\n,]+/).map((item) => item.trim()));
}

function buildEntry(
  blueprint: DirectoryBlueprint,
  profile: BusinessProfile,
  overrides: FieldOverrides
): DirectoryEntry {
  const description = buildDescription(blueprint.descriptionAngle, profile, blueprint);
  const categories = dedupeList([...profile.categories, ...blueprint.categoryOverrides]);
  const keywords = dedupeList([...profile.primaryKeywords, ...blueprint.keywordFocus]);

  const manualPortals = [blueprint.url];

  const apply = (key: string, fallback: string, multiline?: boolean): SubmissionField => ({
    key,
    label: fieldLabels[key as keyof typeof fieldLabels] ?? key,
    value: overrides[key] ?? fallback,
    group: fieldGroups[key as keyof typeof fieldGroups] ?? "Business",
    multiline,
  });

  const fields: SubmissionField[] = [
    apply("companyName", profile.name),
    apply("website", profile.website),
    apply("tagline", description.tagline),
    apply("addressLine1", profile.address.line1),
    apply("city", profile.address.city),
    apply("region", profile.address.region),
    apply("country", profile.address.country),
    apply("contactEmail", profile.email),
    apply("phone", profile.phone),
    apply("availability", profile.hours),
    apply("longDescription", description.long, true),
    apply("shortDescription", description.short, true),
    apply("differentiators", description.differentiators.join("\n"), true),
    apply("proofPoints", description.proofPoints.join("\n"), true),
    apply("categories", categories.join("\n"), true),
    apply("keywords", keywords.join("\n"), true),
    apply("automationStrategy", blueprint.automationStrategy, true),
  ];

  const fieldMap = fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: fieldMap.companyName,
    url: fieldMap.website,
    email: fieldMap.contactEmail,
    telephone: fieldMap.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: fieldMap.addressLine1,
      addressLocality: fieldMap.city,
      addressRegion: fieldMap.region,
      addressCountry: fieldMap.country,
    },
    keywords: parseList(fieldMap.keywords).join(", "),
    description: fieldMap.longDescription,
    sameAs: [profile.website],
    areaServed: "Global",
  };

  const automationSnippet = createAutomationSnippet({
    blueprint,
    payload: fieldMap,
    manualPortals,
  });

  return {
    slug: blueprint.slug,
    name: blueprint.name,
    url: blueprint.url,
    submissionMethod: blueprint.submissionMethod,
    categories,
    keywords,
    description,
    manualSteps: blueprint.manualSteps,
    integrationNotes: blueprint.integrationNotes,
    recommendedIntegrations: blueprint.recommendedIntegrations,
    automationStrategy: blueprint.automationStrategy,
    fields,
    payload: fieldMap,
    structuredData,
    automationSnippet,
    manualPortals,
    apiDocsUrl: blueprint.apiDocsUrl,
    apiEndpoint: blueprint.apiEndpoint,
    supportsApiSubmission: blueprint.supportsApiSubmission,
  };
}

const fieldLabels: Record<string, string> = {
  companyName: "Company Name",
  website: "Website",
  tagline: "Tagline",
  addressLine1: "Street Address",
  city: "City",
  region: "Province / State",
  country: "Country",
  contactEmail: "Primary Email",
  phone: "Primary Phone",
  availability: "Support Hours",
  longDescription: "Long Description",
  shortDescription: "Short Pitch",
  differentiators: "Key Differentiators (one per line)",
  proofPoints: "Proof Points (one per line)",
  categories: "Suggested Categories (one per line)",
  keywords: "Keyword Focus (one per line)",
  automationStrategy: "Automation Strategy",
};

const fieldGroups: Record<string, FieldGroup> = {
  companyName: "Business",
  website: "Business",
  tagline: "Business",
  addressLine1: "Business",
  city: "Business",
  region: "Business",
  country: "Business",
  contactEmail: "Contact",
  phone: "Contact",
  availability: "Contact",
  longDescription: "Marketing",
  shortDescription: "Marketing",
  differentiators: "Marketing",
  proofPoints: "Marketing",
  categories: "Marketing",
  keywords: "Marketing",
  automationStrategy: "Operations",
};

function groupFields(fields: SubmissionField[]): Record<FieldGroup, SubmissionField[]> {
  return fields.reduce<Record<FieldGroup, SubmissionField[]>>(
    (acc, field) => {
      acc[field.group] = [...acc[field.group], field];
      return acc;
    },
    {
      Business: [],
      Contact: [],
      Marketing: [],
      Operations: [],
    }
  );
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function createAutomationSnippet({
  blueprint,
  payload,
  manualPortals,
}: {
  blueprint: DirectoryBlueprint;
  payload: Record<string, string>;
  manualPortals: string[];
}): string {
  return `(() => {\n  const manualPortals = ${JSON.stringify(manualPortals)};\n  const blocked = manualPortals.filter((href) => {\n    const portal = window.open(href, "_blank", "noopener");\n    return !portal;\n  });\n  if (blocked.length) {\n    console.warn(\`Pop-up blocked for: \${blocked.join(', ')}\`);\n  }\n\n  const submissionPayload = ${JSON.stringify(payload, null, 2)};\n\n  fetch("${AUTOMATION_BASE_URL}/directory-submitter", {\n    method: "POST",\n    headers: {\n      "Content-Type": "application/json"\n    },\n    body: JSON.stringify({\n      directory: "${blueprint.name}",\n      slug: "${blueprint.slug}",\n      submissionMethod: "${blueprint.submissionMethod}",\n      supportsApiSubmission: ${blueprint.supportsApiSubmission},\n      payload: submissionPayload\n    })\n  })\n    .then((response) => response.json())\n    .then((result) => {\n      if (!result?.success) {\n        console.error("Directory automation reported an error", result);\n      } else {\n        console.info("Directory automation dispatched", result);\n      }\n    })\n    .catch((error) => {\n      console.error("Directory automation failed", error);\n    });\n})();`;
}

const inputClassName = "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500";

const DirectoryPage = () => {
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState<ProfileFormState>({ ...DEFAULT_PROFILE_FORM });
  const [fieldOverrides, setFieldOverrides] = useState<DirectoryOverrides>({});
  const [activeSubmission, setActiveSubmission] = useState<string | null>(null);

  const businessProfile = useMemo<BusinessProfile>(() => ({
    name: profileForm.name.trim() || DEFAULT_PROFILE_FORM.name,
    website: profileForm.website.trim() || DEFAULT_PROFILE_FORM.website,
    email: profileForm.email.trim() || DEFAULT_PROFILE_FORM.email,
    phone: profileForm.phone.trim() || DEFAULT_PROFILE_FORM.phone,
    address: {
      line1: profileForm.addressLine1.trim() || DEFAULT_PROFILE_FORM.addressLine1,
      city: profileForm.city.trim() || DEFAULT_PROFILE_FORM.city,
      region: profileForm.region.trim() || DEFAULT_PROFILE_FORM.region,
      country: profileForm.country.trim() || DEFAULT_PROFILE_FORM.country,
    },
    categories: parseList(profileForm.categories).length
      ? parseList(profileForm.categories)
      : parseList(DEFAULT_PROFILE_FORM.categories),
    primaryKeywords: parseList(profileForm.keywords).length
      ? parseList(profileForm.keywords)
      : parseList(DEFAULT_PROFILE_FORM.keywords),
    hours: profileForm.hours.trim() || DEFAULT_PROFILE_FORM.hours,
    tagline: profileForm.tagline.trim() || DEFAULT_PROFILE_FORM.tagline,
  }), [profileForm]);

  const directories = useMemo(
    () =>
      DIRECTORY_BLUEPRINTS.map((blueprint) =>
        buildEntry(blueprint, businessProfile, fieldOverrides[blueprint.slug] ?? {})
      ),
    [businessProfile, fieldOverrides]
  );

  const [scanning, setScanning] = useState(false);
  const [discoveredPortals, setDiscoveredPortals] = useState([] as {url:string;title?:string;snippet?:string;hostname?:string;score?:number;}[]);

  const aggregatedExport = useMemo(
    () =>
      formatJson({
        generatedAt: new Date().toISOString(),
        profileForm,
        fieldOverrides,
        discoveredPortals,
        directories: directories.map((directory) => ({
          slug: directory.slug,
          name: directory.name,
          submissionMethod: directory.submissionMethod,
          supportsApiSubmission: directory.supportsApiSubmission,
          manualPortals: directory.manualPortals,
          manualSteps: directory.manualSteps,
          integrationNotes: directory.integrationNotes,
          recommendedIntegrations: directory.recommendedIntegrations,
          payload: directory.payload,
          structuredData: directory.structuredData,
          automationSnippet: directory.automationSnippet,
        })),
      }),
    [directories, fieldOverrides, profileForm, discoveredPortals]
  );

  const handleScanWeb = async (q = 'seo directory listing') => {
    try {
      setScanning(true);
      const url = `${AUTOMATION_BASE_URL}/scan-directories?q=${encodeURIComponent(q)}&limit=30`;
      const r = await fetch(url);
      const json = await r.json();
      if (!r.ok || !json?.success) throw new Error(json?.error || 'Scan failed');
      setDiscoveredPortals(json.results || []);
      toast({ title: `Scan complete`, description: `Found ${json.results?.length ?? 0} candidates.` });
    } catch (error) {
      toast({ title: 'Scan failed', description: error instanceof Error ? error.message : String(error), variant: 'destructive' });
    } finally {
      setScanning(false);
    }
  };

  const handleProfileChange = (key: keyof ProfileFormState, value: string) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRestoreDefaults = () => {
    setProfileForm({ ...DEFAULT_PROFILE_FORM });
    setFieldOverrides({});
    toast({
      title: "Profile reset",
      description: "Business identity restored to the recommended defaults.",
    });
  };

  const handleFieldChange = (slug: string, key: string, value: string) => {
    setFieldOverrides((prev) => {
      const next = { ...prev };
      const existing = next[slug] ?? {};
      if (!value.trim()) {
        delete existing[key];
      } else {
        existing[key] = value;
      }
      if (Object.keys(existing).length === 0) {
        delete next[slug];
      } else {
        next[slug] = { ...existing };
      }
      return next;
    });
  };

  const handleResetField = (slug: string, key: string) => {
    setFieldOverrides((prev) => {
      const next = { ...prev };
      const existing = { ...(next[slug] ?? {}) };
      delete existing[key];
      if (Object.keys(existing).length === 0) {
        delete next[slug];
      } else {
        next[slug] = existing;
      }
      return next;
    });
  };

  const handleCopyPayload = async (directory: DirectoryEntry) => {
    try {
      await copyToClipboard(formatJson(directory.payload));
      toast({
        title: `Payload copied for ${directory.name}`,
        description: "Paste into the directory form or your automation workflow.",
      });
    } catch (error) {
      toast({
        title: "Clipboard unavailable",
        description: error instanceof Error ? error.message : "Unable to copy payload.",
        variant: "destructive",
      });
    }
  };

  const handleCopyScript = async (directory: DirectoryEntry) => {
    try {
      await copyToClipboard(directory.automationSnippet);
      toast({
        title: `Automation script ready for ${directory.name}`,
        description:
          "Run inside your automation tool or browser console to open portals and dispatch the payload.",
      });
    } catch (error) {
      toast({
        title: "Clipboard unavailable",
        description: error instanceof Error ? error.message : "Unable to copy script.",
        variant: "destructive",
      });
    }
  };

  const handleCopyStructuredData = async (directory: DirectoryEntry) => {
    try {
      await copyToClipboard(formatJson(directory.structuredData));
      toast({
        title: `Structured data copied for ${directory.name}`,
        description: "Embed this JSON-LD block in supporting landing pages or documentation.",
      });
    } catch (error) {
      toast({
        title: "Clipboard unavailable",
        description: error instanceof Error ? error.message : "Unable to copy structured data.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPackage = () => {
    const blob = new Blob([aggregatedExport], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backlinkoo-directory-submissions.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Directory package exported",
      description: "JSON bundle downloaded. Share with your automation stack or team.",
    });
  };

  const handleExecuteSubmission = async (directory: DirectoryEntry) => {
    setActiveSubmission(directory.slug);
    const blocked: string[] = [];
    directory.manualPortals.forEach((href) => {
      const portal = window.open(href, "_blank", "noopener");
      if (!portal) {
        blocked.push(href);
      }
    });

    if (blocked.length > 0) {
      toast({
        title: "Pop-up blocked",
        description: `Enable pop-ups for ${blocked.join(", ")}.`,
        variant: "destructive",
      });
    }

    try {
      const response = await fetch(`${AUTOMATION_BASE_URL}/directory-submitter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directory: directory.name,
          slug: directory.slug,
          submissionMethod: directory.submissionMethod,
          supportsApiSubmission: directory.supportsApiSubmission,
          apiEndpoint: directory.apiEndpoint ?? null,
          payload: directory.payload,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Directory automation endpoint returned an error.");
      }

      toast({
        title: `Submission queued for ${directory.name}`,
        description: result.message ?? "Payload dispatched to automation endpoint for processing.",
      });
    } catch (error) {
      toast({
        title: `Submission not completed for ${directory.name}`,
        description: error instanceof Error ? error.message : "Unable to reach automation endpoint.",
        variant: "destructive",
      });
    } finally {
      setActiveSubmission(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="relative overflow-hidden py-16">
                <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
          <header className="space-y-6">
            <Badge className="w-fit bg-indigo-500 text-white">Directory Automation Hub</Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Submit Backlink ∞ everywhere that marketers research SEO software
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleDownloadPackage} className="group bg-indigo-500 hover:bg-indigo-500/90">
                <Download className="h-4 w-4" />
                Export master JSON package
              </Button>
              <Button onClick={() => handleScanWeb()} className="group border bg-slate-50 text-slate-900 hover:bg-slate-100">
                <Play className="h-4 w-4" />
                Scan web for directories
              </Button>
              <Button
                onClick={async () => {
                  if (!window.confirm(`Open ${directories.length} portals and dispatch payloads now?`)) return;
                  const blocked: string[] = [];
                  directories.forEach((d) => {
                    const portal = window.open(d.url, "_blank", "noopener");
                    if (!portal) blocked.push(d.url);
                  });
                  if (blocked.length) {
                    toast({
                      title: "Some pop-ups blocked",
                      description: `Enable pop-ups for ${blocked.slice(0, 3).join(", ")}${blocked.length > 3 ? "…" : ""}.`,
                      variant: "destructive",
                    });
                  }
                  const chunks: DirectoryEntry[][] = [];
                  const size = 4;
                  for (let i = 0; i < directories.length; i += size) {
                    chunks.push(directories.slice(i, i + size));
                  }
                  let ok = 0;
                  for (const batch of chunks) {
                    const res = await Promise.allSettled(
                      batch.map((d) =>
                        fetch(`${AUTOMATION_BASE_URL}/directory-submitter`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            directory: d.name,
                            slug: d.slug,
                            submissionMethod: d.submissionMethod,
                            supportsApiSubmission: d.supportsApiSubmission,
                            apiEndpoint: d.apiEndpoint ?? null,
                            payload: d.payload,
                          }),
                        })
                      )
                    );
                    ok += res.filter((r) => r.status === "fulfilled").length;
                  }
                  toast({
                    title: "Batch dispatch complete",
                    description: `${ok}/${directories.length} payloads dispatched to automation endpoint.`,
                  });
                }}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-600/90"
              >
                <Play className="h-4 w-4" />
                Submit to all now
              </Button>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="h-4 w-4 text-green-600" />
                {directories.length} directory playbooks prepared
              </div>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="bg-white backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Business profile editor</CardTitle>
                  <CardDescription className="text-slate-600">
                    Adjust once, propagate everywhere. Values without input fallback to the recommended defaults.
                  </CardDescription>
                </div>
                <Button
                  variant="secondary"
                  className="gap-2 bg-slate-800 text-slate-900 hover:bg-slate-700"
                  onClick={handleRestoreDefaults}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset defaults
                </Button>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-slate-600">
                      Company name
                    </Label>
                    <Input
                      id="company-name"
                      className={inputClassName}
                      value={profileForm.name}
                      onChange={(event) => handleProfileChange("name", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-tagline" className="text-slate-600">
                      Tagline
                    </Label>
                    <Input
                      id="company-tagline"
                      className={inputClassName}
                      value={profileForm.tagline}
                      onChange={(event) => handleProfileChange("tagline", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-website" className="text-slate-600">
                      Website
                    </Label>
                    <Input
                      id="company-website"
                      className={inputClassName}
                      value={profileForm.website}
                      onChange={(event) => handleProfileChange("website", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email" className="text-slate-600">
                      Primary email
                    </Label>
                    <Input
                      id="company-email"
                      className={inputClassName}
                      value={profileForm.email}
                      onChange={(event) => handleProfileChange("email", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone" className="text-slate-600">
                      Primary phone
                    </Label>
                    <Input
                      id="company-phone"
                      className={inputClassName}
                      value={profileForm.phone}
                      onChange={(event) => handleProfileChange("phone", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-hours" className="text-slate-600">
                      Hours / availability
                    </Label>
                    <Input
                      id="company-hours"
                      className={inputClassName}
                      value={profileForm.hours}
                      onChange={(event) => handleProfileChange("hours", event.target.value)}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-address" className="text-slate-600">
                      Street address
                    </Label>
                    <Input
                      id="company-address"
                      className={inputClassName}
                      value={profileForm.addressLine1}
                      onChange={(event) => handleProfileChange("addressLine1", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-city" className="text-slate-600">
                      City
                    </Label>
                    <Input
                      id="company-city"
                      className={inputClassName}
                      value={profileForm.city}
                      onChange={(event) => handleProfileChange("city", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-region" className="text-slate-600">
                      Province / State
                    </Label>
                    <Input
                      id="company-region"
                      className={inputClassName}
                      value={profileForm.region}
                      onChange={(event) => handleProfileChange("region", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-country" className="text-slate-600">
                      Country
                    </Label>
                    <Input
                      id="company-country"
                      className={inputClassName}
                      value={profileForm.country}
                      onChange={(event) => handleProfileChange("country", event.target.value)}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-categories" className="text-slate-600">
                      Core categories (one per line or comma separated)
                    </Label>
                    <Textarea
                      id="company-categories"
                      className={inputClassName}
                      rows={5}
                      value={profileForm.categories}
                      onChange={(event) => handleProfileChange("categories", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-keywords" className="text-slate-600">
                      Primary keywords (one per line or comma separated)
                    </Label>
                    <Textarea
                      id="company-keywords"
                      className={inputClassName}
                      rows={5}
                      value={profileForm.keywords}
                      onChange={(event) => handleProfileChange("keywords", event.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white backdrop-blur">
              <CardHeader>
                <CardTitle>Automation tips</CardTitle>
                <CardDescription className="text-slate-600">
                  Connect this payload to Zapier, Supabase, or Builder CMS to orchestrate review capture and
                  lead follow-up once each listing goes live.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  • Store the master JSON in Supabase to drive downstream workflows (review outreach, sales alerts,
                  or PR updates).
                </p>
                <p>
                  • Use Zapier Webhooks to capture the automation script output, generate tickets, or sync to CRMs.
                </p>
                <p>
                  • Mirror descriptions across Product Hunt, SaaSHub, and AlternativeTo to compound social proof in
                  a single launch window.
                </p>
                <p>
                  • Embed the structured data block on backlinkoo.com/pages/directory to reinforce consistent
                  metadata for crawlers.
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col gap-2 text-xs text-slate-500">
                  <span>Pro tip: connect additional integrations from the MCP popover for deeper automation.</span>
                  <span>
                    Recommended: Supabase, Zapier, Builder.io, Netlify, Notion, Sentry, Neon, Prisma Postgres, Figma,
                    Linear.
                  </span>
                </div>
              </CardFooter>
            </Card>
          </section>

          <DirectoryFinder profile={{ name: businessProfile.name, website: businessProfile.website, categories: businessProfile.categories, keywords: businessProfile.primaryKeywords }} />

          <Card className="bg-white shadow">
            <CardHeader>
              <CardTitle>Discovered portals</CardTitle>
              <CardDescription className="text-slate-600">Results from X. Use these to open manual submission portals or copy domains into your workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Found: <span className="font-medium text-slate-900">{discoveredPortals.length}</span></div>
                <div className="flex gap-2">
                  <Button onClick={async () => {
                    const text = (discoveredPortals.map(p => p.url)).join('\n');
                    try { await navigator.clipboard.writeText(text); toast({ title: 'Copied', description: 'Discovered URLs copied to clipboard.' }); } catch (e) { toast({ title: 'Copy failed', description: 'Unable to access clipboard.', variant: 'destructive' }); }
                  }} className="bg-slate-50 text-slate-900">Copy URLs</Button>
                  <Button onClick={() => { setDiscoveredPortals([]); toast({ title: 'Cleared', description: 'Discovered list cleared.' }); }} className="bg-slate-50 text-slate-900">Clear</Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {discoveredPortals.map((p) => (
                  <Card key={p.hostname || p.url} className="border border-slate-200 bg-white">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-medium">{p.hostname || p.url}</span>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">discovered</Badge>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{p.title}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="secondary" className="gap-2 bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200">
                            <a href={p.url} target="_blank" rel="noopener noreferrer">Open</a>
                          </Button>
                          <Button onClick={async () => { try { await navigator.clipboard.writeText(p.url); toast({ title: 'Copied', description: 'URL copied.' }); } catch (e) { toast({ title: 'Copy failed', description: 'Unable to access clipboard.', variant: 'destructive' }); } }} className="bg-slate-50 text-slate-900">Copy</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="space-y-4">
            {directories.map((directory) => {
              const groupedFields = groupFields(directory.fields);
              const overridesForDirectory = fieldOverrides[directory.slug] ?? {};

              return (
                <AccordionItem
                  key={directory.slug}
                  value={directory.slug}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg backdrop-blur"
                >
                  <AccordionTrigger className="px-6 py-5 text-left text-lg font-medium text-slate-900">
                    <div className="flex flex-col gap-2 text-left">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>{directory.name}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize",
                            directory.submissionMethod === "api"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : directory.submissionMethod === "hybrid"
                              ? "bg-sky-500/20 text-sky-300"
                              : "bg-indigo-500/20 text-indigo-200"
                          )}
                        >
                          {directory.submissionMethod} submission
                        </Badge>
                        {directory.supportsApiSubmission && (
                          <Badge className="bg-emerald-500/20 text-emerald-700">API-ready</Badge>
                        )}
                        {Object.keys(overridesForDirectory).length > 0 && (
                          <Badge className="bg-orange-500/20 text-orange-200">Customised</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {directory.description.short}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-slate-50">
                    <Card className="border-none bg-transparent">
                      <CardContent className="space-y-8 px-6 pb-6 pt-0">
                        <div className="flex flex-wrap gap-3">
                          <Button asChild variant="secondary" className="gap-2 bg-slate-800 text-slate-900 hover:bg-slate-700">
                            <a href={directory.url} target="_blank" rel="noopener noreferrer">
                              <ArrowUpRight className="h-4 w-4" />
                              Open directory
                            </a>
                          </Button>
                          <Button
                            onClick={() => handleCopyPayload(directory)}
                            variant="secondary"
                            className="gap-2 bg-slate-800 text-slate-900 hover:bg-slate-700"
                          >
                            <Copy className="h-4 w-4" />
                            Copy payload
                          </Button>
                          <Button
                            onClick={() => handleCopyScript(directory)}
                            variant="secondary"
                            className="gap-2 bg-slate-800 text-slate-900 hover:bg-slate-700"
                          >
                            <Play className="h-4 w-4" />
                            Copy automation script
                          </Button>
                          <Button
                            onClick={() => handleCopyStructuredData(directory)}
                            variant="secondary"
                            className="gap-2 bg-slate-800 text-slate-900 hover:bg-slate-700"
                          >
                            <FileJson className="h-4 w-4" />
                            Copy JSON-LD
                          </Button>
                          <Button
                            onClick={() => handleExecuteSubmission(directory)}
                            className="gap-2 bg-indigo-500 text-white hover:bg-indigo-500/90"
                            disabled={activeSubmission !== null}
                          >
                            <Play
                              className={cn(
                                "h-4 w-4",
                                activeSubmission === directory.slug && "animate-pulse"
                              )}
                            />
                            {activeSubmission === directory.slug ? "Dispatching…" : "Open portals & dispatch"}
                          </Button>
                        </div>

                        <Tabs defaultValue="fields" className="w-full">
                          <TabsList className="bg-slate-100 text-slate-200">
                            <TabsTrigger value="fields">Form fields</TabsTrigger>
                            <TabsTrigger value="script">Automation script</TabsTrigger>
                            <TabsTrigger value="jsonld">Structured data</TabsTrigger>
                          </TabsList>
                          <TabsContent value="fields" className="mt-4">
                            <div className="grid gap-6 lg:grid-cols-2">
                              {(
                                Object.entries(groupedFields) as [FieldGroup, SubmissionField[]][]
                              ).map(([group, items]) => (
                                <Card
                                  key={group}
                                  className="border border-slate-200 bg-white shadow-sm"
                                >
                                  <CardHeader className="pb-4">
                                    <CardTitle className="text-base text-slate-900">{group}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4 text-sm text-slate-600">
                                    {items.map((item) => {
                                      const isEdited = overridesForDirectory[item.key] !== undefined;
                                      return (
                                        <div key={item.key} className="space-y-2">
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="text-xs uppercase tracking-wide text-slate-500">
                                              {item.label}
                                            </div>
                                            {isEdited && (
                                              <Button
                                                variant="link"
                                                className="px-0 text-xs text-indigo-300"
                                                onClick={() => handleResetField(directory.slug, item.key)}
                                              >
                                                Reset field
                                              </Button>
                                            )}
                                          </div>
                                          {item.multiline ? (
                                            <Textarea
                                              className={cn(
                                                inputClassName,
                                                "min-h-[120px] text-sm",
                                                isEdited && "border-indigo-400/60"
                                              )}
                                              value={item.value}
                                              onChange={(event) =>
                                                handleFieldChange(directory.slug, item.key, event.target.value)
                                              }
                                            />
                                          ) : (
                                            <Input
                                              className={cn(
                                                inputClassName,
                                                "text-sm",
                                                isEdited && "border-indigo-400/60"
                                              )}
                                              value={item.value}
                                              onChange={(event) =>
                                                handleFieldChange(directory.slug, item.key, event.target.value)
                                              }
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="script" className="mt-4">
                            <Card className="border border-slate-200 bg-white">
                              <CardContent className="px-4 py-4">
                                <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-50 p-4 text-xs text-emerald-700 shadow-inner">
                                  <code>{directory.automationSnippet}</code>
                                </pre>
                                <p className="mt-3 text-xs text-slate-500">
                                  Tip: swap the Netlify endpoint with a Zapier Catch Hook or Supabase Edge Function if
                                  you prefer alternative automation providers.
                                </p>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          <TabsContent value="jsonld" className="mt-4">
                            <Card className="border border-slate-200 bg-white">
                              <CardContent className="px-4 py-4">
                                <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-50 p-4 text-xs text-sky-700 shadow-inner">
                                  <code>{formatJson(directory.structuredData)}</code>
                                </pre>
                                <p className="mt-3 text-xs text-slate-500">
                                  Embed within {"<script type=\"application/ld+json\">"} tags on landing pages that
                                  support this directory submission.
                                </p>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>

                        <div className="grid gap-6 lg:grid-cols-2">
                          <Card className="border border-slate-200 bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-slate-900">Manual steps</CardTitle>
                              <CardDescription className="text-slate-600">
                                Follow these platform-specific actions to complete the listing.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-slate-600">
                              {directory.manualSteps.map((step, index) => (
                                <div key={step} className="flex gap-3">
                                  <span className="mt-px text-xs font-semibold text-indigo-300">
                                    {index + 1}.
                                  </span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          <Card className="border border-slate-200 bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-slate-900">Integration playbook</CardTitle>
                              <CardDescription className="text-slate-600">
                                Recommended follow-up automations and tooling.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-slate-600">
                              <div>
                                <div className="text-xs uppercase text-slate-500">Automation strategy</div>
                                <p className="mt-1 text-slate-200">{directory.automationStrategy}</p>
                              </div>
                              <div>
                                <div className="text-xs uppercase text-slate-500">Integration notes</div>
                                <ul className="mt-1 list-disc space-y-1 pl-5">
                                  {directory.integrationNotes.map((note) => (
                                    <li key={note}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-xs uppercase text-slate-500">Suggested integrations</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {directory.recommendedIntegrations.map((integration) => (
                                    <Badge
                                      key={integration}
                                      variant="secondary"
                                      className="bg-slate-800 text-slate-900"
                                    >
                                      {integration}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {directory.apiDocsUrl && (
                                <Button asChild variant="link" className="px-0 text-indigo-300">
                                  <a href={directory.apiDocsUrl} target="_blank" rel="noopener noreferrer">
                                    Review API documentation
                                  </a>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
