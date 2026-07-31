import React from 'react';

interface GaugeProps {
  value: number;
}

export const Gauge: React.FC<GaugeProps> = ({ value }) => {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = value / 100;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-slate-100"
        strokeWidth="12"
      />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-amber-500"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
      />
    </svg>
  );
};
