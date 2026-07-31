import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { getRoleDefaultPath } from '../../components/auth/ProtectedRoute';
import type { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const { signIn, signInAsDemoRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('david.a@example.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [loading, setLoading] = useState<boolean>(false);

  const handleDemoLogin = (role: Role) => {
    setLoading(true);
    signInAsDemoRole(role);
    const path = getRoleDefaultPath(role);
    navigate(path, { replace: true });
  };

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await signIn(email, password);
      // AuthProvider state change will trigger profile load, default to student path if needed
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.warn('Sign-in fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-3xl text-white text-center tracking-tight mb-1">
          ideate<span className="text-amber-500">X</span>
        </p>
        <p className="text-slate-400 text-sm text-center mb-8">
          Log in to your cohort
        </p>

        <Card className="bg-slate-900 border-slate-800">
          <form onSubmit={handleStandardSubmit} className="space-y-3">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
            />
          </form>

          <div className="mt-5 space-y-2">
            <button
              onClick={() => handleDemoLogin('student')}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Continue as Student
            </button>
            <button
              onClick={() => handleDemoLogin('facilitator')}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              Continue as Facilitator
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              Continue as Admin
            </button>
          </div>
        </Card>
        <p className="text-slate-500 text-xs text-center mt-4">
          Demo login — each account has exactly one role. There's no switcher once you're in.
        </p>
      </div>
    </div>
  );
};
