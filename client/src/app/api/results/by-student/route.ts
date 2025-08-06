import { connectDB } from '@/lib/mongoose';
import { Result } from '@/models/Result';
import { withAuth } from '@/middleware/withAuth';
import { NextRequest, NextResponse } from 'next/server';

async function handleGET(request: Request) {
  try {
    await connectDB();
    
    // Get userId from authenticated user
    const userId = (request as any).user?.userId;
    const schoolId = (request as any).user?.schoolId;
    
    if (!userId) {
      return Response.json({
        success: false, 
        error: 'User ID not found' 
      }, { status: 401 });
    }
    
    // Fetch results
    const query = schoolId ? { schoolId } : {};
    const results = await Result.find(query).sort({ date: -1 });
    
    // Filter for records that include this student
    const studentResults = results.map(result => {
      const resultObj = result.toObject();
      return {
        ...resultObj,
        _id: resultObj._id ? String(resultObj._id) : undefined,
        studentResult: resultObj.students.find((s: { id: string }) => s.id === userId)
      };
    }).filter(result => result.studentResult);
    
    return Response.json({
      success: true, 
      data: studentResults 
    });
  } catch (error) {
    console.error('Error fetching student results:', error);
    return Response.json({
      success: false, 
      error: 'Failed to fetch student results' 
    }, { status: 500 });
  }
}

// Use withAuth middleware to protect the route and ensure only students can access it
export const GET = async (req: NextRequest) => {
  const response = await withAuth(req, async (request: NextRequest) => {
    const result = await handleGET(request);
    return NextResponse.json(result.body, { status: result.status });
  }, ['student']);
  return NextResponse.json(response.body, { status: response.status });
};
