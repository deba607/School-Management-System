'use client';
import { motion } from 'framer-motion';
import { Home, Users, BookOpen, Calendar, Settings } from 'lucide-react';

const navLinks = [
  { icon: Home, label: 'Dashboard' },
  { icon: Users, label: 'Users' },
  { icon: BookOpen, label: 'Courses' },
  { icon: Calendar, label: 'Calendar' },
  { icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="hidden md:flex flex-col w-56 bg-slate-800/90 border-r border-slate-700 py-8 px-4 gap-4 shadow-lg"
    >
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-200 hover:bg-purple-700/30 hover:text-white transition-colors"
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.label}</span>
          </a>
        ))}
      </nav>
    </motion.aside>
  );
}
