import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';
import { validateStudent } from '@/validators/StudentValidators';
import { connectDB } from '@/lib/mongoose';
import { Student } from '@/models/Student';

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Ignore schoolId query param, always return all students
    const students = await studentService.getAllStudents();
    // Remove password from each student object if present
    const studentsNoPassword = students.map((student: any) => {
      const obj = student.toObject ? student.toObject() : { ...student };
      delete obj.password;
      return obj;
    });
    return NextResponse.json({ success: true, data: studentsNoPassword });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
} 