import { connectDB } from '@/lib/mongoose';
import { Result } from '@/models/Result';
import { Student } from '@/models/Student';
import { withAuth } from '@/middleware/withAuth';
import { NextRequest, NextResponse } from 'next/server';

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get userId from authenticated user
    const userId = request.user?.userId;
    const schoolId = request.user?.schoolId;
    
    if (!userId) {
      return NextResponse.json({
        success: false, 
        error: 'User ID not found' 
      }, { status: 401 });
    }
    
    // Get student's class and section
    const student = await Student.findById(userId).select('class sec');
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const studentClass = student.class;
    const studentSection = student.sec;

    // Fetch results filtered by school, class and section
    const query: any = {};
    if (schoolId) query.schoolId = schoolId;
    if (studentClass) query.className = studentClass;
    if (studentSection) query.section = studentSection;

    const results = await Result.find(query).sort({ date: -1 });
    
    // Filter for records that include this student (safety)
    const studentResults = results.map(result => {
      const resultObj = result.toObject();
      return {
        ...resultObj,
        _id: resultObj._id ? String(resultObj._id) : undefined,
        studentResult: resultObj.students.find((s: { id: string }) => s.id === userId)
      };
    }).filter(result => result.studentResult);
    
    return NextResponse.json({
      success: true, 
      data: studentResults 
    });
  } catch (error) {
    console.error('Error fetching student results:', error);
    return NextResponse.json({
      success: false, 
      error: 'Failed to fetch student results' 
    }, { status: 500 });
  }
}

// Use withAuth middleware to protect the route and ensure only students can access it
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['student']);
