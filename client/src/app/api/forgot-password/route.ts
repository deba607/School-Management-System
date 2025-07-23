import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Admin } from "../../../models/Admin";
import { Student } from "../../../models/Student";
import { School } from "../../../models/School";
import { generateAndSaveOTP } from "../../../services/otpService";
import { sendEmail } from "../../../utils/sendEmail";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { role, email, schoolId } = await req.json();
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