import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Input, Task } from "@/types";

const URGENCY_CFG: Record<string, { label: string; textColor: string; bg: string }> = {
  immediate: { label: "Now", textColor: "var(--red)", bg: "var(--red-light)" },
  this_month: { label: "This month", textColor: "var(--amber)", bg: "var(--amber-light)" },
  this_quarter: { label: "Q", textColor: "var(--blue)", bg: "var(--blue-light)" },
};

const TYPE_COLOR: Record<string, string> = {
  meeting: "var(--blue)",
  voice_note: "#EA580C",
  quick_idea: "var(--green)",
  transcript: "var(--purple)",
  note: "var(--text-muted)",
  day_update: "var(--amber)",
  weekly_recap: "var(--red)",
};

interface InboxCriticalWidgetProps {
  inputs: Input[];
  criticalTasks: Task[];
  loading: boolean;
}

export function InboxCriticalWidget({ inputs, criticalTasks, loading }: InboxCriticalWidgetProps) {
  const allItems = [
    ...criticalTasks.slice(0, 3).map((t) => ({
      type: "task" as const, id: t.id, title: t.title, sub: t.status,
      urgency: t.priority === "critical" ? "immediate" : "this_month",
    })),
    ...inputs.slice(0, 4).map((i) => ({
      type: "input" as const, id: i.id, title: i.title, sub: i.type,
      date: i.date, urgency: "this_month",
    })),
  ].slice(0, 6);

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Inbox / Critical</p>
          {allItems.length > 0 && (
            <span
              className="text-[11px] font-medium px-1.5 py-0.5 rounded-md tabular-nums"
              style={{ color: "var(--red)", background: "var(--red-light)" }}
            >
              {allItems.length}
            </span>
          )}
        </div>
        <Link href="/inputs" className="text-[12px]" style={{ color: "var(--text-muted)" }}>All →</Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--green)" }}>Inbox clear</p>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-secondary)" }}>No critical items pending.</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {allItems.map((item) => {
            const urg = URGENCY_CFG[item.urgency];
            const dotColor = item.type === "task"
              ? (item.urgency === "immediate" ? "var(--red)" : "var(--amber)")
              : (TYPE_COLOR[item.sub] || "var(--text-muted)");
            return (
              <Link
                key={item.id}
                href={item.type === "task" ? "/tasks" : "/inputs"}
                className="flex items-start gap-2.5 py-2 px-2.5 -mx-2.5 rounded-lg transition-colors"
                style={{ color: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0"
                  style={{ background: dotColor }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                    {item.title}
                  </span>
                  {"date" in item && item.date && (
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {formatDate(item.date, "dd MMM")}
                    </span>
                  )}
                </div>
                {urg && (
                  <span
                    className="text-[11px] font-medium px-1.5 py-0.5 rounded shrink-0"
                    style={{ color: urg.textColor, background: urg.bg }}
                  >
                    {urg.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
