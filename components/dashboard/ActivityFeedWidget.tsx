import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Input } from "@/types";

const TYPE_COLORS: Record<string, { dot: string; label: string }> = {
  meeting: { dot: "bg-[#2563EB]", label: "Meeting" },
  voice_note: { dot: "bg-[#EA580C]", label: "Voice note" },
  quick_idea: { dot: "bg-[#16A34A]", label: "Idea" },
  transcript: { dot: "bg-[#7C3AED]", label: "Transcript" },
  note: { dot: "bg-[#6B7280]", label: "Note" },
  day_update: { dot: "bg-[#D97706]", label: "Update" },
  weekly_recap: { dot: "bg-[#DC2626]", label: "Recap" },
};

interface ActivityFeedWidgetProps {
  inputs: Input[];
  loading: boolean;
}

export function ActivityFeedWidget({ inputs, loading }: ActivityFeedWidgetProps) {
  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#111827]">Activity Feed</span>
        <Link href="/inputs" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All inputs →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : inputs.length === 0 ? (
        <div className="py-1">
          <p className="text-sm text-[#6B7280]">No recent activity.</p>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Capture inputs to see activity here.</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {inputs.slice(0, 6).map((input) => {
            const cfg = TYPE_COLORS[input.type] || { dot: "bg-[#D1D5DB]", label: input.type };
            return (
              <Link
                key={input.id}
                href="/inputs"
                className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-[#F9FAFB] transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                <span className="text-sm text-[#374151] truncate flex-1">{input.title}</span>
                <span className="text-xs text-[#9CA3AF] shrink-0">
                  {formatDate(input.date, "dd MMM")}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
