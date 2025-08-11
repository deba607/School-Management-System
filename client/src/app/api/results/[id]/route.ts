import { NextRequest, NextResponse } from 'next/server';
import { Result } from '@/models/Result';
import { connectDB } from '@/lib/mongoose';
import { validateResult } from '@/validators/ResultValidators';

// GET - Get a single result record by id
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const result = await Result.findById(params.id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch result' }, { status: 500 });
  }
}

// PUT - Update a result record by id
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const body = await request.json();
    const validation = validateResult(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    const updated = await Result.findByIdAndUpdate(
      params.id,
      { ...validation.data },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: 'Result updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update result' }, { status: 500 });
  }
}

// DELETE - Delete a result record by id
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { params } = await Promise.resolve(context);
  try {
    await connectDB();
    const deleted = await Result.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete result' }, { status: 500 });
  }
} 