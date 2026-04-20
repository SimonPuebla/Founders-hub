import Link from "next/link";

interface ExecutionPulseWidgetProps {
  inProgress: number;
  blocked: number;
  completedPct: number;
  delegated: number;
  loading: boolean;
}

function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: "red" | "green" | "yellow" | "blue" | "gray";
}) {
  const valueColors = {
    red: "text-[#DC2626]",
    green: "text-[#16A34A]",
    yellow: "text-[#D97706]",
    blue: "text-[#2563EB]",
    gray: "text-[#6B7280]",
  };
  const col = color ? valueColors[color] : "text-[#111827]";

  return (
    <div>
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold ${col}`}>{value}</span>
        {sub && <span className="text-xs text-[#9CA3AF]">{sub}</span>}
      </div>
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
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5 flex flex-col min-h-[196px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#111827]">Execution Pulse</span>
        <Link href="/tasks" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
          <Stat
            label="In progress"
            value={inProgress}
            color={inProgress > 0 ? "blue" : "gray"}
          />
          <Stat
            label="Blocked"
            value={blocked}
            color={blocked > 0 ? "red" : "green"}
          />
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Done this week</p>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span
                className={`text-2xl font-bold ${
                  completedPct >= 60
                    ? "text-[#16A34A]"
                    : completedPct >= 30
                    ? "text-[#D97706]"
                    : "text-[#DC2626]"
                }`}
              >
                {completedPct}%
              </span>
            </div>
            <div className="h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  completedPct >= 60
                    ? "bg-[#16A34A]"
                    : completedPct >= 30
                    ? "bg-[#D97706]"
                    : "bg-[#DC2626]"
                }`}
                style={{ width: `${completedPct}%` }}
              />
            </div>
          </div>
          <Stat
            label="Delegated"
            value={delegated}
            color="gray"
          />
        </div>
      )}
    </div>
  );
}
