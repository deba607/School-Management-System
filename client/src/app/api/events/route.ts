import { NextRequest, NextResponse } from "next/server";
import { createEvent, getAllEvents } from "@/services/eventService";
import { EventSchema } from "@/validators/EventValidators";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    let events;
    if (schoolId) {
      events = await Event.find({ schoolId });
    } else {
      events = await getAllEvents();
    }
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const parsed = EventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }
    const event = await createEvent(parsed.data);
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
} 