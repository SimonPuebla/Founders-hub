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
import type { Opportunity, OpportunityType, OpportunityUrgency, OpportunityStatus, OKR } from "@/types";
import { OPP_TYPE_LABELS } from "@/types";

interface OppFormProps {
  opp?: Opportunity;
  onClose: () => void;
}

export function OppForm({ opp, onClose }: OppFormProps) {
  const [title, setTitle] = useState(opp?.title || "");
  const [description, setDescription] = useState(opp?.description || "");
  const [type, setType] = useState<OpportunityType>(opp?.type || "investor");
  const [person, setPerson] = useState(opp?.person || "");
  const [entity, setEntity] = useState(opp?.entity || "");
  const [urgency, setUrgency] = useState<OpportunityUrgency>(opp?.urgency || "this_quarter");
  const [status, setStatus] = useState<OpportunityStatus>(opp?.status || "captured");
  const [okrId, setOkrId] = useState(opp?.okr_id || "");
  const [owner, setOwner] = useState(opp?.owner || "Simo");
  const [notes, setNotes] = useState(opp?.notes || "");
  const [potentialValue, setPotentialValue] = useState(opp?.potential_value || "");
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("okrs").select("id,title").order("title").then(({ data }) => {
      if (data) setOkrs(data as OKR[]);
    });
  }, []);

  async function handleSubmit() {
    if (!title.trim()) return;
    setSaving(true);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      type,
      person: person.trim() || null,
      entity: entity.trim() || null,
      urgency,
      status,
      okr_id: okrId || null,
      owner: owner.trim() || null,
      notes: notes.trim() || null,
      potential_value: potentialValue.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (opp?.id) {
      await supabase.from("opportunities").update(payload).eq("id", opp.id);
      toast({ title: "Opportunity updated" });
    } else {
      await supabase.from("opportunities").insert({ ...payload, created_at: new Date().toISOString() });
      toast({ title: "Opportunity captured" });
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{opp ? "Edit Opportunity" : "Capture Opportunity"}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Opportunity title..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as OpportunityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPP_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Urgency</Label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v as OpportunityUrgency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="no_rush">No Rush</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Contact</Label>
              <Input value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Person name" />
            </div>
            <div className="space-y-1.5">
              <Label>Organization</Label>
              <Input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Company/org" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as OpportunityStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="captured">Captured</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="mapped">Mapped</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="parked">Parked</SelectItem>
                  <SelectItem value="delegated">Delegated</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>OKR</Label>
              <Select value={okrId} onValueChange={setOkrId}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to OKR..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No OKR</SelectItem>
                  {okrs.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Owner</Label>
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Potential Value</Label>
              <Input
                value={potentialValue}
                onChange={(e) => setPotentialValue(e.target.value)}
                placeholder="e.g. $500K, strategic..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context and details..."
              className="h-16"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="h-16"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : opp ? "Save Changes" : "Capture"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
