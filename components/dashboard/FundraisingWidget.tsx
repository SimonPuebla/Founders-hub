import Link from "next/link";
import { TrendingUp } from "lucide-react";
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

  const barColor =
    pct >= 60 ? "bg-[#22c55e]" : pct >= 30 ? "bg-[#7c5cfc]" : "bg-[#f59e0b]";
  const pctColor =
    pct >= 60 ? "text-[#22c55e]" : pct >= 30 ? "text-[#7c5cfc]" : "text-[#f59e0b]";

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Seed Round
          </span>
        </div>
        <Link
          href="/strategy"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          Details →
        </Link>
      </div>

      {loading ? (
        <div className="h-16 bg-[#1a1a1a] rounded animate-pulse" />
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-2xl font-bold text-white">
              {formatCurrency(current)}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#555555]">
                Target: {formatCurrency(target)}
              </span>
              <span className={`font-mono text-sm font-bold ${pctColor}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-[10px] text-[#555555]">
              {formatCurrency(target - current)} remaining
            </span>
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
