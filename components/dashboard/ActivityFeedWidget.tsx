import Link from "next/link";
import { Zap, Mic, FileText, Lightbulb, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Input } from "@/types";

const TYPE_ICONS: Record<string, React.ElementType> = {
  meeting: Calendar,
  voice_note: Mic,
  quick_idea: Lightbulb,
  transcript: FileText,
  note: FileText,
  day_update: Zap,
  weekly_recap: Zap,
};

const TYPE_COLORS: Record<string, string> = {
  meeting: "text-[#3b82f6]",
  voice_note: "text-[#f97316]",
  quick_idea: "text-[#22c55e]",
  transcript: "text-[#7c5cfc]",
  note: "text-[#888888]",
  day_update: "text-[#f59e0b]",
  weekly_recap: "text-[#ef4444]",
};

interface ActivityFeedWidgetProps {
  inputs: Input[];
  loading: boolean;
}

export function ActivityFeedWidget({ inputs, loading }: ActivityFeedWidgetProps) {
  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Activity Feed
          </span>
        </div>
        <Link
          href="/inputs"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          All inputs →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : inputs.length === 0 ? (
        <div className="py-2">
          <p className="text-xs text-[#555555]">No recent activity</p>
          <p className="font-mono text-[10px] text-[#444444] mt-1">
            Capture meetings, ideas, and updates to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {inputs.slice(0, 6).map((input) => {
            const Icon = TYPE_ICONS[input.type] || FileText;
            const color = TYPE_COLORS[input.type] || "text-[#888888]";
            return (
              <Link
                key={input.id}
                href="/inputs"
                className="flex items-center gap-2.5 py-2 px-2 rounded hover:bg-[#1a1a1a] transition-colors group"
              >
                <Icon className={`w-3 h-3 shrink-0 ${color}`} />
                <span className="text-xs text-white truncate flex-1">{input.title}</span>
                <span className="font-mono text-[10px] text-[#555555] shrink-0">
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
