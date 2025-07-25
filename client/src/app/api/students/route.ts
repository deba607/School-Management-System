import { NextRequest } from 'next/server';
import { StudentService } from '@/services/studentService';
import { validateStudent } from '@/validators/StudentValidators';
import { connectDB } from '@/lib/mongoose';
import { Student } from '@/models/Student';
import mongoose from 'mongoose';
import { getCurrentUser } from '@/utils/auth';
import { rateLimit } from '@/lib/rateLimit';
import { securityHeaders, validateRequest, sanitizeInput } from '@/middleware/security';
import { ApiResponse } from '@/lib/apiResponse';

const studentService = new StudentService();

// Apply rate limiting (5 requests per minute per IP)
const limiter = rateLimit();

// POST - Create a new student
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      await limiter.check(request, 5, ip); // 5 requests per minute
    } catch (error) {
      return ApiResponse.rateLimitExceeded();
    }

    // Get user from token (adjust as needed for your auth logic)
    const user = getCurrentUser();
    if (!user) {
      return ApiResponse.unauthorized('You must be logged in to perform this action');
    }
    if (user.role !== 'admin') {
      return ApiResponse.forbidden('You do not have permission to perform this action');
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateStudent(body);

    if (!validation.success) {
      return ApiResponse.validationError(validation.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })));
    }

    try {
      // Create student with validated data
      // The validation has already ensured the data is in the correct format
      const { name, email, password, class: className, sec, address, pictures, schoolId, otp, otpExpiry } = validation.data;
      const student = await studentService.createStudent({
        name,
        email,
        password,
        class: className,
        sec,
        address,
        pictures,
        schoolId: new mongoose.Types.ObjectId(schoolId),
        ...(otp && { otp }),
        ...(otpExpiry && { otpExpiry })
      } as any);
      
      // Convert to plain object and remove sensitive data
      const studentObj = student.toObject();
      delete studentObj.password;
      
      // Return success response
      return ApiResponse.success({ data: studentObj, message: 'Student created successfully', status: 201 });
    } catch (error) {
      console.error('Error creating student:', error);
      
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : 'Failed to create student';
      const statusCode = errorMessage.includes('already exists') ? 409 : 500;
      
      return ApiResponse.error({ error: errorMessage, status: statusCode });
    }

  } catch (error: any) {
    console.error('Error in student creation:', error);
    
    if (error.message && error.message.includes('already exists')) {
      return ApiResponse.error({
        error: 'A student with this email already exists',
        status: 409,
        code: 'DUPLICATE_EMAIL'
      });
    }
    return ApiResponse.serverError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      await limiter.check(request, 10, ip); // 10 requests per minute
    } catch (error) {
      return ApiResponse.rateLimitExceeded();
    }

    await connectDB();
    
    // Get students with pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 items per page
    const skip = (page - 1) * limit;

    // Get total count and paginated results
    const [total, students] = await Promise.all([
      Student.countDocuments({}),
      Student.find({})
        .select('-password') // Exclude password field
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return ApiResponse.success({
      data: {
        students,
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return ApiResponse.serverError(error);
  }
} 