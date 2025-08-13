import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResultStudent {
  id: string;
  name: string;
  marks: string;
  grade: string;
}

export interface IResult extends Document {
  className: string;
  section: string;
  subject: string;
  teacher: string;
  date: string;
  students: IResultStudent[];
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema: Schema = new Schema({
  className: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  date: { type: String, required: true },
  students: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      marks: { type: String, required: true },
      grade: { type: String, required: true },
    },
  ],
  schoolId: { type: String, required: true, trim: true },
}, { timestamps: true });

// In development/Next.js, a previously cached model may have an outdated schema.
// Ensure the latest schema (with schoolId) is applied by removing the cached model first.
if (mongoose.models.Result) {
  delete mongoose.models.Result;
}
export const Result = mongoose.model<IResult>('Result', ResultSchema);