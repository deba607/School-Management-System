'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  userId: string;
  role: 'admin' | 'school' | 'teacher' | 'student';
  schoolId?: string;
  iat?: number;
  exp?: number;
}

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
  userRole: string | null;
}

const SchoolContext = createContext<SchoolContextType>({
  school: null,
  schoolId: null,
  loading: true,
  error: null,
  userRole: null,
});

export const useSchool = () => useContext(SchoolContext);

interface SchoolProviderProps {
  children: ReactNode;
}

export const SchoolProvider = ({ children }: SchoolProviderProps) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teacherSchoolId, setTeacherSchoolId] = useState<string | null>(null);

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
        
        const decoded: JWTPayload = jwtDecode(token);
        console.log('Decoded token:', { ...decoded, token: '***' }); // Log decoded token without the actual token

        const userId = decoded.userId;
        const role = decoded.role;
        const schoolId = decoded.schoolId;
        setUserRole(role);
        
        // If user is a teacher, we store the schoolId from the token
        if (role === 'teacher') {
          if (schoolId) {
            setTeacherSchoolId(schoolId);
          }
          setLoading(false);
          return;
        }
        
        // For school role, fetch school info
        if (!userId || role !== 'school') {
          console.error('Invalid user role or ID', { role, userId: userId ? '***' : 'missing' });
          throw new Error('Not a school user');
        }
        
        // Fetch school info from API
        const res = await fetch(`/api/schools/${userId}`);
        const data = await res.json();
        console.log('School data response:', { status: res.status, success: data.success });
        
        if (res.ok && data.success && data.data) {
          console.log('School data loaded successfully with ID:', data.data.schoolId);
          setSchool(data.data);
        } else {
          console.error('Failed to fetch school data:', data.error);
          throw new Error(data.error || 'Failed to fetch school');
        }
      } catch (err: unknown) {
        console.error('Error in fetchSchool:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch school';
        setError(errorMessage);
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
      schoolId: userRole === 'teacher' ? teacherSchoolId : (school?.schoolId || null), // Use schoolId field consistently
      loading,
      error,
      userRole,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};