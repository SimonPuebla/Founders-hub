import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { OKR, KPI } from "@/types";

interface KPIFundraisingWidgetProps {
  okr?: OKR;
  kpi?: KPI;
  loading: boolean;
}

const SCENARIOS = [
  { amount: 1000000, valuation: 30000000, label: "$1M @ $30M" },
  { amount: 1500000, valuation: 20000000, label: "$1.5M @ $20M" },
  { amount: 1000000, valuation: 25000000, label: "$1M @ $25M" },
];

export function KPIFundraisingWidget({ okr, kpi, loading }: KPIFundraisingWidgetProps) {
  const current = kpi?.current_value || 0;
  const target = kpi?.target_value || 1500000;
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#111827]">KPI — Fundraising</p>
        <Link href="/strategy" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          →
        </Link>
      </div>

      {loading ? (
        <div className="h-20 bg-black/5 rounded-lg animate-pulse" />
      ) : (
        <>
          <div className="mb-3">
            <span className="text-2xl font-bold text-[#111827]">{formatCurrency(current)}</span>
            <div className="mt-1.5 h-1.5 bg-black/6 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pct >= 60 ? "bg-[#16A34A]" : pct >= 30 ? "bg-[#2563EB]" : "bg-[#D97706]"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-[#9CA3AF]">{pct}% of {formatCurrency(target)}</span>
              {okr && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  okr.status === "on_track" ? "text-[#16A34A] bg-green-50" :
                  okr.status === "at_risk" ? "text-[#D97706] bg-amber-50" :
                  "text-[#DC2626] bg-red-50"
                }`}>
                  {okr.status.replace("_", " ")}
                </span>
              )}
            </div>
          </div>

          {/* Range scenarios */}
          <div className="border-t border-black/6 pt-3 mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <p className="text-xs font-medium text-[#D97706]">Range undefined — choose one</p>
            </div>
            <div className="space-y-1">
              {SCENARIOS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-1 px-2 -mx-2 rounded hover:bg-black/4 transition-colors"
                >
                  <span className="text-xs text-[#6B7280]">{s.label}</span>
                  <span className="text-xs text-[#9CA3AF]">
                    {Math.round((s.amount / s.valuation) * 100)}% equity
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/strategy"
              className="mt-2 inline-flex items-center text-xs font-medium text-[#DC2626] hover:underline"
            >
              Define official number →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
