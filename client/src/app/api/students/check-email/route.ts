import { NextRequest, NextResponse } from "next/server";
import { Student } from "@/models/Student";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if a student with this email already exists
    const existingStudent = await Student.findOne({ email });

    return NextResponse.json({
      exists: !!existingStudent,
      message: existingStudent 
        ? "A student with this email already exists" 
        : "Email is available"
    });

  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { error: "An error occurred while checking the email" },
      { status: 500 }
    );
  }
}
