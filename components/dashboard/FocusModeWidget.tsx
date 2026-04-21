"use client";

import { useState, useEffect } from "react";
import { Plus, X, Check, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MODES = [
  { id: "deep_work", label: "Deep Work", color: "text-[#7C3AED] bg-purple-50" },
  { id: "execution", label: "Execution", color: "text-[#2563EB] bg-blue-50" },
  { id: "meetings", label: "Meetings", color: "text-[#D97706] bg-amber-50" },
] as const;

type Mode = typeof MODES[number]["id"];

export function FocusModeWidget() {
  const [mode, setMode] = useState<Mode>("execution");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const saved = localStorage.getItem("focus_mode") as Mode | null;
    if (saved) setMode(saved);

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

  function switchMode(m: Mode) {
    setMode(m);
    localStorage.setItem("focus_mode", m);
  }

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

  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className="glass p-5 flex flex-col gap-4">
      {/* Mode toggle */}
      <div>
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Focus Mode</p>
        <div className="flex flex-col gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all text-left ${
                mode === m.id
                  ? m.color + " font-medium"
                  : "text-[#6B7280] hover:bg-black/4"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  mode === m.id ? "bg-current" : "bg-[#D1D5DB]"
                }`}
              />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/6" />

      {/* Today's priorities */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">Today&apos;s Focus</p>
          {priorities.length < 5 && !adding && (
            <button onClick={() => setAdding(true)} className="text-[#9CA3AF] hover:text-[#2563EB] transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-4 bg-black/5 rounded animate-pulse" />)}
          </div>
        ) : priorities.length === 0 && !adding ? (
          <div>
            <p className="text-sm text-[#D97706]">No focus set</p>
            <button onClick={() => setAdding(true)} className="text-xs text-[#2563EB] hover:underline mt-1">
              Set priorities →
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {priorities.map((p, i) => (
              <div key={i} className="group flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF] w-3 shrink-0">{i + 1}.</span>
                {editing === i ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateItem(i);
                        if (e.key === "Escape") setEditing(null);
                      }}
                      autoFocus
                      className="flex-1 border border-[#2563EB]/50 rounded px-1.5 py-0.5 text-xs text-[#111827] outline-none bg-white/80"
                    />
                    <button onClick={() => updateItem(i)} className="text-[#16A34A]"><Check className="w-3 h-3" /></button>
                    <button onClick={() => setEditing(null)} className="text-[#9CA3AF]"><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <>
                    <span
                      className="flex-1 text-sm text-[#374151] cursor-pointer hover:text-[#6B7280] leading-snug"
                      onClick={() => { setDraft(p); setEditing(i); }}
                    >
                      {p}
                    </span>
                    <button
                      onClick={() => removeItem(i)}
                      className="opacity-0 group-hover:opacity-100 text-[#D1D5DB] hover:text-[#DC2626] transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {adding && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF] w-3">{priorities.length + 1}.</span>
                <input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem();
                    if (e.key === "Escape") { setAdding(false); setNewItem(""); }
                  }}
                  autoFocus
                  placeholder="New priority..."
                  className="flex-1 border border-[#2563EB]/50 rounded px-1.5 py-0.5 text-xs text-[#111827] placeholder-[#D1D5DB] outline-none bg-white/80"
                />
                <button onClick={addItem} className="text-[#16A34A]"><Check className="w-3 h-3" /></button>
                <button onClick={() => { setAdding(false); setNewItem(""); }} className="text-[#9CA3AF]"><X className="w-3 h-3" /></button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
