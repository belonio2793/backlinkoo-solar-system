import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Users, Zap, Sparkles, Crown } from "lucide-react";
import { useAuthModal } from "@/contexts/ModalContext";

type FeatureId =
  | "campaigns"
  | "automation"
  | "keyword_research"
  | "rank_tracker"
  | "community";

export interface FeatureShowcaseModalProps {
  open: boolean;
  initialFeature?: FeatureId;
  onOpenChange: (open: boolean) => void;
}

export function FeatureShowcaseModal({ open, initialFeature = "campaigns", onOpenChange }: FeatureShowcaseModalProps) {
  const slides = useMemo(
    () => [
      {
        id: "campaigns" as FeatureId,
        title: "Campaign Management",
        badge: "Command Center",
        description:
          "Create, monitor, and optimize campaigns in one place with live status, budgets, and results.",
        whatItDoes:
          "Campaign Management is the foundation of the Backlink platform. Buy credits and use them to create and manage backlink campaigns. The system works on a simple 1 credit = 1 backlink ratio.",
        howToUse: [
          "Buy Credits → Open Credits Dashboard → Choose amount → Secure checkout",
          "Create Campaign → Click New Campaign → Enter target website URL → Add target keywords → Assign how many credits (backlinks)",
          "Monitor & Adjust → Track backlinks generated → Reallocate credits between campaigns as needed",
        ],
        pitch: "Turn budget into rankings. Launch in minutes. Control every dollar.",
        benefits: [
          "1 credit = 1 backlink — total clarity",
          "Launch fast with zero learning curve",
          "Move credits between campaigns anytime",
          "Scale from starter to agency without friction",
        ],
      },
      {
        id: "automation" as FeatureId,
        title: "Link Building Automation (Premium)",
        badge: "Backlink  Automation",
        description:
          "AI discovers opportunities and posts contextually across the web with intelligent rotation and drip-feed.",
        whatItDoes:
          "Premium members access automated link building through a distributed blog network. Backlinks are created for you across unique domains (no duplicates) for a diversified, durable profile.",
        howToUse: [
          "Open Automation Dashboard",
          "Enter Target URL and Keywords",
          "Choose style (contextual mentions, guest-like posts, etc.)",
          "System distributes credits and builds links automatically across the network",
        ],
        pitch: "Hands-off authority. Set it, scale it, and watch rankings climb.",
        benefits: [
          "Unique domains only — no duplicates",
          "Natural drip-feed patterns",
          "AI-crafted, contextual placements",
          "Set-and-scale automation loops",
        ],
      },
      {
        id: "keyword_research" as FeatureId,
        title: "Keyword Research",
        badge: "Intelligence Engine",
        description:
          "Analyze competitors and discover opportunities with multi-source data and intent classification.",
        whatItDoes:
          "Identify the best search terms to target with average monthly search volumes (primarily Google) so you can focus on keywords that drive traffic.",
        howToUse: [
          "Open Keyword Research",
          "Enter a seed keyword (e.g., ‘best coffee shop Nairobi’)",
          "Review suggestions with monthly volume, competition and related phrases",
          "Save selected keywords to a campaign",
        ],
        pitch: "Stop guessing. Start targeting real demand that converts.",
        benefits: [
          "Real monthly volumes",
          "Low-competition winners",
          "Instant content ideas",
          "Save picks directly to campaigns",
        ],
      },
      {
        id: "rank_tracker" as FeatureId,
        title: "Rank Tracker",
        badge: "Performance Monitor",
        description:
          "Track Google rankings with alerts and SERP feature visibility to measure impact.",
        whatItDoes:
          "Monitor how your keywords perform over time and compare before vs. after results to see the impact of backlinks.",
        howToUse: [
          "Add your domain (e.g., example.com)",
          "Enter keywords to track",
          "System checks rankings daily or weekly",
          "View progress reports and compare periods",
        ],
        pitch: "Your SEO scoreboard. See wins, spot drops, prove ROI.",
        benefits: [
          "Daily/weekly checks",
          "Instant lift/drop alerts",
          "Before vs. after proof",
          "Client-ready visuals",
        ],
      },
      {
        id: "community" as FeatureId,
        title: "Community Blog",
        badge: "Global Network",
        description:
          "Learn from professionals, share case studies, and stay ahead with best practices.",
        whatItDoes:
          "A free space where you can create posts with contextual backlinks powered by our AI content model—great for testing and learning.",
        howToUse: [
          "Open Community Blog to browse recent posts",
          "Click Create Post → Add a title",
          "Write or auto-generate content",
          "Insert contextual backlinks and publish",
        ],
        pitch: "Test the engine for free. Publish, link, learn — in minutes.",
        benefits: [
          "AI-written drafts",
          "Contextual backlinks",
          "Free forever sandbox",
          "Inspiration from real users",
        ],
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = Math.max(0, slides.findIndex((s) => s.id === initialFeature));
    setIndex(i === -1 ? 0 : i);
  }, [initialFeature, slides]);

  const slide = slides[index] as any;

  const goPrev = () => setIndex((v) => (v - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((v) => (v + 1) % slides.length);

  const { openSignupModal } = useAuthModal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            {slide.title}
            {slide.badge && (
              <Badge variant="secondary" className="ml-1">{slide.badge}</Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {slide.description}
          </DialogDescription>
        </DialogHeader>

        {/* Presentation Hero */}
        <div className="rounded-xl overflow-hidden border bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-amber-500/10 p-5">
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-2"><Crown className="h-4 w-4"/>Unfair Advantage</div>
          <div className="text-xl font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-600"/>{slide.pinchline || slide.pitc || slide.pitch}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {slide.benefits?.map((b: string, i: number) => (
              <div key={i} className="flex items-start gap-2 bg-white/70  rounded-lg border p-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5"/>
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-full bg-white border">Hands‑off setup</span>
            <span className="px-2 py-1 rounded-full bg-white border">Agency‑ready</span>
            <span className="px-2 py-1 rounded-full bg-white border">No contracts</span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium mb-2">What it does</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{slide.whatItDoes}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium mb-2">How to use it</div>
            <ul className="text-sm text-muted-foreground space-y-2">
              {slide.howToUse.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5"/><span>{s}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nav + CTA */}
        <DialogFooter className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{index + 1} / {slides.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goPrev}><ArrowLeft className="h-4 w-4 mr-1"/>Prev</Button>
            <Button variant="default" onClick={() => openSignupModal?.()}>Create Free Account</Button>
            <Button onClick={goNext}>Next<ArrowRight className="h-4 w-4 ml-1"/></Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
