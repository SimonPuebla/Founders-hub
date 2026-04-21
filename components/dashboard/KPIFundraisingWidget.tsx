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
  const barColor = pct >= 60 ? "var(--green)" : pct >= 30 ? "var(--blue)" : "var(--amber)";

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Fundraising</p>
        <Link href="/strategy" className="text-[12px]" style={{ color: "var(--text-muted)" }}>→</Link>
      </div>

      {loading ? (
        <div className="h-20 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
      ) : (
        <>
          <div className="mb-3">
            <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {formatCurrency(current)}
            </span>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                {pct}% of {formatCurrency(target)}
              </span>
              {okr && (
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    color: okr.status === "on_track" ? "var(--green)" : okr.status === "at_risk" ? "var(--amber)" : "var(--red)",
                    background: okr.status === "on_track" ? "var(--green-light)" : okr.status === "at_risk" ? "var(--amber-light)" : "var(--red-light)",
                  }}
                >
                  {okr.status.replace("_", " ")}
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--amber)" }} />
              <p className="text-[11px] font-medium" style={{ color: "var(--amber)" }}>Range undefined — choose one</p>
            </div>
            <div className="space-y-0.5">
              {SCENARIOS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-1 px-2 -mx-2 rounded transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
                  <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {Math.round((s.amount / s.valuation) * 100)}% eq.
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/strategy"
              className="mt-2 inline-flex items-center text-[12px] font-medium"
              style={{ color: "var(--red)" }}
            >
              Define official number →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
