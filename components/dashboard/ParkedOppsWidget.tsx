import Link from "next/link";
import { OPP_TYPE_LABELS } from "@/types";
import type { Opportunity } from "@/types";

interface ParkedOppsWidgetProps {
  opps: Opportunity[];
  loading: boolean;
}

export function ParkedOppsWidget({ opps, loading }: ParkedOppsWidgetProps) {
  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">Parked Opportunities</span>
          {opps.length > 0 && (
            <span className="text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
              {opps.length}
            </span>
          )}
        </div>
        <Link href="/opportunities" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-7 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : opps.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">No parked opportunities.</p>
      ) : (
        <div className="space-y-0.5">
          {opps.slice(0, 5).map((opp) => (
            <Link
              key={opp.id}
              href="/opportunities"
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-[#F9FAFB] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] shrink-0" />
              <span className="text-sm text-[#6B7280] truncate flex-1">{opp.title}</span>
              <span className="text-xs text-[#9CA3AF] shrink-0">
                {OPP_TYPE_LABELS[opp.type]}
              </span>
            </Link>
          ))}
          {opps.length > 5 && (
            <p className="text-xs text-[#9CA3AF] pt-1 px-2">
              +{opps.length - 5} more parked
            </p>
          )}
        </div>
      )}
    </div>
  );
}
