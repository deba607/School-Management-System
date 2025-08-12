'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, UserPlus, Users, Plus, Menu, X, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const navLinks = [
  { icon: Home, label: 'Dashboard', href: '/AdminDashboard' },
  { icon: Building2, label: 'Schools', href: '/AdminDashboard/schools' },
  { icon: Plus, label: 'Add School', href: '/AdminDashboard/add-school' },
  { icon: UserPlus, label: 'Add Admin', href: '/AdminDashboard/add-admin' },
  { icon: Users, label: 'Admins', href: '/AdminDashboard/admins' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('school_management_token');
    }
    setTimeout(() => {
      setLoggingOut(false);
      router.push("/Login");
    }, 500);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden md:flex flex-col w-56 lg:w-64 xl:w-72 bg-slate-800/90 border-r border-slate-700 py-8 px-4 gap-4 shadow-lg"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
              <p className="text-slate-400 text-xs">School Management</p>
            </div>
          </div>
        </motion.div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-slate-200 transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'hover:bg-purple-700/30 hover:text-white hover:scale-105'
                  }`}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + navLinks.length * 0.1, duration: 0.6 }}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 w-full text-slate-200 transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-500 font-semibold mt-4 ${loggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loggingOut}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {loggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </motion.div>
        </nav>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-auto pt-6 border-t border-slate-700"
        >
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-2">School Management System</p>
            <p className="text-slate-500 text-xs">v1.0.0</p>
          </div>
        </motion.div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700 z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                      <p className="text-slate-400 text-xs">School Management</p>
                    </div>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-6">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href;
                      return (
                        <motion.div
                          key={link.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                        >
                          <Link
                            href={link.href}
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 rounded-xl px-4 py-4 text-slate-200 transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                : 'hover:bg-purple-700/30 hover:text-white'
                            }`}
                          >
                            <link.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium text-base">{link.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + navLinks.length * 0.1, duration: 0.6 }}
                  >
                    <button
                      onClick={() => { handleLogout(); closeMobileMenu(); }}
                      className={`flex items-center gap-3 rounded-xl px-4 py-4 w-full text-slate-200 transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-500 font-semibold mt-4 ${loggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={loggingOut}
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      {loggingOut ? 'Logging out...' : 'Log Out'}
                    </button>
                  </motion.div>
                </nav>

                {/* Mobile Footer */}
                <div className="p-6 border-t border-slate-700">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-2">School Management System</p>
                    <p className="text-slate-500 text-xs">v1.0.0</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
