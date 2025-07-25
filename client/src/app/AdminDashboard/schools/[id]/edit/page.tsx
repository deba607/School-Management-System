'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { gsap } from 'gsap';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  Image, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminHeader from '../../../admin-header';
import AdminSidebar from '../../../admin-sidebar';

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

// Custom styles for file input
const fileInputStyles = `
  .file-input-custom::-webkit-file-upload-button {
    background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
    border: none;
    color: white;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    margin-right: 1rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
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
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    margin-right: 1rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }
  
  .file-input-custom::file-selector-button:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  }
`;

export default function EditSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    schoolId: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    description: '',
  });
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [existingPictures, setExistingPictures] = useState<Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch school');
        }

        if (result.success) {
          const school = result.data;
          setForm({
            schoolId: school.schoolId || '',
            password: '',
            confirmPassword: '',
            name: school.name,
            email: school.email,
            address: school.address,
            phone: school.phone,
            city: school.city,
            state: school.state,
            zipCode: school.zipCode,
            country: school.country,
            website: school.website || '',
            description: school.description || '',
          });
          setExistingPictures(school.pictures || []);
        } else {
          throw new Error(result.error || 'Failed to fetch school');
        }
      } catch (error: any) {
        console.error('Error fetching school:', error);
        setError(error.message || 'Failed to fetch school');
      } finally {
        setFetching(false);
      }
    };

    if (params.id) {
      fetchSchool();
    }
  }, [params.id]);

  useEffect(() => {
    if (!fetching) {
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
    }
  }, [fetching]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('Form field changed:', e.target.name, 'Value:', e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Animate the field on change
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Validate files
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      Array.from(files).forEach(file => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          invalidFiles.push(`${file.name} (not an image)`);
          return;
        }
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (too large)`);
          return;
        }
        
        validFiles.push(file);
      });
      
      // Show error for invalid files
      if (invalidFiles.length > 0) {
        setError(`Invalid files: ${invalidFiles.join(', ')}`);
        setTimeout(() => setError(null), 5000);
      }
      
      // Update state with valid files
      if (validFiles.length > 0) {
        const dt = new DataTransfer();
        validFiles.forEach(file => dt.items.add(file));
        setPictures(dt.files);
        setSelectedFiles(validFiles.map(file => file.name));
        
        // Animate file selection
        gsap.fromTo('.file-preview', 
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.1 }
        );
      }
    } else {
      setPictures(null);
      setSelectedFiles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Animate form submission
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });

    try {
      let base64Images: Array<{
        originalName: string;
        mimeType: string;
        size: number;
        base64Data: string;
      }> = [...existingPictures]; // Start with existing pictures

      // Upload and convert new files to base64 if any are selected
      if (pictures && pictures.length > 0) {
        try {
          const uploadFormData = new FormData();
          Array.from(pictures).forEach((file) => {
            uploadFormData.append('files', file);
          });

          console.log('Uploading new files:', Array.from(pictures).map(f => f.name));

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          console.log('Upload response status:', uploadResponse.status);

          const uploadResult = await uploadResponse.json();
          console.log('Upload result:', uploadResult);

          if (!uploadResponse.ok) {
            throw new Error(uploadResult.error || 'Failed to upload images');
          }

          if (uploadResult.success) {
            base64Images = [...existingPictures, ...uploadResult.data];
            console.log('All images (existing + new):', base64Images.length);
          }
        } catch (uploadError: any) {
          console.error('Upload error details:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      // Prepare form data with base64 image data
      const formData = {
        ...form,
        pictures: base64Images
      };
      // If password is empty, remove password and confirmPassword from formData
      if (!formData.password) delete formData.password;
      if (!formData.confirmPassword) delete formData.confirmPassword;

      console.log('Submitting updated form data:', JSON.stringify(formData, null, 2));

      // Submit to backend
      const response = await fetch(`/api/schools/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors specifically
        if (result.details && Array.isArray(result.details)) {
          throw new Error(result.details.join(', '));
        }
        throw new Error(result.error || 'Failed to update school');
      }

      if (result.success) {
        setSuccess(true);
        setLoading(false);
        
        // Success animation
        gsap.to('.success-message', {
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)"
        });
        
        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          router.push(`/AdminDashboard/schools/${params.id}`);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to update school');
      }
    } catch (error: any) {
      console.error('Error updating school:', error);
      setError(error.message || 'Failed to update school');
      setLoading(false);
      
      // Animate error
      gsap.to('.error-message', {
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const handleBack = () => {
    router.push(`/AdminDashboard/schools/${params.id}`);
  };

  const removeExistingPicture = (index: number) => {
    setExistingPictures(existingPictures.filter((_, i) => i !== index));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-400/30 rounded-lg p-6 text-center"
              >
                <h2 className="text-xl font-semibold text-red-300 mb-2">Error</h2>
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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: easeOut }}
            className="max-w-2xl mx-auto"
          >
            <style dangerouslySetInnerHTML={{ __html: fileInputStyles }} />
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleBack}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 
                    ref={titleRef}
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
                  >
                    Edit School
                  </h1>
                  <div className="w-10"></div> {/* Spacer for centering */}
                </div>
                <p className="text-slate-300 text-lg">
                  Update school information
                </p>
              </motion.div>

              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8"
              >
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Password */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.52 }}
                    className="form-field"
                  >
                    <Label htmlFor="password" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4" />
                      Password (leave blank to keep unchanged)
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 pr-12"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 bg-white/10 rounded p-1 shadow-sm focus:outline-none"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.53 }}
                    className="form-field"
                  >
                    <Label htmlFor="confirmPassword" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 pr-12"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 bg-white/10 rounded p-1 shadow-sm focus:outline-none"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </motion.div>

                  {/* School Name */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.5 }}
                    className="form-field"
                  >
                    <Label htmlFor="name" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4" />
                      School Name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter school name"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.6 }}
                    className="form-field"
                  >
                    <Label htmlFor="email" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Official Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="school@example.com"
                      required
                    />
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.7 }}
                    className="form-field"
                  >
                    <Label htmlFor="address" className="text-slate-200 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Textarea
                      name="address"
                      id="address"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 min-h-[80px]"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      required
                    />
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.8 }}
                    className="form-field"
                  >
                    <Label htmlFor="phone" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </motion.div>

                  {/* City */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.9 }}
                    className="form-field"
                  >
                    <Label htmlFor="city" className="text-slate-200 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      City
                    </Label>
                    <Input
                      type="text"
                      name="city"
                      id="city"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />
                  </motion.div>

                  {/* State */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.0 }}
                    className="form-field"
                  >
                    <Label htmlFor="state" className="text-slate-200 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      State
                    </Label>
                    <Input
                      type="text"
                      name="state"
                      id="state"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      required
                    />
                  </motion.div>

                  {/* ZIP Code */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.1 }}
                    className="form-field"
                  >
                    <Label htmlFor="zipCode" className="text-slate-200 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      ZIP Code
                    </Label>
                    <Input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="Enter ZIP code"
                      required
                    />
                  </motion.div>

                  {/* Country */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.2 }}
                    className="form-field"
                  >
                    <Label htmlFor="country" className="text-slate-200 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Country
                    </Label>
                    <Input
                      type="text"
                      name="country"
                      id="country"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                      required
                    />
                  </motion.div>

                  {/* Website */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.3 }}
                    className="form-field"
                  >
                    <Label htmlFor="website" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      type="url"
                      name="website"
                      id="website"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://school-website.com"
                    />
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.4 }}
                    className="form-field"
                  >
                    <Label htmlFor="description" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4" />
                      Description
                    </Label>
                    <Textarea
                      name="description"
                      id="description"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 min-h-[80px]"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter school description"
                    />
                  </motion.div>

                  {/* Existing Pictures */}
                  {existingPictures.length > 0 && (
                    <motion.div
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.5, ease: easeOut, delay: 1.5 }}
                      className="form-field"
                    >
                      <Label className="text-slate-200 flex items-center gap-2 mb-2">
                        <Image className="w-4 h-4" />
                        Existing Pictures ({existingPictures.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {existingPictures.map((picture, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                          >
                            <img
                              src={`/api/images/${params.id}/${index}`}
                              alt={picture.originalName}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingPicture(index)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* New Pictures */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.6 }}
                    className="form-field"
                  >
                    <Label htmlFor="pictures" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Image className="w-4 h-4" />
                      Add New Pictures
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        name="pictures"
                        id="pictures"
                        className="file-input-custom bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>
                    
                    {/* File Preview */}
                    <AnimatePresence>
                      {selectedFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">
                              {selectedFiles.length} new file{selectedFiles.length > 1 ? 's' : ''} selected
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFiles([]);
                                setPictures(null);
                                const fileInput = document.getElementById('pictures') as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                              }}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Clear all
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedFiles.map((fileName, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="file-preview bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg p-3 flex items-center justify-between group hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-purple-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image className="w-4 h-4 text-purple-300" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm text-purple-200 font-medium truncate">
                                      {fileName}
                                    </p>
                                    <p className="text-xs text-purple-300">
                                      New image
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                                    setSelectedFiles(newFiles);
                                    // Update the actual FileList if needed
                                    if (pictures) {
                                      const dt = new DataTransfer();
                                      Array.from(pictures).forEach((file, i) => {
                                        if (i !== index) dt.items.add(file);
                                      });
                                      setPictures(dt.files);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-300 p-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message bg-red-500/20 border border-red-400/30 rounded-lg p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-300">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success Message */}
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="success-message bg-green-500/20 border border-green-400/30 rounded-lg p-3 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-300">School updated successfully! Redirecting...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.7 }}
                    className="form-field"
                  >
                    <motion.button
                      type="submit"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={loading}
                      className="submit-btn w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Updating School...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Update School
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 