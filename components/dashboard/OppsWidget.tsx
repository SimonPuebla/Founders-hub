import Link from "next/link";
import { OPP_TYPE_LABELS } from "@/types";
import type { Opportunity, OKR } from "@/types";

const URGENCY_CONFIG: Record<string, { label: string; text: string; bg: string }> = {
  immediate: { label: "Immediate", text: "text-[#DC2626]", bg: "bg-[#FEF2F2]" },
  this_month: { label: "This month", text: "text-[#D97706]", bg: "bg-[#FFFBEB]" },
  this_quarter: { label: "This quarter", text: "text-[#2563EB]", bg: "bg-[#EFF6FF]" },
  no_rush: { label: "No rush", text: "text-[#6B7280]", bg: "bg-[#F3F4F6]" },
};

interface OppsWidgetProps {
  opps: Opportunity[];
  okrs: OKR[];
  loading: boolean;
}

export function OppsWidget({ opps, okrs, loading }: OppsWidgetProps) {
  const activeOkrIds = new Set(
    okrs
      .filter((o) => o.status !== "completed" && o.status !== "paused")
      .map((o) => o.id)
  );

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">Active Opportunities</span>
          {opps.length > 0 && (
            <span className="text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
              {opps.length}
            </span>
          )}
        </div>
        <Link href="/opportunities" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All opportunities →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#F3F4F6] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : opps.length === 0 ? (
        <div className="py-2">
          <p className="text-sm font-medium text-[#D97706]">No active opportunities</p>
          <p className="text-sm text-[#6B7280] mt-1">Your pipeline is empty.</p>
          <Link href="/opportunities" className="mt-2 inline-block text-sm font-medium text-[#2563EB] hover:underline">
            Add opportunity →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {opps.slice(0, 6).map((opp) => {
            const urg = URGENCY_CONFIG[opp.urgency] || URGENCY_CONFIG.no_rush;
            const aligned = opp.okr_id && activeOkrIds.has(opp.okr_id);
            return (
              <Link
                key={opp.id}
                href="/opportunities"
                className="block border border-[#E6E8EB] rounded-lg p-3 hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all"
              >
                <p className="text-sm font-medium text-[#111827] line-clamp-2 mb-2">{opp.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${urg.text} ${urg.bg}`}>
                    {urg.label}
                  </span>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      aligned
                        ? "text-[#16A34A] bg-[#F0FDF4]"
                        : "text-[#9CA3AF] bg-[#F3F4F6]"
                    }`}
                  >
                    {aligned ? "✓ Aligned" : "Unaligned"}
                  </span>
                </div>
                {opp.person && (
                  <p className="text-xs text-[#9CA3AF] mt-1.5 truncate">{opp.person}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
