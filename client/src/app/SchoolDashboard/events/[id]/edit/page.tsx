"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../../sidebar";
import Header from "../../../header";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";

const initialForm = { title: "", description: "", date: "" };

export default function EditEventPage() {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(containerRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(titleRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "elastic.out(1, 0.5)" });
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setForm({
            title: data.data.title || "",
            description: data.data.description || "",
            date: data.data.date || "",
          });
        } else {
          setError(data.error || "Failed to fetch event");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

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
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update event");
      }
      setSuccess(true);
      setTimeout(() => router.push("/SchoolDashboard/events"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update event");
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
              Edit Event
            </h1>
            {loading ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600 mb-4">{error}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? "Saving..." : "Update Event"}
                </motion.button>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                  >
                    Event updated successfully!
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