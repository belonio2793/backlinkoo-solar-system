import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// A compact, self‑contained ticker that compares common backlink services/prices
// Doubles the items to create a seamless loop

type TickerItem = {
  name: string
  price: number
  note?: string
  description: string
  ours?: boolean
  anchorId?: string
}

const items: TickerItem[] = [
  {
    name: 'Backlink ∞',
    price: 1.4,
    note: 'Per Backlink',
    description: 'Automated link building campaigns with live progress and indexing signals.',
    ours: true,
    anchorId: 'our-price'
  },
  {
    name: 'Guest Post Marketplace',
    price: 150,
    note: '+',
    description: 'Typical marketplace listing for DA30–40 blogs with basic editorial review.'
  },
  {
    name: 'Niche Edit Providers',
    price: 120,
    note: '+',
    description: 'Contextual link insertions on aged articles; variable quality and turnaround.'
  },
  {
    name: 'Digital PR Campaigns',
    price: 500,
    note: '+',
    description: 'Premium outreach with bespoke angles; slower but strong authority wins.'
  },
  {
    name: 'Blogger Outreach (Agency)',
    price: 200,
    note: '+',
    description: 'Managed placements on vetted sites; usually per‑link pricing.'
  },
  {
    name: 'Marketplace Bundles',
    price: 300,
    note: '+',
    description: 'Packaged offers across mixed domains; quality varies widely.'
  },
  {
    name: 'DIY Hosting + Content',
    price: 80,
    note: '/mo',
    description: 'Running your own small PBN including basic hosting + content costs.'
  },
]

export function PriceTicker({ fixedBottom = false }: { fixedBottom?: boolean }) {
  const doubled = React.useMemo(() => [...items, ...items], [])

  return (
    <div
      className={
        fixedBottom
          ? 'fixed inset-x-0 bottom-0 z-[10000] border-t border-border/50 bg-white/90 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur supports-[backdrop-filter]:bg-white/70'
          : 'border-b border-border/50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70'
      }
      style={fixedBottom ? { paddingBottom: 'env(safe-area-inset-bottom, 0px)' } : undefined}
    >
      <div className="w-full">
        <div className="relative overflow-hidden" aria-label="Live pricing comparison ticker" role="region">
          <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white/90 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white/90 to-transparent pointer-events-none" />

          <TooltipProvider delayDuration={120}>
            <div className="ticker group h-10 sm:h-11 flex items-center relative">
              <div className="ticker-track flex items-center gap-6 sm:gap-8 whitespace-nowrap will-change-transform">
                {doubled.map((item, idx) => {
                  const isFirstCycle = idx < items.length
                  const keyBase = item.anchorId ?? item.name.replace(/\s+/g, '-').toLowerCase()
                  const itemKey = `${keyBase}-${idx}`

                  return (
                    <Tooltip key={itemKey}>
                      <TooltipTrigger asChild>
                        <div
                          id={isFirstCycle && item.anchorId ? item.anchorId : undefined}
                          className="flex items-center gap-2 text-xs sm:text-sm cursor-default"
                        >
                          <span className="text-black font-normal">{item.name}</span>
                          <span className={item.ours ? 'px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold' : 'text-gray-900 font-medium'}>
                            {'$'}
                            {item.price}
                            {item.note && ' '}
                            {item.note}
                          </span>
                          <span className="text-gray-400">•</span>
                          {item.ours && (
                            <span className="hidden sm:inline text-xs uppercase tracking-wide font-bold text-primary">OUR PRICE</span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-xs">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-foreground">{item.name}</span>
                          <p className="text-xs leading-snug text-muted-foreground">{item.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          </TooltipProvider>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/90 to-transparent" />
        </div>
      </div>

      {/* Ticker animation styles */}
      <style>
        {`
        .ticker-track {
          animation: ticker-move 28s linear infinite;
        }
        .group:hover .ticker-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
        @keyframes ticker-move {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        `}
      </style>
    </div>
  )
}

export default PriceTicker
