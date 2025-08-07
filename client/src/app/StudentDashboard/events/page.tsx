"use client";

import React, { useEffect, useState } from "react";
import { authFetch } from "@/utils/auth";
import { IEvent } from "@/types/event";
import { motion } from "framer-motion";
import StudentDashboardLayout from "../StudentDashboardLayout";

const EventsPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        // Use the API endpoint instead of the service
        const response = await authFetch('/api/events');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <StudentDashboardLayout>
      <div className="p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-blue-900 tracking-wide text-center sm:text-left">Events</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-blue-700 font-medium">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 border border-red-100">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
            <p className="text-blue-700 text-center font-medium">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event, idx) => (
              <motion.div
                key={String(event._id)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx, type: "spring", stiffness: 90 }}
                className="bg-white/80 shadow-xl rounded-2xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-xl font-bold mb-3 text-blue-900">{event.title}</h2>
                <p className="text-blue-800 mb-3">{event.description}</p>
                <p className="text-blue-600 text-sm font-medium">Date: {event.date instanceof Date ? event.date.toLocaleDateString() : event.date}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default EventsPage;