import React, { useMemo, useState } from 'react';

export default function PricingEstimator() {
  const [retainer, setRetainer] = useState(12000);
  const [pillars, setPillars] = useState(2);
  const [supports, setSupports] = useState(6);
  const [placements, setPlacements] = useState(8);
  const [unitPillar, setUnitPillar] = useState(1200);
  const [unitSupport, setUnitSupport] = useState(450);
  const [unitPlacement, setUnitPlacement] = useState(250);

  const { modeledCost, efficiency } = useMemo(() => {
    const modeledCost = pillars*unitPillar + supports*unitSupport + placements*unitPlacement;
    const efficiency = retainer > 0 ? (modeledCost / retainer) * 100 : 0;
    return { modeledCost, efficiency };
  }, [retainer, pillars, supports, placements, unitPillar, unitSupport, unitPlacement]);

  return (
    <div className="fpd-widget">
      <div className="fpd-widget__header">Pricing Estimator</div>
      <div className="fpd-widget__grid">
        <label>Monthly Retainer<input type="number" value={retainer} onChange={e=>setRetainer(+e.target.value||0)} /></label>
        <label>Pillars / mo<input type="number" value={pillars} onChange={e=>setPillars(+e.target.value||0)} /></label>
        <label>Supports / mo<input type="number" value={supports} onChange={e=>setSupports(+e.target.value||0)} /></label>
        <label>Placements / mo<input type="number" value={placements} onChange={e=>setPlacements(+e.target.value||0)} /></label>
        <label>Unit Pillar Cost<input type="number" value={unitPillar} onChange={e=>setUnitPillar(+e.target.value||0)} /></label>
        <label>Unit Support Cost<input type="number" value={unitSupport} onChange={e=>setUnitSupport(+e.target.value||0)} /></label>
        <label>Unit Placement Cost<input type="number" value={unitPlacement} onChange={e=>setUnitPlacement(+e.target.value||0)} /></label>
      </div>
      <div className="fpd-widget__results">
        <div><strong>Modeled Work Cost:</strong> ${modeledCost.toFixed(0)}</div>
        <div><strong>Efficiency vs Retainer:</strong> {efficiency.toFixed(0)}%</div>
      </div>
    </div>
  );
}
