"use client";

import { Mic, Plus, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function QuickActionsBar() {
  const { setQuickCaptureOpen, setQuickCaptureTab } = useAppStore();

  return (
    <div className="glass px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Quick Actions</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setQuickCaptureTab("task"); setQuickCaptureOpen(true); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            Add Task
          </button>
          <button
            onClick={() => { setQuickCaptureTab("opportunity"); setQuickCaptureOpen(true); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            Add Opportunity
          </button>
          <button
            onClick={() => { setQuickCaptureTab("input"); setQuickCaptureOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-colors"
            style={{ background: "var(--blue)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "oklch(47% 0.19 250)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--blue)"; }}
          >
            <Mic className="w-3.5 h-3.5" />
            Voice Update
          </button>
        </div>
      </div>
    </div>
  );
}
