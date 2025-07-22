import { Attendance, IAttendance } from '@/models/Attendance';
import { connectDB } from '@/lib/mongoose';

export class AttendanceService {
  async createAttendance(data: Omit<IAttendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAttendance> {
    await connectDB();
    const attendance = new Attendance(data);
    return await attendance.save();
  }

  async getAllAttendance(): Promise<IAttendance[]> {
    await connectDB();
    return await Attendance.find({}).sort({ date: -1 });
  }
} 