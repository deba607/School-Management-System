"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../header";
import Sidebar from "../../sidebar";
import { Eye, EyeOff } from "lucide-react";
import { getSchoolIdFromToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { useSchool } from "../../school-context";
import { initializeAuthFetch } from "@/utils/authFetch";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  password: "",
  confirmPassword: "",
  address: "",
};

export default function AddTeacher() {
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
    // Initialize authFetch function
    initializeAuthFetch();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Log current state for debugging
    console.log('Form submission - schoolId:', schoolId);
    console.log('Form data:', form);
    
    // Validate schoolId is present
    if (!schoolId) {
      console.error('School ID is missing in form submission');
      setError("School ID is missing. Please try refreshing the page.");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate address is present
    if (!form.address || form.address.trim().length < 5) {
      setError("Please enter a valid address (at least 5 characters)");
      return;
    }
    
    setLoading(true);
    try {
      // Create form data with all required fields explicitly included
      const formData: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        address: form.address, // Explicitly include address
        password: form.password,
        confirmPassword: form.confirmPassword, // Add confirmPassword for validation
        schoolId,
        pictures: [],
      };
      if (pictures) {
        for (let i = 0; i < pictures.length; i++) {
          const file = pictures[i];
          const base64 = await toBase64(file);
          formData.pictures.push({
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            base64Data: base64,
          });
        }
      }
      console.log('Sending form data to API:', formData);
      // Get the token from localStorage
      const token = localStorage.getItem('school_management_token');
      
      if (!token) {
        throw new Error("You must be logged in to perform this action");
      }

      const response = await window.authFetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create teacher");
      }
      if (result.success) {
        setSuccess(true);
        setForm(initialForm);
        setPictures(null);
        setSelectedFiles([]);
        setTimeout(() => {
          setSuccess(false);
          router.push("/SchoolDashboard/teachers");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to create teacher");
      }
    } catch (error: any) {
      setError(error.message || "Failed to create teacher");
    } finally {
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
                Add New Teacher
              </h1>
              <p className="text-blue-700 text-sm sm:text-base">
                Create a new teacher profile for your school
              </p>
            </div>
            {success && (
              <div
                className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
              >
                Teacher created successfully!
              </div>
            )}
            {error && (
              <div
                className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 text-center font-semibold"
              >
                {error}
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
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter teacher's full name"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email" className="block text-blue-900 font-medium mb-2">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter teacher's email address"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone" className="block text-blue-900 font-medium mb-2">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter teacher's phone number"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
              </div>
              <div className="form-field">
                <label htmlFor="subject" className="block text-blue-900 font-medium mb-2">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter subject taught"
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                />
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
                    placeholder="Enter password"
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base"
                  />
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
                    placeholder="Confirm password"
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base"
                  />
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
                    Creating Teacher...
                  </>
                ) : (
                  <>Create Teacher</>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 