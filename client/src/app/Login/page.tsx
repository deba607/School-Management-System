"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const roles = ["Admin", "Student", "Teacher"];

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [role, setRole] = useState(roles[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState(false);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(containerRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(titleRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, delay: 0.2, ease: "power3.out" });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Login failed");
      if (data.otpSent) {
        setOtpStep(true);
        setUserId(data.userId);
      } else {
        if (role === "Admin") router.push("/SchoolDashboard");
        else if (role === "Student") router.push("/StudentDashboard");
        else if (role === "Teacher") router.push("/TeacherDashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(false);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "OTP verification failed");
      setOtpSuccess(true);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        if (role === "Admin") router.push("/SchoolDashboard");
        else if (role === "Student") router.push("/StudentDashboard");
        else if (role === "Teacher") router.push("/TeacherDashboard");
      }, 1000);
    } catch (err: any) {
      setOtpError(err.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex h-screen min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-purple-400 items-center justify-center">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl border border-blue-200 p-6 sm:p-10 shadow-2xl overflow-auto z-10 flex flex-col items-center"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
      >
        <motion.h1
          ref={titleRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent mb-6 text-center drop-shadow-lg"
        >
          Welcome Back
        </motion.h1>
        <AnimatePresence mode="wait">
          {!otpStep ? (
            <motion.form
              key="login"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-5 w-full"
            >
              <motion.select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 shadow-sm"
                whileFocus={{ scale: 1.03 }}
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </motion.select>
              <motion.input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 shadow-sm"
                whileFocus={{ scale: 1.03 }}
              />
              <motion.input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 shadow-sm"
                whileFocus={{ scale: 1.03 }}
              />
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 rounded-lg bg-red-100 text-red-800 text-center font-semibold"
                >
                  {error}
                </motion.div>
              )}
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              onSubmit={handleOtpSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-5 w-full"
            >
              <motion.input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 shadow-sm tracking-widest text-center text-lg font-bold"
                whileFocus={{ scale: 1.03 }}
                maxLength={6}
              />
              <motion.button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-base flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </motion.button>
              {otpSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                >
                  OTP verified! Redirecting...
                </motion.div>
              )}
              {otpError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-3 rounded-lg bg-red-100 text-red-800 text-center font-semibold"
                >
                  {otpError}
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
