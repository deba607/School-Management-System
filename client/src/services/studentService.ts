import { Student, IStudent } from '@/models/Student';
import { connectDB } from '@/lib/mongoose';
import bcrypt from 'bcryptjs';

export class StudentService {
  async createStudent(studentData: Omit<IStudent, 'id' | 'createdAt' | 'updatedAt'>): Promise<IStudent> {
    await connectDB();
    try {
      // Check if student with same email already exists
      const existingStudent = await Student.findOne({ email: studentData.email });
      if (existingStudent) {
        throw new Error('Student with this email already exists');
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      studentData.password = hashedPassword;
      // Create new student
      const student = new Student(studentData);
      const savedStudent = await student.save();
      return savedStudent;
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
} 