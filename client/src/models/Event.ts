import mongoose, { Schema, Document, models } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  schoolId: string;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  schoolId: { type: String, required: true },
});

export default models.Event || mongoose.model<IEvent>("Event", EventSchema);