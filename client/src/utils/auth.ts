// Authenticated fetch helper
export async function authFetch(url: RequestInfo | URL, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('school_management_token') : null;
  const headers = {
    ...(options.headers ?? {}),
    Authorization: token ? `Bearer ${token}` : ""
  };
  return fetch(url, { ...options, headers });
}
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userId: string;
  role: string;
  schoolId?: string;
  exp?: number;
  iat?: number;
  // Additional user details
  name?: string;
  email?: string;
  schoolName?: string;
  picture?: string;
}

// Token storage key
const TOKEN_KEY = 'school_management_token';

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Get token from storage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    removeToken();
    return null;
  }
  
  return token;
};

// Set token in storage
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from storage
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

// Get school ID from token
export const getSchoolIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.schoolId || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get current user from token
export function getCurrentUser(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Include all token fields in the return value
    return {
      ...decoded,
      userId: decoded.userId,
      role: decoded.role,
      schoolId: decoded.schoolId,
      name: (decoded as any).name || 'User',
      email: (decoded as any).email || '',
      schoolName: (decoded as any).schoolName || '',
      picture: (decoded as any).picture || undefined
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user has required role
export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === requiredRole;
};

// Check if user has any of the required roles
export const hasAnyRole = (requiredRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
};
