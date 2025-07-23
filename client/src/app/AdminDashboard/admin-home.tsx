'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import gsap from 'gsap';
import { useState } from 'react';

export default function AdminHome() {
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true });
  const controls = useAnimation();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    schools: 0,
    admins: 0,
    attendanceToday: null as null | number,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const [studentsRes, teachersRes, schoolsRes, adminsRes, attendanceRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/teachers'),
          fetch('/api/schools'),
          fetch('/api/admins'),
          fetch('/api/attendance'),
        ]);
        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();
        const schoolsData = await schoolsRes.json();
        const adminsData = await adminsRes.json();
        const attendanceData = await attendanceRes.json();
        // Calculate today's attendance percentage
        let attendanceToday = null;
        if (attendanceData.success && Array.isArray(attendanceData.data)) {
          const today = new Date().toISOString().slice(0, 10);
          const todayRecords = attendanceData.data.filter((a: any) => a.date && a.date.slice(0, 10) === today);
          const total = todayRecords.length;
          const present = todayRecords.reduce((acc: number, a: any) => acc + (a.presentCount || 0), 0);
          const possible = todayRecords.reduce((acc: number, a: any) => acc + (a.totalCount || 0), 0);
          attendanceToday = possible > 0 ? Math.round((present / possible) * 100) : null;
        }
        setStats({
          students: studentsData.data?.length || 0,
          teachers: teachersData.data?.length || 0,
          schools: schoolsData.data?.length || 0,
          admins: adminsData.data?.length || 0,
          attendanceToday,
        });
      } catch (err: any) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (isInView && chartRef.current) {
      gsap.fromTo(
        chartRef.current.querySelectorAll('.bar'),
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [isInView]);

  if (loading) {
    return <div className="text-center text-white py-12 text-lg">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 py-12 text-lg">{error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
          },
        }}
      >
        <motion.div
          className="rounded-xl bg-gradient-to-br from-purple-700/80 to-blue-700/80 p-6 shadow-lg text-white flex flex-col items-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <div className="text-3xl font-bold mb-2">{stats.students}</div>
          <div className="text-sm opacity-80">Total Students</div>
        </motion.div>
        <motion.div
          className="rounded-xl bg-gradient-to-br from-purple-700/80 to-blue-700/80 p-6 shadow-lg text-white flex flex-col items-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <div className="text-3xl font-bold mb-2">{stats.teachers}</div>
          <div className="text-sm opacity-80">Teachers</div>
        </motion.div>
        <motion.div
          className="rounded-xl bg-gradient-to-br from-purple-700/80 to-blue-700/80 p-6 shadow-lg text-white flex flex-col items-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <div className="text-3xl font-bold mb-2">{stats.schools}</div>
          <div className="text-sm opacity-80">Schools</div>
        </motion.div>
        <motion.div
          className="rounded-xl bg-gradient-to-br from-purple-700/80 to-blue-700/80 p-6 shadow-lg text-white flex flex-col items-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <div className="text-3xl font-bold mb-2">{stats.admins}</div>
          <div className="text-sm opacity-80">Admins</div>
        </motion.div>
      </motion.div>
      <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Attendance Overview</h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-white text-xl font-bold">
            Today's Attendance:{' '}
            {stats.attendanceToday !== null ? (
              <span className="text-green-400">{stats.attendanceToday}%</span>
            ) : (
              <span className="text-slate-400">N/A</span>
            )}
          </div>
        </div>
        {/* Optionally, you can add a real chart here if you have more attendance data */}
      </div>
    </div>
  );
}
