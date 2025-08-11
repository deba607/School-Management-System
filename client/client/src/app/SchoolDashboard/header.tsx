"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface School {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  description?: string;
  pictures?: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>;
}

interface HeaderProps {
  school?: School;
  isTeacher?: boolean;
  displayName?: string;
  displayEmail?: string;
  displayId?: string;
}
import { useAuth } from "@/contexts/AuthContext";
import { useSchool } from "./school-context";

const Header = () => {
  // All hooks must be called unconditionally at the top level
  const imgRef = useRef(null);
  const { school, loading: schoolLoading, error: schoolError } = useSchool();
  const { user, isAuthenticated } = useAuth();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Initialize with default values
  const defaultValues = {
    displayName: 'Loading...',
    displayEmail: '',
    displayId: '',
    displayPic: 'https://ui-avatars.com/api/?name=U&background=4f46e5&color=fff'
  };

  // Calculate display values based on user role
  const displayValues = React.useMemo(() => {
    if (isLoading || (schoolLoading && !isTeacher)) {
      return defaultValues;
    }

    if (!isTeacher && (schoolError || !school)) {
      return {
        ...defaultValues,
        displayName: 'Error loading school',
        displayPic: 'https://ui-avatars.com/api/?name=E&background=ef4444&color=fff'
      };
    }

    try {
      if (isTeacher) {
        const displayName = user?.name || 'Teacher';
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f46e5&color=fff`;
        
        return {
          displayName,
          displayEmail: user?.email || '',
          displayId: user?.userId ? `ID: ${user.userId.substring(0, 8)}...` : '',
          displayPic: (user?.picture && !imageError) ? user.picture : fallbackAvatar
        };
      } else {
        const displayName = school?.name || 'School';
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f46e5&color=fff`;
        let displayPic = fallbackAvatar;
        
        if (school?.pictures?.[0]?.base64Data && !imageError) {
          try {
            displayPic = `data:${school.pictures[0].mimeType || 'image/jpeg'};base64,${school.pictures[0].base64Data}`;
          } catch (e) {
            console.error('Error processing image data:', e);
          }
        }
        
        return {
          displayName,
          displayEmail: school?.email || '',
          displayId: school?._id ? `School ID: ${school._id.substring(0, 8)}...` : '',
          displayPic
        };
      }
    } catch (error) {
      console.error('Error in display values calculation:', error);
      return defaultValues;
    }
  }, [isTeacher, user, school, imageError, isLoading, schoolLoading, schoolError]);

  // Handle image loading errors
  const handleImageError = React.useCallback(() => {
    setImageError(true);
  }, []);
  
  // Destructure display values
  const { displayName, displayEmail, displayId, displayPic } = displayValues;

  useEffect(() => {
    // Check if user is a teacher
    if (user?.role) {
      setIsTeacher(user.role.toLowerCase() === 'teacher');
    }
    
    // GSAP animation
    gsap.fromTo(
      imgRef.current,
      { rotate: -20, scale: 0.8 },
      { rotate: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    );
    
    // Set loading to false once we have the necessary data
    if (!schoolLoading || isAuthenticated) {
      setIsLoading(false);
    }
  }, [user, schoolLoading, isAuthenticated]);

  // Show loading state with skeleton
  if (isLoading || (schoolLoading && !isTeacher)) {
    return (
      <div className="w-full bg-white/60 backdrop-blur-md shadow-lg p-4 mb-6 rounded-b-2xl border-b border-blue-100">
        <div className="animate-pulse flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
      className="w-full flex flex-col sm:flex-row items-center justify-between bg-white/60 backdrop-blur-md shadow-lg p-4 sm:p-6 mb-6 rounded-b-2xl border-b border-blue-100 gap-4 sm:gap-0"
      style={{ boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.15)" }}
    >
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900">
          Welcome, {displayName}
          {isTeacher && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Teacher</span>}
        </h1>
        <p className="text-blue-700 font-medium text-sm sm:text-base">
          {displayEmail && `${displayEmail} • `}{displayId}
        </p>
        {!isTeacher && school?.address && (
          <p className="text-blue-600 text-xs sm:text-sm mt-1">{school.address}</p>
        )}
      </div>
      <div className="flex items-center justify-center">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-blue-400 shadow-lg overflow-hidden bg-blue-100 flex items-center justify-center"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
          >
            {displayPic && !displayPic.startsWith('data:') ? (
              <img
                ref={imgRef}
                src={displayPic}
                alt={isTeacher ? "Teacher Profile" : "School Logo"}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
          </motion.div>
          {isTeacher && (
            <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
              ✓
            </span>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
