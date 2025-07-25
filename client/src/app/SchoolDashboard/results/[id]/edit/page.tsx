"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../../sidebar";
import Header from "../../../header";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter, useParams } from "next/navigation";

const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const sectionOptions = ["A", "B", "C", "D"];

const initialForm = {
  className: "",
  section: "",
  subject: "",
  teacher: "",
  date: "",
  students: [],
};

export default function EditResult() {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<{ _id: string; name: string; subject: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string; marks?: string; grade?: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

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
    async function fetchResult() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/results/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setForm({
            className: data.data.className || "",
            section: data.data.section || "",
            subject: data.data.subject || "",
            teacher: data.data.teacher || "",
            date: data.data.date || "",
            students: data.data.students || [],
          });
        } else {
          setError(data.error || "Failed to fetch result");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch result");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchResult();
  }, [id]);

  // Fetch subjects and teachers
  useEffect(() => {
    async function fetchSubjectsAndTeachers() {
      try {
        const res = await fetch("/api/teachers");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setTeachers(data.data.map((t: any) => ({ _id: t._id, name: t.name, subject: t.subject })));
          // Deduplicate subjects
          const subjectSet = new Set<string>();
          data.data.forEach((t: any) => {
            if (t.subject) subjectSet.add(t.subject);
          });
          setSubjects(Array.from(subjectSet));
        }
      } catch {}
    }
    fetchSubjectsAndTeachers();
  }, []);

  // Fetch students for class/section
  useEffect(() => {
    if (!form.className || !form.section) return;
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students?class=${form.className}&section=${form.section}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setStudents(data.data.map((s: any) => ({ id: s._id, name: s.name })));
        }
      } catch {}
    }
    fetchStudents();
  }, [form.className, form.section]);

  // Filter teachers for selected subject
  const filteredTeachers = form.subject
    ? teachers.filter(t => t.subject === form.subject)
    : teachers;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleStudentResult = (idx: number, field: string, value: string) => {
    setForm(prev => {
      const students = [...prev.students];
      students[idx][field] = value;
      return { ...prev, students };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/results/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update result");
      }
      setSuccess(true);
      setTimeout(() => router.push("/SchoolDashboard/results"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update result");
    } finally {
      setSaving(false);
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
              Edit Result
            </h1>
            {loading ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600 mb-4">{error}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <select
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    required
                    className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                  >
                    <option value="">Class</option>
                    {classOptions.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <select
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                    className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                  >
                    <option value="">Section</option>
                    {sectionOptions.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                >
                  <option value="">Subject</option>
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <select
                  name="teacher"
                  value={form.teacher || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                >
                  <option value="">Teacher</option>
                  {filteredTeachers.map(t => (
                    <option key={t._id} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                />
                <div className="space-y-2">
                  {form.students.length === 0 ? (
                    <div className="text-center text-blue-700">No students found for this class and section.</div>
                  ) : (
                    form.students.map((stu: any, idx: number) => (
                      <div key={stu.id} className="flex items-center gap-2">
                        <span className="flex-1 text-blue-900 font-medium">{stu.name}</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={stu.marks}
                          onChange={e => handleStudentResult(idx, "marks", e.target.value)}
                          placeholder="Marks"
                          className="w-16 px-2 py-1 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 text-xs"
                        />
                        <input
                          type="text"
                          value={stu.grade}
                          onChange={e => handleStudentResult(idx, "grade", e.target.value)}
                          placeholder="Grade"
                          className="w-12 px-2 py-1 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 text-xs"
                        />
                      </div>
                    ))
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={saving || form.students.length === 0}
                  className="submit-btn w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? "Saving..." : "Update Result"}
                </motion.button>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                  >
                    Result updated successfully!
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