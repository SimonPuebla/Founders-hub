import Link from "next/link";
import { TaskStatusBadge, PriorityIndicator } from "@/components/shared/StatusBadge";
import { formatDate, isOverdue } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TasksTodayWidgetProps {
  todayTasks: Task[];
  blockedTasks: Task[];
  loading: boolean;
}

export function TasksTodayWidget({ todayTasks, blockedTasks, loading }: TasksTodayWidgetProps) {
  const allTasks = [
    ...blockedTasks,
    ...todayTasks.filter((t) => t.status !== "blocked"),
  ].slice(0, 8);

  return (
    <div className="rounded border border-[#1e1e1e] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
            Tasks
          </span>
          {blockedTasks.length > 0 && (
            <span className="font-mono text-[10px] text-[#ef4444] bg-[#ef4444]/10 px-1.5 py-0.5 rounded status-blocked">
              {blockedTasks.length} blocked
            </span>
          )}
        </div>
        <Link href="/tasks?view=today" className="font-mono text-[10px] text-[#4a4a4a] hover:text-[#7c5cfc] transition-colors">
          Ver todo →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-[#1e1e1e] rounded animate-pulse" />
          ))}
        </div>
      ) : allTasks.length === 0 ? (
        <p className="font-mono text-[10px] text-[#4a4a4a] py-2">
          No tasks for today.
        </p>
      ) : (
        <div className="space-y-1">
          {allTasks.map((task) => {
            const overdue = task.due_date && isOverdue(task.due_date);
            return (
              <Link
                key={task.id}
                href="/tasks"
                className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#1a1a1a] transition-colors group"
              >
                <PriorityIndicator priority={task.priority} />
                <span
                  className={cn(
                    "text-xs flex-1 truncate",
                    task.status === "blocked" ? "text-[#ef4444]" : "text-[#f0f0f0]"
                  )}
                >
                  {task.title}
                </span>
                {task.due_date && overdue && (
                  <span className="font-mono text-[10px] text-[#ef4444] shrink-0">
                    {formatDate(task.due_date, "dd MMM")}
                  </span>
                )}
                <TaskStatusBadge status={task.status} className="shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
