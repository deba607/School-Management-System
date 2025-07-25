"use client";
import React, { useEffect, useState } from "react";
import { AttendanceService } from "@/services/attendanceService";
import { getCurrentUser } from "@/utils/auth";
import { IAttendance, IAttendanceStudent } from "@/types/attendance";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<IAttendanceWithStudentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const user = getCurrentUser();
        if (!user?.schoolId || !user?.userId) throw new Error("No schoolId or userId found in user token");
        const service = new AttendanceService();
        const data = await service.getAttendanceBySchool(user.schoolId);
        // Filter for current student
        const filtered = data.map((rec) => ({
          ...rec,
          _id: rec._id ? String(rec._id) : undefined,
          date: rec.date,
          studentStatus: rec.students.find((s) => s.id === user.userId)
        })).filter((rec) => rec.studentStatus);
        setAttendance(filtered);
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Attendance</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4">Class</th>
                <th className="py-2 px-4">Section</th>
                <th className="py-2 px-4">Subject</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec) => (
                <tr key={String(rec._id)} className="border-t">
                  <td className="py-2 px-4">{rec.className}</td>
                  <td className="py-2 px-4">{rec.section}</td>
                  <td className="py-2 px-4">{rec.subject}</td>
                  <td className="py-2 px-4">{formatDate(rec.date)}</td>
                  <td className="py-2 px-4">{rec.studentStatus?.status}</td>
                </tr>
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