"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { OppCard } from "@/components/opportunities/OppCard";
import { OppDetailPanel } from "@/components/opportunities/OppDetailPanel";
import { OppForm } from "@/components/opportunities/OppForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { Opportunity, OpportunityStatus } from "@/types";
import { cn } from "@/lib/utils";

const COLUMNS: { status: OpportunityStatus; label: string }[] = [
  { status: "captured", label: "Captured" },
  { status: "reviewing", label: "Reviewing" },
  { status: "mapped", label: "Mapped" },
  { status: "active", label: "Active" },
  { status: "parked", label: "Parked" },
];

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const loadOpps = useCallback(async () => {
    const { data } = await supabase
      .from("opportunities")
      .select("*, okr:okrs(id,title)")
      .not("status", "in", '("ignored","closed","delegated")')
      .order("created_at", { ascending: false });
    if (data) setOpps(data as Opportunity[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadOpps(); }, [loadOpps]);

  const filteredOpps = search.trim()
    ? opps.filter((o) => o.title.toLowerCase().includes(search.toLowerCase()))
    : opps;

  const grouped = COLUMNS.reduce<Record<string, Opportunity[]>>((acc, col) => {
    acc[col.status] = filteredOpps.filter((o) => o.status === col.status);
    return acc;
  }, {});

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-h-0 ${selectedOpp ? "mr-[420px]" : ""}`}>
        <div className="px-8 pt-8 pb-5 border-b border-[#1e1e1e] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#f0f0f0]">Opportunities</h1>
            <p className="font-mono text-xs text-[#4a4a4a] mt-0.5">{opps.length} total</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4a4a4a]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-7 h-7 text-xs w-[180px]"
              />
            </div>
            <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Capture
              <span className="font-mono text-[10px] opacity-50">O</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="px-8 py-6 flex gap-4">
              {COLUMNS.map((col) => (
                <div key={col.status} className="w-[260px] space-y-2">
                  <div className="h-6 bg-[#111111] rounded animate-pulse" />
                  <div className="h-20 bg-[#111111] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-8 py-5 flex gap-4 min-h-full">
              {COLUMNS.map((col) => {
                const colOpps = grouped[col.status] || [];
                return (
                  <div key={col.status} className="w-[260px] shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
                        {col.label}
                      </span>
                      <span className="font-mono text-[10px] text-[#4a4a4a] bg-[#1e1e1e] px-1.5 py-0.5 rounded">
                        {colOpps.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {colOpps.map((opp) => (
                        <OppCard
                          key={opp.id}
                          opp={opp}
                          isSelected={selectedOpp?.id === opp.id}
                          onClick={() => setSelectedOpp(selectedOpp?.id === opp.id ? null : opp)}
                        />
                      ))}
                      {colOpps.length === 0 && (
                        <div className="h-16 rounded border border-dashed border-[#1e1e1e] flex items-center justify-center">
                          <span className="font-mono text-[10px] text-[#2a2a2a]">empty</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedOpp && (
        <OppDetailPanel
          opp={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          onEdit={() => { setEditingOpp(selectedOpp); setShowForm(true); }}
          onRefresh={loadOpps}
          onStatusChange={(updatedOpp) => {
            setSelectedOpp(updatedOpp);
            loadOpps();
          }}
        />
      )}

      {showForm && (
        <OppForm
          opp={editingOpp || undefined}
          onClose={() => { setShowForm(false); setEditingOpp(null); loadOpps(); }}
        />
      )}
    </div>
  );
}
