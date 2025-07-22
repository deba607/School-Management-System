import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Admin } from "../../../models/Admin";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import bcrypt from "bcryptjs";
import { generateAndSaveOTP } from "../../../services/otpService";
import { sendEmail } from "../../../utils/sendEmail";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { role, email, password } = await req.json();
    let user = null;
    if (role === "Admin") {
      user = await Admin.findOne({ email }).select("+password");
    } else if (role === "Student") {
      user = await Student.findOne({ email }).select("+password");
    } else if (role === "Teacher") {
      user = await Teacher.findOne({ email }).select("+password");
    } else {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }
    // Generate and send OTP
    const otp = await generateAndSaveOTP(user, role);
    if (!user.email) {
      return NextResponse.json({ success: false, error: "User email not found" }, { status: 500 });
    }
    await sendEmail(user.email, "Your OTP Code", `Your OTP code is: ${otp}`);
    return NextResponse.json({ success: true, otpSent: true, userId: user._id, role });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
} 