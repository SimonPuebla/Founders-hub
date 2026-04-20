"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Target, AlertTriangle, Plus, X, Check } from "lucide-react";

export function FocusWidget() {
  const [priorities, setPriorities] = useState<string[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("settings")
      .select("weekly_focus")
      .single()
      .then(({ data }) => {
        if (data?.weekly_focus) {
          try {
            const parsed = JSON.parse(data.weekly_focus);
            setPriorities(Array.isArray(parsed) ? parsed : [data.weekly_focus]);
          } catch {
            setPriorities([data.weekly_focus]);
          }
        }
        setLoading(false);
      });
  }, []);

  async function save(items: string[]) {
    await supabase.from("settings").upsert({
      id: "default",
      weekly_focus: JSON.stringify(items),
      updated_at: new Date().toISOString(),
    });
    setPriorities(items);
  }

  async function addItem() {
    if (!newItem.trim()) return;
    await save([...priorities, newItem.trim()]);
    setNewItem("");
    setAdding(false);
  }

  async function removeItem(i: number) {
    await save(priorities.filter((_, idx) => idx !== i));
  }

  async function updateItem(i: number) {
    await save(priorities.map((p, idx) => (idx === i ? draft : p)));
    setEditing(null);
  }

  return (
    <div className="rounded-lg border border-[#222222] bg-[#0f0f0f] p-5 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-[#7c5cfc]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Today&apos;s Focus
          </span>
        </div>
        {priorities.length < 5 && !adding && !loading && (
          <button
            onClick={() => setAdding(true)}
            className="text-[#555555] hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 flex-1">
          {[1, 2].map((i) => (
            <div key={i} className="h-6 bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : priorities.length === 0 && !adding ? (
        <div className="flex-1 flex flex-col items-start justify-center gap-3">
          <div className="flex items-center gap-2 text-[#f59e0b]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">No focus defined</span>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            You are operating without direction.
            <br />
            Define your top 3 priorities now.
          </p>
          <button
            onClick={() => setAdding(true)}
            className="text-xs font-mono text-[#7c5cfc] hover:text-white transition-colors border border-[#7c5cfc]/30 hover:border-[#7c5cfc] px-3 py-1.5 rounded"
          >
            + Add priority →
          </button>
        </div>
      ) : (
        <div className="flex-1 space-y-2.5">
          {priorities.map((p, i) => (
            <div key={i} className="group flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#7c5cfc] w-4 shrink-0 mt-0.5">
                {i + 1}.
              </span>
              {editing === i ? (
                <div className="flex-1 flex items-center gap-1.5">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateItem(i);
                      if (e.key === "Escape") setEditing(null);
                    }}
                    autoFocus
                    className="flex-1 bg-[#1a1a1a] border border-[#7c5cfc]/50 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <button onClick={() => updateItem(i)} className="text-[#22c55e] hover:text-[#16a34a]">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setEditing(null)} className="text-[#555555]">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className="flex-1 text-sm text-white cursor-pointer hover:text-[#a0a0a0] transition-colors leading-snug"
                    onClick={() => {
                      setDraft(p);
                      setEditing(i);
                    }}
                  >
                    {p}
                  </span>
                  <button
                    onClick={() => removeItem(i)}
                    className="opacity-0 group-hover:opacity-100 text-[#555555] hover:text-[#ef4444] transition-all shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          ))}

          {adding && (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[10px] text-[#7c5cfc] w-4 shrink-0">
                {priorities.length + 1}.
              </span>
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addItem();
                  if (e.key === "Escape") {
                    setAdding(false);
                    setNewItem("");
                  }
                }}
                autoFocus
                placeholder="New priority..."
                className="flex-1 bg-[#1a1a1a] border border-[#7c5cfc]/50 rounded px-2 py-1 text-xs text-white placeholder-[#333333] outline-none"
              />
              <button onClick={addItem} className="text-[#22c55e]">
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewItem("");
                }}
                className="text-[#555555]"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
