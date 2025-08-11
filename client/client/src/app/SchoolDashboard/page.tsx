"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Home from "./home";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "@/utils/auth";

const SchoolDashboardPage = () => {
  const router = useRouter();
  // Auth check and helper for authenticated fetch
  useEffect(() => {
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
    if (!decoded || !['school', 'teacher'].includes((decoded as any).role)) {
      localStorage.removeItem('school_management_token');
      router.push('/Login');
      return;
    }
  }, [router]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative"
      >
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Home />
          </main>
        </div>
      </motion.div>
    </>
  );
};

export default SchoolDashboardPage;
