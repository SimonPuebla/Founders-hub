"use client";

import Link from "next/link";
import type { Task } from "@/types";

interface ActiveProjectWidgetProps {
  tasks: Task[];
  loading: boolean;
}

export function ActiveProjectWidget({ tasks, loading }: ActiveProjectWidgetProps) {
  const projectTasks = tasks
    .filter(
      (t) =>
        t.project?.toLowerCase().includes("product") ||
        t.project?.toLowerCase().includes("plataforma") ||
        t.project?.toLowerCase().includes("os")
    )
    .slice(0, 5);

  const done = projectTasks.filter((t) => t.status === "done").length;
  const total = projectTasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Active Project</p>
        <Link href="/tasks" className="text-[12px]" style={{ color: "var(--text-muted)" }}>→</Link>
      </div>
      <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>Andén OS v2</p>

      {loading ? (
        <div className="h-16 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
      ) : (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Progress</span>
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--blue)" }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: "var(--blue)" }}
              />
            </div>
          </div>

          {projectTasks.length === 0 ? (
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>No product tasks yet.</p>
          ) : (
            <div className="space-y-1.5">
              {projectTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0"
                    style={{
                      borderColor: task.status === "done" ? "var(--green)" : "var(--border-strong)",
                      background: task.status === "done" ? "var(--green-light)" : "transparent",
                    }}
                  >
                    {task.status === "done" && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
                    )}
                  </span>
                  <span
                    className="text-[12px] truncate flex-1"
                    style={{
                      color: task.status === "done" ? "var(--text-muted)" : "var(--text-secondary)",
                      textDecoration: task.status === "done" ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                  {task.status === "blocked" && (
                    <span className="text-[11px]" style={{ color: "var(--red)" }}>blocked</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
