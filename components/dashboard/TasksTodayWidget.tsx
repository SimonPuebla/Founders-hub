import Link from "next/link";
import { CheckSquare, AlertTriangle } from "lucide-react";
import { formatDate, isOverdue } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-[#ef4444]",
  high: "bg-[#f97316]",
  medium: "bg-[#f59e0b]",
  low: "bg-[#555555]",
};

interface TasksTodayWidgetProps {
  todayTasks: Task[];
  loading: boolean;
}

export function TasksTodayWidget({ todayTasks, loading }: TasksTodayWidgetProps) {
  const nonBlocked = todayTasks.filter((t) => t.status !== "blocked");

  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Today&apos;s Tasks
          </span>
          {nonBlocked.length > 0 && (
            <span className="font-mono text-[10px] text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded">
              {nonBlocked.length}
            </span>
          )}
        </div>
        <Link
          href="/tasks?view=today"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          All tasks →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : nonBlocked.length === 0 ? (
        <div className="py-2 space-y-2">
          <div className="flex items-center gap-2 text-[#f59e0b]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">No tasks defined</span>
          </div>
          <p className="text-xs text-[#555555]">Execution is unclear — define what you will do today.</p>
          <Link
            href="/tasks"
            className="inline-block font-mono text-xs text-[#7c5cfc] hover:text-white transition-colors border border-[#7c5cfc]/30 hover:border-[#7c5cfc] px-3 py-1.5 rounded"
          >
            + Add task →
          </Link>
        </div>
      ) : (
        <div className="space-y-0.5">
          {nonBlocked.slice(0, 7).map((task) => {
            const overdue = task.due_date && isOverdue(task.due_date);
            const isInProgress = task.status === "doing" || task.status === "in_progress";
            return (
              <Link
                key={task.id}
                href="/tasks"
                className="flex items-center gap-2.5 py-2 px-2 rounded hover:bg-[#1a1a1a] transition-colors group"
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    PRIORITY_DOT[task.priority] || "bg-[#555555]"
                  )}
                />
                <span
                  className={cn(
                    "text-xs flex-1 truncate",
                    isInProgress ? "text-white font-medium" : "text-[#cccccc]"
                  )}
                >
                  {task.title}
                </span>
                {overdue && (
                  <span className="font-mono text-[10px] text-[#ef4444] shrink-0">
                    {formatDate(task.due_date!, "dd MMM")}
                  </span>
                )}
                {isInProgress && (
                  <span className="font-mono text-[10px] text-[#3b82f6] shrink-0 opacity-0 group-hover:opacity-100">
                    in progress
                  </span>
                )}
              </Link>
            );
          })}
          {nonBlocked.length > 7 && (
            <p className="font-mono text-[10px] text-[#555555] px-2 pt-1">
              +{nonBlocked.length - 7} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
