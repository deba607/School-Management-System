'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface School {
  _id: string;
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  description?: string;
  pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SchoolContextType {
  school: School | null;
  schoolId: string | null;
  loading: boolean;
  error: string | null;
}

const SchoolContext = createContext<SchoolContextType>({
  school: null,
  schoolId: null,
  loading: true,
  error: null,
});

export const useSchool = () => useContext(SchoolContext);

interface SchoolProviderProps {
  children: ReactNode;
}

export const SchoolProvider = ({ children }: SchoolProviderProps) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchool() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('school_management_token') : null;
        if (!token) {
          console.error('No token found in localStorage');
          throw new Error('No token');
        }
        
        const decoded: any = jwtDecode(token);
        console.log('Decoded token:', { ...decoded, token: '***' }); // Log decoded token without the actual token
        
        let userId = decoded.userId;
        let role = decoded.role;
        if (!userId || role !== 'school') {
          console.error('Invalid user role or ID', { role, userId: userId ? '***' : 'missing' });
          throw new Error('Not a school user');
        }
        
        // Fetch school info from API
        const res = await fetch(`/api/schools/${userId}`);
        const data = await res.json();
        console.log('School data response:', { status: res.status, success: data.success });
        
        if (res.ok && data.success && data.data) {
          console.log('School data loaded successfully with ID:', data.data.schoolId || data.data._id);
          setSchool(data.data);
        } else {
          console.error('Failed to fetch school data:', data.error);
          throw new Error(data.error || 'Failed to fetch school');
        }
      } catch (err: any) {
        console.error('Error in fetchSchool:', err);
        setError(err.message || 'Failed to fetch school');
        setSchool(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, []);

  return (
    <SchoolContext.Provider value={{
      school,
      schoolId: school?._id || school?.schoolId || null, // Use _id as fallback
      loading,
      error,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};