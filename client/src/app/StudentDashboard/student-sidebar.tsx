"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const features = [
  { name: "Home", path: "/StudentDashboard" },
  { name: "Classes", path: "/StudentDashboard/classes" },
  { name: "Attendance", path: "/StudentDashboard/attendance" },
  { name: "Results", path: "/StudentDashboard/results" },
  { name: "Events", path: "/StudentDashboard/events" },
  { name: "Logout", path: "/logout" },
];

const StudentSidebar = () => {
  const sidebarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
      <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-200 text-transparent bg-clip-text mb-6">Student Dashboard</h2>
      <ul className="space-y-4">
        {features.map((feature, idx) => {
          const isActive = pathname === feature.path || (feature.path !== "/StudentDashboard" && pathname.startsWith(feature.path));
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
    </motion.aside>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded-full shadow-lg focus:outline-none"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
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

export default StudentSidebar;
