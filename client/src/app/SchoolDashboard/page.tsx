"use client";
// Extend Window type for authFetch
declare global {
  interface Window {
    authFetch: (url: RequestInfo | URL, options?: RequestInit) => Promise<Response>;
  }
}


import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Home from "./home";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const SchoolDashboardPage = () => {
  const router = useRouter();
  // Auth check and helper for authenticated fetch
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/Login');
      return;
    }
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      localStorage.removeItem('token');
      router.push('/Login');
      return;
    }
    if (!decoded || (decoded as any).role !== 'School') {
      localStorage.removeItem('token');
      router.push('/Login');
      return;
    }
  }, [router]);

  // Helper for authenticated fetch
  React.useEffect(() => {
    window.authFetch = async (url: RequestInfo | URL, options: RequestInit = {}) => {
      const token = localStorage.getItem('token');
      const headers = {
        ...(options.headers ?? {}),
        Authorization: token ? `Bearer ${token}` : ""
      };
      return fetch(url, { ...options, headers });
    };
  }, []);
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
