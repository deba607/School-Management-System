import { Types } from 'mongoose';

export interface IAttendanceStudent {
  id: string;
  name: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface IAttendance {
  _id?: string;
  className: string;
  section: string;
  subject: string;
  teacher: string;
  date: Date | string;
  students: IAttendanceStudent[];
  schoolId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
} 