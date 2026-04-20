import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEvent } from "@/types";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    prompt: "consent",
  });
}

async function getAuthenticatedClient() {
  const supabase = createClient();
  const { data } = await supabase
    .from("settings")
    .select("google_refresh_token")
    .single();

  if (!data?.google_refresh_token) {
    throw new Error("Google Calendar not connected");
  }

  oauth2Client.setCredentials({
    refresh_token: data.google_refresh_token,
  });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

export async function exchangeCodeForTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getCalendarEvents(
  timeMin: Date,
  timeMax: Date
): Promise<CalendarEvent[]> {
  try {
    const calendar = await getAuthenticatedClient();
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 50,
    });

    const events = response.data.items || [];
    return events.map((event) => ({
      id: event.id || "",
      title: event.summary || "Sin título",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      attendees: event.attendees?.map((a) => a.displayName || a.email || "") || [],
      location: event.location || undefined,
      description: event.description || undefined,
    }));
  } catch {
    return [];
  }
}

export async function createCalendarBlock(
  title: string,
  date: string,
  durationMinutes = 30
): Promise<string | null> {
  try {
    const calendar = await getAuthenticatedClient();
    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
      },
    });

    return response.data.id || null;
  } catch {
    return null;
  }
}
