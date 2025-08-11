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
    const schoolId = request.user?.schoolId || request.user?.userId;
    
    let results;
    if (schoolId) {
      results = await Result.find({ schoolId });
    } else {
      results = await resultService.getAllResults();
    }
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
    const schoolId = request.user?.schoolId || request.user?.userId;
    
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