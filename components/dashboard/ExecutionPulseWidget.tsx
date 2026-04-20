import Link from "next/link";
import { Activity, TrendingUp } from "lucide-react";

interface ExecutionPulseWidgetProps {
  inProgress: number;
  blocked: number;
  completedPct: number;
  delegated: number;
  loading: boolean;
}

function PulseRow({
  label,
  value,
  bar,
  color,
}: {
  label: string;
  value: string | number;
  bar?: number;
  color: "green" | "red" | "yellow" | "blue" | "muted";
}) {
  const textColors = {
    green: "text-[#22c55e]",
    red: "text-[#ef4444]",
    yellow: "text-[#f59e0b]",
    blue: "text-[#3b82f6]",
    muted: "text-[#888888]",
  };
  const barColors = {
    green: "bg-[#22c55e]",
    red: "bg-[#ef4444]",
    yellow: "bg-[#f59e0b]",
    blue: "bg-[#3b82f6]",
    muted: "bg-[#444444]",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#888888]">{label}</span>
        <span className={`font-mono text-sm font-semibold ${textColors[color]}`}>{value}</span>
      </div>
      {bar !== undefined && (
        <div className="h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColors[color]}`}
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function ExecutionPulseWidget({
  inProgress,
  blocked,
  completedPct,
  delegated,
  loading,
}: ExecutionPulseWidgetProps) {
  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Execution Pulse
          </span>
        </div>
        <Link
          href="/tasks"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          All tasks →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          <PulseRow
            label="In progress"
            value={inProgress}
            color={inProgress > 0 ? "blue" : "muted"}
          />
          <PulseRow
            label="Blocked"
            value={blocked}
            color={blocked > 0 ? "red" : "green"}
          />
          <PulseRow
            label="Done this week"
            value={`${completedPct}%`}
            bar={completedPct}
            color={completedPct >= 60 ? "green" : completedPct >= 30 ? "yellow" : "red"}
          />
          <PulseRow
            label="Delegated / waiting"
            value={delegated}
            color="muted"
          />
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-[#555555]" />
          <span className="font-mono text-[10px] text-[#555555]">
            {inProgress === 0 && blocked === 0
              ? "No active execution — start something"
              : blocked > inProgress
              ? "More blocked than in progress — unblock first"
              : "Execution flowing"}
          </span>
        </div>
      </div>
    </div>
  );
}
