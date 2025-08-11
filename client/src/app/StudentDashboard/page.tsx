"use client";

import React from "react";
import StudentHome from "./student-home";
import StudentDashboardLayout from "./StudentDashboardLayout";

const StudentDashboardPage = () => {
  return (
    <StudentDashboardLayout>
      <StudentHome />
    </StudentDashboardLayout>
  );
};

export default StudentDashboardPage;
