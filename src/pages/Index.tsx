import React, { useState, useEffect, startTransition, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Infinity,
  TrendingUp,
  Shield,
  Globe,
  Search,
  Link,
  BarChart3,
  CheckCircle,
  CreditCard,
  ArrowRight,
  Users,
  Target,
  Zap,
  Activity,
  Lock,
  Menu,
  LogOut,
  BookOpen,
  Star,
  Home,
  X,
  RotateCcw,
  LineChart
} from "lucide-react";
import { PricingModal } from "@/components/PricingModal";
import { ToastAction } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FeatureShowcaseModal } from "@/components/FeatureShowcaseModal";

import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { BlogForm } from "@/components/blog/BlogForm";
import { RotatingTagline } from "@/components/RotatingTagline";
import { RotatingStats } from "@/components/RotatingStats";
import { RotatingTrustIndicators } from "@/components/RotatingTrustIndicators";

import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';
import { Footer } from "@/components/Footer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/services/authService";

import InlineAuthForm from "@/components/InlineAuthForm";
import { TrialConversionBanner } from "@/components/TrialConversionBanner";
import { QuickTrialUpgrade } from "@/components/QuickTrialUpgrade";
import { TrialConversionService } from "@/services/trialConversionService";
import { useAuthModal, usePremiumModal, useWaitlistModal, useModal } from "@/contexts/ModalContext";
import { WaitlistModal } from "@/components/WaitlistModal";
import { BuyCreditsButton } from "@/components/BuyCreditsButton";
import CreditsBadge from "@/components/CreditsBadge";
import { RotatingWord } from "@/components/RotatingWord";
import { RotatingText } from "@/components/RotatingText";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { KeywordRankSplitSection } from "@/components/home/KeywordRankSplitSection";
import AnimatedTestimonials from "@/components/AnimatedTestimonials";
import SEOGrowthGraph from "@/components/SEOGrowthGraph";
import RankHeader from "@/components/RankHeader";
import { HomeFeaturedRankTracker } from "@/components/HomeFeaturedRankTracker";


type PricingPlan = {
  id: 'starter_100' | 'starter_200' | 'starter_300';
  name: string;
  credits: number;
  price: number;
  pricePerLink: number;
  description: string;
  features: string[];
  popular?: boolean;
};

interface PricingSectionProps {
  pricingPlans: PricingPlan[];
  customCredits: number;
  customCreditsInput: string;
  setCustomCredits: (n: number) => void;
  setCustomCreditsInput: (s: string) => void;
  handleGetStarted: (id: 'starter_100' | 'starter_200' | 'starter_300' | 'custom') => void;
  toast: (opts: any) => void;
}

const getPlanOverlay = (id: 'starter_100' | 'starter_200' | 'starter_300') => {
  if (id === 'starter_100') return {
    label: 'Easy Competition',
    text: 'Ideal for new sites or low‑difficulty keywords. Quick traction with safe diversification and measured link velocity.'
  } as const;
  if (id === 'starter_200') return {
    label: 'Medium Difficulty',
    text: 'Balanced volume for competitive niches. Steady ranking gains with broader domain variety and stronger authority.'
  } as const;
  return {
    label: 'Hard Difficulty',
    text: 'Designed for tough keywords and established competitors. Higher link velocity and deep domain mix for sustained impact.'
  } as const;
};

