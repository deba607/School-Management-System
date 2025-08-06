"use client";

import React, { useEffect, useState } from "react";
import { authFetch } from "@/utils/auth";
import { IEvent } from "@/types/event";

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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Events</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={String(event._id)} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-700 mb-1">{event.description}</p>
              <p className="text-gray-500 text-sm">Date: {event.date instanceof Date ? event.date.toLocaleDateString() : event.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsPage;