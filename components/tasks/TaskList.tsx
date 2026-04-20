"use client";

import { createClient } from "@/lib/supabase/client";
import { TaskStatusBadge, PriorityIndicator } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { Edit2 } from "lucide-react";
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

  if (loading) {
    return (
      <div className="px-8 py-6 space-y-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 rounded bg-[#111111] animate-pulse" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="font-mono text-sm text-[#4a4a4a]">No tasks.</p>
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
          <div className="px-8 py-2 sticky top-0 bg-[#0a0a0a] z-10">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
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
}

function TaskRow({ task, isSelected, onClick, onEdit, onCycleStatus }: TaskRowProps) {
  const overdue = task.due_date && isOverdue(task.due_date) && task.status !== "done";
  const dueToday = task.due_date && isDueToday(task.due_date);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-8 py-2.5 cursor-pointer group transition-colors",
        isSelected ? "bg-[#1a1a1a]" : "hover:bg-[#111111]",
        task.status === "done" && "opacity-50"
      )}
      onClick={onClick}
    >
      <PriorityIndicator priority={task.priority} className="shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm truncate",
              task.status === "done" ? "line-through text-[#4a4a4a]" : "text-[#f0f0f0]"
            )}
          >
            {task.title}
          </span>
          {task.project && (
            <span className="font-mono text-[10px] text-[#4a4a4a] bg-[#1e1e1e] px-1.5 py-0.5 rounded shrink-0">
              {task.project}
            </span>
          )}
          {task.okr && (
            <span className="font-mono text-[10px] text-[#7c5cfc] bg-[#7c5cfc]/10 px-1.5 py-0.5 rounded shrink-0 truncate max-w-[120px]">
              {task.okr.title}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {task.due_date && (
          <span
            className={cn(
              "font-mono text-[10px]",
              overdue ? "text-[#ef4444]" : dueToday ? "text-[#f59e0b]" : "text-[#4a4a4a]"
            )}
          >
            {formatDate(task.due_date, "dd MMM")}
          </span>
        )}
        {task.owner && (
          <span className="font-mono text-[10px] text-[#4a4a4a]">{task.owner}</span>
        )}
        <button
          onClick={onCycleStatus}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          title="Cycle status"
        >
          <TaskStatusBadge status={task.status} />
        </button>
        <TaskStatusBadge
          status={task.status}
          className="opacity-100 group-hover:opacity-0 absolute pointer-events-none"
        />
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
