import Event from "../models/Event";
import { EventInput } from "../validators/EventValidators";

export const createEvent = async (data: EventInput) => {
  const event = new Event(data);
  await event.save();
  return event;
};

export const getAllEvents = async () => {
  return await Event.find().sort({ date: -1 });
};

export const getEventsBySchool = async (schoolId: string) => {
  return await Event.find({ schoolId }).sort({ date: -1 });
};