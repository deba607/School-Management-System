'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  GraduationCap, 
  School, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  Smartphone, 
  Database, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Comprehensive student profiles with academic history, attendance records, and performance tracking.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400'
  },
  {
    icon: BookOpen,
    title: 'Course Management',
    description: 'Organize courses, subjects, and curriculum with flexible scheduling and resource allocation.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400'
  },
  {
    icon: Calendar,
    title: 'Attendance Tracking',
    description: 'Automated attendance system with real-time tracking and detailed reporting capabilities.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400'
  },
  {
    icon: Award,
    title: 'Grade Management',
    description: 'Comprehensive grading system with customizable rubrics and performance analytics.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400'
  },
  {
    icon: GraduationCap,
    title: 'Teacher Dashboard',
    description: 'Dedicated teacher portal for managing classes, grades, and student communications.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400'
  },
  {
    icon: School,
    title: 'Parent Portal',
    description: 'Secure parent access to monitor student progress, attendance, and academic performance.',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive reporting and analytics to track performance and identify trends.',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400'
  },
  {
    icon: MessageSquare,
    title: 'Communication Hub',
    description: 'Integrated messaging system for seamless communication between teachers, parents, and students.',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400'
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Cross-platform mobile application for on-the-go access to all school management features.',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400'
  },
  {
    icon: Database,
    title: 'Data Security',
    description: 'Enterprise-grade security with encrypted data storage and compliance with educational standards.',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400'
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Secure role-based permissions ensuring appropriate access levels for all users.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400'
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Easy implementation with automated data migration and comprehensive training support.',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400'
  }
];

export default function FeaturesSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-24 text-white">
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

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-4 rounded-full border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300"
            >
              Features
            </Badge>
            <h2 className="mb-6 bg-gradient-to-r from-white/70 via-white to-slate-500/80 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Comprehensive School Management
            </h2>
            <p className="text-lg text-slate-300/90">
              Everything you need to manage your educational institution efficiently and effectively.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-black/40 border-purple-500/20 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300/90 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white border border-purple-500/30">
            <h3 className="mb-4 text-2xl font-bold">Ready to Get Started?</h3>
            <p className="mb-6 text-lg text-white/90">
              Join hundreds of schools already using EduManage to streamline their operations and improve educational outcomes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button className="rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition-all hover:bg-gray-100">
                Start Free Trial
              </button>
              <button className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 