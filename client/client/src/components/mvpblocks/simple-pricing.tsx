'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

export default function SimplePricing() {
  const [isYearly, setIsYearly] = useState(false);
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

const plans = [
  {
      name: 'Basic',
      price: isYearly ? 29 : 39,
      description: 'Perfect for small schools getting started',
    features: [
        'Up to 100 students',
        'Basic reporting',
        'Email support',
        'Mobile app access',
        'Attendance tracking',
        'Basic analytics',
      ],
      notIncluded: [
        'Advanced analytics',
        'Multi-campus support',
        'Priority support',
        'Custom integrations',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: isYearly ? 79 : 99,
      description: 'Ideal for growing schools with advanced needs',
    features: [
        'Up to 500 students',
        'Advanced reporting',
        'Priority support',
        'Mobile app access',
        'Attendance tracking',
        'Advanced analytics',
        'Multi-campus support',
        'Custom integrations',
        'API access',
        'Data export',
      ],
      notIncluded: [
        'Unlimited students',
        'White-label solution',
        'Dedicated account manager',
      ],
    popular: true,
  },
  {
    name: 'Enterprise',
      price: isYearly ? 199 : 249,
      description: 'For large schools with unlimited requirements',
    features: [
        'Unlimited students',
        'Advanced reporting',
        'Priority support',
        'Mobile app access',
        'Attendance tracking',
        'Advanced analytics',
        'Multi-campus support',
        'Custom integrations',
        'API access',
        'Data export',
        'White-label solution',
        'Dedicated account manager',
        'Custom development',
        'SLA guarantee',
      ],
      notIncluded: [],
      popular: false,
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

  const getToggleClass = () => {
    return isDarkMode 
      ? "relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600"
      : "relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600";
  };

  const getToggleTextClass = () => {
    return isDarkMode 
      ? "text-sm font-medium text-slate-300"
      : "text-sm font-medium text-gray-600";
  };

  const getCardClass = (popular: boolean) => {
    const baseClass = "pricing-card relative rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10";
    const popularClass = isDarkMode 
      ? "bg-purple-600 ring-purple-500"
      : "bg-purple-600 ring-purple-500";
    const regularClass = isDarkMode 
      ? "bg-black/40 ring-purple-500/20"
      : "bg-white ring-gray-200 shadow-lg";
    
    return popular ? `${baseClass} ${popularClass}` : `${baseClass} ${regularClass}`;
  };

  const getCardTitleClass = (popular: boolean) => {
    if (popular) {
      return "text-white";
    }
    return isDarkMode ? "text-white" : "text-gray-900";
  };

  const getCardDescriptionClass = (popular: boolean) => {
    if (popular) {
      return "text-purple-200";
    }
    return isDarkMode ? "text-slate-300" : "text-gray-500";
  };

  const getPriceClass = (popular: boolean) => {
    if (popular) {
      return "text-white";
    }
    return isDarkMode ? "text-white" : "text-gray-900";
  };

  const getFeatureClass = (popular: boolean) => {
    if (popular) {
      return "text-white";
    }
    return isDarkMode ? "text-slate-300" : "text-gray-600";
  };

  const getNotIncludedClass = () => {
    return isDarkMode ? "text-slate-400" : "text-gray-400";
  };

  const getButtonClass = (popular: boolean) => {
    if (popular) {
      return "bg-white text-purple-600 hover:bg-purple-50";
    }
    return isDarkMode 
      ? "bg-purple-600 text-white hover:bg-purple-500"
      : "bg-purple-600 text-white hover:bg-purple-500";
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
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSubtitleClass()}
          >
            Choose the perfect plan for your school. All plans include our core features with no hidden fees.
          </motion.p>
          
          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <span className={getToggleTextClass()}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={getToggleClass()}
            >
              <span
                className={`${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
            <span className={getToggleTextClass()}>
              Yearly
              <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 sm:max-w-none sm:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={getCardClass(plan.popular)}
              >
                {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white">
                  Most Popular
                  </div>
                )}
              
              <div className="text-center">
                <h3 className={`text-lg font-semibold leading-8 ${getCardTitleClass(plan.popular)}`}>
                      {plan.name}
                </h3>
                <p className={`mt-4 text-sm leading-6 ${getCardDescriptionClass(plan.popular)}`}>
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-1">
                  <span className={`text-4xl font-bold tracking-tight ${getPriceClass(plan.popular)}`}>
                    ${plan.price}
                          </span>
                  <span className={`text-sm font-semibold leading-6 ${getCardDescriptionClass(plan.popular)}`}>
                    /month
                        </span>
                </p>
                  <Button
                  className={`mt-6 w-full rounded-lg px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${getButtonClass(plan.popular)}`}
                >
                  Get started
                  </Button>
              </div>

              <ul className="mt-8 space-y-3 text-sm leading-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className={`h-6 w-5 flex-none ${plan.popular ? 'text-white' : 'text-purple-600'}`} />
                    <span className={getFeatureClass(plan.popular)}>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <X className="h-6 w-5 flex-none text-gray-400" />
                    <span className={getNotIncludedClass()}>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
