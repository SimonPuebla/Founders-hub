import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Input } from "@/types";

interface InputsWidgetProps {
  inputs: Input[];
  loading: boolean;
}

export function InputsWidget({ inputs, loading }: InputsWidgetProps) {
  return (
    <div className="rounded border border-[#1e1e1e] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
            Inputs sin procesar
          </span>
          {inputs.length > 0 && (
            <span className="font-mono text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">
              {inputs.length}
            </span>
          )}
        </div>
        <Link href="/inputs" className="font-mono text-[10px] text-[#4a4a4a] hover:text-[#7c5cfc] transition-colors">
          Procesar →
        </Link>
      </div>

      {loading ? (
        <div className="h-8 bg-[#1e1e1e] rounded animate-pulse" />
      ) : inputs.length === 0 ? (
        <p className="font-mono text-[10px] text-[#22c55e]">Todo procesado.</p>
      ) : (
        <div className="space-y-1">
          {inputs.slice(0, 3).map((input) => (
            <Link
              key={input.id}
              href={`/inputs`}
              className="flex items-center gap-2 py-1 hover:bg-[#1a1a1a] px-2 rounded transition-colors"
            >
              <span className="font-mono text-[10px] text-[#4a4a4a] shrink-0">
                {formatDate(input.date, "dd MMM")}
              </span>
              <span className="text-xs text-[#f0f0f0] truncate flex-1">{input.title}</span>
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e1e] text-[#6b6b6b] shrink-0"
              >
                {input.type}
              </span>
            </Link>
          ))}
          {inputs.length > 3 && (
            <p className="font-mono text-[10px] text-[#4a4a4a] px-2 pt-1">
              +{inputs.length - 3} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
