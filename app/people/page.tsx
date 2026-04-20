"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PersonDetailPanel } from "@/components/people/PersonDetailPanel";
import { PersonForm } from "@/components/people/PersonForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Person, PersonRelationship } from "@/types";

const RELATIONSHIP_COLORS: Record<PersonRelationship, string> = {
  team: "text-[#7c5cfc] bg-[#7c5cfc]/10",
  investor: "text-[#22c55e] bg-[#22c55e]/10",
  government: "text-[#3b82f6] bg-[#3b82f6]/10",
  ecosystem: "text-[#f97316] bg-[#f97316]/10",
  startup: "text-[#f59e0b] bg-[#f59e0b]/10",
  media: "text-[#ef4444] bg-[#ef4444]/10",
  other: "text-[#6b6b6b] bg-[#1e1e1e]",
};

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("people")
      .select("*")
      .order("name");
    if (data) setPeople(data as Person[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = search.trim()
    ? people.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.organization?.toLowerCase().includes(search.toLowerCase())
      )
    : people;

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-h-0 ${selected ? "mr-[420px]" : ""}`}>
        <div className="px-8 pt-8 pb-5 border-b border-[#1e1e1e] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#f0f0f0]">People</h1>
            <p className="font-mono text-xs text-[#4a4a4a] mt-0.5">{people.length} contacts</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4a4a4a]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-7 h-7 text-xs w-[160px]"
              />
            </div>
            <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Person
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="px-8 py-6 space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#111111] rounded animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <p className="font-mono text-sm text-[#4a4a4a]">No contacts yet.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                Add first contact
              </Button>
            </div>
          ) : (
            <div className="px-8">
              <div className="py-3 grid grid-cols-12 gap-4 border-b border-[#1e1e1e]">
                <span className="col-span-3 font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">Name</span>
                <span className="col-span-2 font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">Role</span>
                <span className="col-span-2 font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">Organization</span>
                <span className="col-span-2 font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">Relationship</span>
                <span className="col-span-2 font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">Last Contact</span>
                <span className="col-span-1 font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]"></span>
              </div>
              {filtered.map((person) => (
                <div
                  key={person.id}
                  className={cn(
                    "py-3 grid grid-cols-12 gap-4 border-b border-[#0f0f0f] cursor-pointer hover:bg-[#111111] rounded transition-colors group",
                    selected?.id === person.id && "bg-[#1a1a1a]"
                  )}
                  onClick={() => setSelected(selected?.id === person.id ? null : person)}
                >
                  <span className="col-span-3 text-sm text-[#f0f0f0] truncate">{person.name}</span>
                  <span className="col-span-2 text-xs text-[#6b6b6b] truncate">{person.role || "—"}</span>
                  <span className="col-span-2 text-xs text-[#6b6b6b] truncate">{person.organization || "—"}</span>
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded",
                        RELATIONSHIP_COLORS[person.relationship]
                      )}
                    >
                      {person.relationship}
                    </span>
                  </div>
                  <span className="col-span-2 font-mono text-[10px] text-[#4a4a4a]">
                    {person.last_contact ? formatDate(person.last_contact, "dd MMM yyyy") : "—"}
                  </span>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(person);
                        setShowForm(true);
                      }}
                    >
                      <Plus className="w-3 h-3 rotate-45" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <PersonDetailPanel
          person={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setShowForm(true); }}
        />
      )}

      {showForm && (
        <PersonForm
          person={editing || undefined}
          onClose={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}
