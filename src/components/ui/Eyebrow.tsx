import React, { type ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ children }) => {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">
      {children}
    </p>
  );
};
