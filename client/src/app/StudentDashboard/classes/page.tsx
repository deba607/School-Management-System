"use client";

import React, { useEffect, useState } from "react";
import { ClassScheduleService } from "@/services/classScheduleService";
import { getCurrentUser, authFetch } from "@/utils/auth";
import { IClassSchedule } from "@/types/classSchedule";
import { motion } from "framer-motion";

const ClassesPage = () => {
  const [classes, setClasses] = useState<IClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError("");
      try {
        const user = getCurrentUser();
        if (!user?.schoolId) {
          throw new Error("No schoolId found in user token");
        }

        // Fetch student details to get class and section
        const studentResponse = await authFetch('/api/student/me');
        if (!studentResponse.ok) {
          throw new Error('Failed to fetch student details');
        }
        const studentData = await studentResponse.json();
        if (!studentData.success || !studentData.data) {
          throw new Error(studentData.error || 'Failed to retrieve student data');
        }

        const { class: studentClass, sec: studentSection } = studentData.data;

        if (!studentClass || !studentSection) {
          throw new Error("Student class or section not found");
        }

        // Fetch class schedules using the new API endpoint
        const classSchedulesResponse = await authFetch(
          `/api/class-schedules/by-student?schoolId=${user.schoolId}&className=${studentClass}&section=${studentSection}`
        );

        if (!classSchedulesResponse.ok) {
          throw new Error('Failed to fetch class schedules');
        }
        const classSchedulesData = await classSchedulesResponse.json();

        const mapped = classSchedulesData.map((cls: any) => ({
          ...cls,
          _id: cls._id ? String(cls._id) : undefined,
          createdAt: cls.createdAt instanceof Date ? cls.createdAt.toISOString() : cls.createdAt,
          updatedAt: cls.updatedAt instanceof Date ? cls.updatedAt.toISOString() : cls.updatedAt,
        }));
        setClasses(mapped);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-blue-900 tracking-wide text-center sm:text-left">Classes</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-blue-700 font-medium">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 border border-red-100">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
          <p className="text-blue-700 text-center font-medium">No classes found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/80 shadow-xl rounded-2xl border border-blue-100">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Class</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Section</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Subject</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Teacher</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Days</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, idx) => (
                <motion.tr 
                  key={String(cls._id)} 
                  className="border-t border-blue-100 hover:bg-blue-50 transition-colors duration-150"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <td className="py-3 px-4 text-blue-800">{cls.className}</td>
                  <td className="py-3 px-4 text-blue-800">{cls.section}</td>
                  <td className="py-3 px-4 text-blue-800">{cls.subject}</td>
                  <td className="py-3 px-4 text-blue-800">{typeof cls.teacher === 'object' && cls.teacher !== null && 'name' in cls.teacher ? (cls.teacher as any).name : '-'}</td>
                  <td className="py-3 px-4 text-blue-800">{cls.day?.join(", ")}</td>
                  <td className="py-3 px-4 text-blue-800">{cls.startTime} - {cls.endTime}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;