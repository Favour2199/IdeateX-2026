import React, { type ReactNode } from 'react';
import type { Tone } from '../../types';

interface PillProps {
  children: ReactNode;
  tone?: Tone;
}

export const Pill: React.FC<PillProps> = ({ children, tone = 'slate' }) => {
  const tones: Record<Tone, string> = {
    slate: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};
