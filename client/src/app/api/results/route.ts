import { NextRequest, NextResponse } from 'next/server';
import { ResultService } from '@/services/resultService';
import { validateResult } from '@/validators/ResultValidators';
import { connectDB } from '@/lib/mongoose';
import { Result } from '@/models/Result';
import { ApiResponse } from '@/lib/apiResponse';
import { withAuth } from '@/middleware/withAuth';

const resultService = new ResultService();

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get schoolId from authenticated user
    const schoolId = request.user?.schoolId;

    // Optional query filters
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('className');
    const section = searchParams.get('section');

    const query: any = {};
    if (schoolId) query.schoolId = schoolId;
    if (className) query.className = className;
    if (section) query.section = section;
    
    const results = await Result.find(query);
    return ApiResponse.success({ data: results });
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}

async function handlePOST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Add schoolId from authenticated user
    const schoolId = request.user?.schoolId;
    
    if (!schoolId) {
      return ApiResponse.error({
        error: 'School ID not found',
        status: 400
      });
    }
    
    // Add schoolId to the body
    body.schoolId = schoolId;
    
    const validation = validateResult(body);
    if (!validation.success) {
      return ApiResponse.validationError(Array.isArray(validation.errors) ? validation.errors : [validation.errors || '']);
    }
    const result = await resultService.createResult(validation.data! as any);
    return ApiResponse.success({ data: result, message: 'Result saved successfully', status: 201 });
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}

// Use withAuth middleware to protect the routes
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['admin', 'school', 'teacher']);
export const POST = (req: NextRequest) => withAuth(req, handlePOST, ['admin', 'school', 'teacher']);