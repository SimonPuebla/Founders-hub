import Link from "next/link";
import type { OKR } from "@/types";

const STATUS_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  on_track: { bar: "bg-[#16A34A]", text: "text-[#16A34A]", bg: "bg-green-50" },
  at_risk: { bar: "bg-[#D97706]", text: "text-[#D97706]", bg: "bg-amber-50" },
  off_track: { bar: "bg-[#DC2626]", text: "text-[#DC2626]", bg: "bg-red-50" },
  completed: { bar: "bg-[#2563EB]", text: "text-[#2563EB]", bg: "bg-blue-50" },
  paused: { bar: "bg-[#D1D5DB]", text: "text-[#9CA3AF]", bg: "bg-gray-100" },
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
        <p className="text-sm font-semibold text-[#111827]">OKRs</p>
        <Link href="/strategy" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          Strategy →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-black/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div>
          <p className="text-sm text-[#6B7280]">No active OKRs</p>
          <Link href="/strategy" className="text-xs text-[#2563EB] hover:underline mt-1 inline-block">
            Define strategy →
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {active.map((okr) => {
            const cfg = STATUS_COLORS[okr.status] || STATUS_COLORS.off_track;
            return (
              <div key={okr.id}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm text-[#374151] leading-snug flex-1 line-clamp-2">
                    {okr.title}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${cfg.text} ${cfg.bg}`}>
                    {okr.progress}%
                  </span>
                </div>
                <div className="h-1 bg-black/6 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${cfg.bar}`}
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
                {okr.kpis && okr.kpis.length > 0 && (
                  <div className="mt-1.5 space-y-0.5">
                    {okr.kpis.slice(0, 2).map((kpi) => (
                      <div key={kpi.id} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#E5E7EB] shrink-0" />
                        <span className="text-xs text-[#9CA3AF] truncate">{kpi.title}</span>
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
