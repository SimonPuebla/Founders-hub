import Link from "next/link";
import { formatDate, isOverdue } from "@/lib/utils";
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
  const stalledOpps = opps.filter((o) => o.status === "reviewing");
  const totalRisks = blockedTasks.length + stalledOpps.length;

  return (
    <div
      className={`bg-white rounded-lg p-5 ${
        totalRisks > 0
          ? "border border-[#FECACA]"
          : "border border-[#E6E8EB]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">Blocked & Risks</span>
          {totalRisks > 0 && (
            <span className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-full">
              {totalRisks}
            </span>
          )}
        </div>
        <Link href="/tasks" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : totalRisks === 0 ? (
        <div className="py-2">
          <p className="text-sm font-medium text-[#16A34A]">No blockers</p>
          <p className="text-sm text-[#6B7280] mt-1">All clear — execution is unblocked.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {blockedTasks.slice(0, 4).map((task) => (
            <Link
              key={task.id}
              href="/tasks"
              className="flex items-start gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-[#FEF2F2] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-[#374151] truncate block">{task.title}</span>
                {task.due_date && isOverdue(task.due_date) && (
                  <span className="text-xs text-[#DC2626]">
                    overdue {formatDate(task.due_date, "dd MMM")}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded shrink-0">
                blocked
              </span>
            </Link>
          ))}

          {stalledOpps.slice(0, 2).map((opp) => (
            <Link
              key={opp.id}
              href="/opportunities"
              className="flex items-start gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-[#FFFBEB] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <span className="text-sm text-[#374151] truncate flex-1">{opp.title}</span>
              <span className="text-xs font-medium text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded shrink-0">
                stalled
              </span>
            </Link>
          ))}

          {totalRisks > 6 && (
            <p className="text-xs text-[#6B7280] pt-1 px-2">
              +{totalRisks - 6} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
