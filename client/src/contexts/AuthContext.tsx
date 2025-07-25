'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken, setToken, getCurrentUser } from '@/utils/auth';

interface User {
  userId: string;
  role: string;
  schoolId?: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
            userId: userData.userId,
            role: userData.role,
            schoolId: userData.schoolId
          });
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string) => {
    setToken(token);
    const userData = getCurrentUser();
    if (userData) {
      setUser({
        userId: userData.userId,
        role: userData.role,
        schoolId: userData.schoolId
      });
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/Login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
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
