import { NextRequest } from 'next/server';
import { TeacherService } from '@/services/teacherService';
import { validateTeacher } from '@/validators/TeacherValidators';
import { connectDB } from '@/lib/mongoose';
import { Teacher } from '@/models/Teacher';
import { ApiResponse } from '@/lib/apiResponse';
import { withAuth } from '@/middleware/withAuth';
import { Types } from 'mongoose';

const teacherService = new TeacherService();

// GET - List all teachers with optional school filter
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    
    // Build query
    const query: any = {};
    if (schoolId && Types.ObjectId.isValid(schoolId)) {
      query.schoolId = schoolId;
    }
    
    // Execute query
    const teachers = await Teacher.find(query)
      .select('-password -__v')
      .lean();
      
    return ApiResponse.success({ 
      data: teachers,
      message: 'Teachers retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return ApiResponse.serverError(error);
  }
}

// POST - Create a new teacher
async function createTeacher(request: NextRequest) {
  try {
    await connectDB();
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.warn('Invalid JSON payload');
      return ApiResponse.error({
        error: 'Invalid request body',
        status: 400
      });
    }
    
    // Log request for debugging (without sensitive data)
    const logData = { ...body };
    if (logData.password) logData.password = '***';
    if (logData.confirmPassword) logData.confirmPassword = '***';
    console.log('Received teacher creation request:', JSON.stringify(logData, null, 2));
    
    // Get the authenticated user from the request
    const user = request.user;
    if (!user) {
      console.warn('Unauthorized access attempt - no user in request');
      return ApiResponse.unauthorized('Authentication required');
    }
    
    // Only school and admin roles can create teachers
    const userRole = user.role?.toLowerCase();
    if (!['school', 'admin'].includes(userRole)) {
      console.warn(`Forbidden: User role ${userRole} cannot create teachers`);
      return ApiResponse.forbidden('You do not have permission to create teachers');
    }
    
    // Validate required fields
    const requiredFields = [
      'name', 'email', 'phone', 'subject', 
      'address', 'password', 'confirmPassword'
    ];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.warn('Validation failed - missing required fields:', missingFields);
      return ApiResponse.validationError(
        missingFields.map(field => ({
          field,
          message: `${field} is required`
        }))
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return ApiResponse.validationError([
        { field: 'email', message: 'Invalid email format' }
      ]);
    }
    
    // Validate password strength
    if (body.password.length < 8) {
      return ApiResponse.validationError([
        { field: 'password', message: 'Password must be at least 8 characters long' }
      ]);
    }
    
    // Password confirmation check
    if (body.password !== body.confirmPassword) {
      return ApiResponse.validationError([
        { field: 'confirmPassword', message: 'Passwords do not match' }
      ]);
    }
    
    // Remove confirmPassword and trim all string fields
    const { confirmPassword, ...teacherData } = body;
    Object.keys(teacherData).forEach(key => {
      if (typeof teacherData[key] === 'string') {
        teacherData[key] = teacherData[key].trim();
      }
    });
    
    // Use the schoolId from the authenticated user
    const schoolId = user.schoolId || user.userId;
    if (!schoolId || !Types.ObjectId.isValid(schoolId)) {
      console.error('Invalid or missing school ID for user:', user);
      return ApiResponse.error({ 
        error: 'Invalid school ID',
        status: 400
      });
    }
    
    // Add schoolId and role to the teacher data
    teacherData.schoolId = schoolId;
    teacherData.role = 'teacher';
    
    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email: teacherData.email });
    if (existingTeacher) {
      return ApiResponse.error({
        error: 'Email already in use',
        status: 409
      });
    }
    
    // Create the teacher
    const teacher = await teacherService.createTeacher(teacherData);
    
    // Return success response (without sensitive data)
    const { password, __v, ...responseData } = teacher.toObject();
    
    return ApiResponse.success({ 
      data: responseData,
      message: 'Teacher created successfully',
      status: 201
    });
    
  } catch (error: any) {
    console.error('Error in createTeacher:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = error.keyValue?.email ? 'email' : 
                  error.keyValue?.phone ? 'phone' : 'field';
      return ApiResponse.error({ 
        error: `A teacher with this ${field} already exists`,
        status: 409,
        code: 'DUPLICATE_ENTRY'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.entries(error.errors).map(([field, e]: [string, any]) => ({
        field,
        message: e.message
      }));
      return ApiResponse.validationError(errors);
    }
    
    // Default server error
    return ApiResponse.serverError(error);
  }
}

// Export the POST handler with auth middleware
export async function POST(request: NextRequest) {
  return withAuth(request, createTeacher, ['school', 'admin']);
}