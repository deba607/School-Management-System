'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useAnimation } from 'framer-motion';
import { Menu, X, ArrowRight, Zap, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// ... (keep the NavItem interface and navItems array the same)
interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' },
];

export default function Header2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolledDirection, setScrolledDirection] = useState<'up' | 'down'>('up');
  const controls = useAnimation();
  useScroll(); // Only for triggering scroll events, value not used
  const lastScrollY = useRef(0);

  // Handle scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setScrolledDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrolledDirection('up');
      }
      
      setIsScrolled(currentScrollY > 10);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate header on scroll direction change
  useEffect(() => {
    if (scrolledDirection === 'down' && isScrolled) {
      controls.start('hidden');
    } else {
      controls.start('visible');
    }
  }, [scrolledDirection, isScrolled, controls]);

  // Animation variants
  const containerVariants = {
    hidden: { 
      y: -100,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    },
    visible: { 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: 320, // Use a number instead of string for x
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: 0.2
      }
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonHover = {
    scale: 1.05,
    transition: { 
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  };

  const buttonTap = {
    scale: 0.98
  };

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
        variants={containerVariants}
        initial="visible"
        animate={controls}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              custom={0}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={buttonTap}
            >
              <Link href="/" className="flex items-center space-x-3">
                <motion.div 
                  className="relative"
                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-lg">
                    <motion.div
                      animate={{ 
                        rotate: [0, 0, 15, -15, 0],
                        scale: [1, 1.1, 1.1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Zap className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  ></motion.div>
                </motion.div>
                <motion.div 
                  className="flex flex-col"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="text-lg font-bold text-foreground">
                    Acme Inc.
                  </span>
                  <span className="-mt-1 text-xs text-muted-foreground">
                    Build faster
                  </span>
                </motion.div>
              </Link>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className="relative block rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
                  >
                    {item.name}
                    {hoveredItem === item.name && (
                      <motion.span
                        className="absolute bottom-1 left-0 right-0 -z-10 mx-auto h-0.5 bg-gradient-to-r from-rose-500 to-pink-500"
                        layoutId="nav-underline"
                        initial={false}
                        transition={{
                          type: 'spring',
                          bounce: 0.25,
                          duration: 0.5
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              custom={navItems.length + 1}
              variants={itemVariants}
            >
              <motion.button
                className="group relative rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Search className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                  3
                </span>
              </motion.button>

              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.3)',
                  transition: {
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 10
                  }
                }}
                whileTap={buttonTap}
              >
                <Link
                  href="/signup"
                  className="group inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <span>Get Started</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.button
              className="group relative rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-muted lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              custom={navItems.length + 2}
              variants={itemVariants}
              whileTap={buttonTap}
            >
              <div className="relative h-6 w-6">
                <motion.div
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: 180 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-screen w-80 overflow-y-auto bg-background shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex h-16 items-center justify-end px-6">
                <motion.button
                  className="rounded-full p-2 text-foreground hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              
              <div className="px-6 pb-8">
                <motion.div 
                  className="space-y-1"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
                    }
                  }}
                  initial="closed"
                  animate="open"
                >
                  {navItems.map((item) => (
                    <motion.div 
                      key={item.name}
                      variants={mobileItemVariants}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  className="mt-8 space-y-4 border-t border-border pt-6"
                  variants={mobileItemVariants}
                >
                  <Link
                    href="/login"
                    className="block w-full rounded-lg border border-border bg-transparent py-3 text-center font-medium text-foreground transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-center font-medium text-white shadow-lg transition-all hover:shadow-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}