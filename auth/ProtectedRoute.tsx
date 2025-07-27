'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/Login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
    
    // If not loading, authenticated, but role doesn't match, redirect to unauthorized
    if (!loading && isAuthenticated && requiredRole) {
      const userRole = user?.role?.toLowerCase();
      const requiredRoles = Array.isArray(requiredRole) 
        ? requiredRole.map(r => r.toLowerCase())
        : [requiredRole.toLowerCase()];
      
      if (userRole && !requiredRoles.includes(userRole)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, requiredRole, user, router, redirectTo]);

  // Show loading indicator while checking auth state
  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // If role is required but doesn't match, don't render children
  if (requiredRole) {
    const userRole = user?.role?.toLowerCase();
    const requiredRoles = Array.isArray(requiredRole) 
      ? requiredRole.map(r => r.toLowerCase())
      : [requiredRole.toLowerCase()];
    
    if (userRole && !requiredRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
