import { NextRequest, NextResponse } from 'next/server';
import { ResultService } from '@/services/resultService';
import { validateResult } from '@/validators/ResultValidators';
import { connectDB } from '@/lib/mongoose';
import { Result } from '@/models/Result';

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
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateResult(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const result = await resultService.createResult(validation.data!);
    return NextResponse.json({ success: true, data: result, message: 'Result saved successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save result' }, { status: 500 });
  }
} 