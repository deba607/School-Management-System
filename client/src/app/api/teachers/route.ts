import { NextRequest } from 'next/server';
import { TeacherService } from '@/services/teacherService';
import { validateTeacher } from '@/validators/TeacherValidators';
import { connectDB } from '@/lib/mongoose';
import { Teacher } from '@/models/Teacher';
import { ApiResponse } from '@/lib/apiResponse';
import { withAuth } from '@/middleware/withAuth';

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
async function createTeacher(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  console.log('Received teacher data:', JSON.stringify(body, null, 2));
  
  // Get the authenticated user from the request
  const user = request.user;
  if (!user) {
    return ApiResponse.unauthorized('Authentication required');
  }
  
  // Only school and teacher roles can create teachers
  if (!['school', 'teacher'].includes(user.role.toLowerCase())) {
    return ApiResponse.forbidden('You do not have permission to create teachers');
  }
  
  // Remove confirmPassword before validation and saving
  if ('confirmPassword' in body) {
    delete body.confirmPassword;
  }
  
  // Use the schoolId from the authenticated user
  const schoolId = user.schoolId || user.userId; // For school users, userId is the schoolId
  if (!schoolId) {
    return ApiResponse.error({ error: 'School ID could not be determined', status: 400 });
  }
  
  // Add schoolId to the teacher data
  body.schoolId = schoolId;
  
  // Validate the teacher data
  const validation = validateTeacher(body);
  if (!validation.success) {
    return ApiResponse.error({ 
      error: 'Validation failed', 
      details: validation.errors,
      status: 400 
    });
  }
  
  try {
    const teacher = await teacherService.createTeacher(body);
    return ApiResponse.success({ 
      data: teacher,
      message: 'Teacher created successfully',
      status: 201
    });
  } catch (error: any) {
    console.error('Error creating teacher:', error);
    if (error.code === 11000) {
      return ApiResponse.error({ 
        error: 'A teacher with this email or phone already exists',
        status: 400
      });
    }
    return ApiResponse.serverError(error);
  }
}

// Export the POST handler with auth middleware
export async function POST(request: NextRequest) {
  return withAuth(request, createTeacher, ['school', 'teacher']);
}