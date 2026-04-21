import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Input, Task } from "@/types";

const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  immediate: { label: "Now", color: "text-[#DC2626] bg-[#FEF2F2]" },
  this_month: { label: "This month", color: "text-[#D97706] bg-[#FFFBEB]" },
  this_quarter: { label: "Q", color: "text-[#2563EB] bg-[#EFF6FF]" },
};

const TYPE_DOT: Record<string, string> = {
  meeting: "bg-[#2563EB]",
  voice_note: "bg-[#EA580C]",
  quick_idea: "bg-[#16A34A]",
  transcript: "bg-[#7C3AED]",
  note: "bg-[#9CA3AF]",
  day_update: "bg-[#D97706]",
  weekly_recap: "bg-[#DC2626]",
};

interface InboxCriticalWidgetProps {
  inputs: Input[];
  criticalTasks: Task[];
  loading: boolean;
}

export function InboxCriticalWidget({ inputs, criticalTasks, loading }: InboxCriticalWidgetProps) {
  const allItems = [
    ...criticalTasks.slice(0, 3).map((t) => ({ type: "task" as const, id: t.id, title: t.title, sub: t.status, urgency: t.priority === "critical" ? "immediate" : "this_month" })),
    ...inputs.slice(0, 4).map((i) => ({ type: "input" as const, id: i.id, title: i.title, sub: i.type, date: i.date, urgency: "this_month" })),
  ].slice(0, 6);

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#111827]">Inbox / Critical</p>
          {allItems.length > 0 && (
            <span className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded-md">
              {allItems.length}
            </span>
          )}
        </div>
        <Link href="/inputs" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-black/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div>
          <p className="text-sm font-medium text-[#16A34A]">Inbox clear</p>
          <p className="text-sm text-[#6B7280] mt-0.5">No critical items pending.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {allItems.map((item) => {
            const urg = URGENCY_CONFIG[item.urgency];
            return (
              <Link
                key={item.id}
                href={item.type === "task" ? "/tasks" : "/inputs"}
                className="flex items-start gap-2.5 py-2 px-2.5 -mx-2.5 rounded-lg hover:bg-black/4 transition-colors group"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === "task"
                      ? item.urgency === "immediate"
                        ? "bg-[#DC2626]"
                        : "bg-[#D97706]"
                      : TYPE_DOT[item.sub] || "bg-[#9CA3AF]"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#374151] line-clamp-1 group-hover:text-[#111827]">
                    {item.title}
                  </span>
                  {"date" in item && item.date && (
                    <span className="text-xs text-[#9CA3AF]">{formatDate(item.date, "dd MMM")}</span>
                  )}
                </div>
                {urg && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${urg.color}`}>
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
