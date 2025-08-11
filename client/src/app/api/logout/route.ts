import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // In a stateless JWT system, logout is handled on the client by deleting the token.
  // Here, we simply return a success response. You can extend this to blacklist tokens if needed.
  return NextResponse.json({ success: true, message: "Logged out successfully." });
} 