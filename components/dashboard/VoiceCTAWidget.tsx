"use client";

import { useAppStore } from "@/lib/store";
import { Mic, FileText, Zap } from "lucide-react";

export function VoiceCTAWidget() {
  const { setQuickCaptureOpen, setQuickCaptureTab } = useAppStore();

  function openVoice() {
    setQuickCaptureTab("input");
    setQuickCaptureOpen(true);
  }

  function openInput() {
    setQuickCaptureTab("input");
    setQuickCaptureOpen(true);
  }

  function openTask() {
    setQuickCaptureTab("task");
    setQuickCaptureOpen(true);
  }

  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5 flex flex-col min-h-[200px]">
      <div className="flex items-center gap-2 mb-4">
        <Mic className="w-3.5 h-3.5 text-[#f97316]" />
        <span className="text-xs font-semibold text-white uppercase tracking-wider">
          Quick Capture
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <button
          onClick={openVoice}
          className="flex items-center gap-3 w-full bg-[#f97316]/10 border border-[#f97316]/30 hover:border-[#f97316] hover:bg-[#f97316]/15 rounded-lg px-4 py-3.5 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-[#f97316]/20 flex items-center justify-center shrink-0 group-hover:bg-[#f97316]/30 transition-colors">
            <Mic className="w-4 h-4 text-[#f97316]" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-white block">Voice Update</span>
            <span className="text-[10px] text-[#888888]">Log a meeting, idea, or update</span>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={openTask}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222222] hover:border-[#7c5cfc]/50 rounded-lg px-3 py-2.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-[#7c5cfc] shrink-0" />
            <span className="text-xs text-white">New Task</span>
          </button>
          <button
            onClick={openInput}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222222] hover:border-[#3b82f6]/50 rounded-lg px-3 py-2.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
            <span className="text-xs text-white">New Note</span>
          </button>
        </div>
      </div>

      <p className="mt-3 font-mono text-[10px] text-[#444444] text-center">
        Press <kbd className="bg-[#1a1a1a] border border-[#333333] px-1 rounded text-[#666666]">I</kbd> anywhere to capture
      </p>
    </div>
  );
}
