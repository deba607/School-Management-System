'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Header2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add more theme logic here
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChanged'));
  };

  // Initialize theme on component mount
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Default to dark mode
      setIsDarkMode(true);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Smooth scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-700">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EduManage</h1>
            <p className="text-xs text-slate-300">School Management System</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          <button
            onClick={() => scrollToSection('features-section')}
            className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-400"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing-section')}
            className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-400"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('contact-section')}
            className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-400"
          >
            Contact Us
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-lg border border-purple-500/30 bg-black/40 pl-10 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 rounded-lg border border-purple-500/30 bg-black/40 p-0 text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-200"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 rounded-lg border border-purple-500/30 bg-black/40 p-0 text-slate-300 hover:bg-purple-500/10 hover:text-purple-400"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></span>
          </Button>

          {/* Quick Actions */}
          <Button
            className="rounded-lg border border-purple-500/30 bg-gradient-to-b from-purple-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40"
            onClick={() => router.push("/Login")}
          >
            Login
          </Button>
                  </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="rounded-lg border border-purple-500/30 bg-black/40 p-2 text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-purple-500/20 bg-black/95 backdrop-blur-md md:hidden">
          <div className="px-4 py-6">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-10 w-full rounded-lg border border-purple-500/30 bg-black/40 pl-10 pr-4 text-white placeholder-slate-400 backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-4">
              <button
                onClick={() => scrollToSection('features-section')}
                className="flex w-full items-center space-x-3 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-white transition-colors hover:bg-purple-500/20"
              >
                <BookOpen className="h-5 w-5 text-purple-400" />
                <span>Features</span>
              </button>
              <button
                onClick={() => scrollToSection('pricing-section')}
                className="flex w-full items-center space-x-3 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-white transition-colors hover:bg-purple-500/20"
              >
                <Settings className="h-5 w-5 text-purple-400" />
                <span>Pricing</span>
              </button>
              <button
                onClick={() => scrollToSection('contact-section')}
                className="flex w-full items-center space-x-3 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-white transition-colors hover:bg-purple-500/20"
              >
                <User className="h-5 w-5 text-purple-400" />
                <span>Contact Us</span>
              </button>
            </nav>

            {/* Mobile Actions */}
            <div className="mt-6 space-y-3">
              {/* Mobile Theme Toggle */}
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="w-full rounded-lg border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Switch to Dark Mode
                  </>
                )}
              </Button>
              
              <Button
                className="w-full rounded-lg border border-purple-500/30 bg-gradient-to-b from-purple-600 to-blue-700 px-4 py-3 text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40"
                onClick={() => { setIsMenuOpen(false); router.push("/Login"); }}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-lg border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              </div>
          </div>
        </div>
      )}
    </header>
  );
}