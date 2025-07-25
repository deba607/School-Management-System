import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Admin } from "../../../models/Admin";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import { School } from "../../../models/School";
import bcrypt from "bcryptjs";
import { generateAndSaveOTP } from "../../../services/otpService";
import { sendEmail } from "../../../utils/sendEmail";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { role, email, password, schoolId } = await req.json();
    let user = null;
    if (role === "Admin") {
      user = await Admin.findOne({ email }).select("+password");
    } else if (role === "Student") {
      if (!schoolId) {
        return NextResponse.json({ success: false, error: "School ID is required for students" }, { status: 400 });
      }
      user = await Student.findOne({ email, schoolId }).select("+password");
    } else if (role === "School") {
      if (!schoolId) {
        return NextResponse.json({ success: false, error: "School ID is required for schools" }, { status: 400 });
      }
      user = await School.findOne({ email, schoolId }).select("+password");
    } else if (role === "Teacher") {
      if (!schoolId) {
        return NextResponse.json({ success: false, error: "School ID is required for teachers" }, { status: 400 });
      }
      
      // First try to find the school by name if ObjectId is not valid
      let schoolObjectId: mongoose.Types.ObjectId;
      
      if (mongoose.Types.ObjectId.isValid(schoolId)) {
        // If it's a valid ObjectId, use it directly
        schoolObjectId = new mongoose.Types.ObjectId(schoolId);
      } else {
        // If not a valid ObjectId, try to find school by name
        const school = await School.findOne({ name: { $regex: new RegExp(`^${schoolId}$`, 'i') } });
        if (!school) {
          return NextResponse.json({ 
            success: false, 
            error: "School not found. Please check the school name or ID and try again." 
          }, { status: 404 });
        }
        schoolObjectId = school._id;
      }
      
      // Now find the teacher with the school ID
      user = await Teacher.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') },
        schoolId: schoolObjectId 
      }).select("+password");
    } else {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }
    if (!user) {
      let errorMessage = "User not found";
      if (role === "Teacher") {
        errorMessage = "Teacher not found. Please check your email and school ID/name and try again.";
      }
      return NextResponse.json({ success: false, error: errorMessage }, { status: 404 });
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