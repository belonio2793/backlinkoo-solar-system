import React, { useMemo, useState } from 'react';

export default function VelocityPlanner() {
  const [months, setMonths] = useState(6);
  const [baseline, setBaseline] = useState(8);
  const [ramp, setRamp] = useState(1);

  const schedule = useMemo(() => {
    return Array.from({ length: Math.max(1, months) }, (_, i) => {
      const m = i + 1;
      const qty = Math.max(0, Math.round(baseline + (m - 1) * ramp));
      return { m, qty };
    });
  }, [months, baseline, ramp]);

  const total = schedule.reduce((a, b) => a + b.qty, 0);

  return (
    <div className="fpd-widget">
      <div className="fpd-widget__header">Velocity Planner</div>
      <div className="fpd-widget__grid">
        <label>Months<input type="number" value={months} onChange={e=>setMonths(+e.target.value||0)} /></label>
        <label>Baseline / mo<input type="number" value={baseline} onChange={e=>setBaseline(+e.target.value||0)} /></label>
        <label>Monthly Ramp<input type="number" value={ramp} onChange={e=>setRamp(+e.target.value||0)} /></label>
      </div>
      <div className="fpd-table-wrap" style={{ marginTop: '.75rem' }}>
        <table className="fpd-table">
          <thead><tr><th>Month</th><th>Planned Placements</th></tr></thead>
          <tbody>
            {schedule.map(s => (<tr key={s.m}><td>{s.m}</td><td>{s.qty}</td></tr>))}
          </tbody>
          <tfoot><tr><th>Total</th><th>{total}</th></tr></tfoot>
        </table>
      </div>
    </div>
  );
}
