"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Input as InputType, InputType as InputTypeEnum, InputCategory } from "@/types";

interface InputFormProps {
  input?: Partial<InputType>;
  onClose: () => void;
}

export function InputForm({ input, onClose }: InputFormProps) {
  const [title, setTitle] = useState(input?.title || "");
  const [type, setType] = useState<InputTypeEnum>(input?.type || "note");
  const [category, setCategory] = useState<InputCategory>(input?.category || "other");
  const [date, setDate] = useState(input?.date || new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState(input?.content || "");
  const [people, setPeople] = useState((input?.people || []).join(", "));
  const [calendarEventId, setCalendarEventId] = useState(input?.calendar_event_id || "");
  const [decisions, setDecisions] = useState((input?.extracted_decisions || []).join("\n"));
  const [followups, setFollowups] = useState((input?.extracted_followups || []).join("\n"));
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const isEditing = !!input?.id;

  async function handleSubmit() {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);

    const autoTitle = title.trim() || `${type} — ${date}`;
    const peopleArr = people.split(",").map((p) => p.trim()).filter(Boolean);
    const decisionsArr = decisions.split("\n").map((d) => d.trim()).filter(Boolean);
    const followupsArr = followups.split("\n").map((f) => f.trim()).filter(Boolean);

    const payload = {
      title: autoTitle,
      type,
      category,
      date,
      content: content.trim() || null,
      people: peopleArr.length > 0 ? peopleArr : null,
      calendar_event_id: calendarEventId.trim() || null,
      extracted_decisions: decisionsArr.length > 0 ? decisionsArr : null,
      extracted_followups: followupsArr.length > 0 ? followupsArr : null,
      updated_at: new Date().toISOString(),
    };

    if (isEditing) {
      await supabase.from("inputs").update(payload).eq("id", input.id!);
      toast({ title: "Input updated" });
    } else {
      await supabase.from("inputs").insert({ ...payload, created_at: new Date().toISOString() });
      toast({ title: "Input saved" });
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Input" : "New Input"}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Auto-generated from content if left blank"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as InputTypeEnum)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="transcript">Transcript</SelectItem>
                  <SelectItem value="voice_note">Voice Note</SelectItem>
                  <SelectItem value="quick_idea">Quick Idea</SelectItem>
                  <SelectItem value="day_update">Day Update</SelectItem>
                  <SelectItem value="weekly_recap">Weekly Recap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as InputCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundraising">Fundraising</SelectItem>
                  <SelectItem value="government">Gobierno</SelectItem>
                  <SelectItem value="product">Producto</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="strategy">Estrategia</SelectItem>
                  <SelectItem value="ecosystem">Ecosistema</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>People (comma-separated)</Label>
            <Input
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="Juan Benet, Teófilo Beato..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste transcript, write notes, log what happened..."
              className="h-40 font-mono text-xs"
            />
          </div>

          {calendarEventId && (
            <div className="space-y-1.5">
              <Label>Calendar Event ID</Label>
              <Input
                value={calendarEventId}
                onChange={(e) => setCalendarEventId(e.target.value)}
                className="font-mono text-xs"
                readOnly
              />
            </div>
          )}

          <div className="border-t border-[#1e1e1e] pt-4 space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a]">
              Extraction (optional)
            </p>

            <div className="space-y-1.5">
              <Label>Key Decisions (one per line)</Label>
              <Textarea
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                placeholder="Decision 1&#10;Decision 2..."
                className="h-20 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Follow-ups (one per line)</Label>
              <Textarea
                value={followups}
                onChange={(e) => setFollowups(e.target.value)}
                placeholder="Follow-up 1&#10;Follow-up 2..."
                className="h-20 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || (!title.trim() && !content.trim())}>
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Input"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
