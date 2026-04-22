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
        <div className="px-8 pt-8 pb-6 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h1 className="text-[18px] font-semibold" style={{ color: "var(--text-primary)" }}>Strategy</h1>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>OKRs + KPIs — 2026</p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5"
            style={{ background: "var(--blue)", color: "white" }}
          >
            <Plus className="w-3.5 h-3.5" />
            New OKR
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-lg animate-pulse" style={{ background: "var(--bg)", border: "1px solid var(--border)" }} />
              ))}
            </div>
          ) : (
            <>
              {activeOKRs.length === 0 && otherOKRs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-[#9CA3AF]">No OKRs yet.</p>
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
                        <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">
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
