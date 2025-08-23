import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/services/adminService';
import { validateAdminUpdate } from '@/validators/AdminValidators';
import { connectDB } from '@/lib/mongoose';

const adminService = new AdminService();

// GET - Get a specific admin by ID
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    try {
      const admin = await adminService.getAdminById(id);
      
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'Admin not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: true, 
          data: admin 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('AdminService error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('AdminRoute GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a specific admin
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    console.log('Updating admin:', id, 'Data:', JSON.stringify(body, null, 2));
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const validation = validateAdminUpdate(body);
    console.log('Update validation result:', validation);
    
    if (!validation.success) {
      console.log('Update validation errors:', validation.errors);
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
      const admin = await adminService.updateAdmin(id, validation.data!);
      
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'Admin not found' },
          { status: 404 }
        );
      }

      console.log('Admin updated successfully:', admin._id);
      
      return NextResponse.json(
        { 
          success: true, 
          data: admin, 
          message: 'Admin updated successfully' 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('AdminService update error:', error);
      
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
  } catch (error: unknown) {
    console.error('AdminRoute PUT error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific admin
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    try {
      const deleted = await adminService.deleteAdmin(id);
      
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Admin not found' },
          { status: 404 }
        );
      }

      console.log('Admin deleted successfully:', id);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Admin deleted successfully' 
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('AdminService delete error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error' 
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('AdminRoute DELETE error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 