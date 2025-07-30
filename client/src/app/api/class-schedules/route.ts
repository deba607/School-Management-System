import { NextRequest, NextResponse } from 'next/server';
import { ClassScheduleService } from '@/services/classScheduleService';
import { validateClassSchedule } from '@/validators/ClassScheduleValidators';
import { connectDB } from '@/lib/mongoose';
import { withAuth } from '@/middleware/withAuth';

const classScheduleService = new ClassScheduleService();

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get schoolId from authenticated user
    const schoolId = request.user?.schoolId || request.user?.userId;
    
    if (!schoolId) {
      return NextResponse.json({ 
        success: false, 
        error: 'School ID not found' 
      }, { status: 400 });
    }
    
    // Use getClassSchedulesBySchool instead of getAllClassSchedules
    const schedules = await classScheduleService.getClassSchedulesBySchool(schoolId);
    
    // Format teacher name for frontend
    const data = schedules.map(s => {
      const obj = s.toObject();
      obj.teacherName = obj.teacher?.name || '';
      return obj;
    });
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching class schedules:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch class schedules' 
    }, { status: 500 });
  }
}

// Use withAuth middleware to protect the route
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['school', 'teacher']);

// Similarly update the POST function to use withAuth and include schoolId
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
    
    const validation = validateClassSchedule(body);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    const schedule = await classScheduleService.createClassSchedule(validation.data! as any);
    return NextResponse.json({ 
      success: true, 
      data: schedule, 
      message: 'Class schedule created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating class schedule:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create class schedule' 
    }, { status: 500 });
  }
}

export const POST = (req: NextRequest) => withAuth(req, handlePOST, ['school']);