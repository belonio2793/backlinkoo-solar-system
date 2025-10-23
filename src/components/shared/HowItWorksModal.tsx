import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, BookOpen, Globe, Settings, BarChart3, ShieldCheck, Layout, Tags, Sparkles, Network, LineChart, Timer, Zap, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: number;
}

interface SlideItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
}

const useSlides = (): SlideItem[] => {
  return useMemo<SlideItem[]>(() => [
    {
      id: 'add-domains',
      title: 'Add your domains',
      description:
        'Start by adding one or more domains you own. We clean up formatting automatically and verify that each domain can be connected for hosting and analytics.',
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      tip: 'You can add domains one-by-one or paste many at once.'
    },
    {
      id: 'dns-cdn',
      title: 'Point DNS to our CDN + distributed host',
      description:
        'We provide simple DNS records. Point your domain to our global CDN and anycast network for fast, reliable hosting with automatic SSL and caching.',
      icon: <Network className="h-6 w-6 text-indigo-600" />,
      tip: 'Most setups take minutes; we continuously detect and validate DNS changes.'
    },
    {
      id: 'real-time-metrics',
      title: 'Get real-time domain metrics',
      description:
        'See domain authority, trust factor, outbound link counts, and citation flow update in real time. Use these insights to guide content and link strategies.',
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      tip: 'Metrics refresh automatically and can be manually rechecked when needed.'
    },
    {
      id: 'automation-ip',
      title: 'Use our Link Building Automation (proprietary IP)',
      description:
        'Launch smart campaigns that place contextual links inside high-quality AI content across your connected domains—safely, consistently, and at scale.',
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      tip: 'Define your targets and we handle placement, cadence, and variation.'
    },
    {
      id: 'contextual-links',
      title: 'Automated contextual placements',
      description:
        'Our system generates relevant content and places links naturally in context—improving relevance, engagement, and long-term SEO value.',
      icon: <BookOpen className="h-6 w-6 text-sky-600" />,
      tip: 'Content is tailored to your keywords, anchors, and destinations.'
    },
    {
      id: 'indexing-protocols',
      title: 'Multiple indexing protocols for 99% index rate',
      description:
        'We automatically submit, ping, and surface fresh content through several indexing methods to maximize index coverage and speed across all links.',
      icon: <Timer className="h-6 w-6 text-orange-600" />,
      tip: 'Fast indexing means faster ranking signals and performance.'
    },
    {
      id: 'real-time-reporting',
      title: 'Real-time reporting and tracking',
      description:
        'Monitor placements, index status, traffic signals, and campaign progress in one place—ideal for client updates and team collaboration.',
      icon: <LineChart className="h-6 w-6 text-green-700" />,
      tip: 'Export data anytime for reports or audits.'
    },
    {
      id: 'transparent-monitoring',
      title: 'Transparent monitoring of automation',
      description:
        'Every automated action is logged. You get clear visibility into what happened, when, and why—no black box decisions.',
      icon: <Settings className="h-6 w-6 text-gray-700" />,
      tip: 'Drill into activity logs to validate outcomes.'
    },
    {
      id: 'no-manual-labor',
      title: 'Eliminate manual labor and low-quality outsourcing',
      description:
        'Stop chasing writers and managing spreadsheets. Automation preserves quality and consistency while freeing up your time.',
      icon: <Sparkles className="h-6 w-6 text-fuchsia-600" />,
      tip: 'Scale output without scaling headcount.'
    },
    {
      id: 'reliable-hosting',
      title: 'Reliable hosting without surprise downtime',
      description:
        'Our distributed platform reduces risk from unreliable hosts. Get automatic SSL, caching, and redundancy out of the box.',
      icon: <CloudSun className="h-6 w-6 text-cyan-600" />,
      tip: 'We continuously monitor availability and performance.'
    },
    {
      id: 'unlimited-pbn',
      title: 'Add unlimited domains—build your private network',
      description:
        'Create and manage your own private blog network (PBN) without technical overhead. Add as many domains as you need.',
      icon: <ShieldCheck className="h-6 w-6 text-teal-600" />,
      tip: 'A single dashboard for domains, content, and campaigns.'
    },
    {
      id: 'rank-faster',
      title: 'Rank faster—even for tough keywords',
      description:
        'Combine authoritative placements, quality content, and rapid indexing for faster results. Provide measurable value to customers and clients.',
      icon: <BarChart3 className="h-6 w-6 text-emerald-700" />,
      tip: 'Your strategy; our execution and infrastructure.'
    }
  ], []);
};

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ open, onOpenChange, initialStep = 0 }) => {
  const slides = useSlides();
  const [index, setIndex] = useState(initialStep);

  useEffect(() => {
    if (!open) return;
    setIndex(initialStep);
  }, [open, initialStep]);

  const total = slides.length;
  const progress = Math.round(((index + 1) / total) * 100);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Learn How It Works
          </DialogTitle>
          <DialogDescription>
            A quick, friendly walkthrough of domains, DNS, automation, and reporting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-muted-foreground w-10 text-right">{index + 1}/{total}</span>
          </div>

          <div className="rounded-lg border bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0">{slides[index].icon}</div>
              <div>
                <h3 className="text-lg font-semibold">{slides[index].title}</h3>
                <p className="mt-2 text-sm text-gray-700">{slides[index].description}</p>
                {slides[index].tip && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">Tip</Badge>
                    <p className="mt-1 text-xs text-gray-600">{slides[index].tip}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={prev} disabled={index === 0} className={cn('gap-2', index === 0 && 'invisible')}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`Go to ${s.title}`}
                  className={cn('h-2.5 w-2.5 rounded-full transition', i === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400')}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            {index === total - 1 ? (
              <Button onClick={() => onOpenChange(false)} className="gap-2">
                Got it
              </Button>
            ) : (
              <Button onClick={next} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Separator />
          <div className="text-xs text-muted-foreground">
            You can reopen this tutorial anytime from the Automation or Domains pages.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;
