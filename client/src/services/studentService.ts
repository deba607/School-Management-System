import { Student, IStudent } from '@/models/Student';
import { connectDB } from '@/lib/mongoose';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'; // added import statement for mongoose

export class StudentService {
  async createStudent(studentData: {
    name: string;
    email: string;
    password: string;
    class: string;
    sec: string;
    address: string;
    pictures: any[];
    schoolId: string | mongoose.Types.ObjectId;
    otp?: string;
    otpExpiry?: Date;
  }): Promise<IStudent> {
    await connectDB();
    try {
      // Check if student with same email already exists
      const existingStudent = await Student.findOne({ email: studentData.email });
      if (existingStudent) {
        throw new Error('Student with this email already exists');
      }
      
      // Ensure schoolId is an ObjectId
      const schoolId = typeof studentData.schoolId === 'string' 
        ? new mongoose.Types.ObjectId(studentData.schoolId)
        : studentData.schoolId;
      
      // Create student data with proper types
      const studentDataToSave = {
        ...studentData,
        schoolId,
        password: await bcrypt.hash(studentData.password, 10)
      };
      
      // Create and save the student
      const student = new Student(studentDataToSave);
      return await student.save();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async getAllStudents(): Promise<IStudent[]> {
    await connectDB();
    try {
      const students = await Student.find({}).sort({ createdAt: -1 });
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getStudentsByClassAndSection(className: string, section: string): Promise<IStudent[]> {
    await connectDB();
    return await Student.find({ class: className, sec: section }).sort({ name: 1 });
  }

  async getStudentsByClassAndSectionAndSchool(className: string, section: string, schoolId: string): Promise<IStudent[]> {
    await connectDB();
    return await Student.find({ class: className, sec: section, schoolId }).sort({ name: 1 });
  }
} 