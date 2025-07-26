"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import Header from "../../header";
import Sidebar from "../../sidebar";
import { Eye, EyeOff } from "lucide-react";
import { useSchool } from "../../school-context";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  class: "",
  sec: "",
  address: "",
};

export default function AddStudent() {
  const [form, setForm] = useState(initialForm);
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const { schoolId: contextSchoolId, loading: schoolLoading, error: schoolError } = useSchool();

  useEffect(() => {
    if (contextSchoolId) {
      setSchoolId(contextSchoolId);
    }
  }, [contextSchoolId]);

  useEffect(() => {
    // GSAP animations on mount
    const tl = gsap.timeline();
    tl.fromTo(titleRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
      .fromTo('.form-field', { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4")
      .fromTo('.submit-btn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, "-=0.2");
    gsap.to(containerRef.current, { y: -10, duration: 2, ease: "power2.inOut", yoyo: true, repeat: -1 });
    return () => { gsap.killTweensOf(containerRef.current); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

  const checkIfUserExists = async (email: string) => {
    try {
      const response = await fetch(`/api/students/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  const validateForm = () => {
    // Check if all required fields are filled
    const requiredFields = ['name', 'email', 'password', 'class', 'sec', 'address'];
    const missingFields = requiredFields.filter(field => {
      const value = form[field as keyof typeof form];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => {
        if (field === 'sec') return 'section';
        return field;
      });
      return `Please fill in all required fields: ${fieldNames.join(', ')}`;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address";
    }

    // Validate password strength
    if (form.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    // Check password match if confirmPassword exists in the form
    if ('confirmPassword' in form && form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    return null; // No validation errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Log form data for debugging
      console.log('Form data being submitted:', {
        ...form,
        password: '***', // Don't log actual password
        confirmPassword: '***'
      });
      
      // Validate form
      const validationError = validateForm();
      if (validationError) {
        console.error('Client-side validation failed:', validationError);
        setError(validationError);
        setLoading(false);
        return;
      }

      // First check if user with this email already exists
      const userExists = await checkIfUserExists(form.email);
      if (userExists) {
        setError("A student with this email already exists");
        setLoading(false);
        return;
      }

      // Create the student data object with required fields
      const studentData = {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password, // This will be hashed on the server
        class: form.class.trim(),
        sec: form.sec.trim(),
        address: form.address.trim(),
        schoolId: schoolId,
        pictures: [] as Array<{
          originalName: string;
          mimeType: string;
          size: number;
          base64Data: string;
        }>,
      };

      // Process pictures if any
      if (pictures && pictures.length > 0) {
        for (let i = 0; i < pictures.length; i++) {
          const file = pictures[i];
          const base64 = await toBase64(file);
          studentData.pictures.push({
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            base64Data: base64.split(',')[1], // Remove the data URL prefix
          });
        }
      }

      // Get authentication token
      const token = localStorage.getItem('school_management_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Submit the student data
      console.log('Submitting student data to API...');
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();
      console.log('API Response:', {
        status: response.status,
        ok: response.ok,
        result
      });
      
      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && result.details) {
          // Format validation errors into a user-friendly message
          const errorMessages = result.details.map((error: any) => {
            // Format field names to be more user-friendly
            const fieldName = error.path[0] === 'sec' ? 'section' : error.path[0];
            return `- ${fieldName}: ${error.message}`;
          }).join('\n');
          
          throw new Error(`Validation failed:\n${errorMessages}`);
        } 
        // Handle duplicate email error
        else if (response.status === 409) {
          throw new Error("A student with this email already exists");
        } 
        // Handle unauthorized/forbidden
        else if (response.status === 401 || response.status === 403) {
          throw new Error("You don't have permission to perform this action. Please log in again.");
        }
        // Handle other errors
        else {
          throw new Error(result.error || `Failed to create student (${response.status}). Please try again.`);
        }
      }

      if (result.success) {
        setSuccess(true);
        setForm(initialForm);
        setPictures(null);
        setSelectedFiles([]);
        setTimeout(() => {
          setSuccess(false);
          router.push("/SchoolDashboard/students");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to create student. Please try again.");
      }
    } catch (error) {
      // Type-safe error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'An error occurred while submitting the form';
          
      console.error('Error in form submission:', {
        error,
        errorString: String(error),
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage,
        errorStack: error instanceof Error ? error.stack : undefined
      });
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  return (
    <div className="flex h-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center py-12 px-2 overflow-auto h-full">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-lg max-h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-4 sm:p-8 shadow-2xl mt-8 sm:mt-12 overflow-auto z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-6 sm:mb-8"
            >
              <h1
                ref={titleRef}
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-2 sm:mb-4"
              >
                Add New Student
              </h1>
              <p className="text-blue-700 text-sm sm:text-base">
                Create a new student profile for your school
              </p>
            </motion.div>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
              >
                Student created successfully!
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Error</h3>
                    <div className="mt-1 text-sm">
                      {error.split('\n').map((line, i) => (
                        <p key={i} className="whitespace-pre-wrap">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <label htmlFor="schoolId" className="block text-blue-900 font-medium mb-2">School ID</label>
                <input
                  id="schoolId"
                  name="schoolId"
                  type="text"
                  value={schoolId}
                  disabled
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base opacity-70 cursor-not-allowed"
                />
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <label htmlFor="name" className="block text-blue-900 font-medium mb-2">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <label htmlFor="email" className="block text-blue-900 font-medium mb-2">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter student's email address"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <label htmlFor="password" className="block text-blue-900 font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base"
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 bg-white rounded p-1 shadow-sm focus:outline-none"
                    onClick={() => setShowPassword(v => !v)}
                    whileTap={{ scale: 0.85 }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
                <label htmlFor="confirmPassword" className="block text-blue-900 font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base"
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 bg-white rounded p-1 shadow-sm focus:outline-none"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    whileTap={{ scale: 0.85 }}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                <label htmlFor="class" className="block text-blue-900 font-medium mb-2">Class</label>
                <select
                  id="class"
                  name="class"
                  value={form.class}
                  onChange={(e) => handleChange(e)}
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                >
                  <option value="">Select class</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65, duration: 0.6 }}>
                <label htmlFor="sec" className="block text-blue-900 font-medium mb-2">Section</label>
                <select
                  id="sec"
                  name="sec"
                  value={form.sec}
                  onChange={(e) => handleChange(e)}
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                >
                  <option value="">Select section</option>
                  {["A", "B", "C", "D"].map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.68, duration: 0.6 }}>
                <label htmlFor="address" className="block text-blue-900 font-medium mb-2">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
                <label htmlFor="pictures" className="block text-blue-900 font-medium mb-2">Profile Photo</label>
                <input
                  id="pictures"
                  name="pictures"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-2 text-sm sm:text-base"
                  multiple={false}
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2 text-blue-700 text-xs">
                    Selected: {selectedFiles.join(", ")}
                  </div>
                )}
              </motion.div>
              <motion.button
                type="submit"
                disabled={loading}
                className="submit-btn w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating Student...
                  </>
                ) : (
                  <>Create Student</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 