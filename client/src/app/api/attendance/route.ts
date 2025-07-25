import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/services/attendanceService';
import { validateAttendance } from '@/validators/AttendanceValidators';
import { connectDB } from '@/lib/mongoose';
import { Attendance } from '@/models/Attendance';

const attendanceService = new AttendanceService();

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateAttendance(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const attendance = await attendanceService.createAttendance(validation.data!);
    return NextResponse.json({ success: true, data: attendance, message: 'Attendance saved successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save attendance' }, { status: 500 });
  }
} 