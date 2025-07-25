'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface School {
  _id: string;
  schoolId: string;
  name?: string;
  email?: string;
  pictures?: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  // Add other fields as needed
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
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) throw new Error('No token');
        const decoded: any = jwtDecode(token);
        let userId = decoded.userId;
        let role = decoded.role;
        if (!userId || role !== 'School') throw new Error('Not a school user');
        // Fetch school info from API
        const res = await fetch(`/api/schools/${userId}`);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setSchool(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch school');
        }
      } catch (err: any) {
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
      schoolId: school?.schoolId || null,
      loading,
      error,
    }}>
      {children}
    </SchoolContext.Provider>
  );
}; 