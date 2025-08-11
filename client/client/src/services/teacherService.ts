import { Teacher, ITeacher } from '@/models/Teacher';
import { connectDB } from '@/lib/mongoose';
import bcrypt from 'bcryptjs';

export class TeacherService {
  async createTeacher(teacherData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    address: string;
    password: string;
    pictures: any[];
    schoolId: string;
    otp?: string;
    otpExpiry?: Date;
  }): Promise<ITeacher> {
    await connectDB();
    try {
      // Check if teacher with same email already exists
      const existingTeacher = await Teacher.findOne({ email: teacherData.email });
      if (existingTeacher) {
        throw new Error('Teacher with this email already exists');
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(teacherData.password, 10);
      teacherData.password = hashedPassword;
      // Create new teacher
      const teacher = new Teacher(teacherData);
      const savedTeacher = await teacher.save();
      return savedTeacher;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  }
} 