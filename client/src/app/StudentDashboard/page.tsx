"use client";

import React from "react";
import StudentSidebar from "./student-sidebar";
import StudentHeader from "./student-header";
import StudentHome from "./student-home";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { initializeAuthFetch } from "@/utils/authFetch";

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

const StudentDashboardPage = () => {
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuthFetch();
    const token = typeof window !== 'undefined' ? localStorage.getItem('school_management_token') : null;
    if (!token) {
      router.push('/Login');
      return;
    }
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      localStorage.removeItem('school_management_token');
      router.push('/Login');
      return;
    }
    if (!decoded || (decoded as any).role !== 'student') {
      localStorage.removeItem('school_management_token');
      router.push('/Login');
      return;
    }

    const fetchStudentData = async () => {
      try {
        const response = await window.authFetch('/api/student/me');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setStudentData(result.data);
          } else {
            setError(result.error || 'Failed to fetch student data');
          }
        } else if (response.status === 401) {
          localStorage.removeItem('school_management_token');
          router.push('/Login');
        } else {
          setError(`Failed to fetch student data: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching student data: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading student data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative"
    >
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        <StudentHeader studentData={studentData} />
        <main className="flex-1 overflow-y-auto">
          <StudentHome studentData={studentData} />
        </main>
      </div>
    </motion.div>
  );
};

export default StudentDashboardPage;
