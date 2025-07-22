"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const initialEventForm = {
  title: "",
  description: "",
  date: "",
};

export default function EventsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(false);

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

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events");
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

  const openModal = () => {
    setEventForm({ ...initialEventForm });
    setShowModal(true);
    setError(null);
    setSuccess(false);
  };
  const closeModal = () => {
    setShowModal(false);
    setEventForm(initialEventForm);
    setError(null);
    setSuccess(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      if (!res.ok) {
        let errMsg = "Failed to add event";
        try { const data = await res.json(); errMsg = data.error || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to add event");
      setSuccess(true);
      setTimeout(() => {
        closeModal();
        fetchEvents();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to add event");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    try {
      // TODO: Replace with real API call
      // await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter events by search
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
  );

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
                onClick={openModal}
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
                        {/* Edit functionality can be added here */}
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
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative border border-blue-200"
                >
                  <button
                    className="absolute top-2 right-2 text-blue-700 text-xl font-bold"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">Add New Event</h2>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={eventForm.title}
                      onChange={handleChange}
                      required
                      placeholder="Event Title"
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                    />
                    <textarea
                      name="description"
                      value={eventForm.description}
                      onChange={handleChange}
                      required
                      placeholder="Event Description"
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                    />
                    <input
                      type="date"
                      name="date"
                      value={eventForm.date}
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
                      {saving ? "Saving..." : "Add Event"}
                    </motion.button>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                      >
                        Event added successfully!
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
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
} 