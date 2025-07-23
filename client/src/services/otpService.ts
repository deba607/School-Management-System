import crypto from "crypto";
import {Admin} from "../models/Admin";
import {Student} from "../models/Student";
import {Teacher} from "../models/Teacher";
import {School} from "../models/School";

export async function generateAndSaveOTP(user: any, role: string) {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();
  return otp;
}

export async function verifyOTP(userId: string, role: string, otp: string) {
  let user = null;
  if (role === "Admin") user = await Admin.findById(userId);
  else if (role === "Student") user = await Student.findById(userId);
  else if (role === "School") user = await School.findById(userId);
  console.log('User found for OTP:', user);
  if (!user || !user.otp || !user.otpExpiry) {
    console.log('OTP or expiry missing:', { otp: user?.otp, otpExpiry: user?.otpExpiry });
    return false;
  }
  if (user.otp !== otp) {
    console.log('OTP mismatch:', { expected: user.otp, received: otp });
    return false;
  }
  if (user.otpExpiry < new Date()) {
    console.log('OTP expired:', { otpExpiry: user.otpExpiry, now: new Date() });
    return false;
  }
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  return true;
} 