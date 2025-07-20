'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header2 from '@/components/mvpblocks/header-2';
import AppHero from '@/components/mvpblocks/app-hero';
import FeaturesSection from '@/components/mvpblocks/features-section';
import SimplePricing from '@/components/mvpblocks/simple-pricing';
import ContactUs1 from '@/components/mvpblocks/contact-us-1';
import Footer4col from '@/components/mvpblocks/footer-4col';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Type definitions
interface ParticleProps {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

interface AnimationRefs {
  container: React.RefObject<HTMLDivElement | null>;
  hero: React.RefObject<HTMLDivElement | null>;
  features: React.RefObject<HTMLDivElement | null>;
  pricing: React.RefObject<HTMLDivElement | null>;
  contact: React.RefObject<HTMLDivElement | null>;
  footer: React.RefObject<HTMLDivElement | null>;
}

const LandingPage: React.FC = () => {
  // State for particles to avoid hydration mismatch
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Refs for animation triggers
  const refs: AnimationRefs = {
    container: useRef<HTMLDivElement>(null),
    hero: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
    footer: useRef<HTMLDivElement>(null),
  };

  // Scroll progress and view detection
  const { scrollYProgress } = useScroll();
  const isHeroInView = useInView(refs.hero, { once: true });
  const isFeaturesInView = useInView(refs.features, { once: true });
  const isPricingInView = useInView(refs.pricing, { once: true });
  const isContactInView = useInView(refs.contact, { once: true });
  const isFooterInView = useInView(refs.footer, { once: true });

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Generate particle data on client side only
  useEffect(() => {
    const generateParticles = (): ParticleProps[] => {
      return Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + i * 0.5,
        delay: Math.random() * 2,
      }));
    };

    setParticles(generateParticles());
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
    
    // Custom event listener for theme changes from header
    const handleCustomThemeChange = () => {
      handleThemeChange();
    };
    
    window.addEventListener('themeChanged', handleCustomThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChanged', handleCustomThemeChange);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Hero section animations
    if (refs.hero.current) {
      gsap.fromTo(
        refs.hero.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: refs.hero.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Features section stagger animation
    if (refs.features.current) {
      const featureCards = refs.features.current.querySelectorAll('.feature-card');
      gsap.fromTo(
        featureCards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: refs.features.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Pricing section animation
    if (refs.pricing.current) {
      const pricingCards = refs.pricing.current.querySelectorAll('.pricing-card');
      gsap.fromTo(
        pricingCards,
        { opacity: 0, x: -100, rotationY: -15 },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: refs.pricing.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Contact section animation
    if (refs.contact.current) {
      gsap.fromTo(
        refs.contact.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: refs.contact.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Footer animation
    if (refs.footer.current) {
      gsap.fromTo(
        refs.footer.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: refs.footer.current,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Floating particles animation
    const particleElements = document.querySelectorAll('.floating-particle');
    particleElements.forEach((particle, index) => {
      gsap.to(particle, {
        y: -20,
        x: Math.sin(index) * 10,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Continuous background animation
    gsap.to('.animated-bg', {
      backgroundPosition: '200% 200%',
      duration: 20,
      repeat: -1,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Framer Motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const fadeInUpVariants: Variants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const scaleInVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: 'backOut' },
    },
  };

  // Scroll to top handler
  const handleScrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme-based styles
  const getBackgroundStyle = () => {
    if (isDarkMode) {
      return {
        backgroundImage: 'radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)',
        backgroundSize: '200% 200%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    } else {
      return {
        backgroundImage: 'radial-gradient(125% 125% at 50% 10%, #f8fafc 40%, #e0e7ff 100%)',
        backgroundSize: '200% 200%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
  };

  const getContainerClass = () => {
    return isDarkMode 
      ? "relative min-h-screen bg-black" 
      : "relative min-h-screen bg-slate-50";
  };

  const getParticleColor = () => {
    return isDarkMode ? "bg-purple-400/30" : "bg-purple-600/40";
  };

  const getScrollProgressClass = () => {
    return isDarkMode 
      ? "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
      : "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 origin-left z-50";
  };

  const getFloatingButtonClass = () => {
    return isDarkMode
      ? "fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-700 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300"
      : "fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-700 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300";
  };

  return (
    <motion.div
      ref={refs.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={getContainerClass()}
    >
      {/* Animated Background */}
      <motion.div
        style={{ 
          y: backgroundY,
          ...getBackgroundStyle(),
        }}
        className="fixed inset-0 z-0 animated-bg"
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`floating-particle absolute h-2 w-2 rounded-full ${getParticleColor()}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(particle.id) * 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20"
      >
        <Header2 />
      </motion.div>

      {/* Hero Section */}
      <motion.div
        ref={refs.hero}
        variants={scaleInVariants}
        initial="hidden"
        animate={isHeroInView ? 'visible' : 'hidden'}
        className="relative z-20"
      >
        <AppHero />
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={refs.features}
        variants={fadeInUpVariants}
        initial="hidden"
        animate={isFeaturesInView ? 'visible' : 'hidden'}
        className="relative z-20 scroll-mt-4"
        id="features-section"
      >
        <FeaturesSection />
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        ref={refs.pricing}
        variants={fadeInUpVariants}
        initial="hidden"
        animate={isPricingInView ? 'visible' : 'hidden'}
        className="relative z-20"
        id="pricing-section"
      >
        <SimplePricing />
      </motion.div>

      {/* Contact Section */}
      <motion.div
        ref={refs.contact}
        variants={scaleInVariants}
        initial="hidden"
        animate={isContactInView ? 'visible' : 'hidden'}
        className="relative z-20"
        id="contact-section"
      >
        <ContactUs1 />
      </motion.div>

      {/* Footer */}
      <motion.div
        ref={refs.footer}
        variants={fadeInUpVariants}
        initial="hidden"
        animate={isFooterInView ? 'visible' : 'hidden'}
        className="relative z-20"
      >
        <Footer4col />
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className={getScrollProgressClass()}
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Action Button */}
      <motion.button
        className={getFloatingButtonClass()}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
      >
        <svg
          className="h-6 w-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default LandingPage;
