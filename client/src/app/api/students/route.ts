import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';
import { validateStudent } from '@/validators/StudentValidators';
import { connectDB } from '@/lib/mongoose';

const studentService = new StudentService();

// POST - Create a new student
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    // Remove confirmPassword before validation and saving
    if ('confirmPassword' in body) {
      delete body.confirmPassword;
    }
    const validation = validateStudent(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    try {
      const student = await studentService.createStudent(validation.data!);
      // Do not return password in response
      const studentObj = student.toObject();
      delete studentObj.password;
      return NextResponse.json(
        { success: true, data: studentObj, message: 'Student created successfully' },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 