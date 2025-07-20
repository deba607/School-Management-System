'use client';
import { motion } from 'framer-motion';
import { Home, Building2, UserPlus, Users, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
  { icon: Home, label: 'Dashboard', href: '/AdminDashboard' },
  { icon: Building2, label: 'Schools', href: '/AdminDashboard/schools' },
  { icon: Plus, label: 'Add School', href: '/AdminDashboard/add-school' },
  { icon: UserPlus, label: 'Add Admin', href: '/AdminDashboard/add-admin' },
  { icon: Users, label: 'Admins', href: '/AdminDashboard/admins' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="hidden md:flex flex-col w-56 bg-slate-800/90 border-r border-slate-700 py-8 px-4 gap-4 shadow-lg"
    >
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-200 transition-colors ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'hover:bg-purple-700/30 hover:text-white'
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
