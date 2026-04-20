"use client";

import { useState } from "react";
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
import type { OKR, OKRStatus } from "@/types";

interface OKRFormProps {
  okr?: OKR;
  onClose: () => void;
}

export function OKRForm({ okr, onClose }: OKRFormProps) {
  const [title, setTitle] = useState(okr?.title || "");
  const [description, setDescription] = useState(okr?.description || "");
  const [quarter, setQuarter] = useState(okr?.quarter || "Q2 2025");
  const [status, setStatus] = useState<OKRStatus>(okr?.status || "on_track");
  const [progress, setProgress] = useState(String(okr?.progress ?? 0));
  const [owner, setOwner] = useState(okr?.owner || "Simo");
  const [deadline, setDeadline] = useState(okr?.deadline || "2025-06-30");
  const [notes, setNotes] = useState(okr?.notes || "");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  async function handleSubmit() {
    if (!title.trim()) return;
    setSaving(true);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      quarter,
      status,
      progress: parseInt(progress) || 0,
      owner: owner.trim() || null,
      deadline: deadline || null,
      notes: notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (okr?.id) {
      await supabase.from("okrs").update(payload).eq("id", okr.id);
      toast({ title: "OKR updated" });
    } else {
      await supabase.from("okrs").insert({ ...payload, created_at: new Date().toISOString() });
      toast({ title: "OKR created" });
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{okr ? "Edit OKR" : "New OKR"}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cerrar ronda seed"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does success look like?"
              className="h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Quarter</Label>
              <Input
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                placeholder="Q2 2025"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as OKRStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="off_track">Off Track</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Simo"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context..."
              className="h-16"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : okr ? "Save Changes" : "Create OKR"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
