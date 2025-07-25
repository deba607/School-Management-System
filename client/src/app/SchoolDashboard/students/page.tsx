"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Student {
  _id: string;
  name: string;
  email: string;
  class: string;
  sec: string;
  address?: string;
  pictures?: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const router = useRouter();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.data || []);
        setFiltered(data.data || []);
      } else {
        setError(data.error || "Failed to fetch students");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(students);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        students.filter(
          t =>
            t.name.toLowerCase().includes(s) ||
            t.class.toLowerCase().includes(s) ||
            t.sec.toLowerCase().includes(s) ||
            t.email.toLowerCase().includes(s)
        )
      );
    }
  }, [search, students]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStudents(prev => prev.filter(t => t._id !== id));
      } else {
        alert(data.error || "Failed to delete student");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete student");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/SchoolDashboard/students/${id}/edit`);
  };

  return (
    <div className="flex h-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl font-bold text-blue-900">Students</h1>
              <button
                onClick={fetchStudents}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
              >
                Fetch Students
              </button>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, class, section, or email"
                className="w-full sm:w-80 px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/70 text-blue-900"
              />
            </div>
            {loading ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-blue-700">No students found.</div>
            ) : (
              <div className="space-y-4">
                {filtered.map(student => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 rounded-xl shadow p-4 border border-blue-100"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={student.pictures && student.pictures[0] ? student.pictures[0].base64Data : "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.name)}
                        alt={student.name}
                        className="w-16 h-16 rounded-full border-2 border-blue-300 object-cover bg-white"
                      />
                      <div>
                        <div className="font-bold text-blue-900 text-lg">{student.name}</div>
                        <div className="text-blue-700 text-sm">Class: {student.class} | Section: {student.sec}</div>
                        <div className="text-blue-500 text-xs">{student.email}</div>
                        <div className="text-blue-400 text-xs">{student.address || 'No address provided'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        className="px-3 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                        onClick={() => setViewStudent(student)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                        onClick={() => handleEdit(student._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {viewStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
                  <button
                    className="absolute top-2 right-2 text-blue-700 text-xl font-bold"
                    onClick={() => setViewStudent(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={viewStudent.pictures && viewStudent.pictures[0] ? viewStudent.pictures[0].base64Data : "https://ui-avatars.com/api/?name=" + encodeURIComponent(viewStudent.name)}
                      alt={viewStudent.name}
                      className="w-20 h-20 rounded-full border-2 border-blue-300 object-cover bg-white"
                    />
                    <div className="text-center">
                      <div className="font-bold text-blue-900 text-xl mb-1">{viewStudent.name}</div>
                      <div className="text-blue-700 text-base mb-1">Class: {viewStudent.class} | Section: {viewStudent.sec}</div>
                      <div className="text-blue-500 text-sm mb-1">{viewStudent.email}</div>
                      <div className="text-blue-400 text-xs mb-1">{viewStudent.address || 'No address provided'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 