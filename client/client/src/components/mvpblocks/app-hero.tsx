'use client';

import { useEffect, useState } from 'react';
import { easeInOut, motion, spring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ArrowUpRight,
  School,
  Award,
  Clock,
} from 'lucide-react';

export default function AppHero() {
  // State for animated counters
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
  });

  // State for particle positions and animations
  const [particles, setParticles] = useState<Array<{
    id: number;
    top: number;
    left: number;
    duration: number;
    delay: number;
  }>>([]);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Generate particle positions on client side only
  useEffect(() => {
    const particleData = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(particleData);
  }, []);

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

  // Animation to count up numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newStudents = prev.students >= 2500 ? 2500 : prev.students + 50;
        const newTeachers = prev.teachers >= 150 ? 150 : prev.teachers + 3;
        const newCourses = prev.courses >= 120 ? 120 : prev.courses + 2;

        if (
          newStudents === 2500 &&
          newTeachers === 150 &&
          newCourses === 120
        ) {
          clearInterval(interval);
        }

        return {
          students: newStudents,
          teachers: newTeachers,
          courses: newCourses,
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: spring, stiffness: 100 },
    },
  };

  // Floating animation for the school building
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: easeInOut,
    },
  };

  // Rotation animation for the graduation cap
  const rotateAnimation = {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  // Glowing effect animation
  const glowAnimation = {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easeInOut,
    },
  };

  // Tooltip animation
  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: spring,
        stiffness: 100,
        delay: 1.2,
      },
    },
  };

  // Badge pulse animation
  const badgePulse = {
    scale: [1, 1.05, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Theme-based styles
  const getSectionClass = () => {
    return isDarkMode 
      ? "relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-black py-16 text-white sm:px-6 lg:px-8 lg:py-2"
      : "relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-slate-50 py-16 text-gray-900 sm:px-6 lg:px-8 lg:py-2";
  };

  const getBackgroundClass = () => {
    return isDarkMode 
      ? "absolute inset-0 z-0 h-full w-full items-center px-5 py-24 opacity-80 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
      : "absolute inset-0 z-0 h-full w-full items-center px-5 py-24 opacity-80 [background:radial-gradient(125%_125%_at_50%_10%,#f8fafc_40%,#e0e7ff_100%)]";
  };

  const getTitleClass = () => {
    return isDarkMode 
      ? "mb-6 bg-gradient-to-r from-white/70 via-white to-slate-500/80 bg-clip-text text-3xl leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl"
      : "mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-3xl leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl";
  };

  const getHighlightClass = () => {
    return isDarkMode 
      ? "bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
      : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent";
  };

  const getStatsClass = () => {
    return isDarkMode 
      ? "text-2xl font-bold text-purple-400"
      : "text-2xl font-bold text-purple-600";
  };

  const getStatsTextClass = () => {
    return isDarkMode 
      ? "text-xs text-slate-300"
      : "text-xs text-gray-600";
  };

  const getBadgeClass = () => {
    return isDarkMode 
      ? "mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
      : "mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-600";
  };

  const getFeatureBadgeClass = (color: string) => {
    const baseClass = "flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm transition-all";
    const borderClass = isDarkMode ? "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20" : "border-purple-500/30 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20";
    
    if (color === 'blue') {
      return `${baseClass} ${isDarkMode ? "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20" : "border-blue-500/30 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"}`;
    } else if (color === 'orange') {
      return `${baseClass} ${isDarkMode ? "border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20" : "border-orange-500/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"}`;
    }
    
    return `${baseClass} ${borderClass}`;
  };

  const getDescriptionClass = () => {
    return isDarkMode 
      ? "mb-8 max-w-md px-6 text-center text-lg leading-relaxed text-slate-300/90 lg:text-end"
      : "mb-8 max-w-md px-6 text-center text-lg leading-relaxed text-gray-600/90 lg:text-end";
  };

  const getSocialProofClass = () => {
    return isDarkMode 
      ? "mx-auto flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 backdrop-blur-sm lg:mx-0 lg:ml-auto"
      : "mx-auto flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 backdrop-blur-sm lg:mx-0 lg:ml-auto";
  };

  const getSocialTextClass = () => {
    return isDarkMode 
      ? "text-xs text-slate-300"
      : "text-xs text-gray-600";
  };

  return (
    <section className={getSectionClass()}>
      <div className={getBackgroundClass()}></div>
      <svg
        id="noice"
        className="absolute inset-0 z-10 h-full w-full opacity-30"
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.34"
            numOctaves="4"
            stitchTiles="stitch"
          ></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.46"></feFuncR>
            <feFuncG type="linear" slope="0.46"></feFuncG>
            <feFuncB type="linear" slope="0.47"></feFuncB>
            <feFuncA type="linear" slope="0.37"></feFuncA>
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.47" intercept="-0.23" />
            <feFuncG type="linear" slope="1.47" intercept="-0.23" />
            <feFuncB type="linear" slope="1.47" intercept="-0.23" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)"></rect>
      </svg>
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-black/70 to-gray-950 blur-3xl"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Enhanced glow spots */}
        <div className="absolute -left-20 top-20 h-60 w-60 rounded-full bg-purple-600/20 blur-[100px]"></div>
        <div className="absolute -right-20 bottom-20 h-60 w-60 rounded-full bg-blue-600/20 blur-[100px]"></div>
        <motion.div
          animate={glowAnimation}
          className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-indigo-500/10 blur-[80px]"
        ></motion.div>
        <motion.div
          animate={glowAnimation}
          className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-purple-500/10 blur-[80px]"
        ></motion.div>

        {/* Particle effects - subtle dots */}
        <div className="absolute inset-0 opacity-20">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-1 w-1 rounded-full bg-purple-400"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>

      <div className="fadein-blur relative z-0 mx-auto mb-10 h-[300px] w-[300px] lg:absolute lg:right-1/2 lg:top-1/2 lg:mx-0 lg:mb-0 lg:h-[500px] lg:w-[500px] lg:-translate-y-2/3 lg:translate-x-1/2">
        <motion.div
          animate={floatingAnimation}
          className="h-full w-full"
        >
          <School className="h-full w-full text-purple-400 opacity-80" />
        </motion.div>
        <motion.div
          variants={tooltipVariants}
          className="absolute -left-4 top-4 rounded-lg border border-purple-500/30 bg-black/80 p-2 backdrop-blur-md lg:-left-20 lg:top-1/4"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-200">
              Student Management
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={tooltipVariants}
          className="absolute -right-4 top-1/2 rounded-lg border border-blue-500/30 bg-black/80 p-2 backdrop-blur-md lg:-right-24"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-200">
              Course Management
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={tooltipVariants}
          className="absolute bottom-4 left-4 rounded-lg border border-purple-500/30 bg-black/80 p-2 backdrop-blur-md lg:bottom-1/4 lg:left-8"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-200">
              Attendance Tracking
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mb-10 flex w-full max-w-[1450px] flex-grow flex-col items-center justify-center px-4 text-center sm:px-8 lg:mb-0 lg:items-start lg:justify-end lg:text-left"
      >
        <motion.div className="flex w-full flex-col items-center justify-between lg:flex-row lg:items-start">
          <div className="w-full lg:w-auto">
            <motion.div
              variants={itemVariants}
              className={getBadgeClass()}
            >
              <span className="mr-2 rounded-full bg-purple-500 px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              Introducing School Management System
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className={getTitleClass()}
            >
              Streamline Your <br className="hidden sm:inline" />
              <span className={getHighlightClass()}>
                School Operations
              </span>
            </motion.h1>

            {/* Animated Stats Row */}
            <motion.div
              variants={itemVariants}
              className="mb-6 flex flex-wrap justify-center gap-4 md:gap-6 lg:justify-start"
            >
              <div className="rounded-lg border border-purple-500/20 bg-black/40 px-4 py-2 backdrop-blur-sm shadow-sm">
                <p className={getStatsClass()}>
                  {stats.students.toLocaleString()}+
                </p>
                <p className={getStatsTextClass()}>Active Students</p>
              </div>
              <div className="rounded-lg border border-blue-500/20 bg-black/40 px-4 py-2 backdrop-blur-sm shadow-sm">
                <p className="text-2xl font-bold text-blue-400">
                  {stats.teachers.toLocaleString()}+
                </p>
                <p className={getStatsTextClass()}>Qualified Teachers</p>
              </div>
              <div className="rounded-lg border border-purple-500/20 bg-black/40 px-4 py-2 backdrop-blur-sm shadow-sm">
                <p className={getStatsClass()}>
                  {stats.courses}+
                </p>
                <p className={getStatsTextClass()}>Available Courses</p>
              </div>
            </motion.div>

            {/* Feature badges - integrated with content */}
            <motion.div
              variants={itemVariants}
              className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <span className="text-xs font-medium text-slate-300">
                Key Features:
              </span>
              <div className={getFeatureBadgeClass('purple')}>
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                Student Portal
              </div>
              <div className={getFeatureBadgeClass('blue')}>
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                Teacher Dashboard
              </div>
              <div className={getFeatureBadgeClass('purple')}>
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                Attendance System
              </div>
              <div className={getFeatureBadgeClass('orange')}>
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                +8 more
              </div>
            </motion.div>
          </div>

          <div className="mt-6 flex flex-col items-center lg:mt-0 lg:items-end">
            <motion.p
              variants={itemVariants}
              className={getDescriptionClass()}
            >
              Comprehensive school management solution that simplifies administrative tasks, 
              enhances communication, and improves educational outcomes. Manage students, 
              teachers, courses, and more with ease.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mb-8 flex flex-col flex-wrap gap-4 sm:flex-row lg:justify-end"
            >
              <Button
                className="group rounded-full border-t border-purple-400 bg-gradient-to-b from-purple-600 to-blue-700 px-6 py-6 text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40"
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="rounded-full border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                size="lg"
              >
                View Demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className={getSocialProofClass()}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 overflow-hidden rounded-full border-2 border-purple-500/30 bg-gradient-to-br from-purple-500 to-blue-600"
                  >
                    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-80"></div>
                  </div>
                ))}
              </div>
              <span className={getSocialTextClass()}>
                <span className="font-semibold text-white">100+</span>{' '}
                schools already using our system
              </span>
              <ArrowUpRight className="h-3 w-3 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
    </section>
  );
}
