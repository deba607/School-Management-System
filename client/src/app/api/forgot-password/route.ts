import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Admin } from "../../../models/Admin";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import { generateAndSaveOTP } from "../../../services/otpService";
import { sendEmail } from "../../../utils/sendEmail";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { role, email } = await req.json();
    let user = null;
    if (role === "Admin") {
      user = await Admin.findOne({ email });
    } else if (role === "Student") {
      user = await Student.findOne({ email });
    } else if (role === "School") {
      user = await Teacher.findOne({ email });
    } else {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const otp = await generateAndSaveOTP(user, role);
    if (!user.email) {
      return NextResponse.json({ success: false, error: "User email not found" }, { status: 500 });
    }
    await sendEmail(user.email, "Your OTP Code", `Your OTP code is: ${otp}`);
    return NextResponse.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
} 