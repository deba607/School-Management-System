"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface StudentData {
  _id: string;
  name: string;
  email: string;
  class: string;
  sec: string;
  address: string;
  pictures?: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
  createdAt: string;
  updatedAt: string;
  schoolId: string;
}

interface StudentHeaderProps {
  studentData: StudentData | null;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({ studentData }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { rotate: -20, scale: 0.8 },
      { rotate: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  // Generate profile picture URL or use the first picture from student data
  // Update the getProfilePicture function to properly handle the base64 data
  const getProfilePicture = () => {
    if (studentData?.pictures && studentData.pictures.length > 0 && studentData.pictures[0].base64Data) {
      // Make sure the base64 string doesn't already have the data URL prefix
      const base64Data = studentData.pictures[0].base64Data.startsWith('data:') 
        ? studentData.pictures[0].base64Data 
        : `data:${studentData.pictures[0].mimeType};base64,${studentData.pictures[0].base64Data}`;
      return base64Data;
    }
    const name = studentData?.name || 'Student';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
      className="w-full flex flex-col sm:flex-row items-center justify-between bg-white/60 backdrop-blur-md shadow-lg p-4 sm:p-6 mb-6 rounded-b-2xl border-b border-blue-100 gap-4 sm:gap-0"
      style={{ boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.15)" }}
    >
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900">Welcome, {studentData?.name || 'Student'}</h1>
        <p className="text-blue-700 font-medium text-sm sm:text-base">Class: {studentData?.class || ''}-{studentData?.sec || ''}</p>
        <p className="text-blue-600 font-medium text-xs sm:text-sm">{studentData?.email || ''}</p>
      </div>
      <div className="flex items-center justify-center">
        <motion.img
          ref={imgRef}
          src={getProfilePicture()}
          alt={studentData?.name || 'Profile'}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-blue-400 shadow-lg object-cover"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
        />
      </div>
    </motion.header>
  );
};

export default StudentHeader;
