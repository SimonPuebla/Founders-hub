"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { isOverdue } from "@/lib/utils";
import type { Task } from "@/types";

const STATUS_TAG: Record<string, { label: string; color: string }> = {
  blocked: { label: "Blocked", color: "text-[var(--red)] bg-[var(--red-light)]" },
  doing: { label: "Active", color: "text-[var(--blue)] bg-[var(--blue-light)]" },
  waiting: { label: "Waiting", color: "text-[var(--amber)] bg-[var(--amber-light)]" },
  todo: { label: "", color: "" },
  delegated: { label: "Delegated", color: "text-[var(--purple)] bg-[var(--purple-light)]" },
};

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-[var(--red)]",
  high: "bg-[#EA580C]",
  medium: "bg-[var(--amber)]",
  low: "bg-[var(--border-strong)]",
};

interface MainTasksWidgetProps {
  tasks: Task[];
  loading: boolean;
}

export function MainTasksWidget({ tasks, loading }: MainTasksWidgetProps) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const supabase = createClient();

  async function markDone(id: string) {
    setDone((prev) => { const next = new Set(prev); next.add(id); return next; });
    await supabase
      .from("tasks")
      .update({ status: "done", updated_at: new Date().toISOString() })
      .eq("id", id);
  }

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
          <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Tasks Today</p>
          {totalCount > 0 && (
            <span
              className="text-[11px] font-medium tabular-nums px-1.5 py-0.5 rounded-md"
              style={{ color: "var(--text-muted)", background: "var(--bg)" }}
            >
              {totalCount}
            </span>
          )}
        </div>
        <Link href="/tasks" className="text-[12px] transition-colors" style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--blue)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          All tasks →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-24 rounded mb-2 animate-pulse" style={{ background: "var(--bg)" }} />
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="h-7 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="py-4">
          <p className="text-[13px] font-medium" style={{ color: "var(--amber)" }}>No tasks for today</p>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>Define today&apos;s execution to move forward.</p>
          <Link href="/tasks" className="mt-2 inline-block text-[13px] font-medium" style={{ color: "var(--blue)" }}>
            Add task →
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(([project, projectTasks]) => (
            <div key={project}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
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
                      className="flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg transition-colors group"
                      style={{ cursor: "default" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <button
                        onClick={() => markDone(task.id)}
                        className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all"
                        style={{ borderColor: "var(--border-strong)" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.background = "var(--green-light)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "var(--green)" }} />
                      </button>

                      <span
                        className={cn("w-1.5 h-1.5 rounded-full shrink-0", PRIORITY_DOT[task.priority] || "bg-[var(--border-strong)]")}
                      />

                      <span
                        className="text-[13px] flex-1 truncate"
                        style={{ color: isBlocked ? "var(--red)" : "var(--text-secondary)" }}
                      >
                        {task.title}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {overdue && (
                          <span className="text-[11px]" style={{ color: "var(--red)" }}>overdue</span>
                        )}
                        {tag?.label && (
                          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${tag.color}`}>
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
