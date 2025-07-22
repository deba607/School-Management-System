import { ClassSchedule, IClassSchedule } from '@/models/ClassSchedule';
import { connectDB } from '@/lib/mongoose';

export class ClassScheduleService {
  async createClassSchedule(data: Omit<IClassSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<IClassSchedule> {
    await connectDB();
    const schedule = new ClassSchedule(data);
    return await schedule.save();
  }

  async getAllClassSchedules(): Promise<IClassSchedule[]> {
    await connectDB();
    return await ClassSchedule.find({})
      .populate('teacher', 'name')
      .sort({ className: 1, section: 1 });
  }
} 