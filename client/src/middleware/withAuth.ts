import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  roles?: string[]
) {
  try {
    // Get the token from the request
    const token = await getToken({ req });
    
    // If there's no token, return unauthorized
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If roles are specified, check if the user has the required role
    if (roles && roles.length > 0) {
      const userRole = token.role;
      if (!userRole || !roles.includes(userRole)) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Not authorized' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // If we get here, the user is authenticated and authorized
    return handler(req);
  } catch (error) {
    console.error('Authentication error:', error);
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
