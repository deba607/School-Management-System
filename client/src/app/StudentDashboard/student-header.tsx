"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const student = {
  name: "Jane Student",
  class: "10-B",
  profilePic: "https://ui-avatars.com/api/?name=Jane+Student&background=0D8ABC&color=fff",
};

const StudentHeader = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { rotate: -20, scale: 0.8 },
      { rotate: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
      className="w-full flex flex-col sm:flex-row items-center justify-between bg-white/60 backdrop-blur-md shadow-lg p-4 sm:p-6 mb-6 rounded-b-2xl border-b border-blue-100 gap-4 sm:gap-0"
      style={{ boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.15)" }}
    >
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900">Welcome, {student.name}</h1>
        <p className="text-blue-700 font-medium text-sm sm:text-base">Class: {student.class}</p>
      </div>
      <div className="flex items-center justify-center">
        <motion.img
          ref={imgRef}
          src={student.profilePic}
          alt="Profile"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-blue-400 shadow-lg"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
        />
      </div>
    </motion.header>
  );
};

export default StudentHeader;
