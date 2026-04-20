import { NextResponse } from "next/server";
import { getCalendarEvents } from "@/lib/google-calendar/client";

export async function GET() {
  try {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    const events = await getCalendarEvents(now, weekEnd);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
