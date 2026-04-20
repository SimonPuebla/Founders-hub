"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { OKRCard } from "@/components/strategy/OKRCard";
import { OKRDetailPanel } from "@/components/strategy/OKRDetailPanel";
import { OKRForm } from "@/components/strategy/OKRForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { OKR } from "@/types";

export default function StrategyPage() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKR | null>(null);

  const supabase = createClient();

  async function loadOKRs() {
    const { data } = await supabase
      .from("okrs")
      .select("*, kpis(*)")
      .order("created_at", { ascending: true });
    if (data) setOkrs(data as OKR[]);
    setLoading(false);
  }

  useEffect(() => {
    loadOKRs();
  }, []);

  function handleEdit(okr: OKR) {
    setEditingOKR(okr);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingOKR(null);
    loadOKRs();
  }

  const activeOKRs = okrs.filter((o) => o.status !== "completed" && o.status !== "paused");
  const otherOKRs = okrs.filter((o) => o.status === "completed" || o.status === "paused");

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-h-0 ${selectedOKR ? "mr-[420px]" : ""}`}>
        <div className="px-8 pt-8 pb-6 border-b border-[#1e1e1e] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#f0f0f0]">Strategy</h1>
            <p className="font-mono text-xs text-[#4a4a4a] mt-0.5">OKRs + KPIs — Q2 2025</p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New OKR
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded border border-[#1e1e1e] bg-[#111111] animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {activeOKRs.length === 0 && otherOKRs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-mono text-sm text-[#4a4a4a]">No OKRs yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowForm(true)}
                  >
                    Create first OKR
                  </Button>
                </div>
              ) : (
                <>
                  {activeOKRs.map((okr) => (
                    <OKRCard
                      key={okr.id}
                      okr={okr}
                      isSelected={selectedOKR?.id === okr.id}
                      onClick={() => setSelectedOKR(selectedOKR?.id === okr.id ? null : okr)}
                      onEdit={() => handleEdit(okr)}
                    />
                  ))}
                  {otherOKRs.length > 0 && (
                    <>
                      <div className="pt-4 pb-2">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
                          Completed / Paused
                        </p>
                      </div>
                      {otherOKRs.map((okr) => (
                        <OKRCard
                          key={okr.id}
                          okr={okr}
                          isSelected={selectedOKR?.id === okr.id}
                          onClick={() => setSelectedOKR(selectedOKR?.id === okr.id ? null : okr)}
                          onEdit={() => handleEdit(okr)}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {selectedOKR && (
        <OKRDetailPanel
          okr={selectedOKR}
          onClose={() => setSelectedOKR(null)}
          onEdit={() => handleEdit(selectedOKR)}
          onRefresh={loadOKRs}
        />
      )}

      {showForm && (
        <OKRForm
          okr={editingOKR || undefined}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
