'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken, setToken, getCurrentUser } from '@/utils/auth';

import { DecodedToken } from '@/utils/auth';

interface User extends DecodedToken {
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ 
    isAuthenticated: false, 
    loading: true 
  } as User);
  
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = getToken();
      if (token) {
        const userData = getCurrentUser();
        if (userData) {
          setUser({
            ...userData,
            isAuthenticated: true,
            loading: false
          });
          return;
        }
      }
      // If we get here, either no token or invalid user
      setUser(prev => ({
        ...prev,
        isAuthenticated: false,
        loading: false
      }));
    } catch (error) {
      console.error('Error initializing auth:', error);
      removeToken();
      setUser(prev => ({
        ...prev,
        isAuthenticated: false,
        loading: false
      }));
    }
  };

  const login = (token: string) => {
    setToken(token);
    const userData = getCurrentUser();
    if (userData) {
      setUser({
        ...userData,
        isAuthenticated: true,
        loading: false
      });
    }
  };

  const logout = () => {
    removeToken();
    setUser({
      isAuthenticated: false,
      loading: false
    } as User);
    router.push('/Login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user.isAuthenticated,
        loading: user.loading,
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
