import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { OKR, KPI } from "@/types";

interface FundraisingWidgetProps {
  okr?: OKR;
  kpi?: KPI;
  loading: boolean;
}

export function FundraisingWidget({ okr, kpi, loading }: FundraisingWidgetProps) {
  const current = kpi?.current_value || 0;
  const target = kpi?.target_value || 1500000;
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="rounded border border-[#2a2a2a] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
          Seed Round
        </span>
        <Link href="/strategy" className="font-mono text-[10px] text-[#4a4a4a] hover:text-[#7c5cfc] transition-colors">
          →
        </Link>
      </div>

      {loading ? (
        <div className="h-12 bg-[#1e1e1e] rounded animate-pulse" />
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-xl text-[#f0f0f0]">
              {formatCurrency(current)}
            </span>
            <span className="font-mono text-xs text-[#4a4a4a]">
              / {formatCurrency(target)} target
            </span>
          </div>

          <Progress
            value={pct}
            className="h-1 mb-2"
            indicatorClassName={pct >= 60 ? "bg-[#22c55e]" : pct >= 30 ? "bg-[#7c5cfc]" : "bg-[#f59e0b]"}
          />

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#4a4a4a]">{pct}% committed</span>
            {okr && (
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  okr.status === "on_track"
                    ? "text-[#22c55e] bg-[#22c55e]/10"
                    : okr.status === "at_risk"
                    ? "text-[#f59e0b] bg-[#f59e0b]/10"
                    : "text-[#ef4444] bg-[#ef4444]/10"
                }`}
              >
                {okr.status.replace("_", " ")}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
