'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Mail, 
  User,
  Sparkles,
  Clock,
  Calendar
} from 'lucide-react';

export default function AdminHeader() {
  const [currentAdmin] = useState({
    name: "John Administrator",
    email: "admin@schoolsystem.com",
    picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-white/10 shadow-2xl backdrop-blur-xl"
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo & Title */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur-sm"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            >
              Admin Dashboard
            </motion.h1>
          </motion.div>

          {/* Center Section - Time & Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex flex-col items-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center gap-2 text-white mb-1"
            >
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-mono font-medium">
                {formatTime(currentTime)}
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xs text-slate-400 flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              {formatDate(currentTime)}
            </motion.p>
          </motion.div>

          {/* Right Section - Admin Profile */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            {/* Admin Info - Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 200 }}
              className="hidden md:flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              {/* Admin Picture */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
                    src={currentAdmin.picture}
                    alt={currentAdmin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm"
                />
              </motion.div>

              {/* Admin Details */}
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-purple-300" />
                  <span className="text-white font-semibold text-sm sm:text-lg">
                    {currentAdmin.name}
                  </span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-pink-300" />
                  <span className="text-slate-300 text-xs sm:text-sm">
                    {currentAdmin.email}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile Admin Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 200 }}
              className="md:hidden flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 border border-white/20"
            >
              {/* Mobile Admin Picture */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/30">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
                    src={currentAdmin.picture}
                    alt={currentAdmin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm"
                />
              </motion.div>

              {/* Mobile Admin Name */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex flex-col"
              >
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {currentAdmin.name}
                </span>
                <span className="text-slate-300 text-xs">
                  Admin
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Time & Date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="lg:hidden mt-3 flex items-center justify-center gap-4"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center gap-2 text-white"
          >
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono font-medium">
              {formatTime(currentTime)}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center gap-1 text-slate-400"
          >
            <Calendar className="w-3 h-3" />
            <span className="text-xs">
              {formatDate(currentTime)}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
