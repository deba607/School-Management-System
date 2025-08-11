import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/http';

export class ApiResponseUtil {
  static success<T>(data: T, message: string = 'Success'): NextResponse {
    return NextResponse.json({ success: true, message, data }, { status: 200 });
  }

  static created<T>(data: T, message: string = 'Resource created'): NextResponse {
    return NextResponse.json({ success: true, message, data }, { status: 201 });
  }

  static badRequest(message: string = 'Bad request'): NextResponse {
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse {
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }

  static forbidden(message: string = 'Forbidden'): NextResponse {
    return NextResponse.json({ success: false, error: message }, { status: 403 });
  }

  static notFound(message: string = 'Resource not found'): NextResponse {
    return NextResponse.json({ success: false, error: message }, { status: 404 });
  }

  static error(error: Error | string = 'Internal server error'): NextResponse {
    const message = error instanceof Error ? error.message : error;
    console.error('API Error:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}