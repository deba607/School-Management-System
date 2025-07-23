import { NextRequest, NextResponse } from 'next/server';
import { SchoolService } from '@/services/schoolService';
import { validateSchoolUpdate } from '@/validators/SchoolValidators';
import { connectDB } from '@/lib/mongoose';
import bcrypt from 'bcryptjs';

const schoolService = new SchoolService();

// GET - Get a specific school by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      );
    }

    try {
      const school = await schoolService.getSchoolById(id);
      
      if (!school) {
        return NextResponse.json(
          { success: false, error: 'School not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: true, 
          data: school 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('SchoolService error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SchoolRoute GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a specific school
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    
    console.log('Updating school:', id, 'Data:', JSON.stringify(body, null, 2));
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      );
    }

    const validation = validateSchoolUpdate(body);
    console.log('Update validation result:', validation);
    
    if (!validation.success) {
      console.log('Update validation errors:', validation.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    try {
      if (!validation.data) throw new Error('Validation failed');
      const updateData = { ...validation.data };
      // If password is present, hash it
      if (updateData.password) {
        if (updateData.confirmPassword && updateData.password !== updateData.confirmPassword) {
          return NextResponse.json(
            { success: false, error: 'Passwords do not match' },
            { status: 400 }
          );
        }
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      // Remove confirmPassword before saving
      if ('confirmPassword' in updateData) delete updateData.confirmPassword;
      // If schoolId is being changed, ensure uniqueness
      if (updateData.schoolId) {
        const existing = await schoolService.getSchoolById(id);
        if (existing && existing.schoolId !== updateData.schoolId) {
          const duplicate = await SchoolService.prototype.getAllSchools.call(schoolService);
          if (duplicate.some(s => s.schoolId === updateData.schoolId)) {
            return NextResponse.json(
              { success: false, error: 'School ID already exists' },
              { status: 409 }
            );
          }
        }
      }
      const school = await schoolService.updateSchool(id, updateData);
      if (!school) {
        return NextResponse.json(
          { success: false, error: 'School not found' },
          { status: 404 }
        );
      }
      console.log('School updated successfully:', school._id);
      return NextResponse.json(
        { 
          success: true, 
          data: school, 
          message: 'School updated successfully' 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('SchoolService update error:', error);
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message 
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SchoolRoute PUT error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific school
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      );
    }

    try {
      const deleted = await schoolService.deleteSchool(id);
      
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'School not found' },
          { status: 404 }
        );
      }

      console.log('School deleted successfully:', id);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'School deleted successfully' 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('SchoolService delete error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SchoolRoute DELETE error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 