"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "@/utils/auth";
import Header from "../header";
import Sidebar from "../sidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  subject: string;
  address?: string;
  pictures?: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
}

export default function TeachersPage() {
  // Get user role from token
  let userRole: string | null = null;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('school_management_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        userRole = decoded.role?.toLowerCase() || null;
      } catch {}
    }
  }
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);
  const router = useRouter();

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/teachers");
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data || []);
        setFiltered(data.data || []);
      } else {
        setError(data.error || "Failed to fetch teachers");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(teachers);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        teachers.filter(
          t =>
            t.name.toLowerCase().includes(s) ||
            t.subject.toLowerCase().includes(s) ||
            t.email.toLowerCase().includes(s)
        )
      );
    }
  }, [search, teachers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await authFetch(`/api/teachers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTeachers(prev => prev.filter(t => t._id !== id));
      } else {
        alert(data.error || "Failed to delete teacher");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete teacher");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/SchoolDashboard/teachers/${id}/edit`);
  };

  return (
    <div className="flex h-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl font-bold text-blue-900">Teachers</h1>
              <button
                onClick={fetchTeachers}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
              >
                Fetch Teachers
              </button>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, subject, or email"
                className="w-full sm:w-80 px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/70 text-blue-900"
              />
            </div>
            {loading ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-blue-700">No teachers found.</div>
            ) : (
              <div className="space-y-4">
                {filtered.map(teacher => (
                  <motion.div
                    key={teacher._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 rounded-xl shadow p-4 border border-blue-100"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-16 h-16">
                        <Image
                          src={teacher.pictures && teacher.pictures[0] ? teacher.pictures[0].base64Data : "https://ui-avatars.com/api/?name=" + encodeURIComponent(teacher.name)}
                          alt={teacher.name}
                          className="rounded-full border-2 border-blue-300 object-cover bg-white"
                          fill
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-blue-900 text-lg">{teacher.name}</div>
                        <div className="text-blue-700 text-sm">{teacher.subject}</div>
                        <div className="text-blue-500 text-xs">{teacher.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        className="px-3 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                        onClick={() => setViewTeacher(teacher)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                        onClick={() => handleEdit(teacher._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                        onClick={() => handleDelete(teacher._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {viewTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-blue-700 text-xl font-bold"
              onClick={() => setViewTeacher(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={viewTeacher.pictures && viewTeacher.pictures[0] ? viewTeacher.pictures[0].base64Data : "https://ui-avatars.com/api/?name=" + encodeURIComponent(viewTeacher.name)}
                  alt={viewTeacher.name}
                  className="rounded-full border-2 border-blue-300 object-cover bg-white"
                  fill
                  sizes="80px"
                />
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-900 text-xl mb-1">{viewTeacher.name}</div>
                <div className="text-blue-700 text-base mb-1">{viewTeacher.subject}</div>
                <div className="text-blue-500 text-sm mb-1">{viewTeacher.email}</div>
                {['teacher', 'school'].includes(userRole || '') ? (
                  <div className="text-blue-400 text-xs mb-1">{viewTeacher.address || 'No address provided'}</div>
                ) : (
                  <div className="text-red-400 text-xs mb-1">Insufficient permissions to view address</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 