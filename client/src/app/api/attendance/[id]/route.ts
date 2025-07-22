import { NextRequest, NextResponse } from 'next/server';
import { Attendance } from '@/models/Attendance';
import { connectDB } from '@/lib/mongoose';
import { validateAttendance } from '@/validators/AttendanceValidators';

// GET - Get a single attendance record by id
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const attendance = await Attendance.findById(params.id);
    if (!attendance) {
      return NextResponse.json({ success: false, error: 'Attendance record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch attendance record' }, { status: 500 });
  }
}

// PUT - Update an attendance record by id
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateAttendance(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const updated = await Attendance.findByIdAndUpdate(
      params.id,
      { ...validation.data },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Attendance record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: 'Attendance updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update attendance record' }, { status: 500 });
  }
}

// DELETE - Delete an attendance record by id
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const deleted = await Attendance.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Attendance record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Attendance record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete attendance record' }, { status: 500 });
  }
} 