import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-calendar/client";

export async function GET() {
  try {
    const url = getAuthUrl();
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 });
  }
}
