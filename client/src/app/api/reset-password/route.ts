import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Admin } from "../../../models/Admin";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import { School } from "../../../models/School";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { email, role, otp, newPassword, schoolId } = await req.json();
    let user = null;
    if (role === "Admin") {
      user = await Admin.findOne({ email });
    } else if (role === "Student") {
      if (!schoolId) {
        return NextResponse.json({ success: false, error: "School ID is required for students" }, { status: 400 });
      }
      user = await Student.findOne({ email, schoolId });
    } else if (role === "School") {
      if (!schoolId) {
        return NextResponse.json({ success: false, error: "School ID is required for schools" }, { status: 400 });
      }
      user = await School.findOne({ email, schoolId });
    } else {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json({ success: false, error: "No OTP found. Please request a new one." }, { status: 400 });
    }
    if (user.otp !== otp) {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }
    if (user.otpExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
    }
    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return NextResponse.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
} 