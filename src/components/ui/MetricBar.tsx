import React from 'react';
import type { Tone } from '../../types';

interface MetricBarProps {
  label: string;
  value: number;
  tone: Tone;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  label,
  value,
  tone,
}) => {
  const tones: Record<Tone, string> = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-600',
    slate: 'bg-slate-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span>
        <span className="font-medium text-slate-700">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className={`h-1.5 rounded-full ${tones[tone]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
