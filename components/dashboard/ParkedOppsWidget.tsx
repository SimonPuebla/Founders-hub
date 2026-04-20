import Link from "next/link";
import { Archive } from "lucide-react";
import { OPP_TYPE_LABELS } from "@/types";
import type { Opportunity } from "@/types";

interface ParkedOppsWidgetProps {
  opps: Opportunity[];
  loading: boolean;
}

export function ParkedOppsWidget({ opps, loading }: ParkedOppsWidgetProps) {
  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Archive className="w-3.5 h-3.5 text-[#555555]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Parked Opportunities
          </span>
          {opps.length > 0 && (
            <span className="font-mono text-[10px] text-[#555555] bg-[#1a1a1a] px-1.5 py-0.5 rounded">
              {opps.length}
            </span>
          )}
        </div>
        <Link
          href="/opportunities"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          All →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-7 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : opps.length === 0 ? (
        <p className="text-xs text-[#555555]">No parked opportunities.</p>
      ) : (
        <div className="space-y-0.5">
          {opps.slice(0, 5).map((opp) => (
            <Link
              key={opp.id}
              href="/opportunities"
              className="flex items-center gap-2 py-2 px-2 rounded hover:bg-[#1a1a1a] transition-colors"
            >
              <span className="w-1 h-1 rounded-full bg-[#444444] shrink-0" />
              <span className="text-xs text-[#888888] truncate flex-1">{opp.title}</span>
              <span className="font-mono text-[10px] text-[#444444] shrink-0">
                {OPP_TYPE_LABELS[opp.type]}
              </span>
            </Link>
          ))}
          {opps.length > 5 && (
            <p className="font-mono text-[10px] text-[#444444] px-2 pt-1">
              +{opps.length - 5} more parked
            </p>
          )}
        </div>
      )}
    </div>
  );
}
