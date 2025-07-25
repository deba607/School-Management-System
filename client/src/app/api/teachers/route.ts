import { NextRequest } from 'next/server';
import { TeacherService } from '@/services/teacherService';
import { validateTeacher } from '@/validators/TeacherValidators';
import { connectDB } from '@/lib/mongoose';
import { Teacher } from '@/models/Teacher';
import { ApiResponse } from '@/lib/apiResponse';
import { getServerUser } from '@/utils/serverAuth';
 // Add this import, adjust path if needed

const teacherService = new TeacherService();

// GET - List all teachers
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Ignore schoolId query param, always return all teachers
    const teachers = await Teacher.find().select('-password');
    return ApiResponse.success({ data: teachers });
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}

// POST - Create a new teacher
export async function POST(request: NextRequest) {
  // Auth check
  const user = getServerUser(request);
  if (!user) {
    return ApiResponse.unauthorized('You must be logged in to perform this action');
  }
  if (user.role !== 'admin') {
    return ApiResponse.forbidden('You do not have permission to perform this action');
  }
  try {
    await connectDB();
    const body = await request.json();
    console.log('Received teacher data:', JSON.stringify(body, null, 2));
    
    // Remove confirmPassword before validation and saving
    if ('confirmPassword' in body) {
      delete body.confirmPassword;
    }
    
    // Ensure schoolId is provided
    const schoolId = request.headers.get('x-school-id');
    if (!schoolId) {
      return ApiResponse.error({ error: 'School ID is required in headers', status: 400 });
    }
    
    // Add schoolId to the teacher data
    const teacherData = {
      ...body,
      schoolId: schoolId
    };
    
    console.log('Processed teacher data:', JSON.stringify(teacherData, null, 2));
    
    // Validate the teacher data
    const validation = validateTeacher(teacherData);
    console.log('Validation result:', validation);
    
    if (!validation.success) {
      console.error('Validation failed:', validation.errors);
      return ApiResponse.validationError(validation.errors.map((e) => ({
        path: e.path?.join('.') || '',
        message: e.message
      })));
    }
    
    try {
      // At this point, TypeScript knows validation is successful and data exists
      const teacher = await teacherService.createTeacher(validation.data);
      // Do not return password in response
      const teacherObj = teacher.toObject();
      delete teacherObj.password;
      return ApiResponse.success({ data: teacherObj, message: 'Teacher created successfully', status: 201 });
    } catch (error: any) {
      console.error('Error creating teacher:', error);
      if (error.message.includes('already exists')) {
        return ApiResponse.error({ error: 'A teacher with this email already exists', status: 409, code: 'DUPLICATE_EMAIL' });
      }
      return ApiResponse.error({ error: 'Failed to create teacher', details: process.env.NODE_ENV === 'development' ? error.message : undefined, status: 500 });
    }
  } catch (error) {
    return ApiResponse.serverError(error);
  }
} 