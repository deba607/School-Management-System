"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import ClassesCalendar from "./calendar";
import { authFetch } from "@/utils/authFetch";

const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));
const sectionOptions = ["A", "B", "C", "D"];

export default function ClassesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [classSchedules, setClassSchedules] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize animations
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
    
    // Initialize authFetch
    const { initializeAuthFetch } = require('@/utils/authFetch');
    initializeAuthFetch();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/class-schedules");
      const data = await res.json();
      if (data.success) {
        setClassSchedules(data.data || []);
        setFiltered(data.data || []);
      } else {
        setError(data.error || "Failed to fetch classes");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    let filteredList = classSchedules;
    if (searchClass) {
      filteredList = filteredList.filter((c) => c.className === searchClass);
    }
    if (searchSection) {
      filteredList = filteredList.filter((c) => c.section === searchSection);
    }
    setFiltered(filteredList);
  }, [searchClass, searchSection, classSchedules]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class schedule?")) return;
    setDeletingId(id);
    try {
      const res = await authFetch(`/api/class-schedules/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setClassSchedules(prev => prev.filter(s => s._id !== id));
      } else {
        alert(data.error || "Failed to delete class schedule");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete class schedule");
    } finally {
      setDeletingId(null);
    }
  };
  const handleEdit = (id: string) => {
    router.push(`/SchoolDashboard/classes/${id}/edit`);
  };

  return (
    <div className="flex h-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center py-12 px-2 overflow-auto h-full">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-4 sm:p-8 shadow-2xl mt-8 sm:mt-12 overflow-auto z-10"
          >
            <h1
              ref={titleRef}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-6 text-center"
            >
              Classes Management
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex gap-2">
                <button
                  onClick={fetchClasses}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
                >
                  Fetch Classes
                </button>
                <button
                  onClick={() => router.push("/SchoolDashboard/classes/add")}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow"
                >
                  + Add New Class Scheduler
                </button>
              </div>
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
              <div className="text-center text-blue-700">Please select both a class and section to view schedules and calendar.</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-blue-700">No class schedules found for the selected class and section.</div>
            ) : (
              <>
                <div className="space-y-4">
                  {filtered.map((cls, idx) => (
                    <motion.div
                      key={cls._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white/90 rounded-xl shadow p-4 border border-blue-100 flex flex-col gap-2"
                    >
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="font-bold text-blue-900 text-lg">Class {cls.className} - Section {cls.section}</div>
                        <div className="text-blue-700 text-sm">Subject: {cls.subject}</div>
                        <div className="text-blue-700 text-sm">Teacher: {cls.teacherName || cls.teacher}</div>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center text-blue-500 text-xs">
                        <div>Days: {Array.isArray(cls.day) ? cls.day.join(", ") : cls.day}</div>
                        <div>Time: {cls.startTime} - {cls.endTime}</div>
                      </div>
                      {cls.description && <div className="text-blue-400 text-xs mt-1">{cls.description}</div>}
                      <div className="flex gap-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                          onClick={() => handleEdit(cls._id)}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:bg-red-300"
                          onClick={() => handleDelete(cls._id)}
                          disabled={deletingId === cls._id}
                        >
                          {deletingId === cls._id ? "Deleting..." : "Delete"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <ClassesCalendar
                  classSchedules={classSchedules}
                  className={searchClass}
                  section={searchSection}
                />
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}