import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Input } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  meeting: "Meeting",
  voice_note: "Voice",
  quick_idea: "Idea",
  transcript: "Transcript",
  note: "Note",
  day_update: "Update",
  weekly_recap: "Recap",
};

interface InputsWidgetProps {
  inputs: Input[];
  loading: boolean;
}

export function InputsWidget({ inputs, loading }: InputsWidgetProps) {
  return (
    <div
      className={`bg-white rounded-lg p-5 ${
        inputs.length > 0
          ? "border border-[#FDE68A]"
          : "border border-[#E6E8EB]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">Inputs to Process</span>
          {inputs.length > 0 && (
            <span className="text-xs font-medium text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full">
              {inputs.length}
            </span>
          )}
        </div>
        <Link href="/inputs" className="text-xs text-[#6B7280] hover:text-[#2563EB] transition-colors">
          All →
        </Link>
      </div>

      {loading ? (
        <div className="h-8 bg-[#F3F4F6] rounded animate-pulse" />
      ) : inputs.length === 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#16A34A]">All processed</span>
          <span className="text-xs text-[#9CA3AF]">— inbox zero</span>
        </div>
      ) : (
        <>
          <div className="space-y-0.5 mb-3">
            {inputs.slice(0, 3).map((input) => (
              <Link
                key={input.id}
                href="/inputs"
                className="flex items-center gap-2 py-2 px-2 -mx-2 rounded-md hover:bg-[#F9FAFB] transition-colors"
              >
                <span className="text-xs text-[#9CA3AF] shrink-0 w-12">
                  {formatDate(input.date, "dd MMM")}
                </span>
                <span className="text-sm text-[#374151] truncate flex-1">{input.title}</span>
                <span className="text-xs text-[#9CA3AF] shrink-0">
                  {TYPE_LABELS[input.type] || input.type}
                </span>
              </Link>
            ))}
            {inputs.length > 3 && (
              <p className="text-xs text-[#9CA3AF] pt-0.5 px-2">
                +{inputs.length - 3} more
              </p>
            )}
          </div>

          <Link
            href="/inputs"
            className="flex items-center justify-center gap-1.5 w-full py-2 border border-[#D97706] text-[#D97706] hover:bg-[#FFFBEB] rounded-lg transition-colors text-sm font-medium"
          >
            Process now →
          </Link>
        </>
      )}
    </div>
  );
}
