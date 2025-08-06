"use client";

import React, { useEffect, useState } from "react";
import { authFetch } from "@/utils/auth";
import { IResult, IResultStudent } from "@/types/result";

const ResultsPage = () => {
  const [results, setResults] = useState<IResultWithStudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        // Use the new API endpoint
        const response = await authFetch('/api/results/by-student');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch results');
        }
        const data = await response.json();
        setResults(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  function formatDate(date: string | Date | undefined) {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (Object.prototype.toString.call(date) === '[object Date]') return (date as Date).toLocaleDateString();
    return String(date);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4">Class</th>
                <th className="py-2 px-4">Section</th>
                <th className="py-2 px-4">Subject</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Marks</th>
                <th className="py-2 px-4">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((rec) => (
                <tr key={String(rec._id)} className="border-t">
                  <td className="py-2 px-4">{rec.className}</td>
                  <td className="py-2 px-4">{rec.section}</td>
                  <td className="py-2 px-4">{rec.subject}</td>
                  <td className="py-2 px-4">{formatDate(rec.date)}</td>
                  <td className="py-2 px-4">{rec.studentResult?.marks}</td>
                  <td className="py-2 px-4">{rec.studentResult?.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Add type definition for result with studentResult
interface IResultWithStudentResult extends IResult {
  studentResult?: IResultStudent;
}

export default ResultsPage;