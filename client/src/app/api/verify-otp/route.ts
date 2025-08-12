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
      return user?.schoolId || null; // Use schoolId field instead of _id
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
    
    // Input validation
    if (!userId || !role || !otp) {
      console.error('Missing required fields for OTP verification');
      return NextResponse.json(
        { success: false, error: "Missing required fields (userId, role, or otp)" }, 
        { status: 400 }
      );
    }
    
    // Verify OTP
    const valid = await verifyOTP(userId, role, otp);
    console.log('OTP Verification Result:', valid);
    
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP. Please request a new one if needed." }, 
        { status: 400 }
      );
    }
    
    // Get user details based on role
    let userDetails: any = null;
    let schoolId = null;

    if (role === 'Teacher') {
      // Fetch teacher details including school info
      userDetails = await Teacher.findById(userId)
        .populate('schoolId', 'name email address')
        .lean();
      
      if (!userDetails) {
        console.error('Teacher not found:', userId);
        return NextResponse.json(
          { success: false, error: "Teacher account not found" },
          { status: 404 }
        );
      }
      
      schoolId = userDetails.schoolId?.toString() || null;
      
      if (!schoolId) {
        console.error('Teacher login failed - No school ID associated with teacher:', userId);
        return NextResponse.json(
          { success: false, error: "Teacher account not properly associated with a school. Please contact support." },
          { status: 400 }
        );
      }
    } else {
      // For other roles, use the existing getSchoolId function
      schoolId = await getSchoolId(userId, role);
    }

    console.log('Retrieved user details:', { userId, role, schoolId });
    
    // Prepare token payload with user details
    const tokenPayload: any = { 
      userId,
      role: role.toLowerCase(),
      email: userDetails?.email || '',
      name: userDetails?.name || userDetails?.schoolId?.name || 'User',
      schoolId: schoolId,
      schoolName: userDetails?.schoolId?.name || '',
      picture: userDetails?.pictures?.[0]?.base64Data 
        ? `data:${userDetails.pictures[0].mimeType};base64,${userDetails.pictures[0].base64Data}`
        : undefined
    };
    
    // Sign the JWT token
    const token = jwt.sign(tokenPayload, JWT_SECRET, { 
      expiresIn: "7d" 
    });
    
    console.log('JWT token generated successfully for user:', { 
      userId, 
      role,
      hasSchoolId: !!schoolId 
    });
    
    return NextResponse.json({ 
      success: true, 
      token,
      schoolId, // Also include in the response for immediate use if needed
      role: role.toLowerCase()
    });
    
  } catch (error) {
    console.error('Error in OTP verification:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred during OTP verification. Please try again later." 
      }, 
      { status: 500 }
    );
  }
}