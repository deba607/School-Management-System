
import { connectDB } from '@/lib/mongoose';
import { Attendance } from '@/models/Attendance';
import { withAuth } from '@/middleware/withAuth';
import { NextRequest, NextResponse } from 'next/server';

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get userId from authenticated user
    const userId = request.user?.userId;
    const schoolId = request.user?.schoolId;
    
    if (!userId || !schoolId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID or School ID not found' 
      }, { status: 401 });
    }
    
    // Fetch attendance records for the student's school
    const attendanceRecords = await Attendance.find({ schoolId }).sort({ date: -1 });
    
    // Filter for records that include this student
    const studentAttendance = attendanceRecords.map(record => {
      const recordObj = record.toObject();
      return {
        ...recordObj,
        _id: recordObj._id ? String(recordObj._id) : undefined,
        studentStatus: recordObj.students.find(s => s.id === userId)
      };
    }).filter(record => record.studentStatus);
    
    return NextResponse.json({ 
      success: true, 
      data: studentAttendance 
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch student attendance' 
    }, { status: 500 });
  }
}

// Use withAuth middleware to protect the route and ensure only students can access it
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['student']);