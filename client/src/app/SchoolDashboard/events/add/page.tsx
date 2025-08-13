"use client";
import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../../sidebar";
import Header from "../../header";
import { useRouter } from "next/navigation";
import { useSchool } from "../../school-context";
import { authFetch } from "@/utils/authFetch";
import { isAuthenticated } from "@/utils/auth";

const initialForm = { title: "", description: "", date: "" };

export default function AddEventPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [schoolId, setSchoolId] = useState('');
  const { schoolId: contextSchoolId, loading: schoolLoading, error: schoolError } = useSchool();

  // Auth guard: redirect if missing/expired token
  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Session expired. Please log in again.');
      router.push('/Login');
      return;
    }
  }, [router]);

  useEffect(() => {
    // Set schoolId from context
    if (contextSchoolId) {
      console.log('Setting schoolId from context:', contextSchoolId);
      setSchoolId(contextSchoolId);
    } else if (!schoolLoading && !contextSchoolId) {
      console.error('No schoolId available in context after loading');
      setError('School information not available. Please try logging in again.');
    }
  }, [contextSchoolId, schoolLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const formData: any = {
        ...form,
        schoolId,
      };
      const res = await authFetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        let errMsg = "Failed to add event";
        try { const data = await res.json(); errMsg = data.error || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to add event");
      setSuccess(true);
      setTimeout(() => router.push("/SchoolDashboard/events"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to add event");
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
          <div
            ref={containerRef}
            className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-4 sm:p-8 shadow-2xl mt-8 sm:mt-12 overflow-auto z-10"
          >
            <h1
              ref={titleRef}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-6 text-center"
            >
              Add New Event
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Event Title"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Event Description"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
              >
                {saving ? "Saving..." : "Add Event"}
              </button>
              {success && (
                <div
                  className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                >
                  Event added successfully!
                </div>
              )}
              {error && (
                <div
                  className="mt-4 p-3 rounded-lg bg-red-100 text-red-800 text-center font-semibold"
                >
                  {error}
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 