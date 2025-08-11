import { NextRequest } from 'next/server';
import { StudentService } from '@/services/studentService';
import { validateStudent } from '@/validators/StudentValidators';
import { connectDB } from '@/lib/mongoose';
import { Student } from '@/models/Student';
import { School } from '@/models/School';
import mongoose from 'mongoose';
import { rateLimit } from '@/lib/rateLimit';
import { ApiResponse } from '@/lib/apiResponse';
import { withAuth } from '@/middleware/withAuth';
import { getToken } from 'next-auth/jwt';
import { JWT_SECRET } from '@/config/constants';

const studentService = new StudentService();

// Apply rate limiting (10 requests per minute per IP)
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10 // 10 requests per interval
});

// Helper function to get user from token
async function getAuthenticatedUser(req: NextRequest) {
  const token = await getToken({ req, secret: JWT_SECRET });
  if (!token) return null;
  return token;
}

// Helper function to parse form data
async function parseFormData(req: Request) {
  const formData = await req.formData();
  const body: Record<string, any> = {};
  const files: File[] = [];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // First, collect all fields
  for (const [key, value] of formData.entries()) {
    if (key === 'pictures' && value instanceof File) {
      files.push(value);
    } else if (key !== 'pictures') {
      body[key] = value;
    }
  }

  // Then validate files if any
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported. Please upload a JPEG, PNG, or WebP image.`);
    }
  }

  return { ...body, pictures: files } as Record<string, any> & { pictures: File[] };
}

// POST - Create a new student
export const POST = async (request: NextRequest) => {
  return withAuth(
    request,
    async (req) => {
      try {
        // Apply rate limiting
        try {
          const ip = req.headers.get('x-forwarded-for') || 'unknown';
          await limiter.check(req, 10, ip);
        } catch (error) {
          return ApiResponse.rateLimitExceeded();
        }

        // Parse form data
        let body;
        try {
          body = await parseFormData(req);
        } catch (error) {
          console.error('Error parsing form data:', error);
          return ApiResponse.error({ error: 'Invalid form data', status: 400 });
        }

        // Connect to database
        await connectDB();

        // Validate request body with the schoolId string
        const validation = validateStudent(body);
        if (!validation.success) {
          return ApiResponse.validationError(validation.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
          })));
        }

        // Process file uploads if any
        const { name, email, password, class: className, sec, address, schoolId, otp, otpExpiry } = validation.data;
        let picturesData: any[] = [];

        if (body.pictures && Array.isArray(body.pictures) && body.pictures.length > 0) {
          try {
            picturesData = await Promise.all(
              body.pictures.map(async (file: File) => {
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                return {
                  originalName: file.name,
                  mimeType: file.type,
                  size: file.size,
                  base64Data: base64
                };
              })
            );
          } catch (error) {
            console.error('Error processing file uploads:', error);
            return ApiResponse.error({ 
              error: 'Error processing file uploads', 
              status: 500 
            });
          }
        }

        // Create student with validated data
        const student = await studentService.createStudent({
          name,
          email,
          password,
          class: className,
          sec,
          address,
          pictures: picturesData, // Use the processed pictures data
          schoolId: schoolId, // Use the schoolId string directly
          ...(otp && { otp }),
          ...(otpExpiry && { otpExpiry })
        });
        
        // Convert to plain object and remove sensitive data
        const studentObj = student.toObject();
        delete studentObj.password;
        
        // Return success response
        return ApiResponse.success({ 
          data: studentObj, 
          message: 'Student created successfully', 
          status: 201 
        });
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
        return ApiResponse.error({ 
          error: errorMessage, 
          status: 500 
        });
      }
    },
    ['admin', 'school'] // Allow admin and school roles
  );
};

// GET - Get all students
export const GET = (request: NextRequest) => {
  return withAuth(
    request,
    async (req) => {
      // Handler function
      try {
        // Apply rate limiting
        try {
          const ip = req.headers.get('x-forwarded-for') || 'unknown';
          await limiter.check(req, 10, ip); // 10 requests per minute per IP
        } catch (error) {
          return ApiResponse.rateLimitExceeded();
        }

        await connectDB();
        
        // Get students with pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 items per page
        const skip = (page - 1) * limit;
        
        // Get class and section filters
        const className = searchParams.get('class');
        const section = searchParams.get('section');
        const user = await getAuthenticatedUser(req);
        const schoolId = user?.schoolId;
        
        // Build query based on filters
        const query: any = {};
        if (className) query.class = className;
        if (section) query.sec = section;
        if (schoolId) query.schoolId = schoolId;
        
        // Get total count and paginated results
        const [total, students] = await Promise.all([
          Student.countDocuments(query),
          Student.find(query)
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
    },
    ['admin', 'school', 'teacher'] // Allowed roles
  );
};