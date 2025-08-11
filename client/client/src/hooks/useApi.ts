import { useState, useCallback } from 'react';
import { getToken } from '@/utils/auth';

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  request: (endpoint: string, options?: RequestInit) => Promise<T>;
  clearError: () => void;
}

export function useApi<T = any>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const headers = new Headers(options.headers || {});
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      if (!headers.has('Content-Type') && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Something went wrong');
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { data, loading, error, request, clearError };
}

export function useAuthenticatedApi<T = any>(): Omit<ApiResponse<T>, 'request'> & {
  get: (endpoint: string, options?: RequestInit) => Promise<T>;
  post: (endpoint: string, body?: any, options?: RequestInit) => Promise<T>;
  put: (endpoint: string, body?: any, options?: RequestInit) => Promise<T>;
  del: (endpoint: string, options?: RequestInit) => Promise<T>;
} {
  const { request, ...rest } = useApi<T>();

  const get = useCallback((endpoint: string, options: RequestInit = {}) => {
    return request(endpoint, { ...options, method: 'GET' });
  }, [request]);

  const post = useCallback((endpoint: string, body?: any, options: RequestInit = {}) => {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }, [request]);

  const put = useCallback((endpoint: string, body?: any, options: RequestInit = {}) => {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }, [request]);

  const del = useCallback((endpoint: string, options: RequestInit = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' });
  }, [request]);

  return { ...rest, get, post, put, del };
}
