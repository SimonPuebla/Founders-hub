"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { X, Edit2 } from "lucide-react";
import type { Person, Input, Opportunity } from "@/types";
import { cn } from "@/lib/utils";

const RELATIONSHIP_COLORS: Record<string, string> = {
  team: "text-[#7c5cfc] bg-[#7c5cfc]/10",
  investor: "text-[#22c55e] bg-[#22c55e]/10",
  government: "text-[#3b82f6] bg-[#3b82f6]/10",
  ecosystem: "text-[#f97316] bg-[#f97316]/10",
  startup: "text-[#f59e0b] bg-[#f59e0b]/10",
  media: "text-[#ef4444] bg-[#ef4444]/10",
  other: "text-[#6b6b6b] bg-[#1e1e1e]",
};

interface PersonDetailPanelProps {
  person: Person;
  onClose: () => void;
  onEdit: () => void;
}

export function PersonDetailPanel({ person, onClose, onEdit }: PersonDetailPanelProps) {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("inputs")
      .select("id,title,type,date")
      .contains("people", [person.name])
      .order("date", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setInputs(data as Input[]); });

    supabase
      .from("opportunities")
      .select("id,title,type,status")
      .eq("person", person.name)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setOpps(data as Opportunity[]); });
  }, [person.name]);

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col z-30 animate-slide-in-right">
      <div className="px-5 pt-5 pb-4 border-b border-[#1e1e1e] flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/20 flex items-center justify-center mb-2">
            <span className="font-mono text-sm text-[#7c5cfc] font-bold">
              {person.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-sm font-semibold text-[#f0f0f0]">{person.name}</h2>
          {(person.role || person.organization) && (
            <p className="text-xs text-[#6b6b6b] mt-0.5">
              {[person.role, person.organization].filter(Boolean).join(" · ")}
            </p>
          )}
          <span
            className={cn(
              "inline-flex font-mono text-[10px] px-1.5 py-0.5 rounded mt-2",
              RELATIONSHIP_COLORS[person.relationship]
            )}
          >
            {person.relationship}
          </span>
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
        {person.notes && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">Notes</span>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">{person.notes}</p>
          </div>
        )}

        {person.last_contact && (
          <div className="px-5 py-3 border-b border-[#1e1e1e]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#4a4a4a]">Last contact</span>
              <span className="text-xs text-[#f0f0f0]">{formatDate(person.last_contact)}</span>
            </div>
          </div>
        )}

        {inputs.length > 0 && (
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Inputs ({inputs.length})
            </span>
            <div className="space-y-1.5">
              {inputs.map((input) => (
                <div key={input.id} className="flex items-center gap-2 py-1">
                  <span className="font-mono text-[10px] text-[#4a4a4a] shrink-0">
                    {formatDate(input.date, "dd MMM")}
                  </span>
                  <span className="text-xs text-[#f0f0f0] truncate">{input.title}</span>
                  <span className="font-mono text-[10px] text-[#4a4a4a] bg-[#1e1e1e] px-1.5 py-0.5 rounded shrink-0">
                    {input.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {opps.length > 0 && (
          <div className="px-5 py-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] block mb-2">
              Opportunities ({opps.length})
            </span>
            <div className="space-y-1.5">
              {opps.map((opp) => (
                <div key={opp.id} className="flex items-center gap-2 py-1">
                  <span className="text-xs text-[#f0f0f0] flex-1 truncate">{opp.title}</span>
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 rounded",
                      opp.status === "active" ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#6b6b6b] bg-[#1e1e1e]"
                    )}
                  >
                    {opp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
