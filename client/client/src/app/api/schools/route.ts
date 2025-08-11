import { NextResponse } from 'next/server';
import { SchoolService } from '@/services/schoolService';
import { validateSchool } from '@/validators/SchoolValidators';
import { connectDB } from '@/lib/mongoose';
import bcrypt from 'bcryptjs';

const schoolService = new SchoolService();

// POST - Create a new school
export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const body: any = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'pictures' && value instanceof File) {
        if (!body.pictures) body.pictures = [];
        const buffer = Buffer.from(await value.arrayBuffer());
        body.pictures.push({
          originalName: value.name,
          mimeType: value.type,
          size: value.size,
          base64Data: buffer.toString('base64'),
        });
      } else {
        body[key] = value;
      }
    }
    console.log('Received school data:', JSON.stringify(body, null, 2));
    // Extra validation and logging for schoolId
    if (!body.schoolId || typeof body.schoolId !== 'string' || !body.schoolId.trim()) {
      console.error('Missing or empty schoolId in request');
      return NextResponse.json({ success: false, error: 'School ID is required and must not be empty.' }, { status: 400 });
    }
    console.log('schoolId received:', body.schoolId);

    const validation = validateSchool(body);
    console.log('Validation result:', validation);

    if (!validation.success) {
      console.log('Validation errors:', validation.errors);
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
      const { confirmPassword, password, ...rest } = validation.data;
      const schoolData = { ...rest, password: await bcrypt.hash(password, 10) };
      // Attach pictures if present
      if (body.pictures) {
        schoolData.pictures = body.pictures;
      }
      const school = await schoolService.createSchool(schoolData as any);
      console.log('School created:', school._id);
      return NextResponse.json(
        {
          success: true,
          data: school,
          message: 'School created successfully'
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('SchoolService error:', error);
      // Handle specific errors
      if (error.message && error.message.includes('already exists')) {
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
    console.error('SchoolRoute POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET - Get all schools
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    try {
      const schools = await schoolService.getAllSchools();
      
      // Apply search filter if provided
      let filteredSchools = schools;
      if (search) {
        filteredSchools = schools.filter(school => 
          school.name.toLowerCase().includes(search.toLowerCase()) ||
          school.email.toLowerCase().includes(search.toLowerCase()) ||
          school.address.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSchools = filteredSchools.slice(startIndex, endIndex);

      return NextResponse.json(
        { 
          success: true, 
          data: paginatedSchools,
          pagination: {
            page,
            limit,
            total: filteredSchools.length,
            totalPages: Math.ceil(filteredSchools.length / limit)
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('SchoolService GET error:', error);
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