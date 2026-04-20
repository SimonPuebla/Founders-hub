import { OppStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { OPP_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/types";

interface OppCardProps {
  opp: Opportunity;
  isSelected?: boolean;
  onClick: () => void;
}

export function OppCard({ opp, isSelected, onClick }: OppCardProps) {
  return (
    <div
      className={cn(
        "rounded border p-3 cursor-pointer transition-colors",
        isSelected
          ? "bg-[#1a1a1a] border-[#7c5cfc]/50"
          : "bg-[#111111] border-[#1e1e1e] hover:border-[#2a2a2a]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs text-[#f0f0f0] leading-snug flex-1">{opp.title}</span>
        <UrgencyBadge urgency={opp.urgency} className="shrink-0" />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-mono text-[10px] text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
          {OPP_TYPE_LABELS[opp.type]}
        </span>
        {opp.person && (
          <span className="font-mono text-[10px] text-[#4a4a4a]">{opp.person}</span>
        )}
        {opp.entity && (
          <span className="font-mono text-[10px] text-[#4a4a4a]">· {opp.entity}</span>
        )}
      </div>

      {opp.okr && (
        <div className="mt-1.5">
          <span className="font-mono text-[10px] text-[#7c5cfc] bg-[#7c5cfc]/10 px-1.5 py-0.5 rounded truncate block">
            {opp.okr.title}
          </span>
        </div>
      )}
    </div>
  );
}
