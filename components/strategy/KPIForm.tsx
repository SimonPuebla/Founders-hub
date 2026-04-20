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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { KPI } from "@/types";

interface KPIFormProps {
  okrId: string;
  kpi?: KPI;
  onClose: () => void;
}

export function KPIForm({ okrId, kpi, onClose }: KPIFormProps) {
  const [title, setTitle] = useState(kpi?.title || "");
  const [currentValue, setCurrentValue] = useState(String(kpi?.current_value ?? 0));
  const [targetValue, setTargetValue] = useState(String(kpi?.target_value ?? 0));
  const [unit, setUnit] = useState(kpi?.unit || "");
  const [frequency, setFrequency] = useState(kpi?.frequency || "monthly");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  async function handleSubmit() {
    if (!title.trim()) return;
    setSaving(true);

    const payload = {
      okr_id: okrId,
      title: title.trim(),
      current_value: parseFloat(currentValue) || 0,
      target_value: parseFloat(targetValue) || 0,
      unit: unit.trim() || null,
      frequency,
      updated_at: new Date().toISOString(),
    };

    if (kpi?.id) {
      await supabase.from("kpis").update(payload).eq("id", kpi.id);
      toast({ title: "KPI updated" });
    } else {
      await supabase.from("kpis").insert(payload);
      toast({ title: "KPI created" });
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{kpi ? "Edit KPI" : "New KPI"}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Capital comprometido"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Current Value</Label>
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Target Value</Label>
              <Input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="USD, %, startups..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : kpi ? "Save" : "Add KPI"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