function PricingSectionComponent({ pricingPlans, customCredits, customCreditsInput, setCustomCredits, setCustomCreditsInput, handleGetStarted, toast }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="relative py-24 px-0 md:px-6 bg-white section-ambient bg-hero-soft soft-vignette"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="w-full max-w-6xl mx-auto relative z-10 px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-light mb-6 tracking-tight text-gray-900 headline-single-line">Get Any <RotatingWord words={["Keyword","Search Term","Phrase","Long Tail Keyword"]} /> Ranked Using Our <RotatingText phrases={["Domain Authority","Citation Flow","Unique Domains","Aged Domains","Trust Factor","Low Outbound Links"]} className="text-primary" /></h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-6xl mx-auto leading-relaxed font-light">
            Prices are subject to change at any time based on network and market conditions. Before and after results noticeably guaranteed, each campaign includes verified reporting with rankings updates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mx-auto max-w-6xl">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              role="button"
              tabIndex={0}
              onClick={() => handleGetStarted(plan.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGetStarted(plan.id); } }}
              className={`group p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all relative bg-white pricing-card pricing-card-rainbow cursor-pointer focus:outline-none focus-visible:outline-none outline-none`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50 bg-gray-100 text-primary font-mono text-xs most-popular-badge pointer-events-none">
                  MOST POPULAR
                </Badge>
              )}

              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold mb-2 text-gray-900">{plan.name}</CardTitle>
                <div className="text-4xl font-light mb-2 text-gray-900">
                  <span className="text-2xl font-mono">$</span>{plan.price}
                </div>
                <div className="text-sm text-gray-500 font-mono">
                  $1.4 per link
                </div>
                <p className="text-gray-600 font-light">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-3xl font-semibold text-gray-900 mb-4">
                  {`${plan.credits} Credits`}
                </div>

                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-light text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-medium ${plan.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} rainbow-outline-onhover focus-visible:ring-0 focus:ring-0 focus:outline-none`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleGetStarted(plan.id)}
                >
                  Get Started
                </Button>
              </CardContent>
            {(() => { const o = getPlanOverlay(plan.id); return (
              <div className="seo-feature-overlay">
                <div className="seo-feature-overlay-inner">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{plan.name}</span>
                      <Badge variant="outline" className="text-xs">{o.label}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-800">{o.text}</p>
                  </div>
                </div>
              </div>
            ); })()}
            </Card>
          ))}
        </div>

        {/* Custom Credit Purchase */}
        <div className="mt-16 max-w-md mx-auto overscroll-contain">
          <Card className="p-8 text-center border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-blue-50">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold mb-2 text-gray-900">Custom Package</CardTitle>
              <p className="text-gray-600 font-light">Choose your exact credit amount</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Credits
                </label>
                <input
                  id="custom-credits"
                  name="custom-credits"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  min="1"
                  max="10000"
                  step="1"
                  value={customCreditsInput}
                  placeholder="Enter credits (min: 1)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-center text-lg font-semibold"
                  onFocus={(e) => {
                    e.stopPropagation();
                  }}
                  onBlur={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setCustomCreditsInput(value);
                    const credits = parseInt(value, 10) || 0;
                    setCustomCredits(credits);
                  }}
                  onWheel={(e) => {
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'ArrowUp' ||
                      e.key === 'ArrowDown' ||
                      e.key === 'Home' ||
                      e.key === 'End' ||
                      e.key === 'PageUp' ||
                      e.key === 'PageDown'
                    ) {
                      e.preventDefault();
                    }
                    e.stopPropagation();
                  }}
                  onInput={(e) => {
                    e.stopPropagation();
                  }}
                  onKeyUp={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>

              <div className="text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-2">
                  <span className="text-xl font-mono">Total: </span>
                  <span>${customCredits > 0 ? (customCredits * 1.4).toFixed(2) : '0.00'}</span>
                </div>
                <div className="text-sm text-gray-500 font-mono">
                  $1.40 per credit
                </div>
              </div>

              <Button
                className="w-full font-medium bg-primary text-white hover:bg-primary/90 rainbow-outline-onhover focus-visible:ring-0 focus:ring-0 focus:outline-none"
                disabled={customCredits < 1}
                onClick={() => {
                  if (customCredits >= 1) {
                    handleGetStarted('custom');
                  } else {
                    toast({
                      title: 'Invalid Credit Amount',
                      description: 'Please enter at least 1 credit to proceed.',
                      variant: 'destructive'
                    });
                  }
                }}
              >
                Purchase Custom Package
              </Button>
            </CardContent>
          </Card>
        </div>


      </div>
    </section>
  );
}

interface BlogGeneratorSectionProps {
  user: User | null;
  onBlogGenerated: (blogPost: any) => void;
}

const StableBlogGeneratorSection = memo(({ user, onBlogGenerated }: BlogGeneratorSectionProps) => {
  return (
    <>
      <section id="blog-generator" className="py-12 sm:py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
          <div className="w-full px-2 md:px-6">
            <BlogForm
              onContentGenerated={(blogPost) => {
                onBlogGenerated(blogPost);
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
});

const Index = () => {
  const go = (path: string) => {
    window.location.href = path;
  };
  const { toast } = useToast();

  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<{
    title?: string;
    blogUrl?: string;
    inputs?: { keyword: string; anchorText: string; targetUrl: string };
  } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter_100' | 'starter_200' | 'starter_300'>('starter_200');
  const [customCredits, setCustomCredits] = useState<number>(0);
  const [customCreditsInput, setCustomCreditsInput] = useState<string>("");
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  // Feature modal
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [initialFeature, setInitialFeature] = useState<"campaigns" | "automation" | "keyword_research" | "rank_tracker" | "community">("campaigns");
  // Unified modal management
  const { openLoginModal, openSignupModal } = useAuthModal();
  const { openPremiumModal } = usePremiumModal();
  const { openWaitlistModal, closeWaitlistModal, isWaitlistOpen } = useWaitlistModal();
  const { currentModal } = useModal();

  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState('');

  const [showTrialUpgrade, setShowTrialUpgrade] = useState(false);
  const [showInlineAuth, setShowInlineAuth] = useState(false);

  // Backlink estimate UI state
  const [backlinkKeyword, setBacklinkKeyword] = useState("");
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateText, setEstimateText] = useState("");
  const [typedEstimate, setTypedEstimate] = useState("");
  const [typing, setTyping] = useState(false);
  const [showEstimateOverlay, setShowEstimateOverlay] = useState(false);
  const keywordInputRef = useRef<HTMLInputElement | null>(null);

  // Rotating placeholder suggestions for the keyword input
  const [keywordPlaceholder, setKeywordPlaceholder] = useState<string>(
    "Enter a keyword"
  );
  const [keywordFocused, setKeywordFocused] = useState(false);

  const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateRandomKeyword = () => {
    const adjectives = [
      "best",
      "cheap",
      "top",
      "wireless",
      "eco friendly",
      "portable",
      "beginner",
      "premium",
      "budget",
      "fast"
    ];
    const products = [
      "coffee grinder",
      "standing desk",
      "noise cancelling headphones",
      "air fryer",
      "gaming chair",
      "projector",
      "running shoes",
      "smartwatch",
      "yoga mat",
      "water bottle"
    ];
    const verbs = ["learn", "build", "start", "improve", "increase", "grow", "optimize", "fix"];
    const topics = [
      "seo",
      "email marketing",
      "facebook ads",
      "google analytics",
      "content marketing",
      "dropshipping",
      "affiliate marketing",
      "coding interview",
      "resume tips",
      "wfh productivity"
    ];
    const brands = [
      "iphone",
      "android",
      "tesla",
      "netflix",
      "spotify",
      "xbox",
      "playstation",
      "nintendo",
      "macbook",
      "windows laptop"
    ];
    const newsy = [
      "stock market today",
      "weather today",
      "gold price",
      "flight deals",
      "crypto price",
      "nba playoffs",
      "premier league",
      "olympics",
      "tech layoffs",
      "open source ai"
    ];

    const patterns = [
      () => `${randomFrom(adjectives)} ${randomFrom(products)}`,
      () => `how to ${randomFrom(verbs)} ${randomFrom(topics)}`,
      () => `${randomFrom(brands)} vs ${randomFrom(brands)}`,
      () => `best tools for ${randomFrom(topics)}`,
      () => `${randomFrom(newsy)}`,
      () => `${randomFrom(products)} reviews`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)]();
  };


  const sanitizeEstimateText = (raw: string) => {
    if (!raw) return '';
    let t = String(raw || '');

    // Normalize line endings
    t = t.replace(/\r\n?|\r/g, '\n');

    // Remove code blocks and inline code
    t = t.replace(/```[\s\S]*?```/g, '');
    t = t.replace(/`([^`]*)`/g, '$1');

    // Remove markdown headers like "#", "##", "###" at start of lines
    t = t.replace(/(^|\n)\s*#{1,6}\s+/g, '$1');

    // Remove list bullets at line starts: -, *, •
    t = t.replace(/(^|\n)\s*(?:-|\*|•)\s+/g, '$1');

    // Strip markdown links [text](url) -> text
    t = t.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1');

    // Remove emphasis markers **, __, _, *
    t = t.replace(/\*\*|__/g, '');
    t = t.replace(/(?<!\*)\*(?!\*)/g, '');
    t = t.replace(/_/g, '');

    // Remove stray header markers that might remain
    t = t.replace(/#/g, '');

    // Collapse multiple spaces and newlines to single spaces
    t = t.replace(/\s+/g, ' ');

    // Normalize punctuation and dashes
    t = t.replace(/\.{2,}/g, '.');
    t = t.replace(/[–—]+/g, '-');
    t = t.replace(/\-{3,}/g, '-');

    // Prefer a single concise sentence that mentions backlinks and a number
    const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
    const preferred = sentences.find(s => /backlink/i.test(s) && /\d/.test(s)) || sentences[0] || t;
    t = preferred.trim();

    // Ensure sentence ends with punctuation
    if (t && !/[.!?]$/.test(t)) t += '.';

    return t;
  };

  const [estimateParagraphs, setEstimateParagraphs] = useState<string[] | null>(null);
  const [lastKeyword, setLastKeyword] = useState<string>('');

  // Minimal rotating data ticker content (markets + SEO insights)
  const rotatingSlides = [
    { type: 'market', country: 'United States', spend: '$25–30', note: 'Largest market; ~30–35% of global SEO spend. Average guest post backlinks cost $365–$930, with agencies allocating 33% of SEO budgets to links. High demand from e-commerce and finance niches.' },
    { type: 'market', country: 'United Kingdom', spend: '$8–10', note: 'Strong European hub; budgets start at $5,000/month for competitive link-building. Focus on English-language markets; average link costs ~$300–$500.' },
    { type: 'market', country: 'Germany', spend: '$6–8', note: 'High per-link prices ($400+ average); part of Europe\'s ~25% SEO share. Strict regulations favor quality over volume.' },
    { type: 'market', country: 'India', spend: '$4–6', note: 'Growing outsourcing hub; lower costs ($100–$300 per link) but high volume. Contributes to global services via agencies.' },
    { type: 'market', country: 'Australia', spend: '$3–5', note: 'English-speaking market with budgets ~$5,000/month minimum.' },
    { type: 'insight', title: 'Search Traffic Has the Highest Buyer Intent', text: 'Search users are actively looking for solutions; SEO traffic converts up to 10x higher than outbound.' },
    { type: 'insight', title: 'Organic Search Delivers the Lowest CPA', text: 'Paid ads stop when funding stops; SEO keeps generating leads and often returns 3–12x ROI over time.' },
    { type: 'insight', title: 'Search Visibility Builds Trust & Authority', text: 'Users click organic results 65–75% of the time vs 25–35% for ads; top rankings signal credibility.' },
    { type: 'insight', title: 'Compounding Effect', text: 'Every optimized page and backlink keeps driving free traffic; wins stack and multiply over time.' },
    { type: 'insight', title: 'Reduces Dependence on Paid Ads', text: 'Strong organic rankings reduce exposure to rising CPCs, ad fatigue, and algorithm shifts.' },
  ] as const;

  const marketSlides = rotatingSlides.filter((s: any) => s.type === 'market');
  const insightSlides = rotatingSlides.filter((s: any) => s.type === 'insight');
  const [rotMarketIdx, setRotMarketIdx] = useState(0);
  const [rotInsightIdx, setRotInsightIdx] = useState(0);
  const [marketCardDismissed, setMarketCardDismissed] = useState(false);
  const [insightCardDismissed, setInsightCardDismissed] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  // Signal to request child components to restore (bump to trigger effect)
  const [restoreTop, setRestoreTop] = useState<number | null>(null);


  // Restore all dismissed/collapsed UI elements on this page
  const restoreAll = () => {
    setMarketCardDismissed(false);
    setInsightCardDismissed(false);
    // Reset rotators and ticker to default display on this session
    setRotMarketIdx(0);
    setRotInsightIdx(0);
    setTickerPaused(false);
    // Also reset session-only display defaults
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('homeMarketCardDismissed');
      window.sessionStorage.removeItem('homeInsightCardDismissed');
    }

    // Re-measure layout after React updates to avoid overlap (slight delay allows DOM to settle)
    setTimeout(() => {
      try { measureTicker(); } catch (e) { /* ignore in non-browser env */ }
    }, 80);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('homeMarketCardDismissed') === '1') {
      setMarketCardDismissed(true);
    }
    if (window.sessionStorage.getItem('homeInsightCardDismissed') === '1') {
      setInsightCardDismissed(true);
    }
  }, []);

  const handleDismissMarketCard = () => {
    setMarketCardDismissed(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('homeMarketCardDismissed', '1');
    }
  };

  const handleDismissInsightCard = () => {
    setInsightCardDismissed(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('homeInsightCardDismissed', '1');
    }
  };

  useEffect(() => {
    if (marketCardDismissed && insightCardDismissed) return;
    if (tickerPaused) return;
    const id = setInterval(() => {
      setRotMarketIdx((i) => (i + 1) % marketSlides.length);
      setRotInsightIdx((i) => (i + 1) % insightSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [marketSlides.length, insightSlides.length, marketCardDismissed, insightCardDismissed, tickerPaused]);

  // Positioning between search block and section bottom
  const searchSectionRef = useRef<HTMLElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const tickerRef = useRef<HTMLDivElement | null>(null);
  const [tickerTop, setTickerTop] = useState<number | null>(null);

  useEffect(() => {
    if (!showEstimateOverlay) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowEstimateOverlay(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showEstimateOverlay]);

  const measureTicker = () => {
    const sec = searchSectionRef.current;
    const cont = searchContainerRef.current;
    const tick = tickerRef.current;
    if (!sec || !cont) { setTickerTop(null); setRestoreTop(null); return; }

    const secRect = sec.getBoundingClientRect();
    const contRect = cont.getBoundingClientRect();

    // If ticker exists, position it; otherwise only compute restore control position
    if (tick) {
      const tickRect = tick.getBoundingClientRect();
      const midYViewport = contRect.bottom + (secRect.bottom - contRect.bottom) / 2;
      const candidateTop = midYViewport - secRect.top - (tickRect.height / 2);
      const minTop = Math.max(8, contRect.bottom - secRect.top + 8);
      const maxTop = Math.max(minTop, secRect.height - tickRect.height - 8);
      setTickerTop(Math.min(Math.max(candidateTop, minTop), maxTop));
    } else {
      setTickerTop(null);
    }

    // Compute restore button vertical position (viewport-relative) to align with search container center
    try {
      const restoreViewportTop = contRect.top + (contRect.height / 2);
      setRestoreTop(restoreViewportTop);
    } catch (e) {
      setRestoreTop(null);
    }
  };

  useEffect(() => {
    measureTicker();
    const onResize = () => measureTicker();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('scroll', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('scroll', onResize as EventListener);
    };
  }, []);

  useEffect(() => {
    measureTicker();
  }, [rotMarketIdx, rotInsightIdx, typedEstimate, estimateParagraphs, marketCardDismissed, insightCardDismissed]);

  // Convert rough/AI text into a polished, reader-friendly line
  const prettifyEstimate = (raw: string, kw?: string) => {
    const keyword = (kw || lastKeyword || '').trim();
    let t = sanitizeEstimateText(raw);

    // Extract numeric range or single number
    const normalizeNum = (s: string) => s.replace(/,(?=\d{3}(?:\D|$))/g, '');
    const fmtNum = (s: string) => Number(normalizeNum(s)).toLocaleString();

    const range = t.match(/(?:between\s+)?(\d{1,3}(?:,\d{3})*|\d+)\s*(?:[-–—]|to|and|~)\s*(\d{1,3}(?:,\d{3})*|\d+)/i);
    const single = t.match(/(\d{1,3}(?:,\d{3})*|\d+)/);

    let body = t;
    if (range) {
      const a = fmtNum(range[1]);
      const b = fmtNum(range[2]);
      body = `${a}–${b} referring domains (backlinks)`;
    } else if (single) {
      const n = fmtNum(single[1]);
      body = `around ${n} referring domains (backlinks)`;
    } else {
      // Ensure backlinks phrasing present
      if (!/backlink|referring domain/i.test(body)) body += ' backlinks';
    }

    // Compose polished sentence with clear prefix
    const prefix = 'Estimated Backlink Range —';
    const subject = keyword ? `The top result on Google for "${keyword}" likely has:` : 'The top result likely has:';
    let finalText = `${prefix} ${subject} ${body}.`;

    // Normalize whitespace/punctuation
    finalText = finalText.replace(/\s+/g, ' ').replace(/\s+\./g, '.');
    return finalText;
  };

  const formatIntoParagraphs = (raw: string) => {
    if (!raw) return null;
    // Preserve existing double newlines as paragraph separators
    if (/\n\s*\n/.test(raw)) {
      return raw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    }

    // Split into sentences, then group 1-2 sentences per paragraph for readability
    const sentenceSplit = raw.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+(?:\s|$)|.+$/g) || [raw];
    const sentences = sentenceSplit.map(s => s.trim()).filter(Boolean);
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const group = sentences.slice(i, i + 2).join(' ');
      paragraphs.push(group);
    }
    return paragraphs;
  };

  const runTypewriter = (text: string) => {
    const sanitized = sanitizeEstimateText(text);
    setEstimateParagraphs(formatIntoParagraphs(sanitized));
    setTypedEstimate('');
    setTyping(false);
    setShowEstimateOverlay(true);
  };

  const applyEstimate = (kw: string, raw: string) => {
    const text = prettifyEstimate(raw, kw);
    setLastKeyword(kw);
    setEstimateText(text);
    runTypewriter(text);
  };

  const computeHeuristicEstimate = (kw: string) => {
    const words = kw.split(/\s+/).filter(Boolean).length;
    const baseMin = 20 + Math.min(200, words * 10);
    const baseMax = baseMin * 4;
    return `Between ${Math.round(baseMin)} and ${Math.round(baseMax)} referring domains (backlinks)`;
  };

  const tryEstimateFallbacks = async (kw: string, envAny: any, attemptedEndpoint?: string): Promise<string | null> => {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: kw })
    };

    const toKey = (url: string) => {
      try {
        if (/^https?:/i.test(url)) {
          return new URL(url).toString();
        }
        if (typeof window !== 'undefined') {
          return new URL(url, window.location.origin).toString();
        }
      } catch (_) {}
      return url;
    };

    const attemptedKey = attemptedEndpoint ? toKey(attemptedEndpoint) : null;
    const seen = new Set<string>();

    const attempt = async (url: string, logLabel: string, logPrefix: string) => {
      const key = toKey(url);
      if ((attemptedKey && key === attemptedKey) || seen.has(key)) {
        return null;
      }
      seen.add(key);
      console.log(logPrefix, url);
      try {
        const resp = await fetch(url, requestInit);
        const body = await resp.text().catch(() => '');
        console.error(`${logLabel}:`, resp.status, 'body:', body);
        if (!resp.ok) {
          return null;
        }
        try {
          const data = JSON.parse(body || '{}');
          return data?.estimate_text || `Unable to estimate backlinks for "${kw}" right now.`;
        } catch (parseErr) {
          console.error('Error parsing estimate response JSON:', parseErr);
          return null;
        }
      } catch (err) {
        console.error(`Error calling ${url}:`, err);
        return null;
      }
    };

    const apiResult = await attempt('/api/keywordrankEstimatedBacklinks', '/api fallback response status', 'Retrying via /api redirect:');
    if (apiResult) {
      return apiResult;
    }

    const nodeEnv = typeof process !== 'undefined' ? (process as any).env || {} : {};
    const windowEnv = typeof window !== 'undefined' ? (window as any) : {};

    const candidateValues = [
      envAny?.VITE_NETLIFY_FUNCTIONS_URL,
      envAny?.VITE_NETLIFY_DEV_FUNCTIONS,
      envAny?.NETLIFY_FUNCTIONS_URL,
      envAny?.NETLIFY_DEV_FUNCTIONS,
      nodeEnv.VITE_NETLIFY_FUNCTIONS_URL,
      nodeEnv.VITE_NETLIFY_DEV_FUNCTIONS,
      nodeEnv.NETLIFY_FUNCTIONS_URL,
      nodeEnv.NETLIFY_DEV_FUNCTIONS,
      windowEnv?.VITE_NETLIFY_FUNCTIONS_URL,
      windowEnv?.VITE_NETLIFY_DEV_FUNCTIONS,
      windowEnv?.NETLIFY_FUNCTIONS_URL,
      windowEnv?.NETLIFY_DEV_FUNCTIONS,
    ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

    const uniqueCandidates = Array.from(new Set(candidateValues));

    for (const candidate of uniqueCandidates) {
      try {
        const base = candidate.replace(/\/$/, '');
        const altUrl = `${base}/keywordrankEstimatedBacklinks`;
        const altResult = await attempt(altUrl, 'Alternate function response status', 'Retrying estimate via alternate function URL:');
        if (altResult) {
          return altResult;
        }
      } catch (err) {
        console.error('Invalid function base URL:', candidate, err);
      }
    }

    const directResult = await attempt('/.netlify/functions/keywordrankEstimatedBacklinks', 'Direct function response status', 'Retrying via direct functions path:');
    if (directResult) {
      return directResult;
    }

    return null;
  };

  const callOpenAiEstimate = async (kw: string): Promise<string> => {
    const envAny: any = (import.meta as any)?.env || {};
    // Avoid referencing `process` directly in the browser
    const nodeEnv = typeof process !== 'undefined' ? (process as any).env || {} : {};
    // Prefer VITE_ prefixed key for client builds, but also support raw OPENAI_API_KEY if present
    const key = envAny.VITE_OPENAI_API_KEY
      || (window as any)?.VITE_OPENAI_API_KEY
      || (window as any)?.OPENAI_API_KEY
      || (window as any)?.ENV?.VITE_OPENAI_API_KEY
      || nodeEnv.OPENAI_API_KEY
      || nodeEnv.VITE_OPENAI_API_KEY
      || '';
    if (!key) throw new Error('Missing API key in client environment.');
    const system = 'You are an SEO analyst. You estimate backlink counts pragmatically. You never fabricate precise data; you give a reasoned estimate and keep it concise.';
    const user = `Give an estimated number of backlinks based on an intelligent guess for how many backlinks the current top result on Google likely has for the keyword "${kw}".\n\nReturn a single short sentence with a clear integer estimate. Example format: "Estimated backlinks for the current #1 result for \"${kw}\": 350-500 backlinks."`;
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.5,
        max_tokens: 180,
      })
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`OpenAI request failed: ${resp.status} ${errText}`);
    }
    const data = await resp.json();
    return data?.choices?.[0]?.message?.content?.trim() || `Unable to estimate backlinks for "${kw}" right now.`;
  };

  const handleEstimate = async () => {
    if (estimateLoading) return;
    const kwSource = keywordInputRef.current?.value ?? backlinkKeyword;
    const kw = kwSource.trim();
    if (!kw) return;
    setEstimateLoading(true);
    setEstimateText("");
    setTypedEstimate("");
    setShowEstimateOverlay(true);
    try {
      // Autodetect environment and choose function endpoint
      const envAny: any = (import.meta as any)?.env || {};
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

      // Prefer local Netlify Dev when running on localhost or on fly.dev (dev server)
      const isLocalHost = /(^localhost$|^127\.|::1)/.test(hostname) || hostname.includes('fly.dev');

      const localDevBase = envAny.VITE_NETLIFY_DEV_FUNCTIONS || envAny.NETLIFY_DEV_FUNCTIONS || envAny.VITE_NETLIFY_FUNCTIONS_URL || '';
      const defaultLocal = localDevBase || 'http://localhost:8888/.netlify/functions';

      const sameOriginPath = '/api/keywordrankEstimatedBacklinks';

      const endpoint = isLocalHost
        ? (defaultLocal.endsWith('/.netlify/functions') ? `${defaultLocal}/keywordrankEstimatedBacklinks` : `${defaultLocal.replace(/\/$/, '')}/keywordrankEstimatedBacklinks`)
        : sameOriginPath;

      console.log('Using keyword estimate endpoint:', endpoint, 'isLocalHost:', isLocalHost);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.estimate_text || `Unable to estimate backlinks for "${kw}" right now.`;
        applyEstimate(kw, rawText);
        return;
      }

      // Log response body for debugging (console only)
      const bodyText = await res.text().catch(() => '');
      console.error('Netlify function returned non-ok status for estimate:', res.status, 'body:', bodyText);

      if (res.status === 404) {
        const fallbackRaw = await tryEstimateFallbacks(kw, envAny, endpoint);
        if (fallbackRaw) {
          applyEstimate(kw, fallbackRaw);
          return;
        }
      }

      try {
        const directEstimate = await callOpenAiEstimate(kw);
        applyEstimate(kw, directEstimate);
        return;
      } catch (openAiErr) {
        console.error('Direct OpenAI fallback failed:', openAiErr);
      }

      applyEstimate(kw, computeHeuristicEstimate(kw));
      return;
    } catch (e) {
      console.error('Estimate error when calling Netlify function:', e);
      try {
        const directEstimate = await callOpenAiEstimate(kw);
        applyEstimate(kw, directEstimate);
        return;
      } catch (fallbackErr) {
        console.error('Direct OpenAI fallback failed after exception:', fallbackErr);
        applyEstimate(kw, computeHeuristicEstimate(kw));
        return;
      }
    } finally {
      setEstimateLoading(false);
    }
  };

  // Check URL parameters for trial upgrade and track page view
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgrade') === 'trial') {
      setShowTrialUpgrade(true);
      setShowInlineAuth(true);
    }
  }, []);

  // Auto-focus free trial backlink generator when requested via URL
  useEffect(() => {
    try {
      const { search, hash } = window.location;
      const params = new URLSearchParams(search);
      const focusParam = params.get('focus');
      const shouldFocus = focusParam === 'generator' || focusParam === 'trial' || hash === '#blog-generator';
      if (shouldFocus) {
        // Wait for section to mount, then scroll and focus the keyword field
        setTimeout(() => {
          const section = document.getElementById('blog-generator');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const input = section.querySelector('input#keyword') as HTMLInputElement | null;
            input?.focus({ preventScroll: true });
          }
          // Clean the URL param to avoid repeated focusing on navigation
          if (focusParam) {
            params.delete('focus');
            const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${hash || ''}`;
            window.history.replaceState({}, '', newUrl);
          }
        }, 100);
      }
    } catch {}
  }, []);

  // Check for authenticated user on component mount
  useEffect(() => {
    // Get initial session with faster timeout
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    getInitialSession();

    // Fallback timeout to prevent indefinite loading state
    const fallbackTimeout = setTimeout(() => {
      if (!authChecked) {
        console.log('Index page - Auth check timeout, forcing authChecked = true');
        setAuthChecked(true);
      }
    }, 3000); // 3 second timeout

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Index page - Auth state changed:', { event, hasUser: !!session?.user, userId: session?.user?.id });
      setUser(session?.user ?? null);
      if (!authChecked) {
        setAuthChecked(true);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, [authChecked]);

  const handleSignOut = async () => {
    try {
      console.log('Home page: Signing out user...');

      // Clear user state immediately for better UX
      setUser(null);

      // Do actual sign out using direct Supabase call for reliability
      const { error } = await supabase.auth.signOut({ scope: 'global' });

      if (error) {
        console.error('🚪 Sign out error:', error);
      } else {
        console.log('🚪 Sign out successful');
      }

      // Force page refresh after sign out completes
      window.location.reload();

    } catch (error) {
      console.error('Home page sign out error:', error);

      // Still clear user state and refresh even if sign out fails
      setUser(null);
      window.location.reload();
    }
  };

  const headlineVariations = [
    "Enterprise Backlinks",
    "Authority Links",
    "Full User & Client Controls",
    "Industry Leading Tools",
    "Competitive Intelligence",
    "Real Time Tracking",
    "Advanced Keyword Research Tools",
    "Low Outbound Links (OBL)",
    "Unique C-Class IP Addresses",
    "High Indexing Rate",
    "SERP Monitoring",
    "High-DA Networks",
    "Permanent Links",
    "Strategic Placements",
    "Editorial Links",
    "Private Blog Networks",
    "Contextual Authority"
  ];

  const pricingPlans = [
    {
      id: 'starter_100' as const,
      name: 'Starter 100',
      credits: 100,
      price: 140,
      pricePerLink: 1.4,
      description: 'Perfect for testing our platform',
      features: [
        'High DA backlinks',
        'Competitive analysis',
        'Real-time reporting',
        'Campaign management'
      ]
    },
    {
      id: 'starter_200' as const,
      name: 'Starter 200',
      credits: 200,
      price: 280,
      pricePerLink: 1.4,
      description: 'Most popular starting package',
      features: [
        'High DA backlinks',
        'Advanced analytics',
        'Priority support',
        'Campaign optimization'
      ],
      popular: true
    },
    {
      id: 'starter_300' as const,
      name: 'Starter 300',
      credits: 300,
      price: 420,
      pricePerLink: 1.4,
      description: 'Maximum starter value',
      features: [
        'High DA backlinks',
        'Full feature access',
        'Dedicated support',
        'Custom reporting'
      ]
    }
  ];

  const handleGetStarted = (planId: 'starter_100' | 'starter_200' | 'starter_300' | 'custom') => {


    if (planId === 'custom') {
      setIsCustomPackage(true);
    } else {
      setIsCustomPackage(false);
      setSelectedPlan(planId as 'starter_100' | 'starter_200' | 'starter_300');
    }

    setPricingModalOpen(true);
  };


  const handleBlogFormGenerated = (blogPost: any) => {
    setUser(user);

    let fullBlogUrl = '';
    if (blogPost.blogUrl) {
      if (blogPost.blogUrl.startsWith('http')) {
        fullBlogUrl = blogPost.blogUrl;
      } else if (blogPost.blogUrl.startsWith('/')) {
        fullBlogUrl = `${window.location.origin}${blogPost.blogUrl}`;
      } else {
        fullBlogUrl = `${window.location.origin}/blog/${blogPost.blogUrl}`;
      }
    } else if (blogPost.metadata?.slug) {
      fullBlogUrl = `${window.location.origin}/blog/${blogPost.metadata.slug}`;
    }

    setGeneratedBlog({
      title: blogPost.title,
      blogUrl: fullBlogUrl,
      inputs: blogPost.inputs ?? {
        keyword: blogPost.metadata?.keyword || '',
        anchorText: blogPost.metadata?.anchorText || '',
        targetUrl: blogPost.metadata?.targetUrl || ''
      }
    });
    setBlogModalOpen(true);
  };

  const features = [
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Intelligent competitor analysis and strategic link placement for maximum ranking impact.",
      overlay: "We map competitor SERPs and topical clusters to place links on high-relevance pages. This improves topical authority, reduces anchor risk, and accelerates rankings for your primary keywords."
    },
    {
      icon: Zap,
      title: "Rapid Deployment",
      description: "Campaign setup and execution in minutes, not weeks. Start seeing results immediately.",
      overlay: "Fast kickoff means faster crawl and link discovery. We launch with a smart drip to trigger freshness signals without over‑optimization so rankings move quickly and safely."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with comprehensive audit trails and compliance reporting.",
      overlay: "Secure workflows protect tokens and posting credentials, preventing link leakage. Audit trails support compliance and reduce manual‑action risks across large teams."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time performance metrics with predictive ranking intelligence.",
      overlay: "Track referring domain diversity, anchor distribution, OBL, and velocity. Predictive signals flag over‑optimization and surface pages where new links yield the highest ROI."
    }
  ];

  return (
    <div
      className="min-h-screen bg-background font-light bg-hero-soft relative pb-12"
      style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {showEstimateOverlay && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowEstimateOverlay(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-white/20 bg-black/80 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 text-white/70 transition hover:text-white"
              onClick={() => setShowEstimateOverlay(false)}
              aria-label="Close backlink estimate overlay"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-4 pt-2 text-white">
              {lastKeyword ? (
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Keyword: <span className="font-semibold text-white">{lastKeyword}</span>
                </div>
              ) : null}

              {estimateLoading ? (
                <div className="flex items-center gap-3 text-white/80">
                  <div className="loader h-8 w-8 rounded-full border-2 border-white/40" />
                  <span className="text-sm">Analyzing keyword…</span>
                </div>
              ) : typing ? (
                <p className="text-base sm:text-lg font-light leading-relaxed text-white">
                  {typedEstimate}
                </p>
              ) : (
                <div className="space-y-3">
                  {estimateParagraphs && estimateParagraphs.length > 0 ? (
                    estimateParagraphs.map((paragraph, index) => (
                      <p key={index} className="text-base font-light leading-relaxed text-white/90">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-base font-light leading-relaxed text-white/90">{estimateText}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <RankHeader showTabs={false} ctaMode="navigation" />

      {/* Featured Rank Tracker Section - First Section */}
      <HomeFeaturedRankTracker />

      {/* Backlink Estimate Section */}
      <section ref={searchSectionRef} style={{ paddingTop: '24vh', paddingBottom: '24vh' }} className={`relative px-4 md:px-6 bg-gradient-to-br from-blue-50 to-purple-50/30 border-b border-border/50 soft-vignette`}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-4 max-w-md sm:max-w-xl md:max-w-3xl mx-auto text-center">
            <div className="mb-2 flex justify-center -translate-y-[2vh]">
              <a href="/learn" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 px-3 py-1 text-sm shadow-sm transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Learn how it works</span>
              </a>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 text-center">Search the number of backlinks for first result rankings</h2>
          </div>

          <div ref={searchContainerRef} className="relative ui-freeze-on-input max-w-md sm:max-w-xl md:max-w-3xl mx-auto">
            <div className="p-[3px]"><div className="glass-card p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-full shadow-xl border border-border/40 overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 opacity-20 blur-sm pointer-events-none" aria-hidden></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 sm:gap-3 items-center">
                <div className="w-full">
                  <Label htmlFor="backlinkKeyword" className="sr-only">Keyword</Label>
                  <Input
                    ref={keywordInputRef}
                    id="backlinkKeyword"
                    placeholder={keywordPlaceholder}
                    value={backlinkKeyword}
                    onFocus={() => setKeywordFocused(true)}
                    onBlur={() => setKeywordFocused(false)}
                    onChange={(e) => setBacklinkKeyword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleEstimate(); } }}
                    className="bg-white/80 backdrop-blur-sm h-10 sm:h-11 md:h-12 px-4 sm:px-6 rounded-full shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleEstimate} disabled={estimateLoading} className="w-full md:w-auto min-w-[110px] sm:min-w-[120px] flex items-center justify-center space-x-2 rounded-full h-9 sm:h-10 px-3 sm:px-4">
                    <span>{estimateLoading ? 'Analyzing…' : 'Search'}</span>
                    {!estimateLoading && <Search className="ml-0 h-4 w-4" />}
                  </Button>

                  {/* Fancy small indicator */}
                  <div className="hidden md:flex items-center text-sm text-muted-foreground">
                    <span>{estimateLoading ? 'Analyzing keywords' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Loading overlay */}
              {estimateLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-white">
                    <div className="loader w-10 h-10 rounded-full border-2 border-white/30" />
                    <div className="text-sm text-white/90">Analyzing keyword...</div>
                  </div>
                </div>
              )}
            </div>
            </div>

            <div className="min-h-[48px] mt-4 flex items-center justify-center">
              {estimateLoading ? (
                <div className="text-sm text-muted-foreground">Analyzing keyword…</div>
              ) : showEstimateOverlay ? (
                <div className="text-sm text-muted-foreground">Result displayed in the popup overlay.</div>
              ) : estimateText ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs sm:text-sm bg-white text-foreground border border-border shadow-sm hover:bg-white/95"
                  onClick={() => setShowEstimateOverlay(true)}
                >
                  Show latest estimate
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">Results will appear in a popup overlay.</div>
              )}
            </div>

          </div>
        </div>

        {/* Floating restore control (fixed to viewport right) */}
        {(marketCardDismissed || insightCardDismissed) && restoreTop !== null && (
          <div className="hidden md:block" style={{ position: 'fixed', top: restoreTop ? restoreTop + 'px' : '50%', right: '48px', transform: 'translateY(-50%)', zIndex: 60 }}>
            <Button variant="ghost" size="sm" onClick={restoreAll} className="h-8 px-3 bg-white text-foreground border border-border shadow-sm">
              <RotateCcw className="h-4 w-4 mr-1" /> Restore cards
            </Button>
          </div>
        )}

      </section>

      <SEOGrowthGraph />



      <PricingSectionComponent
    pricingPlans={pricingPlans}
    customCredits={customCredits}
    customCreditsInput={customCreditsInput}
    setCustomCredits={setCustomCredits}
    setCustomCreditsInput={setCustomCreditsInput}
    handleGetStarted={handleGetStarted}
    toast={toast}
  />

      <KeywordRankSplitSection />

      {/* Trial Conversion Section */}
      {showTrialUpgrade && (
        <section className="py-12 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="w-full max-w-6xl mx-auto px-6">
            <TrialConversionBanner
              onUpgrade={() => {
                setShowInlineAuth(true);
                document.getElementById('inline-auth')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mb-8"
            />
          </div>
        </section>
      )}

      <StableBlogGeneratorSection user={user} onBlogGenerated={handleBlogFormGenerated} />

      {/* Success Modal for Generated Blog */}
      <Dialog open={blogModalOpen} onOpenChange={setBlogModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Blog Post Published</DialogTitle>
            <DialogDescription>Here are your details and the live link.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Live URL</div>
              <a href={generatedBlog?.blogUrl} className="block break-all text-blue-600 underline" target="_self" rel="noopener noreferrer">
                {generatedBlog?.blogUrl}
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Keyword</div>
                <div className="font-medium">{generatedBlog?.inputs?.keyword}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Anchor Text</div>
                <div className="font-medium">{generatedBlog?.inputs?.anchorText}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Target URL</div>
                <div className="font-medium break-all">{generatedBlog?.inputs?.targetUrl}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (generatedBlog?.blogUrl) navigator.clipboard.writeText(generatedBlog.blogUrl);
              }}
            >
              Copy Link
            </Button>
            <Button
              onClick={() => {
                if (generatedBlog?.blogUrl) window.location.href = generatedBlog.blogUrl;
              }}
            >
              View Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => {
          setPricingModalOpen(false);
          setIsCustomPackage(false);
        }}
        initialCredits={isCustomPackage ? customCredits : pricingPlans.find(p => p.id === selectedPlan)?.credits}
        onAuthSuccess={(user) => {
          setUser(user);
          toast({
            title: "Welcome!",
            description: "You have been successfully signed in.",
          });
        }}
      />

      <FeatureShowcaseModal
        open={featureModalOpen}
        initialFeature={initialFeature}
        onOpenChange={setFeatureModalOpen}
      />



      {/* Restore All button (appears when any UI element is dismissed/collapsed) */}
      {(marketCardDismissed || insightCardDismissed) && (
        <button
          type="button"
          onClick={restoreAll}
          className="fixed right-4 z-[110] inline-flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-lg border hover:bg-gray-50 text-gray-700"
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
          aria-label="Restore all"
          title="Restore all"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      )}

    
      {/* Testimonials (last section) */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedTestimonials />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={closeWaitlistModal}
        initialEmail={waitlistEmail}
        modalProps={currentModal.type === 'waitlist' ? currentModal.props : undefined}
        onSuccess={() => setWaitlistEmail('')}
      />

      {/* Modals are now managed by UnifiedModalManager */}
    </div>
  );
};

export default Index;
