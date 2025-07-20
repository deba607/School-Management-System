'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import gsap from 'gsap';

const stats = [
  { label: 'Total Students', value: 1240 },
  { label: 'Active Courses', value: 32 },
  { label: 'Teachers', value: 58 },
  { label: 'Attendance Today', value: '97%' },
];

export default function AdminHome() {
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true });
  const controls = useAnimation();

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
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="rounded-xl bg-gradient-to-br from-purple-700/80 to-blue-700/80 p-6 shadow-lg text-white flex flex-col items-center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
          >
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm opacity-80">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated Chart Placeholder */}
      <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Attendance Overview</h2>
        <div ref={chartRef} className="flex items-end gap-4 h-40">
          {[80, 90, 97, 85, 92, 88, 95].map((val, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="bar w-6 rounded-t bg-gradient-to-b from-purple-500 to-blue-500"
                style={{ height: `${val}%`, minHeight: 10 }}
              ></div>
              <span className="text-xs text-slate-300 mt-2">Day {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
