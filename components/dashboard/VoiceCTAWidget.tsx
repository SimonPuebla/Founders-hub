"use client";

import { Mic, Plus, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function VoiceCTAWidget() {
  const { setQuickCaptureOpen, setQuickCaptureTab } = useAppStore();

  function openVoice() {
    setQuickCaptureTab("input");
    setQuickCaptureOpen(true);
  }

  function openTask() {
    setQuickCaptureTab("task");
    setQuickCaptureOpen(true);
  }

  function openInput() {
    setQuickCaptureTab("input");
    setQuickCaptureOpen(true);
  }

  return (
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5 flex flex-col min-h-[196px]">
      <span className="text-sm font-medium text-[#111827] mb-4">Quick Capture</span>

      <div className="flex-1 flex flex-col gap-3">
        <button
          onClick={openVoice}
          className="flex items-center gap-3 w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg px-4 py-3 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium block">Voice Update</span>
            <span className="text-xs text-blue-200">Log meeting, idea, or update</span>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={openTask}
            className="flex items-center gap-2 border border-[#E6E8EB] rounded-lg px-3 py-2.5 hover:bg-[#F9FAFB] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <span className="text-sm text-[#374151]">New Task</span>
          </button>
          <button
            onClick={openInput}
            className="flex items-center gap-2 border border-[#E6E8EB] rounded-lg px-3 py-2.5 hover:bg-[#F9FAFB] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <span className="text-sm text-[#374151]">New Note</span>
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#9CA3AF] text-center">
        Press <kbd className="bg-[#F3F4F6] border border-[#E6E8EB] px-1 rounded text-[#6B7280] text-[11px]">I</kbd> anywhere to capture
      </p>
    </div>
  );
}
