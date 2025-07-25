import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Admin } from '@/models/Admin';
import { School } from '@/models/School';
import { Teacher } from '@/models/Teacher';
import { Student } from '@/models/Student';
import { connectDB } from '@/lib/mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  roles?: string[]
) {
  try {
    await connectDB();
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Check if the user exists
    let user;
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.userId);
    } else if (decoded.role === 'school') {
      user = await School.findById(decoded.userId);
    } else if (decoded.role === 'teacher') {
      user = await Teacher.findById(decoded.userId);
    } else if (decoded.role === 'student') {
      user = await Student.findById(decoded.userId);
    }

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If roles are specified, check if the user has the required role
    if (roles && roles.length > 0) {
      if (!roles.map(r => r.toLowerCase()).includes(decoded.role.toLowerCase())) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Add user info to the request for the handler to use
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      schoolId: decoded.schoolId
    };

    // If we get here, the user is authenticated and authorized
    return handler(req);
  } catch (error: any) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Authentication failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to create protected API handlers
export function createProtectedHandler(handler: (req: NextRequest) => Promise<NextResponse>, roles?: string[]) {
  return async (req: NextRequest) => {
    return withAuth(req, handler, roles);
  };
}

// Extend the NextRequest type to include user info
declare module 'next/server' {
  interface NextRequest {
    user?: {
      userId: string;
      role: string;
      schoolId?: string;
    };
  }
}
