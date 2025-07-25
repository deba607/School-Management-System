import { NextRequest } from 'next/server';
import { StudentService } from '@/services/studentService';
import { validateStudent, validateStudentUpdate } from '@/validators/StudentValidators';
import { connectDB } from '@/lib/mongoose';
import { Student } from '@/models/Student';
import mongoose from 'mongoose';
import { rateLimit } from '@/lib/rateLimit';
import { ApiResponse } from '@/lib/apiResponse';
import { withAuth } from '@/middleware/withAuth';
import { getToken } from 'next-auth/jwt';
import { JWT_SECRET } from '@/config/constants';

const studentService = new StudentService();

// Apply rate limiting (5 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Helper function to get user from token
async function getAuthenticatedUser(req: NextRequest) {
  const token = await getToken({ req, secret: JWT_SECRET });
  if (!token) return null;
  return token;
}

// POST - Create a new student
export const POST = async (request: NextRequest) => {
  return withAuth(request, async (req) => {
    try {
      // Apply rate limiting
      try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        await limiter.check(5, ip); // 5 requests per minute
      } catch (error) {
        return ApiResponse.rateLimitExceeded();
      }

      // Parse and validate request body
      const body = await req.json();
      const validation = validateStudent(body);

      if (!validation.success) {
        return ApiResponse.validationError(validation.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })));
      }

      // Create student with validated data
      // The validation has already ensured the data is in the correct format
      const { name, email, password, class: className, sec, address, pictures, schoolId, otp, otpExpiry } = validation.data;
      
      try {
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
      } catch (error: any) {
        console.error('Error creating student:', error);
        
        if (error.message && error.message.includes('already exists')) {
          return ApiResponse.error({
            error: 'A student with this email already exists',
            status: 409,
            code: 'DUPLICATE_EMAIL'
          });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to create student';
        return ApiResponse.error({ error: errorMessage, status: 500 });
      }
    } catch (error) {
      console.error('Unexpected error in student creation:', error);
      return ApiResponse.serverError(error);
    }
  }, { roles: ['admin', 'school', 'teacher'] }); // Allow admin, school, and teacher roles

// GET - Get all students
export const GET = async (request: NextRequest) => {
  return withAuth(request, async (req) => {
    try {
      // Apply rate limiting
      try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        await limiter.check(10, ip); // 10 requests per minute
      } catch (error) {
        return ApiResponse.rateLimitExceeded();
      }

      await connectDB();
      
      // Get students with pagination
      const { searchParams } = new URL(req.url);
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
  }, { roles: ['admin', 'school', 'teacher'] });
};