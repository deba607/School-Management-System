import { NextRequest, NextResponse } from "next/server";
import Event from "../../../../models/Event";
import { EventSchema } from "../../../../validators/EventValidators";
import connectDB from "../../../../lib/mongodb";
import mongoose from "mongoose";
import { withAuth } from "@/middleware/withAuth";

async function handleGET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const params = await context.params;
  try {
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}

async function handlePUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const params = await context.params;
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

async function handleDELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const params = await context.params;
  try {
    const event = await Event.findByIdAndDelete(params.id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}

export const GET = (req: NextRequest, context: { params: Promise<{ id: string }> }) => withAuth(req, (r) => handleGET(r, context), ['school', 'teacher', 'student']);
export const PUT = (req: NextRequest, context: { params: Promise<{ id: string }> }) => withAuth(req, (r) => handlePUT(r, context), ['school']);
export const DELETE = (req: NextRequest, context: { params: Promise<{ id: string }> }) => withAuth(req, (r) => handleDELETE(r, context), ['school']);