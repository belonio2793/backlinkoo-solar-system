import React from 'react';

export default function FirstPageComparisons() {
  const rows = [
    { option: 'First Page Digital', fit: 'Full‑service, APAC‑savvy, multi‑channel orchestration', risks: 'Requires clear scope and governance', bestFor: 'Teams seeking compounding SEO + paid + CRO' },
    { option: 'In‑House Only', fit: 'Control and domain expertise', risks: 'Hiring bandwidth; limited channel depth', bestFor: 'Stable roadmaps with slower iteration' },
    { option: 'Boutique Specialist', fit: 'Deep channel craft (SEO or PR)', risks: 'Gaps in adjacent channels', bestFor: 'Focused needs with strong internal PM' },
    { option: 'Marketplace/Freelancers', fit: 'Flexible, cost efficient pilots', risks: 'Quality variance; coordination overhead', bestFor: 'Task‑level work with defined specs' },
  ];
  return (
    <div className="fpd-table-wrap">
      <table className="fpd-table">
        <thead>
          <tr>
            <th>Option</th>
            <th>Strength</th>
            <th>Risks</th>
            <th>Best When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.option}>
              <td>{r.option}</td>
              <td>{r.fit}</td>
              <td>{r.risks}</td>
              <td>{r.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
