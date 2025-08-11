'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { gsap } from 'gsap';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  Image, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Shield,
  Sparkles,
  Crown,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminHeader from '../admin-header';
import AdminSidebar from '../admin-sidebar';

// Custom styles for file input
const fileInputStyles = `
  .file-input-custom::-webkit-file-upload-button {
    background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
    border: none;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    margin-right: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .file-input-custom::-webkit-file-upload-button:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  }
  
  .file-input-custom::file-selector-button {
    background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
    border: none;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    margin-right: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .file-input-custom::file-selector-button:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  }
  
  @media (min-width: 640px) {
    .file-input-custom::-webkit-file-upload-button {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
    }
    
    .file-input-custom::file-selector-button {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
    }
  }
`;

export default function AddAdmin() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // GSAP animations on mount
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    )
    .fromTo('.form-field', 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo('.submit-btn', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
      "-=0.2"
    );

    // Floating animation for the container
    gsap.to(containerRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    return () => {
      gsap.killTweensOf(containerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPictures(files);
      const fileNames: string[] = [];
      for (let i = 0; i < files.length; i++) {
        fileNames.push(files[i].name);
      }
      setSelectedFiles(fileNames);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('password', form.password);
      formData.append('confirmPassword', form.confirmPassword);

      if (pictures) {
        for (let i = 0; i < pictures.length; i++) {
          formData.append('pictures', pictures[i]);
        }
      }

      const response = await fetch('/api/admins', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin');
      }

      if (result.success) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        setPictures(null);
        setSelectedFiles([]);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to create admin');
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      setError(error.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: fileInputStyles }} />
      
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 rounded-3xl blur-3xl" />
              
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 lg:p-8 shadow-2xl">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-center mb-6 sm:mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 sm:mb-6 shadow-lg"
                  >
                    <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  
                  <h1 
                    ref={titleRef}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-4"
                  >
                    Add New Administrator
                  </h1>
                  
                  <p className="text-slate-300 text-sm sm:text-base lg:text-lg">
                    Create a new administrator account for the school management system
                  </p>
                </motion.div>

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      className="mb-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4 flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      <div>
                        <h3 className="text-green-300 font-semibold text-sm sm:text-base">Success!</h3>
                        <p className="text-green-200 text-xs sm:text-sm">Administrator created successfully.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-6 h-6 text-red-400" />
                      <div>
                        <h3 className="text-red-300 font-semibold text-sm sm:text-base">Error!</h3>
                        <p className="text-red-200 text-xs sm:text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Name Field */}
                  <motion.div
                    className="form-field"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <Label htmlFor="name" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                        <span>Full Name</span>
                      </div>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter administrator's full name"
                      required
                      className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    className="form-field"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <Label htmlFor="email" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
                        <span>Email Address</span>
                      </div>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter administrator's email address"
                      required
                      className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Phone Field */}
                  <motion.div
                    className="form-field"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Label htmlFor="phone" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                        <span>Phone Number</span>
                      </div>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter administrator's phone number"
                      required
                      className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                    />
                  </motion.div>
                  {/* Password Field */}
                  <motion.div
                    className="form-field"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.52, duration: 0.6 }}
                  >
                    <Label htmlFor="password" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                        <span>Password</span>
                      </div>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base"
                      />
                      <motion.button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 bg-white rounded p-1 shadow-sm focus:outline-none"
                        onClick={() => setShowPassword(v => !v)}
                        whileTap={{ scale: 0.85 }}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </motion.button>
                    </div>
                  </motion.div>
                  {/* Confirm Password Field */}
                  <motion.div
                    className="form-field"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.54, duration: 0.6 }}
                  >
                    <Label htmlFor="confirmPassword" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
                        <span>Confirm Password</span>
                      </div>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base"
                      />
                      <motion.button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 bg-white rounded p-1 shadow-sm focus:outline-none"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        whileTap={{ scale: 0.85 }}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Pictures Field */}
                  <motion.div
                    className="form-field"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Label htmlFor="pictures" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                        <span>Profile Pictures</span>
                      </div>
                    </Label>
                    <div className="space-y-3">
                      <input
                        id="pictures"
                        name="pictures"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input-custom w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      
                      {/* Selected Files Display */}
                      {selectedFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10"
                        >
                          <h4 className="text-white font-medium text-sm sm:text-base mb-2">Selected Files:</h4>
                          <div className="space-y-1">
                            {selectedFiles.map((fileName, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm"
                              >
                                <CheckCircle2 className="w-3 h-3 sm:w-4 h-4 text-green-400" />
                                {fileName}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="submit-btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creating Administrator...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                        Create Administrator
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Footer Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-6 sm:mt-8 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
                    <Sparkles className="w-3 h-3 sm:w-4 h-4" />
                    <span>Administrators have full access to manage the system</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 