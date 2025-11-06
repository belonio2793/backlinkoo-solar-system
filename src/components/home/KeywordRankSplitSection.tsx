import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  Search,
  Sparkles
} from "lucide-react";

const panelConfig = {
  keyword: {
    id: "keyword",
    label: "Keyword Research",
    href: "/keyword-research",
    headline: "Find the keywords that actually move the needle",
    description:
      "Surface quick-win topics, filter by intent, and hand teammates a clean list of targets without spreadsheet chaos.",
    features: [
      "Live SERP difficulty signals",
      "Grouped by intent and opportunity",
      "Export-ready lists for briefs"
    ],
    accent: "from-sky-200/70 via-indigo-200/60 to-white"
  },
  rank: {
    id: "rank",
    label: "Rank Tracker",
    href: "/rank-tracker",
    headline: "Track every movement with calm visual clarity",
    description:
      "Watch positions update, spot volatility, and know exactly when a page needs a fresh push.",
    features: [
      "Updates as fast as every 15 minutes",
      "Share links with client-ready visuals",
      "Timeline of historical SERP changes"
    ],
    accent: "from-emerald-200/70 via-teal-200/60 to-white"
  }
} as const;

type PanelKey = keyof typeof panelConfig;

export const KeywordRankSplitSection = () => {
  const [activePanel, setActivePanel] = useState<PanelKey>("keyword");
  const active = panelConfig[activePanel];
  const counterpart = activePanel === "keyword" ? panelConfig.rank : panelConfig.keyword;

  return (
    <section className="relative border-y border-border/30 bg-slate-50/70 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-100" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-3">
          {(Object.keys(panelConfig) as PanelKey[]).map((key) => {
            const panel = panelConfig[key];
            const isActive = activePanel === key;
            return (
              <Button
                key={panel.id}
                type="button"
                onClick={() => setActivePanel(key)}
                aria-pressed={isActive}
                variant="ghost"
                className={`flex items-center gap-2 rounded-full border border-border/50 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-0 focus-visible:outline-none ${
                  isActive ? "border-primary/60 bg-primary text-primary-foreground shadow-md" : "text-gray-700"
                }`}
              >
                {key === "keyword" ? <Search className="h-4 w-4" /> : <LineChart className="h-4 w-4" />}
                {panel.label}
              </Button>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(Object.keys(panelConfig) as PanelKey[]).map((key) => {
            const panel = panelConfig[key];
            const isActive = activePanel === key;
            return (
              <a
                key={panel.id}
                href={panel.href}
                className={`group relative overflow-hidden rounded-3xl border border-border/40 bg-white p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shadow-sm`}
              >
                <div className="relative z-10 flex h-full flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <span className="flex items-center gap-2">
                        {key === "keyword" ? <Search className="h-4 w-4 flex-shrink-0" /> : <LineChart className="h-4 w-4 flex-shrink-0" />}
                        <span>{panel.label}</span>
                      </span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/60">
                      {isActive ? "Selected" : "Preview"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                      {panel.headline}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {panel.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {panel.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary/70" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {`Explore ${panel.label}`}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="rounded-3xl border border-border/40 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">How it connects</span>
              <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {`${active.label} pairs with ${counterpart.label}`}
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {activePanel === "keyword"
                  ? "Send chosen keywords straight into the Rank Tracker with tags and owners already assigned."
                  : "Spot ranking shifts, jump back into research, and refill the pipeline without switching tabs."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
              <a
                href={active.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 whitespace-nowrap"
              >
                {`Open ${active.label}`}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={counterpart.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 whitespace-nowrap"
              >
                {`Preview ${counterpart.label}`}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
