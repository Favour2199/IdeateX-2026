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
  const [viewedIds, setViewedIds] = useState<number[]>([]);
  const [clearedIds, setClearedIds] = useState<number[]>([]);

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  const visibleItems = items.filter((item) => !clearedIds.includes(item.id));
  const active = visibleItems.find((n) => n.id === selected) ?? null;
  const viewedCount = viewedIds.filter((id) => visibleItems.some((item) => item.id === id)).length;

  const openNotification = (id: number) => {
    setSelected(id);
    setViewedIds((current) => (current.includes(id) ? current : [...current, id]));
  };

  const clearViewed = () => {
    if (viewedIds.length === 0) return;

    setClearedIds((current) => [...new Set([...current, ...viewedIds])]);
    if (selected !== null && viewedIds.includes(selected)) {
      setSelected(null);
    }
    setViewedIds([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell size={18} className="text-slate-500" />
        {visibleItems.length > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {visibleItems.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
          {!active ? (
            <>
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <Eyebrow>Notifications</Eyebrow>
                <div className="flex items-center gap-2">
                  {viewedCount > 0 && (
                    <button
                      onClick={clearViewed}
                      className="text-xs font-medium text-amber-700 hover:text-amber-900 cursor-pointer"
                    >
                      Clear viewed
                    </button>
                  )}
                  <button onClick={close} className="cursor-pointer">
                    <X size={13} className="text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
              </div>
              {visibleItems.length === 0 ? (
                <p className="p-4 text-xs text-slate-400 text-center">No new notifications</p>
              ) : (
                visibleItems.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n.id)}
                    className={`w-full border-b border-slate-50 px-3 py-2.5 text-left text-sm transition-colors cursor-pointer last:border-0 hover:bg-slate-50 ${
                      viewedIds.includes(n.id) ? 'text-slate-400' : 'text-slate-700'
                    }`}
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
