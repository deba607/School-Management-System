"use client";
import React, { useEffect, useState } from "react";
import { ClassScheduleService } from "@/services/classScheduleService";
import { getCurrentUser } from "@/utils/auth";
import { IClassSchedule } from "@/types/classSchedule";

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
        if (!user?.schoolId) throw new Error("No schoolId found in user token");
        const service = new ClassScheduleService();
        const data = await service.getClassSchedulesBySchool(user.schoolId);
        const mapped = data.map((cls) => ({
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Classes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4">Class</th>
                <th className="py-2 px-4">Section</th>
                <th className="py-2 px-4">Subject</th>
                <th className="py-2 px-4">Teacher</th>
                <th className="py-2 px-4">Days</th>
                <th className="py-2 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={String(cls._id)} className="border-t">
                  <td className="py-2 px-4">{cls.className}</td>
                  <td className="py-2 px-4">{cls.section}</td>
                  <td className="py-2 px-4">{cls.subject}</td>
                  <td className="py-2 px-4">{typeof cls.teacher === 'object' && cls.teacher !== null && 'name' in cls.teacher ? (cls.teacher as any).name : '-'}</td>
                  <td className="py-2 px-4">{cls.day?.join(", ")}</td>
                  <td className="py-2 px-4">{cls.startTime} - {cls.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassesPage; 