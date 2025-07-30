"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../sidebar";
import Header from "../../header";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useSchool } from "../../school-context";
import { authFetch } from "@/utils/authFetch";

const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const sectionOptions = ["A", "B", "C", "D"];
const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialForm = {
  className: "",
  section: "",
  subject: "",
  teacher: "",
  day: [],
  startTime: "",
  endTime: "",
  description: "",
};

export default function AddClassSchedule() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<{ _id: string; name: string }[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [schoolId, setSchoolId] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const { schoolId: contextSchoolId, loading: schoolLoading, error: schoolError } = useSchool();

  // Add this useEffect to set the schoolId from context
  useEffect(() => {
    if (contextSchoolId) {
      setSchoolId(contextSchoolId);
    }
  }, [contextSchoolId]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      titleRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  useEffect(() => {
    async function fetchDropdowns() {
      setDropdownLoading(true);
      try {
        const res = await authFetch("/api/teachers");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const teachersArr = data.data.map((t: any) => ({ _id: t._id, name: t.name }));
          setTeachers(teachersArr);
          // Deduplicate subjects
          const subjectSet = new Set<string>();
          data.data.forEach((t: any) => {
            if (t.subject) subjectSet.add(t.subject);
          });
          setSubjects(Array.from(subjectSet));
        }
      } catch (e) {
        setError("Failed to load teachers/subjects");
      } finally {
        setDropdownLoading(false);
      }
    }
    fetchDropdowns();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, multiple, options } = e.target as HTMLSelectElement;
    if (type === "select-multiple") {
      const selected: string[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(options[i].value);
      }
      setForm(prev => ({ ...prev, [name]: selected }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData: any = {
        ...form,
        schoolId,
      };
      const res = await authFetch("/api/class-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add class schedule");
      }
      setSuccess(true);
      setLoading(false);
      setForm(initialForm);
      setTimeout(() => router.push("/SchoolDashboard/classes"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to add class schedule");
      setLoading(false);
    }
  };

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
            className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-4 sm:p-8 shadow-2xl mt-8 sm:mt-12 overflow-auto z-10"
          >
            <h1
              ref={titleRef}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-6 text-center"
            >
              Add New Class Schedule
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                <label htmlFor="className" className="block text-blue-900 font-medium mb-2">Class Name</label>
                <select
                  id="className"
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                >
                  <option value="">Select class</option>
                  {classOptions.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
                <label htmlFor="section" className="block text-blue-900 font-medium mb-2">Section</label>
                <select
                  id="section"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                >
                  <option value="">Select section</option>
                  {sectionOptions.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <label htmlFor="subject" className="block text-blue-900 font-medium mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  disabled={dropdownLoading}
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                >
                  <option value="">{dropdownLoading ? "Loading..." : "Select subject"}</option>
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
                <label htmlFor="teacher" className="block text-blue-900 font-medium mb-2">Teacher Name</label>
                <select
                  id="teacher"
                  name="teacher"
                  value={form.teacher}
                  onChange={handleChange}
                  required
                  disabled={dropdownLoading}
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                >
                  <option value="">{dropdownLoading ? "Loading..." : "Select teacher"}</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </motion.div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <label htmlFor="day" className="block text-blue-900 font-medium mb-2">Day(s) of Week</label>
                <select
                  id="day"
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  multiple
                  required
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base min-h-[80px]"
                  style={{ minHeight: "80px" }}
                >
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="text-xs text-blue-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple days</div>
              </motion.div>
              <div className="flex gap-4">
                <motion.div className="form-field flex-1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
                  <label htmlFor="startTime" className="block text-blue-900 font-medium mb-2">Start Time</label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                  />
                </motion.div>
                <motion.div className="form-field flex-1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                  <label htmlFor="endTime" className="block text-blue-900 font-medium mb-2">End Time</label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/60 border border-blue-200 text-blue-900 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base"
                  />
                </motion.div>
              </div>
              <motion.div className="form-field" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65, duration: 0.6 }}>
                <label htmlFor="description" className="block text-blue-900 font-medium mb-2">Description (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter a short description (optional)"
                  className="w-full bg-white/60 border border-blue-200 text-blue-900 placeholder-blue-400 focus:border-blue-400 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm sm:text-base min-h-[80px]"
                />
              </motion.div>
              <motion.button
                type="submit"
                disabled={loading}
                className="submit-btn w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Adding..." : "+ Add Class Schedule"}
              </motion.button>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                >
                  Class schedule added successfully!
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
          </motion.div>
        </main>
      </div>
    </div>
  );
}