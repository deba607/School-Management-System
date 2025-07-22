import { NextRequest, NextResponse } from 'next/server';
import { TeacherService } from '@/services/teacherService';
import { validateTeacher } from '@/validators/TeacherValidators';
import { connectDB } from '@/lib/mongoose';

const teacherService = new TeacherService();

// POST - Create a new teacher
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    // Remove confirmPassword before validation and saving
    if ('confirmPassword' in body) {
      delete body.confirmPassword;
    }
    const validation = validateTeacher(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    try {
      const teacher = await teacherService.createTeacher(validation.data!);
      // Do not return password in response
      const teacherObj = teacher.toObject();
      delete teacherObj.password;
      return NextResponse.json(
        { success: true, data: teacherObj, message: 'Teacher created successfully' },
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