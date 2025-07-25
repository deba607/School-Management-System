import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers middleware
export function securityHeaders(req: NextRequest) {
  const response = NextResponse.next();
  
  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  
  return response;
}

// Request validation middleware
export function validateRequest(req: NextRequest, requiredFields: string[] = []) {
  const errors: { field: string; message: string }[] = [];
  
  // Check for required fields in JSON body
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const contentType = req.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return req.json().then((body) => {
          for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === '') {
              errors.push({ field, message: `${field} is required` });
            }
          }
          
          if (errors.length > 0) {
            return NextResponse.json(
              { success: false, errors },
              { status: 400 }
            );
          }
          
          return { isValid: true, body };
        });
      }
      return { isValid: false, response: NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )};
    } catch (error) {
      return { 
        isValid: false, 
        response: NextResponse.json(
          { success: false, error: 'Invalid JSON body' },
          { status: 400 }
        )
      };
    }
  }
  
  return { isValid: true, body: {} };
}

// Sanitize input data
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    // Basic XSS protection
    return data.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeInput(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const key in data) {
      sanitized[key] = sanitizeInput(data[key]);
    }
    return sanitized;
  }
  
  return data;
}
