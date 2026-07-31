import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

export const getRoleDefaultPath = (role: Role): string => {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'facilitator':
      return '/facilitator/sessions';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/login';
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    const redirectPath = getRoleDefaultPath(profile.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
