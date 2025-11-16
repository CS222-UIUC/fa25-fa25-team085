import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // TODO: Fetch user profile from database
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.email?.split('@')[0] || 'User',
          created_at: session.user.created_at || new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // TODO: Fetch user profile from database
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        username: session.user.email?.split('@')[0] || 'User',
        created_at: session.user.created_at || new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp(email, password);
    if (!error && data.user) {
      // TODO: Create user profile in database with username
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        username,
        created_at: data.user.created_at || new Date().toISOString(),
      });
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword(email, password);
    if (!error && data.user) {
      // TODO: Fetch user profile from database
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.email?.split('@')[0] || 'User',
        created_at: data.user.created_at || new Date().toISOString(),
      });
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

