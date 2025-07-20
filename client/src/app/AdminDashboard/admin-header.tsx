'use client';
import { motion } from 'framer-motion';

export default function AdminHeader() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between bg-slate-900/80 px-6 shadow-md backdrop-blur-md"
    >
      <h1 className="text-xl font-bold text-white tracking-wide">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center text-white font-bold">
          AD
        </div>
      </div>
    </motion.header>
  );
}
