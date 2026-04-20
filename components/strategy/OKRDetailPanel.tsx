"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { OKRStatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { KPIForm } from "@/components/strategy/KPIForm";
import { formatDate } from "@/lib/utils";
import { X, Edit2, Plus, Trash2 } from "lucide-react";
import type { OKR, KPI, Task } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface OKRDetailPanelProps {
  okr: OKR;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

const STATUS_PROGRESS_COLOR: Record<string, string> = {
  on_track: "bg-[#22c55e]",
  at_risk: "bg-[#f59e0b]",
  off_track: "bg-[#ef4444]",
  completed: "bg-[#3b82f6]",
  paused: "bg-[#4a4a4a]",
};

export function OKRDetailPanel({ okr, onClose, onEdit, onRefresh }: OKRDetailPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showKPIForm, setShowKPIForm] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadTasks();
  }, [okr.id]);

  async function loadTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("okr_id", okr.id)
      .order("created_at", { ascending: false });
    if (data) setTasks(data as Task[]);
  }

  async function deleteKPI(kpiId: string) {
    await supabase.from("kpis").delete().eq("id", kpiId);
    onRefresh();
    toast({ title: "KPI deleted" });
  }

  const kpis = okr.kpis || [];
  const progressColor = STATUS_PROGRESS_COLOR[okr.status] || "bg-[#7c5cfc]";

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col z-30 animate-slide-in-right">
      <div className="px-5 pt-5 pb-4 border-b border-[#1e1e1e] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <OKRStatusBadge status={okr.status} />
          <h2 className="text-sm font-semibold text-[#f0f0f0] mt-2 leading-snug">{okr.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] text-[#4a4a4a]">{okr.quarter}</span>
            {okr.owner && (
              <span className="font-mono text-[10px] text-[#4a4a4a]">· {okr.owner}</span>
            )}
            {okr.deadline && (
              <span className="font-mono text-[10px] text-[#4a4a4a]">
                · Due {formatDate(okr.deadline)}
              </span>
            )}
          </div>
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
        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">Progress</span>
            <span className="font-mono text-sm text-[#f0f0f0]">{okr.progress}%</span>
          </div>
          <Progress value={okr.progress} indicatorClassName={progressColor} />
        </div>

        {okr.description && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{okr.description}</p>
          </div>
        )}

        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
              KPIs ({kpis.length})
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowKPIForm(true)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {kpis.length === 0 ? (
            <p className="font-mono text-[10px] text-[#4a4a4a]">No KPIs yet.</p>
          ) : (
            <div className="space-y-3">
              {kpis.map((kpi) => {
                const pct = kpi.target_value > 0
                  ? Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100))
                  : 0;
                return (
                  <div key={kpi.id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#f0f0f0]">{kpi.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => { setEditingKPI(kpi); setShowKPIForm(true); }}
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteKPI(kpi.id)}
                        >
                          <Trash2 className="w-2.5 h-2.5 text-[#ef4444]" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1.5">
                      <span className="font-mono text-sm text-[#f0f0f0]">
                        {kpi.current_value.toLocaleString()}
                      </span>
                      <span className="font-mono text-[10px] text-[#4a4a4a]">
                        / {kpi.target_value.toLocaleString()} {kpi.unit}
                      </span>
                      <span className="font-mono text-[10px] text-[#6b6b6b] ml-auto">{pct}%</span>
                    </div>
                    <Progress
                      value={pct}
                      className="h-0.5"
                      indicatorClassName={progressColor}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
              Linked Tasks ({tasks.length})
            </span>
          </div>
          {tasks.length === 0 ? (
            <p className="font-mono text-[10px] text-[#4a4a4a]">No tasks linked to this OKR.</p>
          ) : (
            <div className="space-y-1.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#1a1a1a] transition-colors"
                >
                  <span
                    className={cn(
                      "inline-block w-0.5 h-3 rounded-full shrink-0",
                      task.priority === "critical" ? "bg-[#ef4444]" :
                      task.priority === "high" ? "bg-[#f59e0b]" :
                      task.priority === "medium" ? "bg-[#7c5cfc]" : "bg-[#4a4a4a]"
                    )}
                  />
                  <span className="text-xs text-[#f0f0f0] flex-1 truncate">{task.title}</span>
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 rounded",
                      task.status === "done" ? "text-[#22c55e] bg-[#22c55e]/10" :
                      task.status === "blocked" ? "text-[#ef4444] bg-[#ef4444]/10" :
                      task.status === "doing" ? "text-[#7c5cfc] bg-[#7c5cfc]/10" :
                      "text-[#6b6b6b] bg-[#1e1e1e]"
                    )}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {okr.notes && (
          <div className="px-5 pb-5 border-t border-[#1e1e1e] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Notes
            </span>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{okr.notes}</p>
          </div>
        )}
      </div>

      {showKPIForm && (
        <KPIForm
          okrId={okr.id}
          kpi={editingKPI || undefined}
          onClose={() => { setShowKPIForm(false); setEditingKPI(null); onRefresh(); }}
        />
      )}
    </div>
  );
}
