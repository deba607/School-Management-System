'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer4col() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme management
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark' || savedTheme === null);
    };

    // Initial theme check
    handleThemeChange();

    // Listen for theme changes
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // Theme-based styles
  const getFooterClass = () => {
    return isDarkMode 
      ? "bg-black"
      : "bg-slate-50";
  };

  const getContainerClass = () => {
    return isDarkMode 
      ? "mx-auto max-w-7xl px-6 lg:px-8"
      : "mx-auto max-w-7xl px-6 lg:px-8";
  };

  const getTitleClass = () => {
    return isDarkMode 
      ? "text-sm font-semibold leading-6 text-white"
      : "text-sm font-semibold leading-6 text-gray-900";
  };

  const getLinkClass = () => {
    return isDarkMode 
      ? "text-sm leading-6 text-slate-300 hover:text-white"
      : "text-sm leading-6 text-gray-600 hover:text-gray-900";
  };

  const getDescriptionClass = () => {
    return isDarkMode 
      ? "text-sm leading-6 text-slate-300"
      : "text-sm leading-6 text-gray-600";
  };

  const getContactItemClass = () => {
    return isDarkMode 
      ? "flex items-center gap-x-3 text-slate-300"
      : "flex items-center gap-x-3 text-gray-600";
  };

  const getDividerClass = () => {
    return isDarkMode 
      ? "border-slate-700"
      : "border-gray-200";
  };

  const getCopyrightClass = () => {
    return isDarkMode 
      ? "text-xs leading-5 text-slate-400"
      : "text-xs leading-5 text-gray-500";
  };

  const navigation = {
    solutions: [
      { name: 'Student Management', href: '#' },
      { name: 'Teacher Dashboard', href: '#' },
      { name: 'Attendance Tracking', href: '#' },
      { name: 'Performance Analytics', href: '#' },
      { name: 'Communication Hub', href: '#' },
    ],
    support: [
      { name: 'Documentation', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Contact Support', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Licenses', href: '#' },
      { name: 'Settings', href: '#' },
    ],
  };

  return (
    <footer className={getFooterClass()}>
      <div className={getContainerClass()}>
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-700">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">EduManage</h3>
                <p className={getDescriptionClass()}>School Management System</p>
              </div>
            </div>
            <p className={getDescriptionClass()}>
              Comprehensive school management solution that simplifies administrative tasks, 
              enhances communication, and improves educational outcomes.
            </p>
            <div className="space-y-4">
              <div className={getContactItemClass()}>
                <Mail className="h-4 w-4 text-purple-400" />
                <span>contact@edumanage.com</span>
              </div>
              <div className={getContactItemClass()}>
                <Phone className="h-4 w-4 text-purple-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={getContactItemClass()}>
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>123 Education St, Learning City, LC 12345</span>
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={getTitleClass()}>Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={getLinkClass()}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className={getTitleClass()}>Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={getLinkClass()}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={getTitleClass()}>Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={getLinkClass()}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className={getTitleClass()}>Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={getLinkClass()}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-16 border-t ${getDividerClass()} pt-8 sm:mt-20 lg:mt-24`}>
          <p className={getCopyrightClass()}>
            &copy; 2024 EduManage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
