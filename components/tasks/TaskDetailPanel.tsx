"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TaskStatusBadge, PriorityIndicator } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { X, Edit2, Calendar } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const TASK_STATUSES: TaskStatus[] = ["todo", "doing", "waiting", "blocked", "done", "delegated"];

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
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col z-30 animate-slide-in-right">
      <div className="px-5 pt-5 pb-4 border-b border-[#1e1e1e] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 flex items-start gap-2">
          <PriorityIndicator priority={task.priority} className="mt-1" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[#f0f0f0] leading-snug">{task.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <TaskStatusBadge status={task.status} />
              {task.project && (
                <span className="font-mono text-[10px] text-[#4a4a4a] bg-[#1e1e1e] px-1.5 py-0.5 rounded">
                  {task.project}
                </span>
              )}
              {task.due_date && (
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    overdue ? "text-[#ef4444]" : dueToday ? "text-[#f59e0b]" : "text-[#4a4a4a]"
                  )}
                >
                  {formatDate(task.due_date)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon-sm" onClick={onEdit}>
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TASK_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border transition-colors",
                  task.status === s
                    ? "border-[#7c5cfc] text-[#7c5cfc] bg-[#7c5cfc]/10"
                    : "border-[#1e1e1e] text-[#4a4a4a] hover:border-[#2a2a2a] hover:text-[#6b6b6b]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {task.description && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Description
            </span>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{task.description}</p>
          </div>
        )}

        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-1">
                Priority
              </span>
              <span className="text-xs text-[#f0f0f0] capitalize">{task.priority}</span>
            </div>
            {task.owner && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-1">
                  Owner
                </span>
                <span className="text-xs text-[#f0f0f0]">{task.owner}</span>
              </div>
            )}
            {task.due_date && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-1">
                  Due Date
                </span>
                <span
                  className={cn(
                    "text-xs",
                    overdue ? "text-[#ef4444]" : dueToday ? "text-[#f59e0b]" : "text-[#f0f0f0]"
                  )}
                >
                  {formatDate(task.due_date)}
                </span>
              </div>
            )}
            {task.progress > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-1">
                  Progress
                </span>
                <span className="text-xs text-[#f0f0f0]">{task.progress}%</span>
              </div>
            )}
          </div>
        </div>

        {task.okr && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              OKR
            </span>
            <span className="text-xs text-[#7c5cfc]">{task.okr.title}</span>
          </div>
        )}

        {task.context_note && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Context
            </span>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{task.context_note}</p>
          </div>
        )}

        {task.people && task.people.length > 0 && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              People
            </span>
            <div className="flex flex-wrap gap-1">
              {task.people.map((p) => (
                <span key={p} className="font-mono text-[10px] bg-[#1e1e1e] text-[#6b6b6b] px-2 py-1 rounded">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 py-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-full justify-start"
            onClick={addToCalendar}
          >
            <Calendar className="w-3.5 h-3.5" />
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
