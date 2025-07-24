import React from "react";
import { SchoolProvider } from "./school-context";

export default function SchoolDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SchoolProvider>
      {children}
    </SchoolProvider>
  );
} 