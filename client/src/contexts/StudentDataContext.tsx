"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface StudentData {
  _id: string;
  name: string;
  email: string;
  class: string;
  sec: string;
  address: string;
  pictures?: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  createdAt: string;
  updatedAt: string;
  schoolId: string;
}

interface StudentDataContextType {
  studentData: StudentData | null;
  loading: boolean;
  error: string | null;
}

const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

export const useStudentData = () => {
  const context = useContext(StudentDataContext);
  if (context === undefined) {
    throw new Error('useStudentData must be used within a StudentDataProvider');
  }
  return context;
};

interface StudentDataProviderProps {
  children: ReactNode;
  studentData: StudentData | null;
  loading: boolean;
  error: string | null;
}

export const StudentDataProvider: React.FC<StudentDataProviderProps> = ({ children, studentData, loading, error }) => {
  return (
    <StudentDataContext.Provider value={{ studentData, loading, error }}>
      {children}
    </StudentDataContext.Provider>
  );
};