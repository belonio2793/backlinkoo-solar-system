import React, { useMemo, useState } from 'react';

export default function PaidBreakEvenCalculator() {
  const [cvRate, setCvRate] = useState(2.0);
  const [aov, setAov] = useState(100);
  const [marginPct, setMarginPct] = useState(60);
  const [targetRoas, setTargetRoas] = useState(3.0);

  const { maxCPC, maxCPA } = useMemo(() => {
    const grossMargin = aov * (marginPct / 100);
    const maxCPA = grossMargin / targetRoas;
    const maxCPC = cvRate > 0 ? maxCPA * (cvRate / 100) : 0;
    return { maxCPC, maxCPA };
  }, [cvRate, aov, marginPct, targetRoas]);

  return (
    <div className="fpd-widget">
      <div className="fpd-widget__header">Paid Media Break‑Even</div>
      <div className="fpd-widget__grid">
        <label>Conversion Rate %<input type="number" value={cvRate} onChange={e=>setCvRate(+e.target.value||0)} /></label>
        <label>Average Order Value<input type="number" value={aov} onChange={e=>setAov(+e.target.value||0)} /></label>
        <label>Margin %<input type="number" value={marginPct} onChange={e=>setMarginPct(+e.target.value||0)} /></label>
        <label>Target ROAS<input type="number" step="0.1" value={targetRoas} onChange={e=>setTargetRoas(+e.target.value||0)} /></label>
      </div>
      <div className="fpd-widget__results">
        <div><strong>Max CPA:</strong> ${maxCPA.toFixed(2)}</div>
        <div><strong>Max CPC:</strong> ${maxCPC.toFixed(2)}</div>
      </div>
    </div>
  );
}
