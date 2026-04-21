import Link from "next/link";
import type { Opportunity } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "text-[#16A34A] bg-green-50" },
  reviewing: { label: "Reviewing", color: "text-[#D97706] bg-amber-50" },
  captured: { label: "New", color: "text-[#2563EB] bg-blue-50" },
  mapped: { label: "Mapped", color: "text-[#7C3AED] bg-purple-50" },
  parked: { label: "Parked", color: "text-[#9CA3AF] bg-gray-100" },
};

const URGENCY_DOT: Record<string, string> = {
  immediate: "bg-[#DC2626]",
  this_month: "bg-[#D97706]",
  this_quarter: "bg-[#2563EB]",
  no_rush: "bg-[#D1D5DB]",
};

interface OppBacklogWidgetProps {
  opps: Opportunity[];
  loading: boolean;
}

export function OppBacklogWidget({ opps, loading }: OppBacklogWidgetProps) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#111827]">Opportunity Backlog</p>
        <Link href="/opportunities" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-black/5 rounded-lg animate-pulse" />)}
        </div>
      ) : opps.length === 0 ? (
        <div>
          <p className="text-sm text-[#6B7280]">No active opportunities</p>
          <Link href="/opportunities" className="text-xs text-[#2563EB] hover:underline mt-1 inline-block">
            Add opportunity →
          </Link>
        </div>
      ) : (
        <div className="space-y-1.5">
          {opps.slice(0, 5).map((opp) => {
            const status = STATUS_CONFIG[opp.status] || STATUS_CONFIG.reviewing;
            const urgencyDot = URGENCY_DOT[opp.urgency] || "bg-[#D1D5DB]";
            return (
              <Link
                key={opp.id}
                href="/opportunities"
                className="flex items-center gap-2.5 py-2 px-2.5 -mx-2.5 rounded-lg hover:bg-black/4 transition-colors group"
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${urgencyDot}`} />
                <span className="text-sm text-[#374151] truncate flex-1 group-hover:text-[#111827]">
                  {opp.title}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${status.color}`}>
                  {status.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
