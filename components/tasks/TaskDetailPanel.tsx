"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TaskStatusBadge, PriorityIndicator } from "@/components/shared/StatusBadge";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { X, Edit2, Calendar } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const TASK_STATUSES: TaskStatus[] = ["todo", "doing", "waiting", "blocked", "done", "delegated"];

const STATUS_COLORS: Record<string, { active: string; idle: string }> = {
  todo:      { active: "border-[var(--border-strong)] text-[var(--text-secondary)] bg-[var(--bg)]", idle: "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]" },
  doing:     { active: "border-[var(--blue)] text-[var(--blue)] bg-[var(--blue-light)]",           idle: "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]" },
  waiting:   { active: "border-[var(--amber)] text-[var(--amber)] bg-[var(--amber-light)]",        idle: "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]" },
  blocked:   { active: "border-[var(--red)] text-[var(--red)] bg-[var(--red-light)]",             idle: "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]" },
  done:      { active: "border-[var(--green)] text-[var(--green)] bg-[var(--green-light)]",        idle: "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]" },
  delegated: { active: "border-[var(--purple)] text-[var(--purple)] bg-[var(--purple-light)]",    idle: "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]" },
};

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

export function TaskDetailPanel({ task, onClose, onEdit, onRefresh }: TaskDetailPanelProps) {
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  async function updateStatus(status: TaskStatus) {
    setUpdating(true);
    await supabase
      .from("tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", task.id);
    toast({ title: `Status → ${status}` });
    setUpdating(false);
    onRefresh();
  }

  async function addToCalendar() {
    toast({ title: "Calendar block created", description: task.title });
  }

  const overdue = task.due_date && isOverdue(task.due_date) && task.status !== "done";
  const dueToday = task.due_date && isDueToday(task.due_date);

  return (
    <div
      className="fixed right-0 top-0 h-full w-[400px] flex flex-col z-30 animate-slide-in-right"
      style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)", boxShadow: "-4px 0 24px oklch(0% 0 0 / 0.06)" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 flex items-start justify-between gap-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex-1 min-w-0 flex items-start gap-2">
          <PriorityIndicator priority={task.priority} className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <TaskStatusBadge status={task.status} />
              {task.project && (
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded"
                  style={{ color: "var(--text-muted)", background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  {task.project}
                </span>
              )}
              {task.due_date && (
                <span
                  className="text-[11px]"
                  style={{ color: overdue ? "var(--red)" : dueToday ? "var(--amber)" : "var(--text-muted)" }}
                >
                  {formatDate(task.due_date)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status picker */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <span
            className="text-[11px] uppercase tracking-wider font-medium block mb-2.5"
            style={{ color: "var(--text-muted)" }}
          >
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TASK_STATUSES.map((s) => {
              const colors = STATUS_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className={cn(
                    "text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors capitalize",
                    task.status === s ? colors.active : colors.idle
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[11px] uppercase tracking-wider font-medium block mb-2" style={{ color: "var(--text-muted)" }}>
              Description
            </span>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {task.description}
            </p>
          </div>
        )}

        {/* Meta grid */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-medium block mb-1" style={{ color: "var(--text-muted)" }}>Priority</span>
              <span className="text-[13px] capitalize" style={{ color: "var(--text-primary)" }}>{task.priority}</span>
            </div>
            {task.owner && (
              <div>
                <span className="text-[11px] uppercase tracking-wider font-medium block mb-1" style={{ color: "var(--text-muted)" }}>Owner</span>
                <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{task.owner}</span>
              </div>
            )}
            {task.due_date && (
              <div>
                <span className="text-[11px] uppercase tracking-wider font-medium block mb-1" style={{ color: "var(--text-muted)" }}>Due Date</span>
                <span
                  className="text-[13px]"
                  style={{ color: overdue ? "var(--red)" : dueToday ? "var(--amber)" : "var(--text-primary)" }}
                >
                  {formatDate(task.due_date)}
                </span>
              </div>
            )}
            {task.progress > 0 && (
              <div>
                <span className="text-[11px] uppercase tracking-wider font-medium block mb-1" style={{ color: "var(--text-muted)" }}>Progress</span>
                <span className="text-[13px] tabular-nums" style={{ color: "var(--text-primary)" }}>{task.progress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* OKR */}
        {task.okr && (
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[11px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>OKR</span>
            <span className="text-[13px]" style={{ color: "var(--blue)" }}>{task.okr.title}</span>
          </div>
        )}

        {/* Context */}
        {task.context_note && (
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[11px] uppercase tracking-wider font-medium block mb-2" style={{ color: "var(--text-muted)" }}>Context</span>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{task.context_note}</p>
          </div>
        )}

        {/* People */}
        {task.people && task.people.length > 0 && (
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-[11px] uppercase tracking-wider font-medium block mb-2" style={{ color: "var(--text-muted)" }}>People</span>
            <div className="flex flex-wrap gap-1.5">
              {task.people.map((p) => (
                <span
                  key={p}
                  className="text-[12px] px-2 py-0.5 rounded-md"
                  style={{ color: "var(--text-secondary)", background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Calendar action */}
        <div className="px-5 py-4">
          <button
            onClick={addToCalendar}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Calendar className="w-3.5 h-3.5" />
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
