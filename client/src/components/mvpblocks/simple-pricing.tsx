'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NumberFlow from '@number-flow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Check, Star, Zap, Shield, School, Users, BookOpen, Calendar, Award, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Star,
    price: {
      monthly: 29,
      yearly: 24,
    },
    description:
      'Perfect for small schools and educational institutions getting started.',
    features: [
      'Up to 200 students',
      'Basic student management',
      'Attendance tracking',
      'Grade management',
      'Email support',
      'Mobile app access',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: School,
    price: {
      monthly: 79,
      yearly: 64,
    },
    description: 'Comprehensive solution for growing schools and districts.',
    features: [
      'Up to 1,000 students',
      'Advanced student portal',
      'Teacher dashboard',
      'Parent communication',
      'Advanced reporting',
      'Priority support',
      'Custom branding',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Shield,
    price: {
      monthly: 'Custom pricing',
      yearly: 'Custom pricing',
    },
    description: 'Enterprise-grade solution for large districts and institutions.',
    features: [
      'Unlimited students',
      'Multi-campus support',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'SIS integration',
      'Advanced security',
      'Custom development',
    ],
    cta: 'Contact Sales',
  },
];

export default function SimplePricing() {
  const [frequency, setFrequency] = useState<string>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="not-prose relative flex w-full flex-col gap-16 overflow-hidden px-4 py-24 text-center sm:px-8 bg-black text-white">
      <div className="absolute inset-0 z-0 h-full w-full items-center px-5 py-24 opacity-80 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
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
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-indigo-500/10 blur-[80px]"
        ></motion.div>
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-purple-500/10 blur-[80px]"
        ></motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center space-y-2">
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5 animate-pulse text-purple-400" />
            Pricing Plans
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-white/70 via-white to-slate-500/80 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          >
            Choose the perfect plan for your school
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-md pt-2 text-lg text-slate-300/90"
          >
            Simple, transparent pricing that scales with your educational institution. 
            No hidden fees, no surprises.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs
            defaultValue={frequency}
            onValueChange={setFrequency}
            className="inline-block rounded-full bg-black/40 p-1 shadow-sm border border-purple-500/20"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="monthly"
                className="rounded-full transition-all duration-300 data-[state=active]:bg-purple-500/20 data-[state=active]:shadow-sm text-white"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="rounded-full transition-all duration-300 data-[state=active]:bg-purple-500/20 data-[state=active]:shadow-sm text-white"
              >
                Yearly
                <Badge
                  variant="secondary"
                  className="ml-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                >
                  20% off
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex"
            >
              <Card
                className={cn(
                  'relative h-full w-full bg-black/40 text-left transition-all duration-300 hover:shadow-lg border-purple-500/20 backdrop-blur-sm',
                  plan.popular
                    ? 'shadow-md ring-2 ring-purple-500/50 shadow-purple-600/20'
                    : 'hover:border-purple-500/30',
                  plan.popular &&
                    'bg-gradient-to-b from-purple-500/[0.03] to-transparent',
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
                    <Badge className="rounded-full bg-purple-600 px-4 py-1 text-white shadow-sm">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className={cn('pb-4', plan.popular && 'pt-8')}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        plan.popular
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-800 text-gray-300',
                      )}
                    >
                      <plan.icon className="h-4 w-4" />
                    </div>
                    <CardTitle
                      className={cn(
                        'text-xl font-bold text-white',
                        plan.popular && 'text-purple-400',
                      )}
                    >
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-300/90">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      {typeof plan.price[frequency as keyof typeof plan.price] === 'number' ? (
                        <>
                          <span className="text-3xl font-bold text-white">
                            $
                          </span>
                          <NumberFlow
                            value={plan.price[frequency as keyof typeof plan.price] as number}
                            className="text-3xl font-bold text-white"
                          />
                          <span className="text-slate-300/90">/{frequency === 'monthly' ? 'mo' : 'mo'}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {plan.price[frequency as keyof typeof plan.price]}
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-2 text-sm text-slate-300/90"
                      >
                        <Check className="h-4 w-4 text-green-400" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={cn(
                      'w-full',
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600',
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
