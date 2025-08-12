import { NextRequest, NextResponse } from 'next/server';
import { ClassSchedule } from '@/models/ClassSchedule';
import { connectDB } from '@/lib/mongoose';
import { validateClassSchedule } from '@/validators/ClassScheduleValidators';

// GET - Get a single class schedule by id
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const schedule = await ClassSchedule.findById(params.id).populate('teacher', 'name');
    if (!schedule) {
      return NextResponse.json({ success: false, error: 'Class schedule not found' }, { status: 404 });
    }
    const obj = schedule.toObject();
    obj.teacherName = obj.teacher?.name || '';
    return NextResponse.json({ success: true, data: obj });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch class schedule' }, { status: 500 });
  }
}

// PUT - Update a class schedule by id
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateClassSchedule(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const updated = await ClassSchedule.findByIdAndUpdate(
      params.id,
      { ...validation.data },
      { new: true, runValidators: true }
    ).populate('teacher', 'name');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Class schedule not found' }, { status: 404 });
    }
    const obj = updated.toObject();
    obj.teacherName = obj.teacher?.name || '';
    return NextResponse.json({ success: true, data: obj, message: 'Class schedule updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update class schedule' }, { status: 500 });
  }
}

// DELETE - Delete a class schedule by id
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const deleted = await ClassSchedule.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Class schedule not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Class schedule deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete class schedule' }, { status: 500 });
  }
} 