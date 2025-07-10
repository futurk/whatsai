import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

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

const AUTH_STORAGE_KEY = '@auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    
    console.log('AuthContext navigation check:', {
      segments,
      inAuthGroup,
      user: user ? 'exists' : 'null',
      isLoading
    });
    
    if (isLoading) return;

    if (!user && inAuthGroup) {
      // User is not signed in and trying to access protected routes
      console.log('Redirecting to / - no user in auth group');
      router.replace('/');
    } else if (user && !inAuthGroup && segments[0] !== 'welcome' && segments[0] !== 'auth' && segments[0] !== 'index') {
      // User is signed in and trying to access auth routes (but not welcome/auth/index)
      console.log('Redirecting to /(tabs) - user exists outside auth group');
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name: 'User Name',
      isGuest: false,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name,
      isGuest: false,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
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
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
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