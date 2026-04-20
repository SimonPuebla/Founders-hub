import Link from "next/link";
import { OKRStatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import type { OKR } from "@/types";

const STATUS_PROGRESS_COLOR: Record<string, string> = {
  on_track: "bg-[#22c55e]",
  at_risk: "bg-[#f59e0b]",
  off_track: "bg-[#ef4444]",
  completed: "bg-[#3b82f6]",
  paused: "bg-[#4a4a4a]",
};

interface OKRWidgetProps {
  okrs: OKR[];
  loading: boolean;
}

export function OKRWidget({ okrs, loading }: OKRWidgetProps) {
  const active = okrs.filter((o) => o.status !== "completed" && o.status !== "paused");

  return (
    <div className="rounded border border-[#1e1e1e] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">OKRs</span>
        <Link href="/strategy" className="font-mono text-[10px] text-[#4a4a4a] hover:text-[#7c5cfc] transition-colors">
          Ver todo →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-[#1e1e1e] rounded animate-pulse" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <p className="font-mono text-[10px] text-[#4a4a4a]">No active OKRs.</p>
      ) : (
        <div className="space-y-3">
          {active.map((okr) => (
            <div key={okr.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#f0f0f0] truncate mr-2 flex-1">{okr.title}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <OKRStatusBadge status={okr.status} />
                  <span className="font-mono text-[10px] text-[#6b6b6b]">{okr.progress}%</span>
                </div>
              </div>
              <Progress
                value={okr.progress}
                className="h-0.5"
                indicatorClassName={STATUS_PROGRESS_COLOR[okr.status] || "bg-[#7c5cfc]"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
