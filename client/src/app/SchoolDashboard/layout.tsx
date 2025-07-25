'use client';

import React from "react";
import { SchoolProvider } from "./school-context";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SchoolDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AuthProvider>
      <SchoolProvider>
        <ProtectedRoute requiredRole={["School", "Teacher"]}>
          {children}
        </ProtectedRoute>
      </SchoolProvider>
    </AuthProvider>
  );
}