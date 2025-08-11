"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../header";
import Sidebar from "../../sidebar";
import { Eye, EyeOff } from "lucide-react";
import { useSchool } from "../../school-context";

type FormField = keyof typeof initialForm;

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const { schoolId: contextSchoolId, loading: schoolLoading, error: schoolError } = useSchool();

  useEffect(() => {
    if (contextSchoolId) {
      console.log('Setting schoolId from context:', contextSchoolId);
      setSchoolId(contextSchoolId);
    } else if (!schoolLoading && !contextSchoolId) {
      console.error('No schoolId available in context after loading');
      setError('School information not available. Please try logging in again.');
    }
  }, [contextSchoolId, schoolLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as FormField;
    setForm(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear the error for the current field when user types
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as FormField;
    setForm(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate the field when it changes
    if (fieldErrors[fieldName]) {
      validateField(fieldName, value);
    }
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof typeof form, value: string) => {
    const newErrors = { ...fieldErrors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Full name is required';
        else if (value.length < 2) newErrors.name = 'Name is too short (minimum 2 characters)';
        else delete newErrors.name;
        break;
        
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) newErrors.email = 'Email is required';
        else if (!emailRegex.test(value)) newErrors.email = 'Please enter a valid email';
        else delete newErrors.email;
        break;
      }
      
      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters';
        else if (form.confirmPassword && value !== form.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.password;
          if (form.confirmPassword) {
            if (value === form.confirmPassword) {
              delete newErrors.confirmPassword;
            }
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== form.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;
        
      case 'class':
        if (!value) newErrors.class = 'Class is required';
        else delete newErrors.class;
        break;
        
      case 'sec':
        if (!value) newErrors.sec = 'Section is required';
        else delete newErrors.sec;
        break;
        
      case 'address':
        if (!value.trim()) newErrors.address = 'Address is required';
        else if (value.length < 10) newErrors.address = 'Address is too short (minimum 10 characters)';
        else delete newErrors.address;
        break;
    }
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (form.name.length < 2) {
      newErrors.name = 'Name is too short (minimum 2 characters)';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm Password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Class validation
    if (!form.class) {
      newErrors.class = 'Class is required';
      isValid = false;
    }

    // Section validation
    if (!form.sec) {
      newErrors.sec = 'Section is required';
      isValid = false;
    }

    // Address validation
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    } else if (form.address.length < 10) {
      newErrors.address = 'Address is too short (minimum 10 characters)';
      isValid = false;
    }

    // Update field errors state
    setFieldErrors(newErrors);
    
    // Log validation result for debugging
    if (!isValid) {
      console.log('Form validation failed with errors:', newErrors);
    } else {
      console.log('Form validation passed');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Validate all fields before submission
    if (!validateForm()) {
      setLoading(false);
      setError('Please fix the errors in the form before submitting.');
      return;
    }
    
    // Validate schoolId is available
    if (!schoolId) {
      setLoading(false);
      setError('School ID is not available. Please refresh the page or log in again.');
      console.error('Missing schoolId during form submission');
      return;
    }
    
    try {
      // Log form data for debugging
      console.log('Form data being submitted:', {
        ...form,
        schoolId, // Log the schoolId being used
        password: '***', // Don't log actual password
        confirmPassword: '***'
      });
      
      // First check if user with this email already exists
      const userExists = await checkIfUserExists(form.email);
      if (userExists) {
        throw new Error("A student with this email already exists");
      }

      // Get authentication token first
      const token = localStorage.getItem('school_management_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Create FormData and append all fields individually
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('email', form.email.trim().toLowerCase());
      formData.append('password', form.password);
      formData.append('class', form.class.trim());
      formData.append('sec', form.sec.trim().toUpperCase());
      formData.append('address', form.address.trim());
      formData.append('schoolId', schoolId);

      // Handle file uploads if any
      if (pictures && pictures.length > 0) {
        Array.from(pictures).forEach((file) => {
          formData.append('pictures', file);
        });
      }

      console.log('Submitting student data to API with schoolId:', schoolId);
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          // Let the browser set the Content-Type with boundary for FormData
        },
        credentials: 'include',
        body: formData,
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response from server. Please try again.');
      }
      
      console.log('API Response:', {
        status: response.status,
        ok: response.ok,
        result
      });
      
      if (!response.ok) {
        // Handle validation errors
        if ((response.status === 400 || response.status === 422) && result.details) {
          const errorMessages = Array.isArray(result.details) 
            ? result.details.map((error: any) => {
                const fieldName = error.path?.[0] === 'sec' ? 'section' : error.path?.[0] || 'field';
                return `- ${fieldName}: ${error.message || 'Invalid value'}`;
              }).join('\n')
            : result.message || 'Validation failed';
          
          throw new Error(`Validation failed:\n${errorMessages}`);
        } 
        // Handle other error cases
        throw new Error(
          result.message || 
          `Failed to create student. Status: ${response.status} ${response.statusText}`
        );
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
      // Enhanced error handling with more detailed logging
      let errorMessage = 'An unknown error occurred while submitting the form';
      
      // Log the raw error first
      console.error('Raw error object:', error);
      
      // Try to extract meaningful error information
      if (error instanceof Error) {
        errorMessage = error.message || 'An error occurred';
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else if (typeof error === 'object' && error !== null) {
        // Handle error-like objects
        const errorObj = error as Record<string, unknown>;
        errorMessage = String(
          errorObj.message || 
          errorObj.error || 
          JSON.stringify(error)
        );
        console.error('Error object details:', errorObj);
      } else {
        // Handle non-object errors (strings, numbers, etc.)
        errorMessage = String(error);
      }
      
      // Log the final error message
      console.error('Final error message:', errorMessage);
      
      // Set the error state with the most specific message we could find
      setError(errorMessage);
      setLoading(false);
      
      // For debugging: Log the current form state
      console.log('Current form state:', {
        ...form,
        password: '***',
        confirmPassword: '***'
      });
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
          <div
            ref={containerRef}
            className="relative w-full max-w-lg max-h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-4 sm:p-8 shadow-2xl mt-8 sm:mt-12 overflow-auto z-10"
          >
            <div
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
            </div>
            {success && (
              <div
                className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
              >
                Student created successfully!
              </div>
            )}
            {error && (
              <div
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
              </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="form-field">
                <label htmlFor="schoolId" className="block text-blue-900 font-medium mb-2">School ID</label>
                <input
                  id="schoolId"
                  name="schoolId"
                  type="text"
                  value={schoolId}
                  disabled
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="form-field">
                <label htmlFor="name" className="block text-blue-900 font-medium mb-2">Full Name</label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    placeholder="Enter student's full name"
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.name ? 'border-red-400' : 'border-blue-200'} text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="email" className="block text-blue-900 font-medium mb-2">Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField('email', e.target.value)}
                    placeholder="Enter student's email address"
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.email ? 'border-red-400' : 'border-blue-200'} text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="password" className="block text-blue-900 font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={(e) => validateField('password', e.target.value)}
                    placeholder="Enter password"
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.password ? 'border-red-400' : 'border-blue-200'} text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base`}
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                  )}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 bg-white rounded p-1 shadow-sm focus:outline-none"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="confirmPassword" className="block text-blue-900 font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={(e) => validateField('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.confirmPassword ? 'border-red-400' : 'border-blue-200'} text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base`}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 bg-white rounded p-1 shadow-sm focus:outline-none"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="class" className="block text-blue-900 font-medium mb-2">Class</label>
                <div className="relative">
                  <select
                    id="class"
                    name="class"
                    value={form.class}
                    onChange={handleChange}
                    onBlur={(e) => validateField('class', e.target.value)}
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.class ? 'border-red-400' : 'border-blue-200'} text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base`}
                  >
                    <option value="">Select class</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                    ))}
                  </select>
                  {fieldErrors.class && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.class}</p>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="sec" className="block text-blue-900 font-medium mb-2">Section</label>
                <div className="relative">
                  <select
                    id="sec"
                    name="sec"
                    value={form.sec}
                    onChange={handleChange}
                    onBlur={(e) => validateField('sec', e.target.value)}
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.sec ? 'border-red-400' : 'border-blue-200'} text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base`}
                  >
                    <option value="">Select section</option>
                    {["A", "B", "C", "D"].map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                  {fieldErrors.sec && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.sec}</p>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="address" className="block text-blue-900 font-medium mb-2">Address</label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleTextareaChange}
                    onBlur={(e) => validateField('address', e.target.value)}
                    placeholder="Enter address"
                    rows={3}
                    required
                    className={`w-full bg-white/60 border ${fieldErrors.address ? 'border-red-400' : 'border-blue-200'} text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base`}
                  />
                  {fieldErrors.address && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
                  )}
                </div>
              </div>
              <div className="form-field">
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
              </div>
              <button
                type="submit"
                disabled={loading}
                className="submit-btn w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    Creating Student...
                  </>
                ) : (
                  <>Create Student</>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}