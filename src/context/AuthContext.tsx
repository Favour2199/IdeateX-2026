import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, Role } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signInAsDemoRole: (role: Role) => void;
  signOut: () => Promise<void>;
}

const DEMO_PROFILES: Record<Role, Profile> = {
  student: {
    id: 'demo-student-id',
    full_name: 'David Adeleke',
    email: 'david.a@example.com',
    role: 'student',
    cohort: 'Cohort 5',
    active: true,
  },
  facilitator: {
    id: 'demo-facilitator-id',
    full_name: 'Rashidat Raheem',
    email: 'rashidat@example.com',
    role: 'facilitator',
    cohort: 'Cohort 5',
    active: true,
  },
  admin: {
    id: 'demo-admin-id',
    full_name: 'Raphael S.',
    email: 'admin@example.com',
    role: 'admin',
    cohort: 'All Cohorts',
    active: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('Profile fetch error, using default fallback profile:', error);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.warn('Failed to query profiles table:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          if (isMounted && userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.warn('Supabase auth getSession check:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        if (isMounted) {
          setProfile(userProfile || DEMO_PROFILES.student);
        }
      } else {
        // If not authenticated via Supabase session and no demo profile is active
        if (isMounted && !profile) {
          setUser(null);
          setProfile(null);
        }
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'password123',
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile || DEMO_PROFILES.student);
      }
    } catch (err) {
      console.warn('Supabase sign-in failed, checking demo email matching:', err);
      // Fallback demo matching by email
      const matchedRole = (['student', 'facilitator', 'admin'] as Role[]).find(
        (r) => DEMO_PROFILES[r].email.toLowerCase() === email.toLowerCase()
      );
      signInAsDemoRole(matchedRole || 'student');
    } finally {
      setLoading(false);
    }
  };

  const signInAsDemoRole = (chosenRole: Role) => {
    const demoProfile = DEMO_PROFILES[chosenRole];
    const mockUser: User = {
      id: demoProfile.id,
      app_metadata: {},
      user_metadata: { full_name: demoProfile.full_name, role: demoProfile.role },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: demoProfile.email,
    };
    setUser(mockUser);
    setProfile(demoProfile);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut notice:', err);
    } finally {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signInAsDemoRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
