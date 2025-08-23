import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/models/Student';
import { connectDB } from '@/lib/mongoose';

// GET - Get a single student by id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectDB();
    const student = await Student.findById(params.id).select('-password');
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch student' }, { status: 500 });
  }
}

// PUT - Update a student by id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectDB();
    const body = await request.json();
    const student = await Student.findById(params.id);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    student.name = body.name ?? student.name;
    student.email = body.email ?? student.email;
    student.class = body.class ?? student.class;
    student.sec = body.sec ?? student.sec;
    student.address = body.address ?? student.address;
    if (body.pictures && Array.isArray(body.pictures) && body.pictures.length > 0) {
      student.pictures = body.pictures;
    }
    await student.save();
    const updated = await Student.findById(params.id).select('-password');
    return NextResponse.json({ success: true, data: updated, message: 'Student updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE - Delete a student by id
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await connectDB();
    const student = await Student.findByIdAndDelete(params.id);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
} 