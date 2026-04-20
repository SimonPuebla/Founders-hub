import Link from "next/link";
import type { OKR, Task } from "@/types";

const STATUS_CONFIG: Record<string, { bar: string; badge: string; label: string }> = {
  on_track: { bar: "bg-[#16A34A]", badge: "text-[#16A34A] bg-[#F0FDF4]", label: "On track" },
  at_risk: { bar: "bg-[#D97706]", badge: "text-[#D97706] bg-[#FFFBEB]", label: "At risk" },
  off_track: { bar: "bg-[#DC2626]", badge: "text-[#DC2626] bg-[#FEF2F2]", label: "Off track" },
  completed: { bar: "bg-[#2563EB]", badge: "text-[#2563EB] bg-[#EFF6FF]", label: "Done" },
  paused: { bar: "bg-[#D1D5DB]", badge: "text-[#6B7280] bg-[#F3F4F6]", label: "Paused" },
};

interface OKRWidgetProps {
  okrs: OKR[];
  tasks: Task[];
  loading: boolean;
}

export function OKRWidget({ okrs, tasks, loading }: OKRWidgetProps) {
  const active = okrs.filter((o) => o.status !== "completed" && o.status !== "paused");

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#111827]">OKR Snapshot</span>
        <Link href="/strategy" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          Strategy →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="py-1">
          <p className="text-sm text-[#6B7280]">No active OKRs</p>
          <Link href="/strategy" className="mt-1 inline-block text-sm font-medium text-[#2563EB] hover:underline">
            Define strategy →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((okr) => {
            const cfg = STATUS_CONFIG[okr.status] || STATUS_CONFIG.off_track;
            const linkedTasks = tasks.filter((t) => t.okr_id === okr.id).length;
            return (
              <div key={okr.id}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-sm text-[#374151] leading-snug flex-1">{okr.title}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all ${cfg.bar}`}
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">{okr.progress}% complete</span>
                  <span className="text-xs text-[#9CA3AF]">
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
