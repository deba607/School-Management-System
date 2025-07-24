import { NextRequest, NextResponse } from 'next/server';
import { TeacherService } from '@/services/teacherService';
import { validateTeacher } from '@/validators/TeacherValidators';
import { connectDB } from '@/lib/mongoose';
import { Teacher } from '@/models/Teacher';

const teacherService = new TeacherService();

// GET - List all teachers
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Ignore schoolId query param, always return all teachers
    const teachers = await Teacher.find().select('-password');
    return NextResponse.json({ success: true, data: teachers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

// POST - Create a new teacher
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    console.log('Received teacher data:', JSON.stringify(body, null, 2));
    // Remove confirmPassword before validation and saving
    if ('confirmPassword' in body) {
      delete body.confirmPassword;
    }
    // Log the received body for debugging
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Ensure address is included in the body
    if (!body.address || body.address.trim().length < 5) {
      console.error('Address validation failed - missing or too short:', body.address);
      return NextResponse.json(
        { success: false, error: 'Address is required and must be at least 5 characters long' },
        { status: 400 }
      );
    }
    
    // Validate the teacher data
    const validation = validateTeacher(body);
    console.log('Validation result:', validation);
    
    if (!validation.success) {
      console.error('Validation failed:', validation.errors);
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