"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSchool } from "./school-context";
import { useAuth } from "@/contexts/AuthContext";
// Toast notifications temporarily disabled - will be re-enabled after package installation
// import { toast } from "react-hot-toast";

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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { school, schoolId, loading, error } = useSchool();
  const { logout } = useAuth();
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      // This will handle token removal, state clearing, and redirection
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      console.error('Failed to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  }, [logout, router]);
  
  // Handle navigation with loading state
  const handleNavigation = useCallback((path: string) => {
    setIsNavigating(true);
    setOpen(false);
    router.push(path);
    // Reset navigating state after a short delay
    const timer = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timer);
  }, [router]);

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
      className="fixed md:static top-0 left-0 z-40 w-64 h-full bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 text-white flex flex-col p-6 shadow-2xl rounded-r-3xl md:rounded-none md:shadow-none overflow-y-auto"
      aria-label="Sidebar"
    >
      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-200 text-transparent bg-clip-text">
            {loading ? 'Loading...' : (school?.name || 'School Dashboard')}
          </h2>
          <button 
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-200 hover:text-white focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => handleNavigation("/SchoolDashboard/students/add")}
            disabled={isNavigating}
          >
            <span>+ Add Student</span>
            {isNavigating && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => handleNavigation("/SchoolDashboard/teachers/add")}
            disabled={isNavigating}
          >
            <span>+ Add Teacher</span>
            {isNavigating && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.button>
        </div>
      </div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-3">
          {features.map((feature, idx) => {
            // Skip rendering if still loading school data
            if (loading && feature.name !== 'Logout') return null;
            
            const isActive = pathname === feature.path || 
              (feature.path !== "/SchoolDashboard" && pathname.startsWith(feature.path));
            
            // Add icons for each menu item
            const getIcon = (name: string) => {
              switch(name) {
                case 'Overview': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                );
                case 'Teachers': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                );
                case 'Students': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                );
                case 'Classes': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                );
                case 'Attendance': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                );
                case 'Results': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                );
                case 'Events': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                );
                case 'Logout': return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                );
                default: return null;
              }
            };

            if (feature.name === "Logout") {
              return (
                <motion.li
                  key={feature.name}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx, type: "spring", stiffness: 100 }}
                  className="mt-6 pt-4 border-t border-blue-600"
                >
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg ${
                      loggingOut 
                        ? 'bg-red-600/80 text-white/80 cursor-not-allowed' 
                        : 'bg-red-600/90 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                    disabled={loggingOut}
                  >
                    {getIcon(feature.name)}
                    <span>{loggingOut ? 'Logging out...' : feature.name}</span>
                    {loggingOut && (
                      <svg className="animate-spin h-4 w-4 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
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
                  onClick={(e) => {
                    if (isNavigating) {
                      e.preventDefault();
                      return;
                    }
                    handleNavigation(feature.path);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg ${
                    isActive 
                      ? 'bg-white/20 text-cyan-200 font-semibold shadow-lg ring-2 ring-cyan-300/50' 
                      : 'text-gray-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getIcon(feature.name)}
                  <span>{feature.name}</span>
                  {isNavigating && isActive && (
                    <svg className="animate-spin h-4 w-4 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
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
        className={`md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-full shadow-lg focus:outline-none transition-all duration-200 ${
          open ? 'bg-red-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-800'
        }`}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {/* Sidebar for desktop */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 md:hidden bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-40 w-72 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
