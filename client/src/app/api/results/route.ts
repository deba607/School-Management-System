import { NextRequest } from 'next/server';
import { ResultService } from '@/services/resultService';
import { validateResult } from '@/validators/ResultValidators';
import { connectDB } from '@/lib/mongoose';
import { Result } from '@/models/Result';
import { ApiResponse } from '@/lib/apiResponse';

const resultService = new ResultService();

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateResult(body);
    if (!validation.success) {
      return ApiResponse.validationError(validation.errors);
    }
    const result = await resultService.createResult(validation.data!);
    return ApiResponse.success({ data: result, message: 'Result saved successfully', status: 201 });
  } catch (error) {
    return ApiResponse.serverError(error);
  }
} 