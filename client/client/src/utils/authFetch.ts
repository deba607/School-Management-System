// Extend Window type for authFetch
declare global {
  interface Window {
    authFetch: (url: RequestInfo | URL, options?: RequestInit) => Promise<Response>;
  }
}

// AuthFetch utility function with better error handling and header management
export const authFetch = async (url: RequestInfo | URL, options: RequestInit = {}): Promise<Response> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('school_management_token') : null;
    
    // Create minimal headers to avoid 431 error
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge with any existing headers from options
    const finalHeaders = {
      ...headers,
      ...(options.headers || {})
    };
    
    const response = await fetch(url, { 
      ...options, 
      headers: finalHeaders,
      credentials: 'include' // Include credentials for cross-origin requests
    });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Clear invalid token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('school_management_token');
        window.location.href = '/Login';
      }
      throw new Error('Session expired. Please log in again.');
    }
    
    return response;
  } catch (error) {
    console.error('Error in authFetch:', error);
    throw error;
  }
};

// Initialize window.authFetch if in browser environment
export const initializeAuthFetch = () => {
  if (typeof window !== 'undefined') {
    window.authFetch = authFetch;
  }
}; 