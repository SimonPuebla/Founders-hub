import Link from "next/link";
import { AlertOctagon, Clock, TrendingDown } from "lucide-react";
import { isOverdue, formatDate } from "@/lib/utils";
import type { Task, Opportunity } from "@/types";

interface BlockedRisksWidgetProps {
  blockedTasks: Task[];
  opps: Opportunity[];
  loading: boolean;
  todayStr: string;
}

export function BlockedRisksWidget({
  blockedTasks,
  opps,
  loading,
  todayStr,
}: BlockedRisksWidgetProps) {
  const overdueTasks = blockedTasks.filter(
    (t) => t.due_date && t.due_date < todayStr
  );
  const stalledOpps = opps.filter((o) => o.status === "reviewing");
  const totalRisks = blockedTasks.length + stalledOpps.length;

  return (
    <div
      className={`rounded-lg border bg-[#0f0f0f] p-5 flex flex-col ${
        totalRisks > 0
          ? "border-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
          : "border-[#222222]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon
            className={`w-3.5 h-3.5 ${totalRisks > 0 ? "text-[#ef4444]" : "text-[#555555]"}`}
          />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Blocked & Risks
          </span>
          {totalRisks > 0 && (
            <span className="font-mono text-[10px] text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 px-1.5 py-0.5 rounded">
              {totalRisks}
            </span>
          )}
        </div>
        <Link
          href="/tasks"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2 flex-1">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : totalRisks === 0 ? (
        <div className="flex-1 flex flex-col items-start justify-center gap-1.5 py-2">
          <div className="flex items-center gap-2 text-[#22c55e]">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">No blockers</span>
          </div>
          <p className="text-xs text-[#555555]">All clear — execution is unblocked</p>
        </div>
      ) : (
        <div className="flex-1 space-y-1 overflow-hidden">
          {blockedTasks.slice(0, 4).map((task) => (
            <Link
              key={task.id}
              href="/tasks"
              className="flex items-start gap-2 py-2 px-2 rounded hover:bg-[#ef4444]/5 transition-colors group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white truncate block">{task.title}</span>
                {task.due_date && isOverdue(task.due_date) && (
                  <span className="font-mono text-[10px] text-[#ef4444]">
                    overdue {formatDate(task.due_date, "dd MMM")}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-[#ef4444] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                blocked
              </span>
            </Link>
          ))}

          {stalledOpps.slice(0, 2).map((opp) => (
            <Link
              key={opp.id}
              href="/opportunities"
              className="flex items-start gap-2 py-2 px-2 rounded hover:bg-[#f59e0b]/5 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white truncate block">{opp.title}</span>
                <span className="font-mono text-[10px] text-[#f59e0b]">stalled — reviewing</span>
              </div>
            </Link>
          ))}

          {totalRisks > 6 && (
            <p className="font-mono text-[10px] text-[#555555] px-2 pt-1">
              +{totalRisks - 6} more risks
            </p>
          )}
        </div>
      )}
    </div>
  );
}
