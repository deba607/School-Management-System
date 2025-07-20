import { NextResponse } from 'next/server';
import { SchoolService } from '@/services/schoolService';
import { validateSchoolUpdate } from '@/validators/SchoolValidators';
import { connectDB } from '@/lib/mongoose';

const schoolService = new SchoolService();

// GET - Get a specific school by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    try {
      const school = await schoolService.getSchoolById(id);
      
      if (!school) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'School not found' 
          },
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
    } catch (error) {
      console.error('SchoolService GET by ID error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SchoolRoute GET by ID error:', error);
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const validation = validateSchoolUpdate(body);
    
    if (!validation.success) {
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
      const school = await schoolService.updateSchool(id, validation.data!);
      
      if (!school) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'School not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: true, 
          data: school, 
          message: 'School updated successfully' 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('SchoolService PUT error:', error);
      
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    try {
      const deleted = await schoolService.deleteSchool(id);
      
      if (!deleted) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'School not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'School deleted successfully' 
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('SchoolService DELETE error:', error);
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