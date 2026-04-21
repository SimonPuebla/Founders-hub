"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { isOverdue } from "@/lib/utils";
import type { Task } from "@/types";

const STATUS_TAG: Record<string, { label: string; color: string }> = {
  blocked: { label: "Blocked", color: "text-[#DC2626] bg-[#FEF2F2]" },
  doing: { label: "Active", color: "text-[#2563EB] bg-[#EFF6FF]" },
  waiting: { label: "Waiting", color: "text-[#D97706] bg-[#FFFBEB]" },
  todo: { label: "", color: "" },
  delegated: { label: "Delegated", color: "text-[#7C3AED] bg-purple-50" },
};

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-[#DC2626]",
  high: "bg-[#EA580C]",
  medium: "bg-[#D97706]",
  low: "bg-[#D1D5DB]",
};

interface MainTasksWidgetProps {
  tasks: Task[];
  loading: boolean;
}

export function MainTasksWidget({ tasks, loading }: MainTasksWidgetProps) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const supabase = createClient();

  async function markDone(id: string) {
    setDone((prev) => new Set([...prev, id]));
    await supabase
      .from("tasks")
      .update({ status: "done", updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  // Group tasks by project (show max 4 groups, 4 tasks each)
  const grouped = tasks
    .filter((t) => !done.has(t.id))
    .reduce<Record<string, Task[]>>((acc, task) => {
      const key = task.project || "General";
      if (!acc[key]) acc[key] = [];
      if (acc[key].length < 4) acc[key].push(task);
      return acc;
    }, {});

  const groups = Object.entries(grouped).slice(0, 5);
  const totalCount = tasks.filter((t) => !done.has(t.id)).length;

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#111827]">Tasks Today</p>
          {totalCount > 0 && (
            <span className="text-xs font-medium text-[#6B7280] bg-black/6 px-1.5 py-0.5 rounded-md">
              {totalCount}
            </span>
          )}
        </div>
        <Link href="/tasks" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All tasks →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-24 bg-black/5 rounded mb-2 animate-pulse" />
              <div className="space-y-2">
                {[1, 2].map((j) => <div key={j} className="h-7 bg-black/4 rounded-lg animate-pulse" />)}
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="py-4">
          <p className="text-sm font-medium text-[#D97706]">No tasks for today</p>
          <p className="text-sm text-[#6B7280] mt-1">Define today&apos;s execution to move forward.</p>
          <Link href="/tasks" className="mt-2 inline-block text-sm font-medium text-[#2563EB] hover:underline">
            Add task →
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(([project, projectTasks]) => (
            <div key={project}>
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2">
                {project}
              </p>
              <div className="space-y-0.5">
                {projectTasks.map((task) => {
                  const tag = STATUS_TAG[task.status];
                  const overdue = task.due_date && isOverdue(task.due_date);
                  const isBlocked = task.status === "blocked";
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-black/4 transition-colors group"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => markDone(task.id)}
                        className="w-4 h-4 rounded border border-[#D1D5DB] hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all shrink-0 flex items-center justify-center"
                      >
                        <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 bg-[#16A34A] transition-opacity" />
                      </button>

                      {/* Priority dot */}
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          PRIORITY_DOT[task.priority] || "bg-[#D1D5DB]"
                        )}
                      />

                      {/* Title */}
                      <span
                        className={cn(
                          "text-sm flex-1 truncate",
                          isBlocked ? "text-[#DC2626]" : "text-[#374151]"
                        )}
                      >
                        {task.title}
                      </span>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {overdue && (
                          <span className="text-[10px] text-[#DC2626]">overdue</span>
                        )}
                        {tag?.label && (
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tag.color}`}>
                            {tag.label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
