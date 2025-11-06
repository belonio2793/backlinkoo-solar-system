import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Trophy, TrendingUp, Link as LinkIcon, Award, X } from 'lucide-react';

interface CaseStudyItem {
  brand: string;
  headline: string;
  result: string;
  backlinks: string;
  notes?: string;
}

export const SEOCaseStudiesRotator: React.FC<{ restoreSignal?: number }> = ({ restoreSignal }) => {
  const items: CaseStudyItem[] = useMemo(() => [
    { brand: 'Backlinko', headline: 'Skyscraper Technique dominated competitive queries', result: 'Multiple #1 rankings', backlinks: '5k+ referring domains to flagship assets', notes: 'Iconic skyscraper outreach playbook' },
    { brand: 'Ahrefs', headline: 'Programmatic keyword pages captured long‑tail demand', result: 'Millions of monthly visits', backlinks: '100k+ referring domains across library', notes: 'Data‑driven SEO at scale' },
    { brand: 'HubSpot', headline: 'Topic clusters + pillar pages won SaaS intent', result: 'Thousands of page‑one terms', backlinks: '1M+ links to content hub', notes: 'Internal linking structure amplified authority' },
    { brand: 'Canva', headline: 'Templates SEO unlocked explosive growth', result: '0 → 1B+ visits/yr over time', backlinks: '400k+ referring domains', notes: 'Design templates targeted intent with scalable pages' },
    { brand: 'Zapier', headline: 'App “X vs Y” pages captured high‑intent searches', result: '#1 for thousands of comparisons', backlinks: '250k+ referring domains', notes: 'Programmatic SEO done right' },
    { brand: 'NerdWallet', headline: 'Editorial authority in personal finance vertical', result: 'Owns many money terms', backlinks: '500k+ referring domains', notes: 'Relentless content + authority building' },
    { brand: 'G2', headline: 'Category pages rank for software keywords', result: 'SERP dominance for B2B tools', backlinks: '1M+ links across ecosystem', notes: 'UGC + aggregation + internal PR' },
    { brand: 'Healthline', headline: 'Medical E‑E‑A‑T with editorial rigor', result: 'Top visibility across health SERPs', backlinks: '1M+ referring domains', notes: 'Expert review & authority signals at scale' },
    { brand: 'Shopify', headline: 'Commerce resource hub compounding links', result: 'Massive organic funnel', backlinks: '700k+ referring domains', notes: 'Education content drives brand searches' },
    { brand: 'Mailchimp', headline: 'Guides + glossary captured intent stages', result: 'Owns email marketing queries', backlinks: '300k+ referring domains', notes: 'Evergreen education library' },
    { brand: 'Wikipedia', headline: 'Internal linking + authority flywheel', result: 'SERP omnipresence', backlinks: 'Millions of referring domains', notes: 'Canonical example of link equity flow' },
    { brand: 'Investopedia', headline: 'Finance glossary SEO', result: 'Dominates definitional queries', backlinks: '1M+ referring domains', notes: 'Depth + trust + consistency' },
    { brand: 'Reddit', headline: 'Community UGC pages earn natural links', result: 'High visibility for discussions', backlinks: 'Millions of referring domains', notes: 'Freshness + breadth' },
    { brand: 'Backlink ∞ Users', headline: 'Contextual placements across unique domains', result: 'Predictable top-3 gains', backlinks: 'Hundreds of new RDs per campaign', notes: 'Autonomous campaigning' },
    { brand: 'Airbnb (guides)', headline: 'City/host resource hubs', result: 'Travel intent capture', backlinks: 'High authority editorial links', notes: 'Localized content at scale' },
    { brand: 'Expedia', headline: 'Destination hubs + programmatic SEO', result: 'Long‑tail coverage across geo/intent', backlinks: 'Enterprise‑level link graph', notes: 'Taxonomy‑driven architecture' },
    { brand: 'Moz', headline: 'Foundational guides earned elite links', result: 'Evergreen #1s (e.g., “what is seo”)', backlinks: 'Hundreds of thousands of links', notes: 'Link magnets that compound' },
    { brand: 'CXL', headline: 'Deep research content', result: 'Ranks for competitive CRO queries', backlinks: 'Strong authority signals', notes: 'Expert long‑form execution' },
  ], []);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  // Pause rotation when hovered or when user manually overrides with keyboard
  const [hoverPaused, setHoverPaused] = useState(false);
  const manualUnpauseTimer = useRef<number | null>(null);

  // Filter out skewed items from rotation
  const displayItems = useMemo(
    () => items.filter(i => !(i.brand === 'Backlinko' || i.brand === 'Ahrefs' || i.brand === 'Moz')),
    [items]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('seoCaseStudiesDismissed') === '1') {
      setDismissed(true);
    }
  }, []);

  // Listen for external restore requests (signal bump)
  useEffect(() => {
    if (typeof restoreSignal === 'undefined') return;
    // when restoreSignal changes, un-dismiss and reset rotation index
    setDismissed(false);
    setIndex(0);
    if (typeof window !== 'undefined') {
      try { window.sessionStorage.removeItem('seoCaseStudiesDismissed'); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('seoCaseStudies:changed', { detail: { dismissed: false } })); } catch (e) {}
    }
  }, [restoreSignal]);

  useEffect(() => {
    if (dismissed || displayItems.length === 0) return;
    if (hoverPaused) return; // stop rotation while hovered or manually paused
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % displayItems.length);
        setVisible(true);
      }, 180);
    }, 3500);
    return () => clearInterval(id);
  }, [displayItems.length, dismissed, hoverPaused]);

  // cleanup manual unpause timer on unmount
  useEffect(() => {
    return () => {
      if (manualUnpauseTimer.current) {
        clearTimeout(manualUnpauseTimer.current as unknown as number);
        manualUnpauseTimer.current = null;
      }
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('seoCaseStudiesDismissed', '1');
      try { window.dispatchEvent(new CustomEvent('seoCaseStudies:changed', { detail: { dismissed: true } })); } catch (e) {}
    }
  };

  const item = displayItems[index % Math.max(1, displayItems.length)] || displayItems[0];

  if (dismissed) {
    return null;
  }

  return (
    <div className="mt-2 mb-4 sm:mb-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-700 mb-2">
          <Trophy className="h-4 w-4" />
          <span className="uppercase tracking-wider">Real‑world SEO wins</span>
        </div>
        <div
          className="relative mx-auto max-w-4xl px-2 sm:px-4 rounded-2xl focus:outline-none focus-visible:outline-none"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="SEO case studies carousel"
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              setVisible(false);
              setIndex((i) => (i - 1 + Math.max(1, displayItems.length)) % Math.max(1, displayItems.length));
              setTimeout(() => setVisible(true), 120);
              // manual override: pause auto-rotation for a short duration
              setHoverPaused(true);
              if (manualUnpauseTimer.current) clearTimeout(manualUnpauseTimer.current as unknown as number);
              manualUnpauseTimer.current = window.setTimeout(() => { setHoverPaused(false); manualUnpauseTimer.current = null; }, 8000);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              setVisible(false);
              setIndex((i) => (i + 1) % Math.max(1, displayItems.length));
              setTimeout(() => setVisible(true), 120);
              // manual override: pause auto-rotation for a short duration
              setHoverPaused(true);
              if (manualUnpauseTimer.current) clearTimeout(manualUnpauseTimer.current as unknown as number);
              manualUnpauseTimer.current = window.setTimeout(() => { setHoverPaused(false); manualUnpauseTimer.current = null; }, 8000);
            }
          }}
        >
          <div className={`transition-all duration-200 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            <div className="rounded-xl pricing-card-rainbow border border-blue-200/50 bg-white  px-5 sm:px-6 pr-10 sm:pr-12 py-3 shadow-sm relative">
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss SEO case studies widget"
                className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200/60 bg-white hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 text-gray-800">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm sm:text-base font-semibold">{item.brand}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{item.headline}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-green-700 font-medium"><TrendingUp className="h-4 w-4"/>{item.result}</div>
                  <div className="hidden sm:flex items-center gap-1 text-purple-700"><LinkIcon className="h-4 w-4"/>{item.backlinks}</div>
                </div>
              </div>
              {item.notes && <div className="mt-1 text-[11px] sm:text-xs text-gray-500">{item.notes}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
