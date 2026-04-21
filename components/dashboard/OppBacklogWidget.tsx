import Link from "next/link";
import type { Opportunity } from "@/types";

const STATUS_CFG: Record<string, { label: string; textColor: string; bg: string }> = {
  active: { label: "Active", textColor: "var(--green)", bg: "var(--green-light)" },
  reviewing: { label: "Reviewing", textColor: "var(--amber)", bg: "var(--amber-light)" },
  captured: { label: "New", textColor: "var(--blue)", bg: "var(--blue-light)" },
  mapped: { label: "Mapped", textColor: "var(--purple)", bg: "var(--purple-light)" },
  parked: { label: "Parked", textColor: "var(--text-muted)", bg: "var(--bg)" },
};

const URGENCY_COLOR: Record<string, string> = {
  immediate: "var(--red)",
  this_month: "var(--amber)",
  this_quarter: "var(--blue)",
  no_rush: "var(--border-strong)",
};

interface OppBacklogWidgetProps {
  opps: Opportunity[];
  loading: boolean;
}

export function OppBacklogWidget({ opps, loading }: OppBacklogWidgetProps) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Opportunity Backlog</p>
        <Link href="/opportunities" className="text-[12px]" style={{ color: "var(--text-muted)" }}>All →</Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 rounded-lg animate-pulse" style={{ background: "var(--bg)" }} />
          ))}
        </div>
      ) : opps.length === 0 ? (
        <div>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>No active opportunities</p>
          <Link href="/opportunities" className="text-[12px] mt-1 inline-block" style={{ color: "var(--blue)" }}>
            Add opportunity →
          </Link>
        </div>
      ) : (
        <div className="space-y-0.5">
          {opps.slice(0, 5).map((opp) => {
            const cfg = STATUS_CFG[opp.status] || STATUS_CFG.reviewing;
            const urgencyColor = URGENCY_COLOR[opp.urgency] || "var(--border-strong)";
            return (
              <Link
                key={opp.id}
                href="/opportunities"
                className="flex items-center gap-2.5 py-2 px-2.5 -mx-2.5 rounded-lg transition-colors"
                style={{ color: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: urgencyColor }} />
                <span className="text-[13px] truncate flex-1" style={{ color: "var(--text-secondary)" }}>
                  {opp.title}
                </span>
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded shrink-0"
                  style={{ color: cfg.textColor, background: cfg.bg }}
                >
                  {cfg.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
