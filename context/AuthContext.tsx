import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inAuthScreens = segments[0] === 'auth' || segments[0] === 'welcome';
    
    console.log('Navigation check:', {
      user: user ? { id: user.id, isGuest: user.isGuest } : null,
      segments,
      inTabsGroup,
      inAuthScreens,
      isLoading
    });

    if (!user && inTabsGroup) {
      // User is not signed in and trying to access protected routes
      console.log('Redirecting to welcome - no user');
      router.replace('/welcome');
    } else if (user && inAuthScreens) {
      // User is signed in (including guests) but still on auth screens
      console.log('Redirecting to tabs - user exists, leaving auth screens');
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Check if user exists in our users table
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      let userData: User;

      if (existingUser) {
        userData = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          isGuest: existingUser.is_guest,
        };
      } else {
        // Create user profile if it doesn't exist
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || 'User',
            is_guest: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        userData = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isGuest: newUser.is_guest,
        };
      }

      setUser(userData);
      console.log('User profile loaded:', userData);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // User profile will be loaded via the auth state change listener
    console.log('User signed in:', data.user?.id);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // User profile will be created via the auth state change listener
    console.log('User signed up:', data.user?.id);
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      email: 'guest@example.com',
      name: 'Guest User',
      isGuest: true,
    };

    // Don't store guest user in AsyncStorage - they should see welcome screen again
    setUser(guestUser);
    console.log('User continuing as guest:', guestUser);
    
    // Force navigation to tabs
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 100);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setUser(null);
    console.log('User signed out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
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