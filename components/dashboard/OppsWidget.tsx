import Link from "next/link";
import { Zap, AlertTriangle } from "lucide-react";
import { OPP_TYPE_LABELS } from "@/types";
import type { Opportunity, OKR } from "@/types";

const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  immediate: { label: "Immediate", color: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20" },
  this_month: { label: "This month", color: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20" },
  this_quarter: { label: "This quarter", color: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20" },
  no_rush: { label: "No rush", color: "text-[#555555] bg-[#1a1a1a] border-[#333333]" },
};

interface OppsWidgetProps {
  opps: Opportunity[];
  okrs: OKR[];
  loading: boolean;
}

export function OppsWidget({ opps, okrs, loading }: OppsWidgetProps) {
  const activeOkrIds = new Set(okrs.filter((o) => o.status !== "completed" && o.status !== "paused").map((o) => o.id));

  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#f97316]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Active Opportunities
          </span>
          {opps.length > 0 && (
            <span className="font-mono text-[10px] text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
              {opps.length}
            </span>
          )}
        </div>
        <Link
          href="/opportunities"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          All opportunities →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : opps.length === 0 ? (
        <div className="py-2 space-y-2">
          <div className="flex items-center gap-2 text-[#f59e0b]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">No active opportunities</span>
          </div>
          <p className="text-xs text-[#555555]">
            Your pipeline is empty — capture opportunities before they disappear.
          </p>
          <Link
            href="/opportunities"
            className="inline-block font-mono text-xs text-[#f97316] hover:text-white transition-colors border border-[#f97316]/30 hover:border-[#f97316] px-3 py-1.5 rounded"
          >
            + Add opportunity →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {opps.slice(0, 6).map((opp) => {
            const urgency = URGENCY_CONFIG[opp.urgency] || URGENCY_CONFIG.no_rush;
            const aligned = opp.okr_id && activeOkrIds.has(opp.okr_id);
            return (
              <Link
                key={opp.id}
                href="/opportunities"
                className="block bg-[#141414] border border-[#222222] hover:border-[#333333] rounded-lg p-3 transition-all hover:bg-[#1a1a1a]"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs text-white font-medium leading-snug flex-1 line-clamp-2">
                    {opp.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${urgency.color}`}
                  >
                    {urgency.label}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      aligned
                        ? "text-[#22c55e] bg-[#22c55e]/10"
                        : "text-[#555555] bg-[#1a1a1a]"
                    }`}
                  >
                    {aligned ? "✓ Aligned" : "Not aligned"}
                  </span>
                </div>
                {opp.person && (
                  <p className="font-mono text-[10px] text-[#555555] mt-1.5 truncate">{opp.person}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
