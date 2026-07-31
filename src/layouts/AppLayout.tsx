import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Pill } from '../components/ui/Pill';
import { NotificationBell } from '../components/notifications/NotificationBell';
import { NAV_BY_ROLE, NOTIFICATIONS_BY_ROLE } from '../utils/navigation';
import type { Role } from '../types';

export const AppLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [noticeOpen, setNoticeOpen] = useState<boolean>(true);

  const role: Role = profile?.role || 'student';
  const navItems = NAV_BY_ROLE[role] || [];
  const notifications = NOTIFICATIONS_BY_ROLE[role] || [];

  const getInitials = (name: string) => {
    if (!name) return 'DA';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const roleLabel =
    role === 'student'
      ? 'Student'
      : role === 'admin'
        ? 'Admin'
        : 'Facilitator';

  return (
    <div className="min-h-full bg-slate-50 font-sans text-slate-800 flex flex-col">
      {noticeOpen && (
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 flex items-center justify-between">
          <span>
            Click-through prototype — logged in as {roleLabel}, matching production RLS security policies.
          </span>
          <button
            onClick={() => setNoticeOpen(false)}
            className="cursor-pointer text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-serif text-lg text-slate-900 tracking-tight">
            ideate<span className="text-amber-500">X</span>
          </p>
          <Pill>{roleLabel}</Pill>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell items={notifications} />
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">
              {getInitials(profile?.full_name || 'David A.')}
            </div>
            <span className="font-medium text-slate-800">
              {profile?.full_name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              title="Log out"
              className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex flex-1">
        <nav className="w-56 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-64px)] p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={`/${role}/${item.key}`}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 font-medium border-l-2 border-amber-500'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
