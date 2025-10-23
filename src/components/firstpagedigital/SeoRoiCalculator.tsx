import React, { useMemo, useState } from 'react';

export default function SeoRoiCalculator() {
  const [sessions, setSessions] = useState(10000);
  const [upliftPct, setUpliftPct] = useState(20);
  const [cvRate, setCvRate] = useState(2.5);
  const [aov, setAov] = useState(120);
  const [marginPct, setMarginPct] = useState(60);
  const [monthlyCost, setMonthlyCost] = useState(8000);

  const { incrSessions, incrOrders, incrRevenue, margin, roi } = useMemo(() => {
    const incrSessions = sessions * (upliftPct / 100);
    const incrOrders = incrSessions * (cvRate / 100);
    const incrRevenue = incrOrders * aov;
    const margin = incrRevenue * (marginPct / 100);
    const roi = monthlyCost > 0 ? ((margin - monthlyCost) / monthlyCost) * 100 : 0;
    return { incrSessions, incrOrders, incrRevenue, margin, roi };
  }, [sessions, upliftPct, cvRate, aov, marginPct, monthlyCost]);

  return (
    <div className="fpd-widget">
      <div className="fpd-widget__header">SEO ROI Estimator</div>
      <div className="fpd-widget__grid">
        <label>Monthly Organic Sessions<input type="number" value={sessions} onChange={e=>setSessions(+e.target.value||0)} /></label>
        <label>Expected Uplift %<input type="number" value={upliftPct} onChange={e=>setUpliftPct(+e.target.value||0)} /></label>
        <label>Conversion Rate %<input type="number" value={cvRate} onChange={e=>setCvRate(+e.target.value||0)} /></label>
        <label>Average Order Value<input type="number" value={aov} onChange={e=>setAov(+e.target.value||0)} /></label>
        <label>Margin %<input type="number" value={marginPct} onChange={e=>setMarginPct(+e.target.value||0)} /></label>
        <label>Monthly Program Cost<input type="number" value={monthlyCost} onChange={e=>setMonthlyCost(+e.target.value||0)} /></label>
      </div>
      <div className="fpd-widget__results">
        <div><strong>Incremental Sessions:</strong> {Math.round(incrSessions).toLocaleString()}</div>
        <div><strong>Incremental Orders:</strong> {Math.round(incrOrders).toLocaleString()}</div>
        <div><strong>Incremental Revenue:</strong> ${incrRevenue.toFixed(0)}</div>
        <div><strong>Gross Margin:</strong> ${margin.toFixed(0)}</div>
        <div><strong>ROI:</strong> {roi.toFixed(1)}%</div>
      </div>
    </div>
  );
}
