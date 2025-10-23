import React, { useMemo, useState } from 'react';

export default function AnchorMixCalculator() {
  const [total, setTotal] = useState(40);
  const [branded, setBranded] = useState(40);
  const [url, setUrl] = useState(20);
  const [topical, setTopical] = useState(30);
  const [descriptive, setDescriptive] = useState(10);

  const sum = branded + url + topical + descriptive;
  const normalized = sum === 100;

  const counts = useMemo(() => {
    const pct = sum > 0 ? { branded: branded / sum, url: url / sum, topical: topical / sum, descriptive: descriptive / sum } : { branded: 0, url: 0, topical: 0, descriptive: 0 };
    return {
      branded: Math.round(total * pct.branded),
      url: Math.round(total * pct.url),
      topical: Math.round(total * pct.topical),
      descriptive: Math.round(total * pct.descriptive),
    };
  }, [total, branded, url, topical, descriptive, sum]);

  return (
    <div className="fpd-widget">
      <div className="fpd-widget__header">Anchor Mix Planner</div>
      <div className="fpd-widget__grid">
        <label>Total Links<input type="number" value={total} onChange={e=>setTotal(+e.target.value||0)} /></label>
        <label>Branded %<input type="number" value={branded} onChange={e=>setBranded(+e.target.value||0)} /></label>
        <label>URL %<input type="number" value={url} onChange={e=>setUrl(+e.target.value||0)} /></label>
        <label>Topical %<input type="number" value={topical} onChange={e=>setTopical(+e.target.value||0)} /></label>
        <label>Descriptive %<input type="number" value={descriptive} onChange={e=>setDescriptive(+e.target.value||0)} /></label>
        <div className={"text-sm "+(normalized?"text-green-700":"text-amber-700")}>Sum: {sum}% {normalized?"(balanced)":"(auto-normalized)"}</div>
      </div>
      <div className="fpd-widget__results">
        <div><strong>Branded:</strong> {counts.branded}</div>
        <div><strong>URL:</strong> {counts.url}</div>
        <div><strong>Topical:</strong> {counts.topical}</div>
        <div><strong>Descriptive:</strong> {counts.descriptive}</div>
      </div>
    </div>
  );
}
