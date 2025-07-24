"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";
import Header from "../../../header";
import Sidebar from "../../../sidebar";
import { useSchool } from "../../school-context";

const initialForm = {
  name: "",
  email: "",
  class: "",
  sec: "",
  address: "",
};

export default function EditStudent() {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const { schoolId, loading: schoolLoading, error: schoolError } = useSchool();

  useEffect(() => {
    // GSAP animations on mount
    const tl = gsap.timeline();
    tl.fromTo(titleRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
      .fromTo('.form-field', { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4")
      .fromTo('.submit-btn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, "-=0.2");
    gsap.to(containerRef.current, { y: -10, duration: 2, ease: "power2.inOut", yoyo: true, repeat: -1 });
    return () => { gsap.killTweensOf(containerRef.current); };
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await fetch(`/api/students/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setForm({
            name: data.data.name || "",
            email: data.data.email || "",
            class: data.data.class || "",
            sec: data.data.sec || "",
            address: data.data.address || "",
          });
          if (data.data.pictures && data.data.pictures[0]) {
            setSelectedFiles([data.data.pictures[0].originalName]);
          }
        } else {
          setError(data.error || "Failed to fetch student");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch student");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchStudent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setLoading(true);
    setError(null);
    try {
      if (!schoolId) {
        throw new Error('No schoolId found');
      }
      
      const formData: any = {
        ...form,
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
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update student");
      }
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          router.push("/SchoolDashboard/students");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to update student");
      }
    } catch (error: any) {
      setError(error.message || "Failed to update student");
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
                Edit Student
              </h1>
              <p className="text-blue-700 text-sm sm:text-base">
                Update student details
              </p>
            </motion.div>
            {fetching ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600 mb-4">{error}</div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                  <label htmlFor="class" className="block text-blue-900 font-medium mb-2">Class</label>
                  <input
                    id="class"
                    name="class"
                    type="text"
                    value={form.class}
                    onChange={handleChange}
                    placeholder="Enter class"
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                  />
                </motion.div>
                <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
                  <label htmlFor="sec" className="block text-blue-900 font-medium mb-2">Section</label>
                  <input
                    id="sec"
                    name="sec"
                    type="text"
                    value={form.sec}
                    onChange={handleChange}
                    placeholder="Enter section"
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                  />
                </motion.div>
                <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
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
                <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65, duration: 0.6 }}>
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
                      Updating Student...
                    </>
                  ) : (
                    <>Update Student</>
                  )}
                </motion.button>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                  >
                    Student updated successfully!
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-red-100 text-red-800 text-center font-semibold"
                  >
                    {error}
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
} 