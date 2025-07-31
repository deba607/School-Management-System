import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/models/Student';
import { connectDB } from '@/lib/mongoose';
import { withAuth } from '@/middleware/withAuth';

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get the student ID from the authenticated user
    const userId = request.user?.userId;
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID not found' 
      }, { status: 401 });
    }
    
    // Fetch the student data
    const student = await Student.findById(userId).select('-password');
    
    if (!student) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch student data' 
    }, { status: 500 });
  }
}

// Use withAuth middleware to protect the route and ensure only students can access it
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['student']);