import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { JWT_SECRET } from '@/config/constants';
import { ROLES } from '@/config/constants';

interface AuthOptions {
  roles?: string[];
  allowPublic?: boolean;
}

export function withApiAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: AuthOptions = { roles: [], allowPublic: false }
) {
  return async (req: NextRequest) => {
    // If public access is allowed and no roles are required, proceed
    if (options.allowPublic && (!options.roles || options.roles.length === 0)) {
      return handler(req);
    }

    // Get the token from the request
    const token = await getToken({ req, secret: JWT_SECRET });

    // Check if token exists and is valid
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (token.exp && typeof token.exp === 'number' && token.exp < currentTime) {
      return NextResponse.json(
        { success: false, error: 'Token expired' },
        { status: 401 }
      );
    }

    // Check if user has required role
    if (options.roles && options.roles.length > 0) {
      const userRole = token.role;
      if (!userRole || typeof userRole !== 'string' || !options.roles.includes(userRole)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    // Add user to request object for use in API routes
    const requestWithUser = new NextRequest(req);
    (requestWithUser as any).user = token;

    return handler(requestWithUser);
  };
}

// Helper functions for specific role checks
export const withAdmin = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withApiAuth(handler, { roles: [ROLES.ADMIN] });

export const withSchool = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withApiAuth(handler, { roles: [ROLES.SCHOOL, ROLES.ADMIN] });

export const withTeacher = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withApiAuth(handler, { roles: [ROLES.TEACHER, ROLES.ADMIN] });

export const withStudent = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withApiAuth(handler, { roles: [ROLES.STUDENT, ROLES.ADMIN] });

export const withAnyAuth = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withApiAuth(handler, { roles: Object.values(ROLES) });

export const withPublic = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withApiAuth(handler, { allowPublic: true });
