// Extend Window type for authFetch
declare global {
  interface Window {
    authFetch: (url: RequestInfo | URL, options?: RequestInit) => Promise<Response>;
  }
}

// AuthFetch utility function
export const authFetch = async (url: RequestInfo | URL, options: RequestInit = {}): Promise<Response> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('school_management_token') : null;
  const headers = {
    ...(options.headers ?? {}),
    Authorization: token ? `Bearer ${token}` : ""
  };
  return fetch(url, { ...options, headers });
};

// Initialize window.authFetch if in browser environment
export const initializeAuthFetch = () => {
  if (typeof window !== 'undefined') {
    window.authFetch = authFetch;
  }
}; 