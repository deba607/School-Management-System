"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSchool } from "./school-context";

const features = [
  { name: "Overview", path: "/SchoolDashboard" },
  { name: "Teachers", path: "/SchoolDashboard/teachers" },
  { name: "Students", path: "/SchoolDashboard/students" },
  { name: "Classes", path: "/SchoolDashboard/classes" },
  { name: "Attendance", path: "/SchoolDashboard/attendance" },
  { name: "Results", path: "/SchoolDashboard/results" },
  { name: "Events", path: "/SchoolDashboard/events" },
  { name: "Logout", path: "/logout" },
];

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const { school, schoolId, loading, error } = useSchool();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      // Optionally handle error, but still proceed with logout
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setTimeout(() => {
      setLoggingOut(false);
      router.push("/Login");
    }, 500);
  };

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { boxShadow: "0 0 0px #0000" },
        {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          duration: 1.2,
          ease: "power2.out",
        }
      );
    }
  }, [open]);

  // Sidebar content
  const sidebarContent = (
    <motion.aside
      ref={sidebarRef}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="fixed md:static top-0 left-0 z-40 w-64 h-full bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 text-white flex flex-col p-6 shadow-2xl rounded-r-3xl md:rounded-none md:shadow-none"
      aria-label="Sidebar"
    >
      <div className="flex flex-col gap-4 mb-10 md:mb-8">
        <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-200 text-transparent bg-clip-text">School Dashboard</h2>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
          className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 rounded-lg shadow-md transition-colors duration-200"
          style={{ boxShadow: "0 2px 8px rgba(34,197,94,0.15)" }}
          onClick={() => { router.push("/SchoolDashboard/students/add"); setOpen(false); }}
        >
          + Add Student
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-lg shadow-md transition-colors duration-200"
          style={{ boxShadow: "0 2px 8px rgba(59,130,246,0.15)" }}
          onClick={() => { router.push("/SchoolDashboard/teachers/add"); setOpen(false); }}
        >
          + Add Teacher
        </motion.button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {features.map((feature, idx) => {
            // Highlight if current path starts with the feature path
            const isActive = pathname === feature.path || (feature.path !== "/SchoolDashboard" && pathname.startsWith(feature.path));
            if (feature.name === "Logout") {
              return (
                <motion.li
                  key={feature.name}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx, type: "spring", stiffness: 100 }}
                >
                  <button
                    onClick={handleLogout}
                    className={`block w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:shadow-lg bg-red-500 text-white font-bold ${loggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={loggingOut}
                  >
                    {loggingOut ? 'Logging out...' : feature.name}
                  </button>
                </motion.li>
              );
            }
            return (
              <motion.li
                key={feature.name}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx, type: "spring", stiffness: 100 }}
              >
                <Link
                  href={feature.path}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:shadow-lg ${
                    isActive ? "bg-white/20 text-cyan-200 font-bold shadow-lg ring-2 ring-cyan-300" : ""
                  }`}
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                >
                  {feature.name}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded-full shadow-lg focus:outline-none"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar for desktop and mobile */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar overlay"
            />
            {sidebarContent}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
