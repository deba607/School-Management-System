'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Mail, MapPin, Phone, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import AdminHeader from '../admin-header';
import AdminSidebar from '../admin-sidebar';

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
}

export default function SchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<string | null>(null);

  const fetchSchools = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/schools');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch schools');
      }

      if (result.success) {
        setSchools(result.data || []);
        setSuccess(`Successfully fetched ${result.data?.length || 0} schools`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || 'Failed to fetch schools');
      }
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      setError(error.message || 'Failed to fetch schools');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchool = (schoolId: string) => {
    router.push(`/AdminDashboard/schools/${schoolId}`);
  };

  const handleEditSchool = (schoolId: string) => {
    router.push(`/AdminDashboard/schools/${schoolId}/edit`);
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return;
    }

    setDeletingSchool(schoolId);

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete school');
      }

      if (result.success) {
        setSchools(schools.filter(school => school._id !== schoolId));
        setSuccess('School deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || 'Failed to delete school');
      }
    } catch (error: any) {
      console.error('Error deleting school:', error);
      setError(error.message || 'Failed to delete school');
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeletingSchool(null);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Schools Management</h1>
                <p className="text-slate-400">Manage all registered schools in the system</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchSchools}
                  disabled={loading}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Fetching...' : 'Fetch Schools'}
                </button>
                
                <button
                  onClick={() => router.push('/AdminDashboard/add-school')}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Building2 className="w-4 h-4" />
                  Add New School
                </button>
              </div>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4 flex items-center gap-2"
                >
                  <span className="text-red-300">{error}</span>
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-green-500/20 border border-green-400/30 rounded-lg p-4 flex items-center gap-2"
                >
                  <span className="text-green-300">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Schools Grid */}
            {schools.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {schools.map((school, index) => (
                  <motion.div
                    key={school._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{school.name}</h3>
                          <p className="text-sm text-slate-300">ID: {school._id.slice(-8)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewSchool(school._id)}
                          className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditSchool(school._id)}
                          className="p-2 text-slate-400 hover:text-yellow-400 transition-colors"
                          title="Edit School"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchool(school._id)}
                          disabled={deletingSchool === school._id}
                          className="p-2 text-slate-400 hover:text-red-400 disabled:text-slate-600 transition-colors"
                          title="Delete School"
                        >
                          {deletingSchool === school._id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"
                            />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 truncate">{school.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 truncate">{school.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{school.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{school.city}, {school.state}</span>
                      </div>
                      
                      {school.pictures && school.pictures.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-400">📷</span>
                            <span className="text-slate-300">{school.pictures.length} image(s)</span>
                          </div>
                          <div className="flex gap-2 overflow-x-auto">
                            {school.pictures.slice(0, 3).map((picture, picIndex) => (
                              <img
                                key={picIndex}
                                src={`/api/images/${school._id}/${picIndex}`}
                                alt={picture.originalName}
                                className="w-12 h-12 object-cover rounded-lg border border-white/20"
                              />
                            ))}
                            {school.pictures.length > 3 && (
                              <div className="w-12 h-12 bg-slate-600/50 rounded-lg flex items-center justify-center text-xs text-slate-300">
                                +{school.pictures.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Created: {new Date(school.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(school.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && schools.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Schools Found</h3>
                <p className="text-slate-400 mb-6">Get started by adding your first school to the system.</p>
                <button
                  onClick={() => router.push('/AdminDashboard/add-school')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add Your First School
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
