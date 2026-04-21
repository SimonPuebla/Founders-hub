"use client";

import { Mic, Plus, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function QuickActionsBar() {
  const { setQuickCaptureOpen, setQuickCaptureTab } = useAppStore();

  return (
    <div className="glass px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">Quick Actions</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setQuickCaptureTab("task"); setQuickCaptureOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-black/4 hover:border-[#D1D5DB] transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#6B7280]" />
            Add Task
          </button>
          <button
            onClick={() => { setQuickCaptureTab("opportunity"); setQuickCaptureOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-black/4 hover:border-[#D1D5DB] transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-[#6B7280]" />
            Add Opportunity
          </button>
          <button
            onClick={() => { setQuickCaptureTab("input"); setQuickCaptureOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Mic className="w-4 h-4" />
            Voice Update
          </button>
        </div>
      </div>
    </div>
  );
}
