import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/services/attendanceService';
import { validateAttendance } from '@/validators/AttendanceValidators';
import { connectDB } from '@/lib/mongoose';
import { Attendance } from '@/models/Attendance';
import { withAuth } from '@/middleware/withAuth';

const attendanceService = new AttendanceService();

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    const schoolId = request.user?.schoolId;
    const userId = request.user?.userId; // Get userId for student-specific filtering

    let attendance;
    if (schoolId) {
      attendance = await Attendance.find({ schoolId }).sort({ date: -1 });

      // If userId is present, filter for the specific student on the server-side
      if (userId) {
        attendance = attendance.map((rec) => ({
          ...rec.toObject(), // Convert Mongoose document to plain object
          _id: rec._id ? String(rec._id) : undefined,
          date: rec.date,
          studentStatus: rec.students.find((s: { id: string }) => s.id === userId)
        })).filter((rec) => rec.studentStatus);
      }

    } else {
      attendance = await attendanceService.getAllAttendance();
    }
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

async function handlePOST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Add schoolId from authenticated user (string)
    const schoolId = request.user?.schoolId;
    
    if (!schoolId) {
      return NextResponse.json({ 
        success: false, 
        error: 'School ID not found' 
      }, { status: 400 });
    }
    
    // Add schoolId to the body
    body.schoolId = schoolId;
    
    const validation = validateAttendance(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const attendance = await attendanceService.createAttendance(validation.data! as any);
    return NextResponse.json({ success: true, data: attendance, message: 'Attendance saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ success: false, error: 'Failed to save attendance' }, { status: 500 });
  }
}

// Use withAuth middleware to protect the routes
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['admin', 'school', 'teacher']);
export const POST = (req: NextRequest) => withAuth(req, handlePOST, ['admin', 'school', 'teacher']);