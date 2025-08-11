import { School, ISchool } from '@/models/School';
import { connectDB } from '@/lib/mongoose';

export class SchoolService {
  async createSchool(schoolData: Omit<ISchool, 'id' | 'createdAt' | 'updatedAt'>): Promise<ISchool> {
    await connectDB();
    
    try {
      // Check if school with same email already exists
      const existingSchool = await School.findOne({ email: schoolData.email });
      if (existingSchool) {
        throw new Error('School with this email already exists');
      }

      // Check if school with same schoolId already exists
      const existingSchoolId = await School.findOne({ schoolId: schoolData.schoolId });
      if (existingSchoolId) {
        throw new Error('School with this School ID already exists');
      }

      // Create new school
      const school = new School(schoolData);
      const savedSchool = await school.save();
      return savedSchool;
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  }

  async getAllSchools(): Promise<ISchool[]> {
    await connectDB();
    
    try {
      const schools = await School.find({}).sort({ createdAt: -1 });
      return schools;
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  }

  async getSchoolById(id: string): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findById(id);
      return school;
    } catch (error) {
      console.error('Error fetching school by ID:', error);
      throw error;
    }
  }

  async getSchoolByEmail(email: string): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findOne({ email });
      return school;
    } catch (error) {
      console.error('Error fetching school by email:', error);
      throw error;
    }
  }

  async getSchoolBySchoolId(schoolId: string): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findOne({ schoolId });
      return school;
    } catch (error) {
      console.error('Error fetching school by schoolId:', error);
      throw error;
    }
  }

  async updateSchool(id: string, updateData: Partial<ISchool>): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return school;
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  }

  async deleteSchool(id: string): Promise<boolean> {
    await connectDB();
    
    try {
      const result = await School.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  }

  async updateSchoolPictures(id: string, pictures: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    base64Data: string;
  }>): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findByIdAndUpdate(
        id,
        { pictures, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return school;
    } catch (error) {
      console.error('Error updating school pictures:', error);
      throw error;
    }
  }
} 