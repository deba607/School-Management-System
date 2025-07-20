import { School, ISchool } from '@/models/School';
import bcrypt from 'bcryptjs';
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

      // Check if school with same token already exists
      const existingToken = await School.findOne({ token: schoolData.token });
      if (existingToken) {
        throw new Error('School with this token already exists');
      }

      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(schoolData.password, saltRounds);

      // Create new school with hashed password
      const school = new School({
        ...schoolData,
        password: hashedPassword
      });

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

  async getSchoolByToken(token: string): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findOne({ token });
      return school;
    } catch (error) {
      console.error('Error fetching school by token:', error);
      throw error;
    }
  }

  async updateSchool(id: string, updateData: Partial<ISchool>): Promise<ISchool | null> {
    await connectDB();
    
    try {
      // If password is being updated, hash it
      if (updateData.password) {
        const saltRounds = 12;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }

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

  async validateSchoolCredentials(email: string, password: string): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findOne({ email });
      if (!school) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, school.password);
      if (!isPasswordValid) {
        return null;
      }

      return school;
    } catch (error) {
      console.error('Error validating school credentials:', error);
      throw error;
    }
  }

  async updateSchoolPictures(id: string, pictureUrls: string[]): Promise<ISchool | null> {
    await connectDB();
    
    try {
      const school = await School.findByIdAndUpdate(
        id,
        { pictures: pictureUrls, updatedAt: new Date() },
        { new: true }
      );
      return school;
    } catch (error) {
      console.error('Error updating school pictures:', error);
      throw error;
    }
  }
} 