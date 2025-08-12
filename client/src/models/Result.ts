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
}, { timestamps: true });

export const Result = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema); 