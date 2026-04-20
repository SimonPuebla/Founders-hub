import Link from "next/link";
import { Inbox, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Input } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  meeting: "text-[#3b82f6]",
  voice_note: "text-[#f97316]",
  quick_idea: "text-[#22c55e]",
  transcript: "text-[#7c5cfc]",
  note: "text-[#888888]",
  day_update: "text-[#f59e0b]",
  weekly_recap: "text-[#ef4444]",
};

interface InputsWidgetProps {
  inputs: Input[];
  loading: boolean;
}

export function InputsWidget({ inputs, loading }: InputsWidgetProps) {
  return (
    <div
      className={`rounded-lg border bg-[#0f0f0f] p-5 ${
        inputs.length > 0
          ? "border-[#f59e0b]/30"
          : "border-[#222222]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Inbox
            className={`w-3.5 h-3.5 ${inputs.length > 0 ? "text-[#f59e0b]" : "text-[#555555]"}`}
          />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Inputs to Process
          </span>
          {inputs.length > 0 && (
            <span className="font-mono text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-1.5 py-0.5 rounded">
              {inputs.length}
            </span>
          )}
        </div>
        <Link
          href="/inputs"
          className="font-mono text-[10px] text-[#555555] hover:text-white transition-colors"
        >
          All inputs →
        </Link>
      </div>

      {loading ? (
        <div className="h-8 bg-[#1a1a1a] rounded animate-pulse" />
      ) : inputs.length === 0 ? (
        <div className="flex items-center gap-2 text-[#22c55e]">
          <span className="text-xs font-medium">All processed</span>
          <span className="font-mono text-[10px] text-[#555555]">— inbox zero</span>
        </div>
      ) : (
        <>
          <div className="space-y-0.5 mb-3">
            {inputs.slice(0, 3).map((input) => (
              <Link
                key={input.id}
                href="/inputs"
                className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="font-mono text-[10px] text-[#555555] shrink-0 w-12">
                  {formatDate(input.date, "dd MMM")}
                </span>
                <span className="text-xs text-white truncate flex-1">{input.title}</span>
                <span className={`font-mono text-[10px] shrink-0 ${TYPE_COLORS[input.type] || "text-[#888888]"}`}>
                  {input.type.replace("_", " ")}
                </span>
              </Link>
            ))}
            {inputs.length > 3 && (
              <p className="font-mono text-[10px] text-[#555555] px-2 pt-0.5">
                +{inputs.length - 3} more unprocessed
              </p>
            )}
          </div>

          <Link
            href="/inputs"
            className="flex items-center justify-center gap-2 w-full py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/15 rounded-lg transition-all text-[#f59e0b] font-mono text-xs"
          >
            Process now
            <ArrowRight className="w-3 h-3" />
          </Link>
        </>
      )}
    </div>
  );
}
