"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { CalendarEvent } from "@/types";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarWidgetProps {
  events: CalendarEvent[];
  loading: boolean;
}

export function CalendarWidget({ events, loading }: CalendarWidgetProps) {
  const today = new Date();

  const todayEvents = events.filter((e) => {
    const start = new Date(e.start);
    return isToday(start);
  });

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">
            Calendar — {format(today, "d MMM", { locale: es })}
          </span>
          {todayEvents.length > 0 && (
            <span className="text-xs font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
              {todayEvents.length}
            </span>
          )}
        </div>
        <Link href="/settings" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          Connect →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : todayEvents.length === 0 ? (
        <div className="py-1">
          <p className="text-sm text-[#6B7280]">No events today.</p>
          <Link href="/settings" className="mt-1 inline-block text-sm font-medium text-[#2563EB] hover:underline">
            Connect Google Calendar →
          </Link>
        </div>
      ) : (
        <div className="space-y-0.5">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-[#F9FAFB] transition-colors group"
            >
              <span className="text-sm font-medium text-[#2563EB] w-12 shrink-0">
                {event.start ? formatTime(event.start) : "—"}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-[#374151] truncate block">{event.title}</span>
                {event.attendees && event.attendees.length > 0 && (
                  <span className="text-xs text-[#9CA3AF] truncate block">
                    {event.attendees.slice(0, 2).join(", ")}
                    {event.attendees.length > 2 && ` +${event.attendees.length - 2}`}
                  </span>
                )}
              </div>
              {event.hasLinkedInput ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" title="Logged" />
              ) : (
                <Link
                  href={`/inputs?log=${event.id}&title=${encodeURIComponent(event.title)}&date=${event.start?.split("T")[0]}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Log meeting"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon-sm" asChild>
                    <span>
                      <FileText className="w-3.5 h-3.5 text-[#6B7280]" />
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
