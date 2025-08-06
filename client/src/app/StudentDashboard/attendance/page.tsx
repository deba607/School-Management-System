"use client";

import React, { useEffect, useState } from "react";
import { authFetch } from "@/utils/auth";
import { IAttendance, IAttendanceStudent } from "@/types/attendance";
import { motion } from "framer-motion";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<IAttendanceWithStudentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        // Use the new API endpoint
        const response = await authFetch('/api/attendance/by-student');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch attendance');
        }
        const data = await response.json();
        setAttendance(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  function formatDate(date: string | Date | undefined) {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (Object.prototype.toString.call(date) === '[object Date]') return (date as Date).toLocaleDateString();
    return String(date);
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-blue-900 tracking-wide text-center sm:text-left">Attendance</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-blue-700 font-medium">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 border border-red-100">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      ) : attendance.length === 0 ? (
        <div className="bg-white/80 shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-100">
          <p className="text-blue-700 text-center font-medium">No attendance records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/80 shadow-xl rounded-2xl border border-blue-100">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Class</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Section</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Subject</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Date</th>
                <th className="py-3 px-4 text-blue-900 font-semibold text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec, idx) => (
                <motion.tr 
                  key={String(rec._id)} 
                  className="border-t border-blue-100 hover:bg-blue-50 transition-colors duration-150"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <td className="py-3 px-4 text-blue-800">{rec.className}</td>
                  <td className="py-3 px-4 text-blue-800">{rec.section}</td>
                  <td className="py-3 px-4 text-blue-800">{rec.subject}</td>
                  <td className="py-3 px-4 text-blue-800">{formatDate(rec.date)}</td>
                  <td className="py-3 px-4 text-blue-800 font-medium">{rec.studentStatus?.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Add type definition for attendance with studentStatus
interface IAttendanceWithStudentStatus extends IAttendance {
  studentStatus?: IAttendanceStudent;
}

export default AttendancePage;