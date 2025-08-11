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
  try {
    console.log(`Verifying OTP for ${role} with ID:`, userId);
    
    // Find the user based on role
    let user = null;
    switch (role) {
      case "Admin":
        user = await Admin.findById(userId);
        break;
      case "Student":
        user = await Student.findById(userId);
        break;
      case "School":
        user = await School.findById(userId);
        break;
      case "Teacher":
        user = await Teacher.findById(userId);
        break;
      default:
        console.error('Invalid role for OTP verification:', role);
        return false;
    }
    
    console.log('User found for OTP verification:', { 
      userId, 
      role,
      userExists: !!user,
      hasOtp: user?.otp ? 'yes' : 'no',
      otpExpiry: user?.otpExpiry,
      currentTime: new Date()
    });

    // Check if user exists and has OTP data
    if (!user) {
      console.error('User not found for OTP verification');
      return false;
    }

    if (!user.otp || !user.otpExpiry) {
      console.error('OTP or expiry missing for user:', { 
        userId, 
        hasOtp: !!user.otp, 
        hasExpiry: !!user.otpExpiry 
      });
      return false;
    }

    // Verify OTP
    if (user.otp !== otp) {
      console.error('OTP mismatch:', { 
        expected: user.otp, 
        received: otp,
        userId,
        role
      });
      return false;
    }

    // Check expiry
    if (user.otpExpiry < new Date()) {
      console.error('OTP expired:', { 
        otpExpiry: user.otpExpiry, 
        currentTime: new Date(),
        userId,
        role
      });
      return false;
    }

    // Clear OTP data after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    console.log('OTP verified successfully for user:', { userId, role });
    return true;
    
  } catch (error) {
    console.error('Error in verifyOTP:', { 
      error: error.message, 
      stack: error.stack,
      userId,
      role
    });
    return false;
  }
}