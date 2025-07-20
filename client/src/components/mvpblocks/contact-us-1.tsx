'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs1() {
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

  const getFormClass = () => {
    return isDarkMode 
      ? "mx-auto mt-16 max-w-xl sm:mt-20"
      : "mx-auto mt-16 max-w-xl sm:mt-20";
  };

  const getInputClass = () => {
    return isDarkMode 
      ? "block w-full rounded-lg border-0 bg-black/40 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-purple-500/30 placeholder:text-slate-300 placeholder:opacity-100 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
      : "block w-full rounded-lg border-0 bg-white px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 placeholder:opacity-100 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6";
  };

  const getTextareaClass = () => {
    return isDarkMode 
      ? "block w-full rounded-lg border-0 bg-black/40 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-purple-500/30 placeholder:text-slate-300 placeholder:opacity-100 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 resize-none"
      : "block w-full rounded-lg border-0 bg-white px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 placeholder:opacity-100 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 resize-none";
  };

  const getLabelClass = () => {
    return isDarkMode 
      ? "block text-sm font-medium leading-6 text-slate-300"
      : "block text-sm font-medium leading-6 text-gray-900";
  };

  const getVisualClass = () => {
    return isDarkMode 
      ? "relative isolate overflow-hidden bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20 px-6 py-24 shadow-2xl sm:px-24 xl:py-32"
      : "relative isolate overflow-hidden bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-purple-600/10 px-6 py-24 shadow-2xl sm:px-24 xl:py-32";
  };

  const getVisualTitleClass = () => {
    return isDarkMode 
      ? "text-3xl font-bold tracking-tight text-white sm:text-4xl"
      : "text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl";
  };

  const getVisualDescriptionClass = () => {
    return isDarkMode 
      ? "mt-6 text-lg leading-8 text-slate-300"
      : "mt-6 text-lg leading-8 text-gray-600";
  };

  const getContactInfoClass = () => {
    return isDarkMode 
      ? "mt-10 text-base leading-7 text-slate-300"
      : "mt-10 text-base leading-7 text-gray-600";
  };

  const getContactItemClass = () => {
    return isDarkMode 
      ? "flex items-center gap-x-3 text-slate-300"
      : "flex items-center gap-x-3 text-gray-600";
  };

  return (
    <section className={getSectionClass()}>
      <div className={getContainerClass()}>
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={getTitleClass()}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSubtitleClass()}
          >
            Ready to transform your school management? Contact us today to learn more about our comprehensive solution.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto w-full max-w-2xl lg:mx-0"
          >
            <form action="#" method="POST" className="space-y-6">
              <div>
                <Label htmlFor="school-name" className={getLabelClass()}>
                  School Name
                </Label>
                <div className="mt-2.5">
                  <Input
                    type="text"
                    name="school-name"
                    id="school-name"
                    autoComplete="organization"
                    className={getInputClass()}
                    placeholder="Enter your school name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className={getLabelClass()}>
                  Email address
                </Label>
                <div className="mt-2.5">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className={getInputClass()}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className={getLabelClass()}>
                  Phone number
                </Label>
                <div className="mt-2.5">
                  <Input
                    type="tel"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    className={getInputClass()}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message" className={getLabelClass()}>
                  Message
                </Label>
                <div className="mt-2.5">
                  <Textarea
                    name="message"
                    id="message"
                    rows={9}
                    className={getTextareaClass()}
                    placeholder="Tell us about your school's needs"
                  />
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:from-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Visual Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={getVisualClass()}
          >
            <div className="absolute inset-0 -z-10 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 opacity-20"></div>
            </div>
            
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className={getVisualTitleClass()}>
                Ready to Get Started?
              </h2>
              <p className={getVisualDescriptionClass()}>
                Join hundreds of schools already using our platform to streamline their operations and improve educational outcomes.
              </p>
              
              <div className={getContactInfoClass()}>
                <div className="space-y-4">
                  <div className={getContactItemClass()}>
                    <Mail className="h-5 w-5 text-purple-400" />
                    <span>contact@edumanage.com</span>
                  </div>
                  <div className={getContactItemClass()}>
                    <Phone className="h-5 w-5 text-purple-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className={getContactItemClass()}>
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <span>123 Education St, Learning City, LC 12345</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
