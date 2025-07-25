import { NextRequest, NextResponse } from 'next/server';
import { ClassScheduleService } from '@/services/classScheduleService';
import { validateClassSchedule } from '@/validators/ClassScheduleValidators';
import { connectDB } from '@/lib/mongoose';

const classScheduleService = new ClassScheduleService();

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Ignore schoolId query param, always return all class schedules
    const schedules = await classScheduleService.getAllClassSchedules();
    // Format teacher name for frontend
    const data = schedules.map(s => {
      const obj = s.toObject();
      obj.teacherName = obj.teacher?.name || '';
      return obj;
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch class schedules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateClassSchedule(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const schedule = await classScheduleService.createClassSchedule(validation.data! as any);
    return NextResponse.json({ success: true, data: schedule, message: 'Class schedule created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create class schedule' }, { status: 500 });
  }
} 