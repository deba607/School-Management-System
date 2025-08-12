import { NextRequest, NextResponse } from 'next/server';
import { School } from '@/models/School';
import { connectDB } from '@/lib/mongoose';

export async function GET(request: NextRequest, context: { params: { schoolId: string; imageIndex: string } }) {
  try {
    await connectDB();
    const { params } = await Promise.resolve(context);
    const { schoolId, imageIndex } = params;

    const index = parseInt(imageIndex);

    if (isNaN(index) || index < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid image index' },
        { status: 400 }
      );
    }

    // Find the school
    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    // Check if image exists
    if (!school.pictures || !school.pictures[index]) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    const image = school.pictures[index];

    try {
      // Convert base64 back to buffer
      const imageBuffer = Buffer.from(image.base64Data, 'base64');
      
      // Return the image with proper headers
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': image.mimeType,
          'Content-Length': image.size.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      });

    } catch (decodeError) {
      console.error('Base64 decode error:', decodeError);
      return NextResponse.json(
        { success: false, error: 'Failed to decode image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image serve error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 