"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const overviewData = [
  { label: "Total Classes", value: 8 },
  { label: "Attendance", value: "97%" },
  { label: "Upcoming Events", value: 2 },
  { label: "Results", value: "A" },
];

const StudentHome = () => {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

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
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-blue-900 tracking-wide text-center sm:text-left">Student Overview</h2>
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

export default StudentHome;
