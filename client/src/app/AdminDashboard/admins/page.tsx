'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, RefreshCw, Shield, Sparkles, Crown, X, Search, Eye } from 'lucide-react';
import AdminHeader from '../admin-header';
import AdminSidebar from '../admin-sidebar';

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<{ src: string; alt: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admins');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch admins');
      }

      if (result.success) {
        setAdmins(result.data || []);
        setFilteredAdmins(result.data || []);
        setSuccess(`Successfully fetched ${result.data?.length || 0} admins`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || 'Failed to fetch admins');
      }
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      setError(error.message || 'Failed to fetch admins');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(admin => {
        const searchLower = searchTerm.toLowerCase();
        return (
          admin.name.toLowerCase().includes(searchLower) ||
          admin.email.toLowerCase().includes(searchLower) ||
          admin.phone.toLowerCase().includes(searchLower) ||
          admin._id.toLowerCase().includes(searchLower)
        );
      });
      setFilteredAdmins(filtered);
    }
  }, [searchTerm, admins]);

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return;
    }

    setDeletingAdmin(adminId);

    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete admin');
      }

      if (result.success) {
        setAdmins(admins.filter(admin => admin._id !== adminId));
        setSuccess('Admin deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || 'Failed to delete admin');
      }
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      setError(error.message || 'Failed to delete admin');
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeletingAdmin(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageModalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleImageHover = (picture: any) => {
    const imageUrl = `data:${picture.mimeType};base64,${picture.base64Data}`;
    setHoveredImage({
      src: imageUrl,
      alt: picture.originalName
    });
  };

  const handleImageLeave = () => {
    setHoveredImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
        />
      </div>

      <AdminHeader />
      <div className="flex relative z-10">
        <AdminSidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 sm:mb-6 shadow-2xl"
              >
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-4"
              >
                Admins Management
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8"
              >
                Manage all administrators in the system
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              >
                <button
                  onClick={fetchAdmins}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-base w-full sm:w-auto"
                >
                  <motion.div
                    animate={loading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  {loading ? 'Fetching...' : 'Refresh Admins'}
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/AdminDashboard/add-admin')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add New Admin
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mb-6 sm:mb-8 flex justify-center"
            >
              <div className="relative max-w-md w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search admins by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-sm sm:text-base"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  )}
                </div>
                
                {/* Search Results Info */}
                <AnimatePresence>
                  {searchTerm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-slate-300 text-center"
                    >
                      Found {filteredAdmins.length} admin{filteredAdmins.length !== 1 ? 's' : ''} 
                      {searchTerm && ` for "${searchTerm}"`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="mb-6 sm:mb-8 bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500/30 rounded-full flex items-center justify-center">
                    <span className="text-red-300 text-xs sm:text-sm">⚠️</span>
                  </div>
                  <span className="text-red-300 font-medium text-sm sm:text-base">{error}</span>
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="mb-6 sm:mb-8 bg-green-500/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                    <span className="text-green-300 text-xs sm:text-sm">✨</span>
                  </div>
                  <span className="text-green-300 font-medium text-sm sm:text-base">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admins Grid */}
            {filteredAdmins.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              >
                {filteredAdmins.map((admin, index) => (
                  <motion.div
                    key={admin._id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group relative"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 hover:bg-white/15 transition-all duration-500 overflow-hidden">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
                        />
                      </div>

                      <div className="relative z-10">
                        {/* Header */}
                        <motion.div
                          variants={textVariants}
                          className="flex items-start justify-between mb-4 sm:mb-6"
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <motion.div
                              variants={iconVariants}
                              whileHover="hover"
                              className="relative"
                            >
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                                className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl sm:rounded-2xl blur-sm"
                              />
                            </motion.div>
                            
                            <div>
                              <motion.h3
                                variants={textVariants}
                                className="text-lg sm:text-xl font-bold text-white mb-1"
                              >
                                {admin.name}
                              </motion.h3>
                              <motion.p
                                variants={textVariants}
                                className="text-xs sm:text-sm text-slate-300 font-mono"
                              >
                                ID: {admin._id.slice(-8)}
                              </motion.p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                          variants={textVariants}
                          className="space-y-3 sm:space-y-4 mb-4 sm:mb-6"
                        >
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 sm:gap-3 text-slate-200 hover:text-white transition-colors"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600/30 rounded-lg flex items-center justify-center">
                              <Mail className="w-3 h-3 sm:w-4 h-4 text-purple-300" />
                            </div>
                            <span className="text-xs sm:text-sm truncate">{admin.email}</span>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 sm:gap-3 text-slate-200 hover:text-white transition-colors"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-600/30 rounded-lg flex items-center justify-center">
                              <Phone className="w-3 h-3 sm:w-4 h-4 text-pink-300" />
                            </div>
                            <span className="text-xs sm:text-sm">{admin.phone}</span>
                          </motion.div>
                        </motion.div>

                        {/* Images Section */}
                        {admin.pictures && admin.pictures.length > 0 && (
                          <motion.div
                            variants={textVariants}
                            className="mb-4 sm:mb-6"
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-600/30 rounded-lg flex items-center justify-center">
                                <span className="text-emerald-300 text-xs sm:text-sm">📷</span>
                              </div>
                              <span className="text-xs sm:text-sm text-slate-300">
                                {admin.pictures.length} image{admin.pictures.length > 1 ? 's' : ''}
                              </span>
                            </motion.div>
                            
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex gap-2 overflow-x-auto pb-2"
                            >
                              {admin.pictures.slice(0, 3).map((picture, picIndex) => (
                                <motion.div
                                  key={picIndex}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  className="relative cursor-pointer group"
                                  onMouseEnter={() => handleImageHover(picture)}
                                  onMouseLeave={handleImageLeave}
                                >
                                  <img
                                    src={`data:${picture.mimeType};base64,${picture.base64Data}`}
                                    alt={picture.originalName}
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-white/20 shadow-lg transition-all duration-300 group-hover:border-purple-400"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all duration-300 flex items-center justify-center">
                                    <Eye className="opacity-0 group-hover:opacity-100 text-white w-3 h-3 sm:w-4 h-4 transition-opacity duration-300" />
                                  </div>
                                </motion.div>
                              ))}
                              {admin.pictures.length > 3 && (
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600/50 to-pink-600/50 rounded-lg flex items-center justify-center text-xs text-white font-bold border-2 border-white/20"
                                >
                                  +{admin.pictures.length - 3}
                                </motion.div>
                              )}
                            </motion.div>
                          </motion.div>
                        )}
                        
                        {/* Timestamps */}
                        <motion.div
                          variants={textVariants}
                          className="flex items-center justify-between text-xs text-slate-400 pt-3 sm:pt-4 border-t border-white/10"
                        >
                          <span>Created: {new Date(admin.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(admin.updatedAt).toLocaleDateString()}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && filteredAdmins.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center py-12 sm:py-20"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
                >
                  <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
                >
                  {searchTerm ? 'No Admins Found' : 'No Admins Found'}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg"
                >
                  {searchTerm 
                    ? `No admins match your search for "${searchTerm}"`
                    : 'Get started by adding your first administrator to the system.'
                  }
                </motion.p>
                
                {!searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/AdminDashboard/add-admin')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold"
                  >
                    Add Your First Admin
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Image Hover Modal */}
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
            onClick={() => setHoveredImage(null)}
          >
            <motion.div
              variants={imageModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 h-1/4 min-w-[280px] min-h-[200px] max-w-[500px] max-h-[400px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setHoveredImage(null)}
                className="absolute -top-4 -right-4 w-8 h-8 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white z-10 transition-colors shadow-lg"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="w-full h-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
                <img
                  src={hoveredImage.src}
                  alt={hoveredImage.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 