"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Home from "./home";
import { motion } from "framer-motion";

const SchoolDashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Home />
        </main>
      </div>
    </motion.div>
  );
};

export default SchoolDashboardPage;
