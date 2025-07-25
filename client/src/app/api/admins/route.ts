import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/adminService';
import { validateAdmin } from '@/validators/AdminValidators';
import { connectDB } from '@/lib/mongoose';
import { ApiResponse } from '@/lib/apiResponse';

const adminService = new AdminService();

// POST - Create a new admin
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    let body: any;
    let isFormData = false;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      isFormData = true;
      const formData = await request.formData();
      body = {};
      for (const [key, value] of formData.entries()) {
        if (key === 'pictures' && value instanceof File) {
          // Handle file uploads (base64 encode for now)
          if (!body.pictures) body.pictures = [];
          const file = value as File;
          const arrayBuffer = await file.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString('base64');
          body.pictures.push({
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            base64Data,
          });
        } else {
          body[key] = String(value);
        }
      }
    } else {
      body = await request.json();
    }
    console.log('Received admin data:', JSON.stringify(body, null, 2));
    
    const validation = validateAdmin(body);
    console.log('Validation result:', validation);
    
    if (!validation.success) {
      console.log('Validation errors:', validation.errors);
      return ApiResponse.validationError(validation.errors);
    }

    try {
      if (!validation.data) throw new Error('Validation failed');
      const { confirmPassword, ...adminData } = validation.data;
      // Cast to any to satisfy the type, since AdminService handles the rest
      const admin = await adminService.createAdmin(adminData as any);
      console.log('Admin created:', admin._id);
      const adminObj = admin.toObject();
      delete adminObj.password;
      return ApiResponse.success({ data: adminObj, message: 'Admin created successfully', status: 201 });
    } catch (error: any) {
      console.error('AdminService error:', error);
      
      // Handle specific errors
      if (error.message.includes('already exists')) {
        return ApiResponse.error({ error: error.message, status: 409, code: 'DUPLICATE_EMAIL' });
      }
      
      return ApiResponse.serverError(error);
    }
  } catch (error: unknown) {
    console.error('AdminRoute POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return ApiResponse.serverError(error);
  }
}

// GET - Get all admins
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    try {
      const admins = await adminService.getAllAdmins();
      
      // Apply search filter if provided
      let filteredAdmins = admins;
      if (search) {
        filteredAdmins = admins.filter(admin => 
          admin.name.toLowerCase().includes(search.toLowerCase()) ||
          admin.email.toLowerCase().includes(search.toLowerCase()) ||
          admin.phone.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

      return ApiResponse.success({
        data: paginatedAdmins,
        message: undefined,
        status: 200,
        headers: undefined,
      });
    } catch (error: any) {
      console.error('AdminService GET error:', error);
      return ApiResponse.serverError(error);
    }
  } catch (error: unknown) {
    console.error('AdminRoute GET error:', error);
    return ApiResponse.serverError(error);
  }
} 