import { Types } from 'mongoose';

export interface IClassSchedule {
  _id?: string;
  className: string;
  section: string;
  subject: string;
  teacher: string | Types.ObjectId;
  day: string[];
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  schoolId: string | Types.ObjectId;
} 