"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, Check } from "lucide-react";
import Link from "next/link";

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
    <div className="bg-white border border-[#E6E8EB] rounded-lg p-5 flex flex-col min-h-[196px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#111827]">Today&apos;s Focus</span>
        {priorities.length < 5 && !adding && !loading && (
          <button
            onClick={() => setAdding(true)}
            className="text-[#9CA3AF] hover:text-[#2563EB] transition-colors"
            title="Add priority"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2.5 flex-1">
          {[1, 2].map((i) => (
            <div key={i} className="h-5 bg-[#F3F4F6] rounded animate-pulse" />
          ))}
        </div>
      ) : priorities.length === 0 && !adding ? (
        <div className="flex-1 flex flex-col justify-center gap-2">
          <p className="text-sm font-medium text-[#D97706]">No focus defined</p>
          <p className="text-sm text-[#6B7280]">
            You are operating without direction — set your top priorities.
          </p>
          <button
            onClick={() => setAdding(true)}
            className="mt-1 text-sm text-[#2563EB] hover:underline text-left font-medium"
          >
            Set priorities →
          </button>
        </div>
      ) : (
        <div className="flex-1 space-y-2">
          {priorities.map((p, i) => (
            <div key={i} className="group flex items-center gap-2">
              <span className="text-xs font-medium text-[#9CA3AF] w-4 shrink-0">{i + 1}.</span>
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
                    className="flex-1 border border-[#2563EB] rounded-md px-2 py-1 text-sm text-[#111827] outline-none bg-white"
                  />
                  <button onClick={() => updateItem(i)} className="text-[#16A34A]">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditing(null)} className="text-[#9CA3AF]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className="flex-1 text-sm text-[#111827] cursor-pointer hover:text-[#6B7280] transition-colors leading-snug"
                    onClick={() => {
                      setDraft(p);
                      setEditing(i);
                    }}
                  >
                    {p}
                  </span>
                  <button
                    onClick={() => removeItem(i)}
                    className="opacity-0 group-hover:opacity-100 text-[#D1D5DB] hover:text-[#DC2626] transition-all shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}

          {adding && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium text-[#9CA3AF] w-4 shrink-0">
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
                className="flex-1 border border-[#2563EB] rounded-md px-2 py-1 text-sm text-[#111827] placeholder-[#D1D5DB] outline-none bg-white"
              />
              <button onClick={addItem} className="text-[#16A34A]">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewItem("");
                }}
                className="text-[#9CA3AF]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
