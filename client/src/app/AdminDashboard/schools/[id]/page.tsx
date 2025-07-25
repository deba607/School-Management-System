'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  FileText, 
  ArrowLeft, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  Calendar,
  Clock
} from 'lucide-react';
import AdminHeader from '../../admin-header';
import AdminSidebar from '../../admin-sidebar';

interface School {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  description?: string;
  pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  createdAt: string;
  updatedAt: string;
  schoolId: string;
}

export default function ViewSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch school');
        }

        if (result.success) {
          setSchool(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch school');
        }
      } catch (error: any) {
        console.error('Error fetching school:', error);
        setError(error.message || 'Failed to fetch school');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSchool();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/AdminDashboard/schools/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/schools/${params.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete school');
      }

      if (result.success) {
        router.push('/AdminDashboard/schools');
      } else {
        throw new Error(result.error || 'Failed to delete school');
      }
    } catch (error: any) {
      console.error('Error deleting school:', error);
      setError(error.message || 'Failed to delete school');
    }
  };

  const handleBack = () => {
    router.push('/AdminDashboard/schools');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 sm:p-6 text-center"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-red-300 mb-2">Error</h2>
                <p className="text-red-200 mb-4">{error}</p>
                <button
                  onClick={handleBack}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 sm:p-6 text-center"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-yellow-300 mb-2">School Not Found</h2>
                <p className="text-yellow-200 mb-4">The school you're looking for doesn't exist.</p>
                <button
                  onClick={handleBack}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col xs:flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-8"
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={handleBack}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div>
                  <h1 className="text-lg xs:text-xl sm:text-3xl font-bold text-white break-words max-w-[200px] xs:max-w-none">{school.name}</h1>
                  <p className="text-slate-400 text-xs xs:text-sm sm:text-base">School Details</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center w-full sm:w-auto">
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-xs xs:text-sm sm:text-base w-full sm:w-auto"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-xs xs:text-sm sm:text-base w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>

            {/* School Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6"
            >
              {/* Basic Information */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 xs:p-4 sm:p-6">
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Basic Information
                </h2>
                
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3 break-words">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Email</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 break-words">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Phone</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.phone}</p>
                    </div>
                  </div>
                  
                  {school.website && (
                    <div className="flex items-center gap-2 sm:gap-3 break-words overflow-x-auto">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs sm:text-sm text-slate-400">Website</p>
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors break-all whitespace-pre-wrap text-xs xs:text-sm"
                          style={{ wordBreak: 'break-all' }}
                        >
                          {school.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3 break-words">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">School ID</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.schoolId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 xs:p-4 sm:p-6">
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h2>
                
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Address</p>
                    <p className="text-white break-all text-xs xs:text-sm">{school.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">City</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.city}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">State</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.state}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">ZIP Code</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.zipCode}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">Country</p>
                      <p className="text-white break-all text-xs xs:text-sm">{school.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {school.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 xs:mt-6 sm:mt-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 xs:p-4 sm:p-6"
              >
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </h2>
                <p className="text-slate-300 leading-relaxed text-xs xs:text-sm sm:text-base break-words">{school.description}</p>
              </motion.div>
            )}

            {/* Images */}
            {school.pictures && school.pictures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 xs:mt-6 sm:mt-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 xs:p-4 sm:p-6"
              >
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  School Images ({school.pictures.length})
                </h2>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                  {school.pictures.map((picture, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative group"
                    >
                      <img
                        src={`data:${picture.mimeType};base64,${picture.base64Data}`}
                        alt={picture.originalName}
                        className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-xs sm:text-sm font-medium text-center px-2 break-all">{picture.originalName}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timestamps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 xs:mt-6 sm:mt-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 xs:p-4 sm:p-6"
            >
              <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timestamps
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Created</p>
                    <p className="text-white break-all text-xs xs:text-sm">{new Date(school.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">Last Updated</p>
                    <p className="text-white break-all text-xs xs:text-sm">{new Date(school.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 