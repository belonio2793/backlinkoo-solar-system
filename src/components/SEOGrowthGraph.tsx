import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RotatingText } from "@/components/RotatingText";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Utility to format large numbers nicely
const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.round(n).toLocaleString();
};

// Format ROI percentage with suffixes (keeps math but makes UI readable)
const fmtPercent = (n: number) => {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B%`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M%`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1).replace(/\.0$/, "")}k%`;
  return `${Math.round(n)}%`;
};

// Predictive model for compounding organic growth (toy but smooth & believable)
function makeData(days = 52, roiBoost = 1) {
  const points: { week: number; label: string; traffic: number; roi: number; keywords: number; volume: number }[] = [];
  const cost = 280; // baseline initial campaign cost (example)
  const convRate = 0.022; // 2.2% site-wide CR
  const valuePerConv = 65; // LTV per conversion

  // Start ROI at ~92% by priming cumulative revenue
  let cumulativeRevenue = cost * 1.92;

  // Precompute a normalized logistic for smooth growth mapping 0->1
  const maxTraffic = 8000; // daily ceiling for visualization
  const minTraffic = 147; // requested: 1 keyword = 147 daily visitors at start
  const logistic = (x: number) => 1 / (1 + Math.exp(-8 * (x - 0.45)));
  const l0 = logistic(0);
  const l1 = logistic(1);

  for (let i = 0; i <= days; i++) {
    const t = i / Math.max(1, days); // 0..1

    // Daily visitors: start at 147 and smoothly approach maxTraffic
    const traffic = minTraffic + ((logistic(t) - l0) / Math.max(1e-6, (l1 - l0))) * (maxTraffic - minTraffic);

    // Keywords discovered & ranked gradually (start at 1, ramp to 1000)
    const keywords = 1 + Math.pow(t, 0.85) * 999; // 1..1000
    // Requested: 1 keyword = 4400 monthly search volume (scale linearly by keyword count)
    const volume = keywords * 4400;

    // simple revenue model based on traffic
    const dailyRevenue = traffic * convRate * valuePerConv;
    cumulativeRevenue += dailyRevenue; // accumulate daily revenue

    // Apply exponential boost to cumulative revenue over time based on roiBoost
    const boosted = cumulativeRevenue * Math.exp(roiBoost * t * 0.9);

    const roi = ((boosted - cost) / Math.max(cost, 1)) * 100; // %

    points.push({
      week: i,
      label: `Day ${i}`,
      traffic,
      roi,
      keywords,
      volume,
    });
  }
  return points;
}

export default function SEOGrowthGraph({ className }: { className?: string }) {
  const ROI_MAX = 1000; // slider & handle shared cap (large to allow big growth)
  const [roiBoost, setRoiBoost] = useState(1);
  const data = useMemo(() => makeData(64, roiBoost), [roiBoost]);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const roiHandleRef = useRef<HTMLDivElement | null>(null);
  const [draggingRoi, setDraggingRoi] = useState(false);

  // Sync pointer drag across the chart surface
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      setDragging(true);
      onMove(e);
    };
    const onUp = () => setDragging(false);
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging && !(e as any).buttons) return;
      const rect = el.getBoundingClientRect();
      const clientX = (e as TouchEvent).touches?.[0]?.clientX ?? (e as MouseEvent).clientX;
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)));
      const newIdx = Math.round(pct * (data.length - 1));
      setIndex(newIdx);
    };

    el.addEventListener("mousedown", onDown as any);
    el.addEventListener("touchstart", onDown as any, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    el.addEventListener("mousemove", onMove as any);
    el.addEventListener("touchmove", onMove as any, { passive: true });

    return () => {
      el.removeEventListener("mousedown", onDown as any);
      el.removeEventListener("touchstart", onDown as any);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      el.removeEventListener("mousemove", onMove as any);
      el.removeEventListener("touchmove", onMove as any);
    };
  }, [dragging, data.length]);

  // ROI drag handlers (vertical)
  useEffect(() => {
    const handle = roiHandleRef.current;
    const container = ref.current;
    if (!handle || !container) return;

    let active = false;
    const maxBoost = ROI_MAX;

    const onPointerDown = (e: PointerEvent) => {
      active = true;
      (handle as Element).setPointerCapture?.(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const rect = container.getBoundingClientRect();
      const clientY = e.clientY;
      const pct = 1 - Math.min(1, Math.max(0, (clientY - rect.top) / Math.max(1, rect.height)));
      const newBoost = Math.max(0, pct * maxBoost);
      setRoiBoost(newBoost);
    };

    const onPointerUp = (e: PointerEvent) => {
      active = false;
      try { (handle as Element).releasePointerCapture?.(e.pointerId); } catch {}
    };

    handle.addEventListener("pointerdown", onPointerDown as any);
    window.addEventListener("pointermove", onPointerMove as any);
    window.addEventListener("pointerup", onPointerUp as any);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown as any);
      window.removeEventListener("pointermove", onPointerMove as any);
      window.removeEventListener("pointerup", onPointerUp as any);
    };
  }, [roiHandleRef.current, ref.current, ROI_MAX]);

  const selected = data[index] ?? data[data.length - 1];

  return (
    <section className={cn("relative py-16 md:py-24 bg-white border-y", className)}>
      <div className="absolute inset-0 pointer-events-none" />
      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Anchor for Growth Engine removed from visual header per request */}
        <div id="growth-engine" />

        {/* KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <KPI label="Keywords" value={fmt(selected.keywords)} />
          <KPI label="Monthly Search Volume" value={fmt(selected.volume)} />
          <KPI label="Daily Visitors" value={fmt(selected.traffic)} />
          <KPI label="ROI %" value={fmtPercent(selected.roi)} />
        </div>

        {/* Chart */}
        <div className="relative rounded-2xl bg-white  border border-border/60  overflow-hidden ring-1 ring-black/5">
          <div ref={ref} className="absolute inset-0 z-10" aria-hidden />
          <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(90%_80%_at_50%_10%,#000,transparent)]" />

          <div className="relative">
            <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <ChartContainer
              config={{
                traffic: { label: "Daily Traffic", color: "hsl(var(--primary))" },
                roi: { label: "ROI %", color: "#10b981" },
              }}
              className="h-[340px] w-full"
            >
              <AreaChart data={data} margin={{ top: 20, right: 24, left: 12, bottom: 12 }}>
                <defs>
                  <linearGradient id="gradTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(v) => `Day ${v}`} />
                <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} width={56} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(v) => fmtPercent(Number(v))} width={46} />

                <Tooltip content={<ChartTooltipContent hideIndicator />} formatter={(value: any, name: any) => [typeof value === "number" ? (name === "roi" ? fmtPercent(Number(value)) : fmt(Number(value))) : value, name === "traffic" ? "Daily Traffic" : name === "roi" ? "ROI %" : name]} />

                <Area type="monotone" dataKey="traffic" stroke="#2563eb" strokeWidth={2.2} fill="url(#gradTraffic)" yAxisId="left" />
                <Area type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={1.8} fill="url(#gradRoi)" yAxisId="right" />

                <ReferenceLine x={selected.week} yAxisId="left" stroke="#94a3b8" strokeDasharray="4 4" />
                <ReferenceDot x={selected.week} y={selected.traffic} r={5} fill="#2563eb" yAxisId="left" />
              </AreaChart>
            </ChartContainer>

            {/* Floating label for the selected point */}

            {/* ROI draggable handle (right side) */}
            <div className="absolute right-2 top-6 bottom-6 w-8 flex items-start justify-center pointer-events-auto">
              <div
                ref={roiHandleRef}
                role="slider"
                aria-label="ROI growth handle"
                aria-valuemin={0}
                aria-valuemax={ROI_MAX}
                aria-valuenow={roiBoost}
                title="Drag up to increase exponential ROI boost"
                className="relative w-6 h-full flex items-start"
              >
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600  cursor-grab"
                  style={{ top: `${(1 - Math.min(1, roiBoost / ROI_MAX)) * 100}%` }}
                />
              </div>
            </div>


          </div>

          {/* Drag helper indicator */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/70 to-transparent pointer-events-none" />
        </div>

        {/* Slider control mirrors the drag, for accessibility (native fallback) */}
        <div className="mt-5 select-none">
          <input
            type="range"
            min={0}
            max={data.length - 1}
            value={index}
            onChange={(e) => setIndex(Number((e.target as HTMLInputElement).value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-blue-600"
            aria-label="Day slider"
          />
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-gray-500">
            <span>Day 0</span>
            <span>Drag to Explore</span>
            <span aria-hidden="true">&nbsp;</span>
          </div>

          {/* ROI guidance and readout (slider removed; use right-side handle) */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider">ROI Growth</label>
              <div className="mt-1 text-xs text-gray-500">Drag the right-side handle to apply an exponential growth factor to projected ROI over time.</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono">{roiBoost.toFixed(2)}x</div>
              <div className="text-[11px] text-gray-500">Unlimited potential</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KPI({ label, value }: { label: string; value: string | number; glow?: string }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-white border border-border/60 shadow-sm p-4 sm:p-5"
    )}>
      <div className="relative z-10">
        <div className="text-[11px] uppercase tracking-wider text-gray-500">{label}</div>
        <div className="mt-1 text-xl md:text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
