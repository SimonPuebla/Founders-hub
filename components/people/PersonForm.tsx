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
import type { Person, PersonRelationship } from "@/types";

interface PersonFormProps {
  person?: Person;
  onClose: () => void;
}

export function PersonForm({ person, onClose }: PersonFormProps) {
  const [name, setName] = useState(person?.name || "");
  const [role, setRole] = useState(person?.role || "");
  const [organization, setOrganization] = useState(person?.organization || "");
  const [relationship, setRelationship] = useState<PersonRelationship>(
    person?.relationship || "other"
  );
  const [notes, setNotes] = useState(person?.notes || "");
  const [lastContact, setLastContact] = useState(person?.last_contact || "");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);

    const payload = {
      name: name.trim(),
      role: role.trim() || null,
      organization: organization.trim() || null,
      relationship,
      notes: notes.trim() || null,
      last_contact: lastContact || null,
    };

    if (person?.id) {
      await supabase.from("people").update(payload).eq("id", person.id);
      toast({ title: "Contact updated" });
    } else {
      await supabase.from("people").insert({ ...payload, created_at: new Date().toISOString() });
      toast({ title: "Contact added" });
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{person ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="Full name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="CEO, Investor..." />
            </div>
            <div className="space-y-1.5">
              <Label>Organization</Label>
              <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Company" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Relationship</Label>
              <Select value={relationship} onValueChange={(v) => setRelationship(v as PersonRelationship)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="ecosystem">Ecosystem</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Last Contact</Label>
              <Input type="date" value={lastContact} onChange={(e) => setLastContact(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context, relationship notes..."
              className="h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
            {saving ? "Saving..." : person ? "Save" : "Add Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
