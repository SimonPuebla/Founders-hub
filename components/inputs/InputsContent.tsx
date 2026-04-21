"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InputCard } from "@/components/inputs/InputCard";
import { InputForm } from "@/components/inputs/InputForm";
import { InputDetailPanel } from "@/components/inputs/InputDetailPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import type { Input as InputType } from "@/types";

export function InputsContent() {
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInput, setSelectedInput] = useState<InputType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInput, setEditingInput] = useState<Partial<InputType> | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const supabase = createClient();

  const logCalendarEventId = searchParams.get("log");
  const logTitle = searchParams.get("title");
  const logDate = searchParams.get("date");

  const loadInputs = useCallback(async () => {
    let query = supabase
      .from("inputs")
      .select("*")
      .order("date", { ascending: false });

    if (filterType !== "all") query = query.eq("type", filterType);

    const { data } = await query;
    let results = (data as InputType[]) || [];

    if (search.trim()) {
      results = results.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setInputs(results);
    setLoading(false);
  }, [filterType, search]);

  useEffect(() => { loadInputs(); }, [loadInputs]);

  useEffect(() => {
    if (logCalendarEventId && logTitle) {
      setEditingInput({
        title: decodeURIComponent(logTitle),
        type: "meeting",
        category: "other",
        date: logDate || new Date().toISOString().split("T")[0],
        calendar_event_id: logCalendarEventId,
      });
      setShowForm(true);
    }
  }, [logCalendarEventId]);

  const unprocessed = inputs.filter((i) => !i.extracted_tasks);

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-h-0 ${selectedInput ? "mr-[520px]" : ""}`}>
        <div className="px-8 pt-8 pb-5 border-b border-[#E6E8EB] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#111827]">Inputs</h1>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              {inputs.length} total
              {unprocessed.length > 0 && (
                <span className="text-[#D97706] ml-1">· {unprocessed.length} sin procesar</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-7 h-7 text-xs w-[160px]"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="quick_idea">Quick Idea</SelectItem>
                <SelectItem value="day_update">Day Update</SelectItem>
                <SelectItem value="weekly_recap">Weekly Recap</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Plus className="w-3.5 h-3.5" />
              New Input
              <span className="text-[10px] opacity-50">I</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-[#F3F4F6] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : inputs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#9CA3AF]">No inputs yet.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                Add first input
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {inputs.map((input) => (
                <InputCard
                  key={input.id}
                  input={input}
                  isSelected={selectedInput?.id === input.id}
                  onClick={() => setSelectedInput(selectedInput?.id === input.id ? null : input)}
                  onEdit={() => { setEditingInput(input); setShowForm(true); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedInput && (
        <InputDetailPanel
          input={selectedInput}
          onClose={() => setSelectedInput(null)}
          onEdit={() => { setEditingInput(selectedInput); setShowForm(true); }}
          onRefresh={() => { loadInputs(); }}
        />
      )}

      {showForm && (
        <InputForm
          input={editingInput || undefined}
          onClose={() => { setShowForm(false); setEditingInput(null); loadInputs(); }}
        />
      )}
    </div>
  );
}
