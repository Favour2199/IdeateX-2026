import React, { useState } from 'react';
import { Bell, X, ChevronLeft } from 'lucide-react';
import type { NotificationItem } from '../../types';
import { Eyebrow } from '../ui/Eyebrow';

interface NotificationBellProps {
  items: NotificationItem[];
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ items }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  const active = items.find((n) => n.id === selected) ?? null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell size={18} className="text-slate-500" />
        {items.length > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
          {!active ? (
            <>
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <Eyebrow>Notifications</Eyebrow>
                <button onClick={close} className="cursor-pointer">
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              {items.length === 0 ? (
                <p className="p-4 text-xs text-slate-400 text-center">No new notifications</p>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSelected(n.id)}
                    className="w-full text-left px-3 py-2.5 text-sm text-slate-700 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {n.header}
                  </button>
                ))
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <p className="text-sm font-medium text-slate-900 flex-1 truncate">
                  {active.header}
                </p>
                <button onClick={close} className="cursor-pointer">
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              <div className="px-3 py-3 text-sm text-slate-600 leading-relaxed">
                {active.details}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
