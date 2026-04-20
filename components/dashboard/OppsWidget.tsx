import Link from "next/link";
import { OppStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { OPP_TYPE_LABELS } from "@/types";
import type { Opportunity } from "@/types";

interface OppsWidgetProps {
  opps: Opportunity[];
  loading: boolean;
}

export function OppsWidget({ opps, loading }: OppsWidgetProps) {
  return (
    <div className="rounded border border-[#1e1e1e] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
          Oportunidades
        </span>
        <Link href="/opportunities" className="font-mono text-[10px] text-[#4a4a4a] hover:text-[#7c5cfc] transition-colors">
          Ver todo →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-[#1e1e1e] rounded animate-pulse" />
          ))}
        </div>
      ) : opps.length === 0 ? (
        <p className="font-mono text-[10px] text-[#4a4a4a]">No active opportunities.</p>
      ) : (
        <div className="space-y-2">
          {opps.map((opp) => (
            <Link
              key={opp.id}
              href="/opportunities"
              className="block py-2 px-2 rounded hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs text-[#f0f0f0] leading-snug flex-1 truncate">{opp.title}</span>
                <UrgencyBadge urgency={opp.urgency} className="shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
                  {OPP_TYPE_LABELS[opp.type]}
                </span>
                {opp.person && (
                  <span className="font-mono text-[10px] text-[#4a4a4a]">{opp.person}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
