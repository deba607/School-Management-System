import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  date: Date;
  students: Array<{
    id: string;
    status: string;
    name: string;
    class: string;
    sec: string;
  }>;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema({
  date: { type: Date, required: true },
  students: [
    {
      id: { type: String, required: true },
      status: { type: String, required: true },
      name: { type: String, required: true },
      class: { type: String, required: true },
      sec: { type: String, required: true },
    },
  ],
  schoolId: {
    type: String,
    required: [true, 'School ID is required'],
    trim: true
  },
}, { timestamps: true });

export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema); 