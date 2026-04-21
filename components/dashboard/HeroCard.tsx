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
    <div className="glass-strong px-8 py-6">
      <div className="flex items-start justify-between gap-6">
        {/* Left: greeting + focus */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              How&apos;s my day looking?
            </h1>
            <span className="text-sm text-[#9CA3AF] capitalize">
              {format(today, "EEEE d MMMM", { locale: es })}
            </span>
          </div>

          {loading ? (
            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-32 bg-black/5 rounded animate-pulse" />
              ))}
            </div>
          ) : priorities.length > 0 ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {priorities.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-[#9CA3AF]">{i + 1}.</span>
                  <span className="text-sm text-[#374151]">{p}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#D97706] mt-2">No focus defined — set priorities to start your day.</p>
          )}
        </div>

        {/* Right: quick pulse + time */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className={`text-2xl font-bold ${inProgress > 0 ? "text-[#2563EB]" : "text-[#9CA3AF]"}`}>
                {inProgress}
              </span>
              <p className="text-xs text-[#9CA3AF] mt-0.5">in progress</p>
            </div>
            <div className="w-px h-10 bg-black/8" />
            <div className="text-center">
              <span className={`text-2xl font-bold ${blocked > 0 ? "text-[#DC2626]" : "text-[#16A34A]"}`}>
                {blocked}
              </span>
              <p className="text-xs text-[#9CA3AF] mt-0.5">blocked</p>
            </div>
            {topOpp && (
              <>
                <div className="w-px h-10 bg-black/8" />
                <div className="max-w-[160px]">
                  <span className="text-xs font-medium text-[#D97706] uppercase tracking-wide">Live opp</span>
                  <p className="text-sm text-[#374151] truncate mt-0.5">{topOpp.title}</p>
                </div>
              </>
            )}
          </div>
          <div className="text-right">
            <span className="text-3xl font-light tabular-nums text-[#111827]">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
