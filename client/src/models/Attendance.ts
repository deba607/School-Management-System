import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  className: string;
  section: string;
  subject: string;
  teacher: string;
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
  className: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
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

// Ensure latest schema is applied in dev/Next.js by clearing cached model
if (mongoose.models.Attendance) {
  delete mongoose.models.Attendance;
}
export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);