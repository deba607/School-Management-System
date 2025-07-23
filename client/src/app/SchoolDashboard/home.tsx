"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    classes: 0,
    attendanceToday: null as null | number,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    cardRefs.current.forEach((ref, idx) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { boxShadow: "0 0 0px #0000" },
          {
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)",
            duration: 1.2,
            delay: 0.2 * idx,
            ease: "power2.out",
            repeat: 1,
            yoyo: true,
          }
        );
      }
    });
  }, [stats]);

  useEffect(() => {
    async function fetchStats() {
      setStats(s => ({ ...s, loading: true, error: null }));
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) throw new Error('No token');
        // No need to decode schoolId or fetch teacher for schoolId
        // Fetch all in parallel without schoolId
        const [teachersRes, studentsRes, classesRes, attendanceRes] = await Promise.all([
          fetch(`/api/teachers`),
          fetch(`/api/students`),
          fetch(`/api/class-schedules`),
          fetch(`/api/attendance`),
        ]);
        const teachersData = await teachersRes.json();
        const studentsData = await studentsRes.json();
        const classesData = await classesRes.json();
        const attendanceData = await attendanceRes.json();
        // Calculate today's attendance percentage
        let attendanceToday = null;
        if (attendanceData.success && Array.isArray(attendanceData.data)) {
          const today = new Date().toISOString().slice(0, 10);
          const todayRecords = attendanceData.data.filter((a: any) => a.date && a.date.slice(0, 10) === today);
          const present = todayRecords.reduce((acc: number, a: any) => acc + (a.students?.filter((s: any) => s.status === 'Present').length || 0), 0);
          const possible = todayRecords.reduce((acc: number, a: any) => acc + (a.students?.length || 0), 0);
          attendanceToday = possible > 0 ? Math.round((present / possible) * 100) : null;
        }
        setStats({
          teachers: teachersData.data?.length || 0,
          students: studentsData.data?.length || 0,
          classes: classesData.data?.length || 0,
          attendanceToday,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setStats(s => ({ ...s, loading: false, error: err.message || 'Failed to fetch data' }));
      }
    }
    fetchStats();
  }, []);

  const overviewData = [
    { label: "Total Teachers", value: stats.loading ? '...' : stats.teachers },
    { label: "Total Students", value: stats.loading ? '...' : stats.students },
    { label: "Total Classes", value: stats.loading ? '...' : stats.classes },
    { label: "Today's Attendance", value: stats.loading ? '...' : (stats.attendanceToday !== null ? `${stats.attendanceToday}%` : 'N/A') },
  ];

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-blue-900 tracking-wide text-center sm:text-left">School Overview</h2>
      {stats.error && <div className="text-red-600 mb-4">{stats.error}</div>}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {overviewData.map((item, idx) => (
          <motion.div
            key={item.label}
            ref={(el: HTMLDivElement | null) => { cardRefs.current[idx] = el; }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * idx, type: "spring", stiffness: 90 }}
            className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center border border-blue-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300 min-h-[120px] sm:min-h-[160px]"
            whileHover={{ scale: 1.08 }}
          >
            <span className="text-base sm:text-lg text-blue-700 mb-2 font-semibold text-center">{item.label}</span>
            <span className="text-2xl sm:text-4xl font-extrabold text-blue-900 drop-shadow-lg">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
