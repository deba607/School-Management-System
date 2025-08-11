import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClassSchedule extends Document {
  className: string;
  section: string;
  subject: string;
  teacher: Types.ObjectId;
  day: string[];
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  schoolId: Types.ObjectId;
}

const ClassScheduleSchema: Schema = new Schema({
  className: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  day: { type: [String], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: { type: String, trim: true },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
}, { timestamps: true });

export const ClassSchedule = mongoose.models.ClassSchedule || mongoose.model<IClassSchedule>('ClassSchedule', ClassScheduleSchema); 