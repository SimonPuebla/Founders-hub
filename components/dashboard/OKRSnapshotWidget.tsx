import Link from "next/link";
import type { OKR } from "@/types";

const STATUS_CFG: Record<string, { bar: string; textColor: string; bg: string; label: string }> = {
  on_track: { bar: "var(--green)", textColor: "var(--green)", bg: "var(--green-light)", label: "On track" },
  at_risk: { bar: "var(--amber)", textColor: "var(--amber)", bg: "var(--amber-light)", label: "At risk" },
  off_track: { bar: "var(--red)", textColor: "var(--red)", bg: "var(--red-light)", label: "Off track" },
  completed: { bar: "var(--blue)", textColor: "var(--blue)", bg: "var(--blue-light)", label: "Done" },
  paused: { bar: "var(--border-strong)", textColor: "var(--text-muted)", bg: "var(--bg)", label: "Paused" },
};

interface OKRSnapshotWidgetProps {
  okrs: OKR[];
  loading: boolean;
}

export function OKRSnapshotWidget({ okrs, loading }: OKRSnapshotWidgetProps) {
  const active = okrs.filter((o) => o.status !== "completed" && o.status !== "paused").slice(0, 4);

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>OKRs</p>
        <Link href="/strategy" className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Strategy →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>No active OKRs</p>
          <Link href="/strategy" className="text-[12px] mt-1 inline-block" style={{ color: "var(--blue)" }}>
            Define strategy →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((okr) => {
            const cfg = STATUS_CFG[okr.status] || STATUS_CFG.off_track;
            return (
              <div key={okr.id}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[13px] leading-snug flex-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {okr.title}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-1.5 py-0.5 rounded shrink-0 tabular-nums"
                    style={{ color: cfg.textColor, background: cfg.bg }}
                  >
                    {okr.progress}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${okr.progress}%`, background: cfg.bar }}
                  />
                </div>
                {okr.kpis && okr.kpis.length > 0 && (
                  <div className="mt-1.5 space-y-0.5">
                    {okr.kpis.slice(0, 2).map((kpi) => (
                      <div key={kpi.id} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--border-strong)" }} />
                        <span className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{kpi.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
