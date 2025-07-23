import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function middleware(request: any) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/AdminDashboard/:path*'],
}; 