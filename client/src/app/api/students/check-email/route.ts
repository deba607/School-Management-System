import { NextRequest } from 'next/server';
import { Student } from '@/models/Student';
import { connectDB } from '@/lib/mongoose';
import { publicRateLimiter } from '@/lib/rateLimit';
import { securityHeaders, sanitizeInput } from '@/middleware/security';
import { ApiResponse } from '@/lib/apiResponse';

// Apply rate limiting (10 requests per minute per IP)
const limiter = publicRateLimiter;

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      await limiter.check(request, 10, ip); // 10 requests per minute
    } catch (error) {
      return ApiResponse.rateLimitExceeded();
    }

    // Apply security headers
    securityHeaders(request);

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Validate email parameter
    if (!email) {
      return ApiResponse.error({
        error: 'Email parameter is required',
        status: 400,
        code: 'EMAIL_REQUIRED'
      });
    }

    // Sanitize and validate email format
    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitizedEmail)) {
      return ApiResponse.error({
        error: 'Please provide a valid email address',
        status: 400,
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    await connectDB();

    try {
      // Check if a student with this email already exists (case-insensitive)
      const existingStudent = await Student.findOne({ 
        email: { $regex: new RegExp(`^${sanitizedEmail}$`, 'i') }
      });

      return ApiResponse.success({
        data: {
          exists: !!existingStudent,
          message: existingStudent 
            ? 'A student with this email already exists' 
            : 'Email is available'
        }
      });

    } catch (dbError) {
      console.error('Database error checking email:', dbError);
      return ApiResponse.error({
        error: 'Error checking email availability',
        status: 500,
        code: 'DATABASE_ERROR'
      });
    }

  } catch (error) {
    console.error('Unexpected error in check-email endpoint:', error);
    return ApiResponse.serverError(error);
  }
}
