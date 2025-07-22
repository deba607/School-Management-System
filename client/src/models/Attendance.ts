import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAttendanceStudent {
  id: string;
  name: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface IAttendance extends Document {
  className: string;
  section: string;
  subject: string;
  teacher: string;
  date: string;
  students: IAttendanceStudent[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema({
  className: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  date: { type: String, required: true },
  students: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    },
  ],
}, { timestamps: true });

export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema); 