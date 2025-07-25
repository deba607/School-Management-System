import { NextRequest, NextResponse } from "next/server";
import Event from "../../../../models/Event";
import { EventSchema } from "../../../../validators/EventValidators";
import connectDB from "../../../../lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request, context: { params: { id: string } }) {
  await connectDB();
  const { params } = await Promise.resolve(context);
  try {
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  await connectDB();
  const { params } = await Promise.resolve(context);
  try {
    const body = await req.json();
    const parsed = EventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }
    const event = await Event.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  await connectDB();
  const { params } = await Promise.resolve(context);
  try {
    const event = await Event.findByIdAndDelete(params.id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
} 