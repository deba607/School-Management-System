import { Admin, IAdmin } from '@/models/Admin';
import { connectDB } from '@/lib/mongoose';
import bcrypt from 'bcryptjs';

export class AdminService {
  async createAdmin(adminData: Omit<IAdmin, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAdmin> {
    await connectDB();
    
    try {
      // Check if admin with same email already exists
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      adminData.password = hashedPassword;
      // Remove confirmPassword if present
      if ('confirmPassword' in adminData) {
        delete (adminData as any).confirmPassword;
      }
      // Create new admin
      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      return savedAdmin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    await connectDB();
    
    try {
      const admins = await Admin.find({}).sort({ createdAt: -1 });
      return admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }

  async getAdminById(id: string): Promise<IAdmin | null> {
    await connectDB();
    
    try {
      const admin = await Admin.findById(id);
      return admin;
    } catch (error) {
      console.error('Error fetching admin by ID:', error);
      throw error;
    }
  }

  async getAdminByEmail(email: string): Promise<IAdmin | null> {
    await connectDB();
    
    try {
      const admin = await Admin.findOne({ email });
      return admin;
    } catch (error) {
      console.error('Error fetching admin by email:', error);
      throw error;
    }
  }

  async updateAdmin(id: string, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
    await connectDB();
    
    try {
      const admin = await Admin.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return admin;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  async deleteAdmin(id: string): Promise<boolean> {
    await connectDB();
    
    try {
      const result = await Admin.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  async updateAdminPictures(id: string, pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>): Promise<IAdmin | null> {
    await connectDB();
    
    try {
      const admin = await Admin.findByIdAndUpdate(
        id,
        { pictures, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return admin;
    } catch (error) {
      console.error('Error updating admin pictures:', error);
      throw error;
    }
  }
} 