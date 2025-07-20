import { NextResponse } from 'next/server';
import { ContactService } from '@/services/contactService';
import { validateContact } from '@/validators/ContactValidators';
import { connectDB } from '@/lib/mongoose';
// If '@/middleware/' does not exist, comment out or remove the import
// import { rateLimiterMiddleware } from '@/middleware/';

const contactService = new ContactService();

export async function POST(request: Request) {
  try {
    await connectDB();
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // const rateLimitRes = await rateLimiterMiddleware(ip);
    // if (rateLimitRes) return rateLimitRes;

    // Validate request
    const body = await request.json();
    const validation = validateContact(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors },
        { status: 400 }
      );
    }

    // Debug log validation data
    console.log('Validation data:', validation.data);

    try {
      const contact = await contactService.createContact(validation.data!);
      console.log('Contact created:', contact);
      return NextResponse.json(
        { success: true, data: contact, message: 'Contact created successfully' },
        { status: 201 }
      );
    } catch (error) {
      console.error('ContactService error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('ContactRoute error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}