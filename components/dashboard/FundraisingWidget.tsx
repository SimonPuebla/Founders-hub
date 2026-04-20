import Link from "next/link";
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
    pct >= 60 ? "bg-[#16A34A]" : pct >= 30 ? "bg-[#2563EB]" : "bg-[#D97706]";
  const pctColor =
    pct >= 60 ? "text-[#16A34A]" : pct >= 30 ? "text-[#2563EB]" : "text-[#D97706]";

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#111827]">Seed Round</span>
        <Link href="/strategy" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          Details →
        </Link>
      </div>

      {loading ? (
        <div className="h-20 bg-[#F3F4F6] rounded animate-pulse" />
      ) : (
        <>
          <div className="mb-1">
            <span className="text-3xl font-bold text-[#111827]">{formatCurrency(current)}</span>
          </div>
          <p className="text-xs text-[#9CA3AF] mb-3">of {formatCurrency(target)} target</p>

          <div className="mb-1.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#6B7280]">Committed</span>
              <span className={`text-sm font-bold ${pctColor}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#9CA3AF]">
              {formatCurrency(target - current)} remaining
            </span>
            {okr && (
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  okr.status === "on_track"
                    ? "text-[#16A34A] bg-[#F0FDF4]"
                    : okr.status === "at_risk"
                    ? "text-[#D97706] bg-[#FFFBEB]"
                    : "text-[#DC2626] bg-[#FEF2F2]"
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
