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
    const schoolId = request.user?.schoolId || request.user?.userId;
    
    let attendance;
    if (schoolId) {
      attendance = await Attendance.find({ schoolId });
    } else {
      attendance = await attendanceService.getAllAttendance();
    }
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

async function handlePOST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Add schoolId from authenticated user
    const schoolId = request.user?.schoolId || request.user?.userId;
    
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