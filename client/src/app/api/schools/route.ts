import { NextResponse } from 'next/server';
import { SchoolService } from '@/services/schoolService';
import { validateSchool } from '@/validators/SchoolValidators';
import { connectDB } from '@/lib/mongoose';

const schoolService = new SchoolService();

// POST - Create a new school
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log('Received school data:', JSON.stringify(body, null, 2));
    
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
      const school = await schoolService.createSchool(validation.data!);
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