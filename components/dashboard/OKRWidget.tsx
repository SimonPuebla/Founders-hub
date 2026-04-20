import Link from "next/link";
import { Target } from "lucide-react";
import type { OKR, Task } from "@/types";

const STATUS_CONFIG: Record<string, { bar: string; badge: string; label: string }> = {
  on_track: { bar: "bg-[#22c55e]", badge: "text-[#22c55e] bg-[#22c55e]/10", label: "On track" },
  at_risk: { bar: "bg-[#f59e0b]", badge: "text-[#f59e0b] bg-[#f59e0b]/10", label: "At risk" },
  off_track: { bar: "bg-[#ef4444]", badge: "text-[#ef4444] bg-[#ef4444]/10", label: "Off track" },
  completed: { bar: "bg-[#3b82f6]", badge: "text-[#3b82f6] bg-[#3b82f6]/10", label: "Done" },
  paused: { bar: "bg-[#444444]", badge: "text-[#555555] bg-[#1a1a1a]", label: "Paused" },
};

interface OKRWidgetProps {
  okrs: OKR[];
  tasks: Task[];
  loading: boolean;
}

export function OKRWidget({ okrs, tasks, loading }: OKRWidgetProps) {
  const active = okrs.filter((o) => o.status !== "completed" && o.status !== "paused");

  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-[#7c5cfc]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            OKR Snapshot
          </span>
        </div>
        <Link
          href="/strategy"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          Strategy →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <p className="text-xs text-[#555555]">No active OKRs — define your strategy.</p>
      ) : (
        <div className="space-y-4">
          {active.map((okr) => {
            const cfg = STATUS_CONFIG[okr.status] || STATUS_CONFIG.off_track;
            const linkedTasks = tasks.filter((t) => t.okr_id === okr.id).length;
            return (
              <div key={okr.id}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs text-white leading-snug flex-1">{okr.title}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all ${cfg.bar}`}
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#555555]">
                    {okr.progress}% complete
                  </span>
                  <span className="font-mono text-[10px] text-[#444444]">
                    {linkedTasks} task{linkedTasks !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
