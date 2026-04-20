import { cn } from "@/lib/utils";
import type {
  OKRStatus,
  TaskStatus,
  TaskPriority,
  OpportunityStatus,
  OpportunityUrgency,
} from "@/types";

const OKR_STATUS: Record<OKRStatus, { label: string; className: string }> = {
  on_track: { label: "On Track", className: "bg-[#22c55e]/15 text-[#22c55e]" },
  at_risk: { label: "At Risk", className: "bg-[#f59e0b]/15 text-[#f59e0b]" },
  off_track: { label: "Off Track", className: "bg-[#ef4444]/15 text-[#ef4444]" },
  completed: { label: "Completed", className: "bg-[#3b82f6]/15 text-[#3b82f6]" },
  paused: { label: "Paused", className: "bg-[#1e1e1e] text-[#6b6b6b]" },
};

const TASK_STATUS: Record<TaskStatus, { label: string; className: string; pulse?: boolean }> = {
  todo: { label: "Todo", className: "bg-[#1e1e1e] text-[#6b6b6b]" },
  doing: { label: "Doing", className: "bg-[#7c5cfc]/15 text-[#7c5cfc]" },
  waiting: { label: "Waiting", className: "bg-[#f59e0b]/15 text-[#f59e0b]" },
  blocked: { label: "Blocked", className: "bg-[#ef4444]/15 text-[#ef4444]", pulse: true },
  done: { label: "Done", className: "bg-[#22c55e]/15 text-[#22c55e]" },
  delegated: { label: "Delegated", className: "bg-[#3b82f6]/15 text-[#3b82f6]" },
};

const TASK_PRIORITY: Record<TaskPriority, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#ef4444" },
  high: { label: "High", color: "#f59e0b" },
  medium: { label: "Medium", color: "#7c5cfc" },
  low: { label: "Low", color: "#4a4a4a" },
};

const OPP_STATUS: Record<OpportunityStatus, { label: string; className: string }> = {
  captured: { label: "Captured", className: "bg-[#1e1e1e] text-[#6b6b6b]" },
  reviewing: { label: "Reviewing", className: "bg-[#f59e0b]/15 text-[#f59e0b]" },
  mapped: { label: "Mapped", className: "bg-[#7c5cfc]/15 text-[#7c5cfc]" },
  active: { label: "Active", className: "bg-[#22c55e]/15 text-[#22c55e]" },
  parked: { label: "Parked", className: "bg-[#1e1e1e] text-[#4a4a4a]" },
  delegated: { label: "Delegated", className: "bg-[#3b82f6]/15 text-[#3b82f6]" },
  ignored: { label: "Ignored", className: "bg-[#1e1e1e] text-[#3a3a3a]" },
  closed: { label: "Closed", className: "bg-[#22c55e]/15 text-[#22c55e]" },
};

const OPP_URGENCY: Record<OpportunityUrgency, { label: string; className: string }> = {
  immediate: { label: "Immediate", className: "bg-[#ef4444]/15 text-[#ef4444]" },
  this_month: { label: "This Month", className: "bg-[#f59e0b]/15 text-[#f59e0b]" },
  this_quarter: { label: "This Quarter", className: "bg-[#7c5cfc]/15 text-[#7c5cfc]" },
  no_rush: { label: "No Rush", className: "bg-[#1e1e1e] text-[#6b6b6b]" },
};

interface OKRStatusBadgeProps {
  status: OKRStatus;
  className?: string;
}

export function OKRStatusBadge({ status, className }: OKRStatusBadgeProps) {
  const s = OKR_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        s.className,
        className
      )}
    >
      {s.label}
    </span>
  );
}

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const s = TASK_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        s.className,
        s.pulse ? "status-blocked" : "",
        className
      )}
    >
      {s.label}
    </span>
  );
}

interface PriorityIndicatorProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const p = TASK_PRIORITY[priority];
  return (
    <span
      className={cn("inline-block w-0.5 rounded-full h-4 shrink-0", className)}
      style={{ backgroundColor: p.color }}
      title={p.label}
    />
  );
}

interface OppStatusBadgeProps {
  status: OpportunityStatus;
  className?: string;
}

export function OppStatusBadge({ status, className }: OppStatusBadgeProps) {
  const s = OPP_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        s.className,
        className
      )}
    >
      {s.label}
    </span>
  );
}

interface UrgencyBadgeProps {
  urgency: OpportunityUrgency;
  className?: string;
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const u = OPP_URGENCY[urgency];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        u.className,
        className
      )}
    >
      {u.label}
    </span>
  );
}
