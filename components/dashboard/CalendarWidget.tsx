"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { Calendar, FileText } from "lucide-react";
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
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Calendar — {format(today, "d MMM", { locale: es })}
          </span>
          {todayEvents.length > 0 && (
            <span className="font-mono text-[10px] text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded">
              {todayEvents.length}
            </span>
          )}
        </div>
        <Link
          href="/settings"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          Connect calendar →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : todayEvents.length === 0 ? (
        <div className="py-1">
          <p className="text-xs text-[#555555]">No events today.</p>
          <Link
            href="/settings"
            className="font-mono text-[10px] text-[#3b82f6] hover:underline mt-1.5 inline-block"
          >
            Connect Google Calendar →
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 py-2 px-2 rounded hover:bg-[#1a1a1a] transition-colors group"
            >
              <div className="w-12 shrink-0">
                <span className="font-mono text-xs text-[#3b82f6]">
                  {event.start ? formatTime(event.start) : "—"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white truncate block">{event.title}</span>
                {event.attendees && event.attendees.length > 0 && (
                  <span className="font-mono text-[10px] text-[#555555] truncate block">
                    {event.attendees.slice(0, 2).join(", ")}
                    {event.attendees.length > 2 && ` +${event.attendees.length - 2}`}
                  </span>
                )}
              </div>
              {event.hasLinkedInput ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" title="Logged" />
              ) : (
                <Link
                  href={`/inputs?log=${event.id}&title=${encodeURIComponent(event.title)}&date=${event.start?.split("T")[0]}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Log meeting"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon-sm" asChild>
                    <span>
                      <FileText className="w-3 h-3" />
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
