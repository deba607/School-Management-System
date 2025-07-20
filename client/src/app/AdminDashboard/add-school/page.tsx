'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { gsap } from 'gsap';
// import { Button } from '@/components/ui/button'; // Removed unused import
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
  Upload
} from 'lucide-react';
import AdminHeader from '../admin-header';
import AdminSidebar from '../admin-sidebar';

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

export default function AddSchool() {
  const [form, setForm] = useState({
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

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
      tl.kill();
    };
  }, []);

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
      }> = [];

      // Upload and convert files to base64 if any are selected
      if (pictures && pictures.length > 0) {
        try {
          const uploadFormData = new FormData();
          Array.from(pictures).forEach((file) => {
            uploadFormData.append('files', file);
          });

          console.log('Uploading files:', Array.from(pictures).map(f => f.name));

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
            base64Images = uploadResult.data;
            console.log('Base64 images:', base64Images.length);
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

      console.log('Submitting form data:', JSON.stringify(formData, null, 2));

      // Submit to backend
      const response = await fetch('/api/schools', {
        method: 'POST',
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
        throw new Error(result.error || 'Failed to create school');
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
        
        // Reset form
      setForm({
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
      setPictures(null);
        setSelectedFiles([]);
        
        // Clear file input
        const fileInput = document.getElementById('pictures') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to create school');
      }
    } catch (error: any) {
      console.error('Error creating school:', error);
      setError(error.message || 'Failed to create school');
      setLoading(false);
      
      // Animate error
      gsap.to('.error-message', {
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

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
                <h1 
                  ref={titleRef}
                  className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4"
                >
                  Add New School
                </h1>
                <p className="text-slate-300 text-lg">
                  Register a new educational institution in the system
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

                  {/* Pictures */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 0.9 }}
                    className="form-field"
                  >
                    <Label htmlFor="pictures" className="text-slate-200 flex items-center gap-2 mb-2">
                      <Image className="w-4 h-4" />
                      School Pictures
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
                              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
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
                                      Image file
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
                          
                          {/* File Upload Tips */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-blue-600/10 border border-blue-400/20 rounded-lg p-3"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="text-xs text-blue-300">
                                <p className="font-medium mb-1">Upload Tips:</p>
                                <ul className="space-y-1 text-blue-200/80">
                                  <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                                  <li>• Maximum file size: 5MB per image</li>
                                  <li>• You can select multiple images at once</li>
                                  <li>• Images will be optimized automatically</li>
                                </ul>
                              </div>
        </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* City */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.0 }}
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
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.1 }}
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
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.2 }}
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
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.3 }}
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
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.4 }}
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
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.5 }}
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
                        <span className="text-green-300">School added successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, ease: easeOut, delay: 1.3 }}
                    className="form-field"
                  >
                    <motion.button
          type="submit"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
          disabled={loading}
                      className="submit-btn w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Adding School...
                        </>
                      ) : (
                        <>
                          <Building2 className="w-5 h-5" />
                          Add School
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