import Link from "next/link";
import { formatDate, isOverdue } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-[#DC2626]",
  high: "bg-[#EA580C]",
  medium: "bg-[#D97706]",
  low: "bg-[#9CA3AF]",
};

interface TasksTodayWidgetProps {
  todayTasks: Task[];
  loading: boolean;
}

export function TasksTodayWidget({ todayTasks, loading }: TasksTodayWidgetProps) {
  const visible = todayTasks.filter((t) => t.status !== "blocked").slice(0, 5);

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">Today&apos;s Tasks</span>
          {visible.length > 0 && (
            <span className="text-xs font-medium text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full">
              {visible.length}
            </span>
          )}
        </div>
        <Link href="/tasks?view=today" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All tasks →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-2">
          <p className="text-sm font-medium text-[#D97706]">No tasks defined</p>
          <p className="text-sm text-[#6B7280] mt-1">Define today&apos;s execution.</p>
          <Link
            href="/tasks"
            className="mt-2 inline-block text-sm font-medium text-[#2563EB] hover:underline"
          >
            Add task →
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {visible.map((task) => {
            const overdue = task.due_date && isOverdue(task.due_date);
            const isActive = task.status === "doing" || (task.status as string) === "in_progress";
            return (
              <Link
                key={task.id}
                href="/tasks"
                className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-[#F9FAFB] transition-colors group"
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    PRIORITY_COLORS[task.priority] || "bg-[#9CA3AF]"
                  )}
                />
                <span
                  className={cn(
                    "text-sm flex-1 truncate",
                    isActive ? "text-[#111827] font-medium" : "text-[#374151]"
                  )}
                >
                  {task.title}
                </span>
                {overdue && (
                  <span className="text-xs font-medium text-[#DC2626] shrink-0">
                    {formatDate(task.due_date!, "dd MMM")}
                  </span>
                )}
                {isActive && (
                  <span className="text-xs text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    active
                  </span>
                )}
              </Link>
            );
          })}
          {todayTasks.filter((t) => t.status !== "blocked").length > 5 && (
            <Link
              href="/tasks"
              className="block text-xs text-[#6B7280] hover:text-[#2563EB] pt-1 px-2 -mx-2"
            >
              +{todayTasks.filter((t) => t.status !== "blocked").length - 5} more →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
