'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Database,
  Settings,
  Award,
} from 'lucide-react';

export default function FeaturesSection() {
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

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student profiles, enrollment tracking, and academic records management.',
    },
    {
      icon: BookOpen,
      title: 'Course Management',
      description: 'Create and manage courses, assignments, and curriculum with ease.',
    },
    {
      icon: Calendar,
      title: 'Attendance Tracking',
      description: 'Automated attendance monitoring with real-time reporting and analytics.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Advanced analytics and reporting for student and teacher performance.',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Integrated messaging system for teachers, students, and parents.',
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Enterprise-grade security with encrypted data and secure access controls.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant notifications and live updates across all school activities.',
    },
    {
      icon: Globe,
      title: 'Multi-campus Support',
      description: 'Manage multiple campuses and locations from a single platform.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Access',
      description: 'Full mobile support with responsive design for all devices.',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Comprehensive data backup, recovery, and management systems.',
    },
    {
      icon: Settings,
      title: 'Customizable Workflows',
      description: 'Flexible workflows that adapt to your school\'s unique processes.',
    },
    {
      icon: Award,
      title: 'Achievement Tracking',
      description: 'Track student achievements, awards, and extracurricular activities.',
    },
  ];

  // Theme-based styles
  const getSectionClass = () => {
    return isDarkMode 
      ? "py-24 bg-black"
      : "py-24 bg-slate-50";
  };

  const getContainerClass = () => {
    return isDarkMode 
      ? "mx-auto max-w-7xl px-6 lg:px-8"
      : "mx-auto max-w-7xl px-6 lg:px-8";
  };

  const getTitleClass = () => {
    return isDarkMode 
      ? "text-center text-4xl font-bold tracking-tight text-white sm:text-6xl"
      : "text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl";
  };

  const getSubtitleClass = () => {
    return isDarkMode 
      ? "mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-300"
      : "mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600";
  };

  const getCardClass = () => {
    return isDarkMode 
      ? "feature-card group relative rounded-2xl border border-purple-500/20 bg-black/40 p-8 backdrop-blur-sm transition-all hover:border-purple-500/40 hover:bg-purple-500/10"
      : "feature-card group relative rounded-2xl border border-purple-500/20 bg-white/80 p-8 backdrop-blur-sm transition-all hover:border-purple-500/40 hover:bg-purple-500/10 shadow-lg";
  };

  const getIconClass = () => {
    return isDarkMode 
      ? "h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors"
      : "h-8 w-8 text-purple-600 group-hover:text-purple-500 transition-colors";
  };

  const getTitleTextClass = () => {
    return isDarkMode 
      ? "mt-6 text-lg font-semibold leading-7 text-white"
      : "mt-6 text-lg font-semibold leading-7 text-gray-900";
  };

  const getDescriptionClass = () => {
    return isDarkMode 
      ? "mt-4 text-base leading-7 text-slate-300"
      : "mt-4 text-base leading-7 text-gray-600";
  };

  return (
    <section className={getSectionClass()}>
      <div className={getContainerClass()}>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={getTitleClass()}
          >
            Powerful Features for Modern Schools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSubtitleClass()}
          >
            Everything you need to manage your school efficiently. From student tracking to advanced analytics, 
            our platform provides comprehensive tools for educational excellence.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={getCardClass()}
              >
                <dt className="flex items-center gap-x-3">
                  <feature.icon className={getIconClass()} />
                  <span className={getTitleTextClass()}>{feature.title}</span>
                </dt>
                <dd className={getDescriptionClass()}>
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
} 