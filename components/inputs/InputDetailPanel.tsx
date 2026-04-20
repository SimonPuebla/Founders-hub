"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/tasks/TaskForm";
import { OppForm } from "@/components/opportunities/OppForm";
import { formatDate } from "@/lib/utils";
import { X, Edit2, Plus, CheckSquare, Zap } from "lucide-react";
import type { Input } from "@/types";
import { toast } from "@/hooks/use-toast";

const TYPE_COLORS: Record<string, string> = {
  meeting: "text-[#3b82f6] bg-[#3b82f6]/10",
  note: "text-[#6b6b6b] bg-[#1e1e1e]",
  transcript: "text-[#7c5cfc] bg-[#7c5cfc]/10",
  voice_note: "text-[#f97316] bg-[#f97316]/10",
  quick_idea: "text-[#22c55e] bg-[#22c55e]/10",
  day_update: "text-[#f59e0b] bg-[#f59e0b]/10",
  weekly_recap: "text-[#ef4444] bg-[#ef4444]/10",
};

interface InputDetailPanelProps {
  input: Input;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

export function InputDetailPanel({ input, onClose, onEdit, onRefresh }: InputDetailPanelProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showOppForm, setShowOppForm] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const typeColor = TYPE_COLORS[input.type] || "text-[#6b6b6b] bg-[#1e1e1e]";

  function handleTextSelection() {
    const selection = window.getSelection()?.toString().trim();
    if (selection) setSelectedText(selection);
  }

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-[520px] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col z-30 animate-slide-in-right">
        <div className="px-5 pt-5 pb-4 border-b border-[#1e1e1e] flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${typeColor}`}>
                {input.type.replace("_", " ")}
              </span>
              <span className="font-mono text-[10px] text-[#4a4a4a]">
                {formatDate(input.date)}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-[#f0f0f0] leading-snug">{input.title}</h2>
            {input.people && input.people.length > 0 && (
              <p className="text-xs text-[#6b6b6b] mt-1">{input.people.join(", ")}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon-sm" onClick={onEdit}>
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {input.content && (
            <div className="px-5 py-4 border-b border-[#1e1e1e]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
                  Content
                </span>
                <div className="flex items-center gap-1">
                  {selectedText && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] gap-1"
                        onClick={() => setShowTaskForm(true)}
                      >
                        <CheckSquare className="w-2.5 h-2.5" />
                        → Task
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] gap-1"
                        onClick={() => setShowOppForm(true)}
                      >
                        <Zap className="w-2.5 h-2.5" />
                        → Opp
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div
                className="text-xs text-[#6b6b6b] leading-relaxed whitespace-pre-wrap font-mono select-text"
                onMouseUp={handleTextSelection}
              >
                {input.content}
              </div>
              {!selectedText && (
                <p className="font-mono text-[10px] text-[#2a2a2a] mt-2">
                  Select text to convert to task or opportunity
                </p>
              )}
            </div>
          )}

          {input.extracted_decisions && input.extracted_decisions.length > 0 && (
            <div className="px-5 py-4 border-b border-[#1e1e1e]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
                Decisions
              </span>
              <ul className="space-y-1">
                {input.extracted_decisions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-[10px] text-[#4a4a4a] mt-0.5">·</span>
                    <span className="text-xs text-[#f0f0f0]">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {input.extracted_followups && input.extracted_followups.length > 0 && (
            <div className="px-5 py-4 border-b border-[#1e1e1e]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
                Follow-ups
              </span>
              <ul className="space-y-1">
                {input.extracted_followups.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-[10px] text-[#f59e0b] mt-0.5">→</span>
                    <span className="text-xs text-[#f0f0f0]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {input.extracted_tasks && input.extracted_tasks.length > 0 && (
            <div className="px-5 py-4 border-b border-[#1e1e1e]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
                Tasks Extracted ({input.extracted_tasks.length})
              </span>
              <div className="space-y-1">
                {input.extracted_tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#f0f0f0]">
                    <span className="font-mono text-[10px] text-[#22c55e]">✓</span>
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-7 text-xs"
                onClick={() => setShowTaskForm(true)}
              >
                <Plus className="w-3 h-3" />
                New Task from this
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-7 text-xs"
                onClick={() => setShowOppForm(true)}
              >
                <Plus className="w-3 h-3" />
                New Opp from this
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          task={selectedText ? { id: "", title: selectedText, status: "todo", priority: "medium", progress: 0, input_id: input.id, okr_id: undefined, created_at: "", updated_at: "" } : undefined}
          onClose={() => { setShowTaskForm(false); setSelectedText(""); toast({ title: "Task created" }); onRefresh(); }}
        />
      )}

      {showOppForm && (
        <OppForm
          opp={selectedText ? undefined : undefined}
          onClose={() => { setShowOppForm(false); setSelectedText(""); onRefresh(); }}
        />
      )}
    </>
  );
}
