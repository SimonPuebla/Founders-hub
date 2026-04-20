import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import type { Input } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  meeting: "text-[#3b82f6] bg-[#3b82f6]/10",
  note: "text-[#6b6b6b] bg-[#1e1e1e]",
  transcript: "text-[#7c5cfc] bg-[#7c5cfc]/10",
  voice_note: "text-[#f97316] bg-[#f97316]/10",
  quick_idea: "text-[#22c55e] bg-[#22c55e]/10",
  day_update: "text-[#f59e0b] bg-[#f59e0b]/10",
  weekly_recap: "text-[#ef4444] bg-[#ef4444]/10",
};

const CATEGORY_LABELS: Record<string, string> = {
  fundraising: "Fundraising",
  government: "Gobierno",
  product: "Producto",
  demo: "Demo",
  event: "Evento",
  strategy: "Estrategia",
  ecosystem: "Ecosistema",
  other: "Otro",
};

interface InputCardProps {
  input: Input;
  isSelected?: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function InputCard({ input, isSelected, onClick, onEdit }: InputCardProps) {
  const processed = !!input.extracted_tasks;
  const typeColor = TYPE_COLORS[input.type] || "text-[#6b6b6b] bg-[#1e1e1e]";

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded border cursor-pointer group transition-colors",
        isSelected
          ? "bg-[#1a1a1a] border-[#7c5cfc]/50"
          : "bg-[#111111] border-[#1e1e1e] hover:border-[#2a2a2a]"
      )}
      onClick={onClick}
    >
      <div className="shrink-0">
        {processed ? (
          <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
        ) : (
          <Circle className="w-4 h-4 text-[#2a2a2a]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm text-[#f0f0f0] truncate">{input.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[10px] px-1.5 py-0.5 rounded", typeColor)}>
            {input.type.replace("_", " ")}
          </span>
          <span className="font-mono text-[10px] text-[#4a4a4a]">
            {CATEGORY_LABELS[input.category] || input.category}
          </span>
          {input.people && input.people.length > 0 && (
            <span className="font-mono text-[10px] text-[#4a4a4a]">
              · {input.people.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[10px] text-[#4a4a4a]">
          {formatDate(input.date, "dd MMM")}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
