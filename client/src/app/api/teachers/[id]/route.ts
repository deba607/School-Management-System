import { NextRequest, NextResponse } from 'next/server';
import { Teacher } from '@/models/Teacher';
import { connectDB } from '@/lib/mongoose';

// GET - Get a single teacher by id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectDB();
    const teacher = await Teacher.findById(params.id).select('-password');
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: teacher });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch teacher' }, { status: 500 });
  }
}

// PUT - Update a teacher by id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectDB();
    const body = await request.json();
    const teacher = await Teacher.findById(params.id);
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
    }
    teacher.name = body.name ?? teacher.name;
    teacher.email = body.email ?? teacher.email;
    teacher.subject = body.subject ?? teacher.subject;
    teacher.address = body.address ?? teacher.address;
    if (body.pictures && Array.isArray(body.pictures) && body.pictures.length > 0) {
      teacher.pictures = body.pictures;
    }
    await teacher.save();
    const updated = await Teacher.findById(params.id).select('-password');
    return NextResponse.json({ success: true, data: updated, message: 'Teacher updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update teacher' }, { status: 500 });
  }
}

// DELETE - Delete a teacher by id
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectDB();
    const teacher = await Teacher.findByIdAndDelete(params.id);
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete teacher' }, { status: 500 });
  }
} 