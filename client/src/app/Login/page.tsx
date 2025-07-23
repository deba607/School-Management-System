"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const roles = ["Admin", "Student", "School"];

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
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotRole, setForgotRole] = useState(roles[0]);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotStep, setForgotStep] = useState<'email' | 'verify'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const router = useRouter();
  const forgotModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(titleRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, delay: 0.2, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (showForgot && forgotModalRef.current) {
      gsap.fromTo(forgotModalRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" });
    }
  }, [showForgot]);

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
        else if (role === "School") router.push("/SchoolDashboard");
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
        else if (role === "School") router.push("/SchoolDashboard");
      }, 1000);
    } catch (err: any) {
      setOtpError(err.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSuccess("");
    setForgotError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, role: forgotRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send OTP");
      setForgotSuccess("OTP sent to your email. Please check your inbox.");
      setTimeout(() => {
        setForgotStep('verify');
      }, 1000);
    } catch (err: any) {
      setForgotError(err.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess("");
    setResetError("");
    if (forgotNewPassword !== forgotConfirmPassword) {
      setResetError("Passwords do not match");
      setResetLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          role: forgotRole,
          otp: forgotOtp,
          newPassword: forgotNewPassword
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to reset password");
      setResetSuccess("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep('email');
        setForgotEmail("");
        setForgotOtp("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setResetSuccess("");
      }, 1500);
    } catch (err: any) {
      setResetError(err.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
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
              <motion.button
                type="button"
                className="text-blue-600 hover:underline text-sm mt-2"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </motion.button>
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
      <AnimatePresence>
        {showForgot && (
          <motion.div
            key="forgot-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={forgotModalRef}
              initial={{ scale: 0.85, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 60 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full relative"
            >
              <motion.button
                className="absolute top-2 right-2 text-blue-700 text-xl font-bold"
                onClick={() => { setShowForgot(false); setForgotStep('email'); setResetSuccess(''); setResetError(''); }}
                aria-label="Close"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
              <AnimatePresence mode="wait">
                {forgotStep === 'email' && (
                  <motion.div
                    key="forgot-email"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.h2
                      className="text-xl font-bold mb-4 text-blue-900"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      Forgot Password
                    </motion.h2>
                    <motion.form
                      onSubmit={handleForgotPassword}
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                    >
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label className="block text-blue-900 font-medium mb-1">Role</label>
                        <select
                          value={forgotRole}
                          onChange={e => setForgotRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                        >
                          {roles.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <label className="block text-blue-900 font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                          placeholder="Enter your email"
                        />
                      </motion.div>
                      <motion.button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
                        disabled={forgotLoading}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {forgotLoading ? "Sending..." : "Send OTP"}
                      </motion.button>
                      {forgotSuccess && <motion.div className="text-green-600 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{forgotSuccess}</motion.div>}
                      {forgotError && <motion.div className="text-red-600 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{forgotError}</motion.div>}
                    </motion.form>
                  </motion.div>
                )}
                {forgotStep === 'verify' && (
                  <motion.div
                    key="forgot-verify"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.h2
                      className="text-xl font-bold mb-4 text-blue-900"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      Verify OTP & Reset Password
                    </motion.h2>
                    <motion.form
                      onSubmit={handleResetPassword}
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                    >
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label className="block text-blue-900 font-medium mb-1">OTP</label>
                        <input
                          type="text"
                          value={forgotOtp}
                          onChange={e => setForgotOtp(e.target.value)}
                          required
                          maxLength={6}
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900 tracking-widest text-center text-lg font-bold"
                          placeholder="Enter OTP"
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <label className="block text-blue-900 font-medium mb-1">New Password</label>
                        <input
                          type="password"
                          value={forgotNewPassword}
                          onChange={e => setForgotNewPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                          placeholder="Enter new password"
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <label className="block text-blue-900 font-medium mb-1">Confirm Password</label>
                        <input
                          type="password"
                          value={forgotConfirmPassword}
                          onChange={e => setForgotConfirmPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-400 bg-white/70 text-blue-900"
                          placeholder="Confirm new password"
                        />
                      </motion.div>
                      <motion.button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow"
                        disabled={resetLoading}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {resetLoading ? "Resetting..." : "Reset Password"}
                      </motion.button>
                      {resetSuccess && <motion.div className="text-green-600 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{resetSuccess}</motion.div>}
                      {resetError && <motion.div className="text-red-600 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{resetError}</motion.div>}
                    </motion.form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
