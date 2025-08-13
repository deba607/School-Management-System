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
    const userId = request.user?.userId; // Present for all roles
    const role = request.user?.role;      // Use role to scope filtering

    // Optional query filters by class/section
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('className');
    const section = searchParams.get('section');

    const query: any = {};
    if (schoolId) query.schoolId = schoolId;
    if (className) query.className = className;
    if (section) query.section = section;

    let attendance = await Attendance.find(query).sort({ date: -1 });

    // Only apply per-student filtering when the requester is a student
    if (role === 'student' && userId) {
      attendance = attendance.map((rec) => ({
        ...rec.toObject(),
        _id: rec._id ? String(rec._id) : undefined,
        date: rec.date,
        studentStatus: rec.students.find((s: { id: string }) => s.id === userId)
      })).filter((rec) => rec.studentStatus);
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

    // Persist className and section at root for efficient filtering
    const payload = {
      ...validation.data,
      className: validation.data.className,
      section: validation.data.section,
    } as any;

    const attendance = await attendanceService.createAttendance(payload);
    return NextResponse.json({ success: true, data: attendance, message: 'Attendance saved successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving attendance:', error);
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map((e: any) => e?.message || String(e));
      return NextResponse.json({ success: false, error: 'Attendance validation failed', details }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to save attendance' }, { status: 500 });
  }
}

// Use withAuth middleware to protect the routes
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['admin', 'school', 'teacher']);
export const POST = (req: NextRequest) => withAuth(req, handlePOST, ['admin', 'school', 'teacher']);