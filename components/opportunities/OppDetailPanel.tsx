"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OppStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { X, Edit2 } from "lucide-react";
import type { Opportunity, OpportunityStatus } from "@/types";
import { OPP_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const STATUSES: OpportunityStatus[] = [
  "captured", "reviewing", "mapped", "active", "parked", "delegated", "ignored", "closed"
];

interface OppDetailPanelProps {
  opp: Opportunity;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
  onStatusChange: (opp: Opportunity) => void;
}

export function OppDetailPanel({ opp, onClose, onEdit, onRefresh, onStatusChange }: OppDetailPanelProps) {
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  async function updateStatus(status: OpportunityStatus) {
    setUpdating(true);
    const { data } = await supabase
      .from("opportunities")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", opp.id)
      .select("*, okr:okrs(id,title)")
      .single();
    if (data) onStatusChange(data as Opportunity);
    toast({ title: `Status → ${status}` });
    setUpdating(false);
  }

  async function updateField(field: string, value: string) {
    const { data } = await supabase
      .from("opportunities")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", opp.id)
      .select("*, okr:okrs(id,title)")
      .single();
    if (data) onStatusChange(data as Opportunity);
    toast({ title: "Updated" });
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col z-30 animate-slide-in-right">
      <div className="px-5 pt-5 pb-4 border-b border-[#1e1e1e] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[10px] text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded">
              {OPP_TYPE_LABELS[opp.type]}
            </span>
            <OppStatusBadge status={opp.status} />
          </div>
          <h2 className="text-sm font-semibold text-[#f0f0f0] leading-snug">{opp.title}</h2>
          {(opp.person || opp.entity) && (
            <p className="text-xs text-[#6b6b6b] mt-1">
              {[opp.person, opp.entity].filter(Boolean).join(" · ")}
            </p>
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
        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border transition-colors",
                  opp.status === s
                    ? "border-[#7c5cfc] text-[#7c5cfc] bg-[#7c5cfc]/10"
                    : "border-[#1e1e1e] text-[#4a4a4a] hover:border-[#2a2a2a] hover:text-[#6b6b6b]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-b border-[#1e1e1e] space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block">
            Evaluación
          </span>

          <div>
            <p className="text-xs text-[#6b6b6b] mb-2">1. ¿Contribuye a un OKR activo?</p>
            <div className="flex items-center gap-2">
              {opp.okr ? (
                <span className="font-mono text-[10px] text-[#7c5cfc] bg-[#7c5cfc]/10 px-2 py-1 rounded">
                  {opp.okr.title}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-[#4a4a4a]">No vinculada</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#6b6b6b] mb-2">2. ¿Merece activarse ahora?</p>
            <div className="flex gap-2">
              {["Sí", "Todavía no", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField("recommended_action", opt)}
                  className={cn(
                    "font-mono text-[10px] px-2.5 py-1 rounded border transition-colors",
                    opp.recommended_action === opt
                      ? "border-[#7c5cfc] text-[#7c5cfc] bg-[#7c5cfc]/10"
                      : "border-[#1e1e1e] text-[#4a4a4a] hover:border-[#2a2a2a]"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#6b6b6b] mb-2">3. Urgencia</p>
            <UrgencyBadge urgency={opp.urgency} />
          </div>

          {opp.difficulty && (
            <div>
              <p className="text-xs text-[#6b6b6b] mb-1">4. Dificultad</p>
              <span
                className={cn(
                  "font-mono text-[10px] px-1.5 py-0.5 rounded",
                  opp.difficulty === "easy" ? "text-[#22c55e] bg-[#22c55e]/10" :
                  opp.difficulty === "medium" ? "text-[#f59e0b] bg-[#f59e0b]/10" :
                  "text-[#ef4444] bg-[#ef4444]/10"
                )}
              >
                {opp.difficulty}
              </span>
            </div>
          )}
        </div>

        {opp.description && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Description
            </span>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{opp.description}</p>
          </div>
        )}

        {opp.notes && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Notes
            </span>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{opp.notes}</p>
          </div>
        )}

        <div className="px-5 py-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
            Details
          </span>
          <div className="space-y-2">
            {opp.potential_value && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#4a4a4a]">Potential value</span>
                <span className="text-xs text-[#f0f0f0]">{opp.potential_value}</span>
              </div>
            )}
            {opp.owner && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#4a4a4a]">Owner</span>
                <span className="text-xs text-[#f0f0f0]">{opp.owner}</span>
              </div>
            )}
            {opp.origin && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#4a4a4a]">Origin</span>
                <span className="text-xs text-[#f0f0f0]">{opp.origin}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#4a4a4a]">Created</span>
              <span className="text-xs text-[#6b6b6b]">{formatDate(opp.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
