import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "../../../services/otpService";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  try {
    const { userId, role, otp } = await req.json();
    console.log('OTP Verification Request:', { userId, role, otp });
    const valid = await verifyOTP(userId, role, otp);
    console.log('OTP Verification Result:', valid);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }
    const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
} 