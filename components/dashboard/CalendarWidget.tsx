"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime, formatDate } from "@/lib/utils";
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
    <div className="rounded border border-[#1e1e1e] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
            Hoy — {format(today, "d MMM", { locale: es })}
          </span>
        </div>
        <Link
          href="/settings"
          className="font-mono text-[10px] text-[#4a4a4a] hover:text-[#7c5cfc] transition-colors"
        >
          Calendar →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-[#1e1e1e] rounded animate-pulse" />
          ))}
        </div>
      ) : todayEvents.length === 0 ? (
        <div className="py-2">
          <p className="font-mono text-[10px] text-[#4a4a4a]">No hay eventos hoy.</p>
          <Link
            href="/settings"
            className="font-mono text-[10px] text-[#3b82f6] hover:underline mt-1 inline-block"
          >
            Conectar Google Calendar →
          </Link>
        </div>
      ) : (
        <div className="space-y-1.5">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 py-2 px-2 rounded hover:bg-[#1a1a1a] transition-colors group"
            >
              <div className="w-14 shrink-0">
                <span className="font-mono text-xs text-[#3b82f6]">
                  {event.start ? formatTime(event.start) : "—"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[#f0f0f0] truncate block">{event.title}</span>
                {event.attendees && event.attendees.length > 0 && (
                  <span className="font-mono text-[10px] text-[#4a4a4a] truncate block">
                    {event.attendees.slice(0, 2).join(", ")}
                    {event.attendees.length > 2 && ` +${event.attendees.length - 2}`}
                  </span>
                )}
              </div>
              {event.hasLinkedInput ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
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
