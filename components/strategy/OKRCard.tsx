"use client";

import { OKRStatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Edit2, ChevronRight } from "lucide-react";
import type { OKR } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_PROGRESS_COLOR: Record<string, string> = {
  on_track: "bg-[#22c55e]",
  at_risk: "bg-[#f59e0b]",
  off_track: "bg-[#ef4444]",
  completed: "bg-[#3b82f6]",
  paused: "bg-[#4a4a4a]",
};

interface OKRCardProps {
  okr: OKR;
  isSelected?: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function OKRCard({ okr, isSelected, onClick, onEdit }: OKRCardProps) {
  const kpis = okr.kpis || [];
  const progressColor = STATUS_PROGRESS_COLOR[okr.status] || "bg-[#7c5cfc]";

  return (
    <div
      className={cn(
        "rounded border transition-colors cursor-pointer group",
        isSelected
          ? "bg-[#1a1a1a] border-[#7c5cfc]/50"
          : "bg-[#111111] border-[#1e1e1e] hover:border-[#2a2a2a]"
      )}
      onClick={onClick}
    >
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <OKRStatusBadge status={okr.status} />
              <span className="font-mono text-[10px] text-[#4a4a4a]">{okr.quarter}</span>
              {okr.owner && (
                <span className="font-mono text-[10px] text-[#4a4a4a]">· {okr.owner}</span>
              )}
            </div>
            <h3 className="text-sm font-medium text-[#f0f0f0] leading-snug">{okr.title}</h3>
            {okr.description && (
              <p className="text-xs text-[#6b6b6b] mt-1 leading-relaxed line-clamp-2">
                {okr.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <ChevronRight
              className={cn(
                "w-4 h-4 text-[#4a4a4a] transition-transform",
                isSelected && "rotate-90 text-[#7c5cfc]"
              )}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#4a4a4a] uppercase tracking-wider">
              Progress
            </span>
            <span className="font-mono text-xs text-[#f0f0f0]">{okr.progress}%</span>
          </div>
          <Progress
            value={okr.progress}
            className="h-1"
            indicatorClassName={progressColor}
          />
        </div>

        {kpis.length > 0 && (
          <div className="mt-4 border-t border-[#1e1e1e] pt-3 grid grid-cols-2 gap-3">
            {kpis.slice(0, 4).map((kpi) => {
              const pct = kpi.target_value > 0
                ? Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100))
                : 0;
              return (
                <div key={kpi.id}>
                  <p className="font-mono text-[10px] text-[#4a4a4a] uppercase tracking-wider leading-none mb-1">
                    {kpi.title}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-sm text-[#f0f0f0]">
                      {kpi.current_value.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] text-[#4a4a4a]">
                      / {kpi.target_value.toLocaleString()} {kpi.unit}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="h-0.5 mt-1"
                    indicatorClassName={progressColor}
                  />
                </div>
              );
            })}
          </div>
        )}

        {okr.deadline && (
          <div className="mt-3 flex items-center gap-1">
            <span className="font-mono text-[10px] text-[#4a4a4a]">
              Deadline: {formatDate(okr.deadline)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
