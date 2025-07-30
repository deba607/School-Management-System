"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";
import { jwtDecode } from "jwt-decode";
import { useSchool } from "../school-context";

export default function EventsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { schoolId } = useSchool();

  useEffect(() => {
    gsap.fromTo(containerRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(titleRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "elastic.out(1, 0.5)" });
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use authFetch instead of fetch
      const res = await window.authFetch(`/api/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      } else {
        setError(data.error || "Failed to fetch events");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    try {
      // Use authFetch instead of fetch
      const res = await window.authFetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.filter(e => e._id !== id));
      } else {
        alert(data.error || "Failed to delete event");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };
  const handleEdit = (id: string) => {
    router.push(`/SchoolDashboard/events/${id}/edit`);
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
            className="relative w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 p-2 sm:p-6 shadow-2xl mt-4 sm:mt-8 overflow-auto z-10"
          >
            <h1
              ref={titleRef}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-8 text-center"
            >
              Events Management
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <button
                onClick={fetchEvents}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
              >
                Fetch Events
              </button>
              <button
                onClick={() => router.push("/SchoolDashboard/events/add")}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow"
              >
                + Add Event
              </button>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or description"
                className="w-full sm:w-80 px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/70 text-blue-900"
              />
            </div>
            {loading ? (
              <div className="text-center text-blue-700">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600 mb-4">{error}</div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="text-center text-blue-700">No events found.</div>
                ) : (
                  filteredEvents.map((event, idx) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx, type: "spring", stiffness: 90 }}
                      className="bg-white/90 rounded-xl shadow-lg p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-lg font-bold text-blue-900 mb-1">{event.title}</div>
                        <div className="text-blue-700 text-sm mb-1">{event.description}</div>
                        <div className="text-xs text-blue-500">{event.date}</div>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                          onClick={() => handleEdit(event._id)}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-3 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:bg-red-300"
                          onClick={() => handleDelete(event._id)}
                          disabled={deletingId === event._id}
                        >
                          {deletingId === event._id ? "Deleting..." : "Delete"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
