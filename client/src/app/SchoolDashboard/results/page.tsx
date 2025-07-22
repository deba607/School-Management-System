"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const sectionOptions = ["A", "B", "C", "D"];

export default function ResultsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<{ _id: string; name: string; subject: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [resultForm, setResultForm] = useState({
    className: "",
    section: "",
    subject: "",
    teacher: "",
    date: "",
    students: [] as any[], // { id, name, marks, grade }
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/results");
      const data = await res.json();
      if (data.success) {
        setResultsData(data.data || []);
        setFiltered(data.data || []);
      } else {
        setError(data.error || "Failed to fetch results");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    let filteredList = resultsData;
    if (searchClass) {
      filteredList = filteredList.filter((r) => r.className === searchClass);
    }
    if (searchSection) {
      filteredList = filteredList.filter((r) => r.section === searchSection);
    }
    setFiltered(filteredList);
  }, [searchClass, searchSection, resultsData]);

  // Fetch subjects and teachers when modal opens or class/section changes
  useEffect(() => {
    if (!showModal) return;
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
  }, [showModal, resultForm.className, resultForm.section]);

  // Fetch students for class/section
  useEffect(() => {
    if (!showModal || !resultForm.className || !resultForm.section) return;
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students?class=${resultForm.className}&section=${resultForm.section}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setStudents(data.data.map((s: any) => ({ id: s._id, name: s.name })));
          setResultForm((prev) => ({ ...prev, students: data.data.map((s: any) => ({ id: s._id, name: s.name, marks: "", grade: "" })) }));
        }
      } catch {}
    }
    fetchStudents();
  }, [showModal, resultForm.className, resultForm.section]);

  // Filter teachers for selected subject
  const filteredTeachers = resultForm.subject
    ? teachers.filter(t => t.subject === resultForm.subject)
    : teachers;

  const openModal = () => {
    if (!searchClass || !searchSection) return;
    setResultForm({
      className: searchClass,
      section: searchSection,
      subject: "",
      teacher: "",
      date: new Date().toISOString().slice(0, 10),
      students: [],
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };
  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setResultForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleStudentResult = (idx: number, field: string, value: string) => {
    setResultForm((prev) => {
      const students: any[] = [...prev.students];
      students[idx][field] = value;
      return { ...prev, students };
    });
  };
  const handleResultSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save result");
      setSaving(false);
      setShowModal(false);
      fetchResults();
    } catch (err: any) {
      setFormError(err.message || "Failed to save result");
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setResultsData(prev => prev.filter(r => r._id !== id));
      } else {
        alert(data.error || "Failed to delete result");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete result");
    } finally {
      setDeletingId(null);
    }
  };
  const handleEdit = (id: string) => {
    router.push(`/SchoolDashboard/results/${id}/edit`);
  };

  return (
    <div className="flex h-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center py-8 px-2 overflow-auto h-full">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-2 sm:p-6 shadow-2xl mt-4 sm:mt-8 overflow-auto z-10"
          >
            <h1
              ref={titleRef}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-8 text-center"
            >
              Results Management
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <button
                onClick={fetchResults}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
              >
                Fetch Results
              </button>
              <button
                onClick={openModal}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow"
              >
                + Add Result
              </button>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={searchClass}
                  onChange={e => setSearchClass(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/70 text-blue-900"
                >
                  <option value="">All Classes</option>
                  {classOptions.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <select
                  value={searchSection}
                  onChange={e => setSearchSection(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/70 text-blue-900"
                >
                  <option value="">All Sections</option>
                  {sectionOptions.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (!searchClass || !searchSection) ? (
              <div className="text-center text-blue-700">Please select both a class and section to view results.</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-blue-700">No results found for the selected class and section.</div>
            ) : (
              <div className="space-y-4">
                {filtered.map((record, idx) => (
                  <motion.div
                    key={record._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/90 rounded-xl shadow p-4 border border-blue-100 flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="font-bold text-blue-900 text-lg">{record.subject} ({record.teacher || record.teacherName})</div>
                      <div className="text-blue-700 text-sm">Date: {record.date}</div>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center text-blue-500 text-xs">
                      <div>Class: {record.className} - Section: {record.section}</div>
                    </div>
                    <div className="mt-2">
                      <div className="font-semibold text-blue-800 text-xs mb-1">Students:</div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                        {record.students && record.students.map((stu: any) => (
                          <li key={stu.id} className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-blue-900">{stu.name}</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{stu.marks} {stu.grade && `(${stu.grade})`}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                        onClick={() => handleEdit(record._id)}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:bg-red-300"
                        onClick={() => handleDelete(record._id)}
                        disabled={deletingId === record._id}
                      >
                        {deletingId === record._id ? "Deleting..." : "Delete"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative"
              >
                <button
                  className="absolute top-2 right-2 text-blue-700 text-xl font-bold"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">Add Result</h2>
                <form onSubmit={handleResultSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      name="className"
                      value={resultForm.className}
                      onChange={handleFormChange}
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
                      value={resultForm.section}
                      onChange={handleFormChange}
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
                    value={resultForm.subject}
                    onChange={handleFormChange}
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
                    value={resultForm.teacher || ""}
                    onChange={handleFormChange}
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
                    value={resultForm.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                  />
                  <div className="space-y-2">
                    {resultForm.students.length === 0 ? (
                      <div className="text-center text-blue-700">No students found for this class and section.</div>
                    ) : (
                      resultForm.students.map((stu: any, idx: number) => (
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
                  <button
                    type="submit"
                    disabled={saving || resultForm.students.length === 0}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                  >
                    {saving ? "Saving..." : "Submit Result"}
                  </button>
                  {formError && <div className="text-center text-red-600 text-sm mt-2">{formError}</div>}
                </form>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
} 