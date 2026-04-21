"use client";

import { useState } from "react";
import Link from "next/link";
import type { Task } from "@/types";

interface ActiveProjectWidgetProps {
  tasks: Task[];
  loading: boolean;
}

export function ActiveProjectWidget({ tasks, loading }: ActiveProjectWidgetProps) {
  // Find Andén OS / Product tasks
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
        <p className="text-sm font-semibold text-[#111827]">Active Project</p>
        <Link href="/tasks" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          →
        </Link>
      </div>
      <p className="text-xs text-[#9CA3AF] mb-3">Andén OS v2</p>

      {loading ? (
        <div className="h-16 bg-black/5 rounded-lg animate-pulse" />
      ) : (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#6B7280]">Progress</span>
              <span className="text-xs font-semibold text-[#2563EB]">{pct}%</span>
            </div>
            <div className="h-1.5 bg-black/6 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {projectTasks.length === 0 ? (
            <p className="text-xs text-[#9CA3AF]">No product tasks yet.</p>
          ) : (
            <div className="space-y-1.5">
              {projectTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      task.status === "done"
                        ? "border-[#16A34A] bg-[#F0FDF4]"
                        : "border-[#D1D5DB]"
                    }`}
                  >
                    {task.status === "done" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    )}
                  </span>
                  <span
                    className={`text-xs truncate flex-1 ${
                      task.status === "done"
                        ? "text-[#9CA3AF] line-through"
                        : "text-[#374151]"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.status === "blocked" && (
                    <span className="text-[10px] text-[#DC2626]">blocked</span>
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
