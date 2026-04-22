"use client";

import { createClient } from "@/lib/supabase/client";
import { TaskStatusBadge, PriorityIndicator } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { Check, Clock, Edit2 } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const STATUS_ORDER: TaskStatus[] = ["blocked", "doing", "waiting", "todo", "delegated", "done"];

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  selectedId?: string;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
  onStatusChange: () => void;
}

export function TaskList({ tasks, loading, selectedId, onSelect, onEdit, onStatusChange }: TaskListProps) {
  const supabase = createClient();

  async function cycleStatus(task: Task, e: React.MouseEvent) {
    e.stopPropagation();
    const order: TaskStatus[] = ["todo", "doing", "waiting", "blocked", "done", "delegated"];
    const idx = order.indexOf(task.status);
    const next = order[(idx + 1) % order.length];
    await supabase.from("tasks").update({ status: next, updated_at: new Date().toISOString() }).eq("id", task.id);
    toast({ title: `Status → ${next}` });
    onStatusChange();
  }

  async function markDone(task: Task, e: React.MouseEvent) {
    e.stopPropagation();
    await supabase.from("tasks").update({ status: "done", updated_at: new Date().toISOString() }).eq("id", task.id);
    toast({ title: "Task done" });
    onStatusChange();
  }

  async function postpone(task: Task, e: React.MouseEvent) {
    e.stopPropagation();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    await supabase.from("tasks").update({ due_date: tomorrow, updated_at: new Date().toISOString() }).eq("id", task.id);
    toast({ title: "Postponed to tomorrow" });
    onStatusChange();
  }

  if (loading) {
    return (
      <div className="px-8 py-6 space-y-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-[#F3F4F6] animate-pulse" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-sm text-[#9CA3AF]">No tasks.</p>
      </div>
    );
  }

  const grouped = STATUS_ORDER.reduce<Record<string, Task[]>>((acc, status) => {
    const group = tasks.filter((t) => t.status === status);
    if (group.length > 0) acc[status] = group;
    return acc;
  }, {});

  return (
    <div className="py-2">
      {Object.entries(grouped).map(([status, groupTasks]) => (
        <div key={status}>
          <div className="px-8 py-2 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
            <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">
              {status} ({groupTasks.length})
            </span>
          </div>
          {groupTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isSelected={task.id === selectedId}
              onClick={() => onSelect(task)}
              onEdit={() => onEdit(task)}
              onCycleStatus={(e) => cycleStatus(task, e)}
              onDone={(e) => markDone(task, e)}
              onPostpone={(e) => postpone(task, e)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onCycleStatus: (e: React.MouseEvent) => void;
  onDone: (e: React.MouseEvent) => void;
  onPostpone: (e: React.MouseEvent) => void;
}

function TaskRow({ task, isSelected, onClick, onEdit, onCycleStatus, onDone, onPostpone }: TaskRowProps) {
  const overdue = task.due_date && isOverdue(task.due_date) && task.status !== "done";
  const dueToday = task.due_date && isDueToday(task.due_date);
  const isDone = task.status === "done";

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-8 py-2.5 cursor-pointer group transition-colors",
        isSelected ? "bg-[#EFF6FF]" : "hover:bg-[#F9FAFB]",
        isDone && "opacity-50"
      )}
      onClick={onClick}
    >
      <PriorityIndicator priority={task.priority} className="shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm truncate",
              isDone ? "line-through text-[#9CA3AF]" : "text-[#111827]"
            )}
          >
            {task.title}
          </span>
          {task.project && (
            <span className="text-[10px] text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded shrink-0">
              {task.project}
            </span>
          )}
          {task.okr && (
            <span className="text-[10px] text-[#7c5cfc] bg-[#7c5cfc]/10 px-1.5 py-0.5 rounded shrink-0 truncate max-w-[120px]">
              {task.okr.title}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Quick actions — shown on hover, hidden when done */}
        {!isDone && (
          <>
            <button
              onClick={onDone}
              title="Mark done"
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-[#16A34A] bg-[#F0FDF4] hover:bg-[#DCFCE7]"
            >
              <Check className="w-3 h-3" />
              Done
            </button>
            <button
              onClick={onPostpone}
              title="Postpone to tomorrow"
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-[#D97706] bg-[#FFFBEB] hover:bg-[#FEF3C7]"
            >
              <Clock className="w-3 h-3" />
              Mañana
            </button>
          </>
        )}

        {task.due_date && (
          <span
            className={cn(
              "text-[10px]",
              overdue ? "text-[#DC2626]" : dueToday ? "text-[#D97706]" : "text-[#9CA3AF]"
            )}
          >
            {formatDate(task.due_date, "dd MMM")}
          </span>
        )}
        {task.owner && (
          <span className="text-[10px] text-[#9CA3AF]">{task.owner}</span>
        )}
        <button
          onClick={onCycleStatus}
          title="Cycle status"
        >
          <TaskStatusBadge status={task.status} />
        </button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
