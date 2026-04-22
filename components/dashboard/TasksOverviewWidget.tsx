import Link from "next/link";
import type { Task } from "@/types";

const STATUS_CONFIG = [
  { key: "doing",     label: "In Progress", color: "var(--blue)",   track: "var(--blue-light)" },
  { key: "blocked",   label: "Blocked",     color: "var(--red)",    track: "var(--red-light)" },
  { key: "waiting",   label: "Waiting",     color: "var(--amber)",  track: "var(--amber-light)" },
  { key: "todo",      label: "To Do",       color: "var(--border-strong)", track: "var(--bg)" },
  { key: "delegated", label: "Delegated",   color: "var(--purple)", track: "var(--purple-light)" },
] as const;

interface TasksOverviewWidgetProps {
  tasks: Task[];
  loading: boolean;
}

export function TasksOverviewWidget({ tasks, loading }: TasksOverviewWidgetProps) {
  const counts = STATUS_CONFIG.reduce<Record<string, number>>((acc, s) => {
    acc[s.key] = tasks.filter((t) => t.status === s.key).length;
    return acc;
  }, {});

  const total = tasks.length;
  const max = Math.max(...Object.values(counts), 1);

  const doing   = counts["doing"]   ?? 0;
  const blocked = counts["blocked"] ?? 0;

  return (
    <div className="glass p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[18px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            Are my tasks on track?
          </p>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {total} active tasks · {doing} in progress · {blocked} blocked
          </p>
        </div>
        <Link
          href="/tasks"
          className="text-[12px] shrink-0 mt-0.5 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--blue)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          All tasks →
        </Link>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="space-y-3">
          {[80, 100, 55, 40, 20].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-20 rounded animate-pulse" style={{ background: "var(--bg)" }} />
              <div className="h-7 rounded animate-pulse" style={{ background: "var(--bg)", width: `${w}%` }} />
              <div className="h-3 w-4 rounded animate-pulse" style={{ background: "var(--bg)" }} />
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <div className="py-4 text-center">
          <p className="text-[13px] font-medium" style={{ color: "var(--green)" }}>All clear</p>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>No active tasks.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {STATUS_CONFIG.map(({ key, label, color, track }) => {
            const count = counts[key] ?? 0;
            const pct = max > 0 ? Math.round((count / max) * 100) : 0;

            return (
              <div key={key} className="flex items-center gap-3">
                {/* Label */}
                <span
                  className="text-[12px] text-right shrink-0"
                  style={{ width: 82, color: "var(--text-muted)" }}
                >
                  {label}
                </span>

                {/* Bar track + fill */}
                <div
                  className="flex-1 rounded-md overflow-hidden"
                  style={{ height: 28, background: track }}
                >
                  {count > 0 && (
                    <div
                      className="h-full rounded-md transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  )}
                </div>

                {/* Count */}
                <span
                  className="text-[13px] font-semibold tabular-nums shrink-0 text-right"
                  style={{ width: 24, color: count > 0 ? color : "var(--border-strong)" }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
