import { NextRequest, NextResponse } from "next/server";
import { createEvent, getAllEvents } from "@/services/eventService";
import { EventSchema } from "@/validators/EventValidators";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { withAuth } from "@/middleware/withAuth";

async function handleGET(request: NextRequest) {
  await connectDB();
  try {
    // Get schoolId from authenticated user
    const schoolId = request.user?.schoolId;
    
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

async function handlePOST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    
    // Add schoolId from authenticated user if not provided
    if (!body.schoolId) {
      const schoolId = req.user?.schoolId;
      if (schoolId) {
        body.schoolId = schoolId;
      }
    }
    
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

// Use withAuth middleware to protect the routes
export const GET = (req: NextRequest) => withAuth(req, handleGET, ['school', 'teacher', 'student']);
export const POST = (req: NextRequest) => withAuth(req, handlePOST, ['school']);