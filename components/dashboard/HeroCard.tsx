"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Task, Opportunity } from "@/types";

interface HeroCardProps {
  priorities: string[];
  inProgress: number;
  blocked: number;
  topOpp?: Opportunity;
  loading: boolean;
}

export function HeroCard({ priorities, inProgress, blocked, topOpp, loading }: HeroCardProps) {
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const today = new Date();

  useEffect(() => {
    const id = setInterval(() => setTime(format(new Date(), "HH:mm")), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card-hero px-8 py-5">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              How&apos;s my day looking?
            </h1>
            <span className="text-[13px] capitalize" style={{ color: "var(--text-muted)" }}>
              {format(today, "EEEE d MMMM", { locale: es })}
            </span>
          </div>

          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-32 rounded animate-pulse" style={{ background: "var(--bg)" }} />
              ))}
            </div>
          ) : priorities.length > 0 ? (
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {priorities.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium tabular-nums" style={{ color: "var(--text-muted)" }}>{i + 1}.</span>
                  <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{p}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px]" style={{ color: "var(--amber)" }}>No focus defined — set priorities to start your day.</p>
          )}
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: inProgress > 0 ? "var(--blue)" : "var(--text-muted)" }}
              >
                {inProgress}
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>in progress</p>
            </div>
            <div className="w-px h-8" style={{ background: "var(--border)" }} />
            <div className="text-center">
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: blocked > 0 ? "var(--red)" : "var(--green)" }}
              >
                {blocked}
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>blocked</p>
            </div>
            {topOpp && (
              <>
                <div className="w-px h-8" style={{ background: "var(--border)" }} />
                <div className="max-w-[160px]">
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--amber)" }}>Live opp</span>
                  <p className="text-[13px] truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{topOpp.title}</p>
                </div>
              </>
            )}
          </div>
          <div className="text-right">
            <span className="text-3xl font-light tabular-nums" style={{ color: "var(--text-primary)" }}>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
