import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "../../../services/otpService";
import jwt from "jsonwebtoken";
import { Admin } from "../../../models/Admin";
import { School } from "../../../models/School";
import { Teacher } from "../../../models/Teacher";
import { Student } from "../../../models/Student";
import connectDB from "../../../lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

async function getSchoolId(userId: string, role: string): Promise<string | null> {
  await connectDB();
  try {
    let user;
    if (role === 'Admin') {
      user = await Admin.findById(userId);
      return user?.schoolId?.toString() || null;
    } else if (role === 'School') {
      user = await School.findById(userId);
      return user?._id?.toString() || null; // For school users, the ID is the school ID
    } else if (role === 'Teacher') {
      user = await Teacher.findById(userId);
      return user?.schoolId?.toString() || null;
    } else if (role === 'Student') {
      user = await Student.findById(userId);
      return user?.schoolId?.toString() || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching school ID:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, role, otp } = await req.json();
    console.log('OTP Verification Request:', { userId, role, otp });
    
    const valid = await verifyOTP(userId, role, otp);
    console.log('OTP Verification Result:', valid);
    
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }
    
    // Get the school ID based on the user's role
    const schoolId = await getSchoolId(userId, role);
    console.log('Retrieved school ID:', schoolId);
    
    // Include schoolId in the JWT token if available
    const tokenPayload: any = { userId, role };
    if (schoolId) {
      tokenPayload.schoolId = schoolId;
    }
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    return NextResponse.json({ 
      success: true, 
      token,
      schoolId // Also include in the response for immediate use if needed
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}