"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check } from "lucide-react";

export function FocusWidget() {
  const [focus, setFocus] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("settings")
      .select("weekly_focus")
      .single()
      .then(({ data }) => {
        if (data?.weekly_focus) setFocus(data.weekly_focus);
        setLoading(false);
      });
  }, []);

  async function saveFocus() {
    await supabase.from("settings").upsert({ id: "default", weekly_focus: draft, updated_at: new Date().toISOString() });
    setFocus(draft);
    setEditing(false);
  }

  if (loading) return null;

  return (
    <div className="rounded border border-[#1e1e1e] bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
          Foco de la semana
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => { setDraft(focus); setEditing(true); }}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveFocus()}
            autoFocus
            className="text-sm h-7"
            placeholder="¿En qué se enfoca esta semana?"
          />
          <Button size="icon-sm" onClick={saveFocus}>
            <Check className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-[#f0f0f0]">
          {focus || (
            <span className="text-[#4a4a4a] italic">Sin foco definido esta semana.</span>
          )}
        </p>
      )}
    </div>
  );
}
