import { NextResponse } from 'next/server';
import { ClassScheduleService } from '@/services/classScheduleService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const className = searchParams.get('className');
    const section = searchParams.get('section');

    if (!schoolId || !className || !section) {
      return NextResponse.json({ message: 'Missing required parameters: schoolId, className, or section' }, { status: 400 });
    }

    const classScheduleService = new ClassScheduleService();
    const classSchedules = await classScheduleService.getClassSchedulesBySchoolClassAndSection(
      schoolId,
      className,
      section
    );

    return NextResponse.json(classSchedules);
  } catch (error) {
    console.error('Error fetching class schedules:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}