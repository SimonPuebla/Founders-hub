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
import type { Task, TaskStatus, TaskPriority, OKR } from "@/types";
import { SEED_PROJECTS } from "@/types";

interface TaskFormProps {
  task?: Task;
  defaultOKRId?: string;
  onClose: () => void;
}

export function TaskForm({ task, defaultOKRId, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [project, setProject] = useState(task?.project || "");
  const [okrId, setOkrId] = useState(task?.okr_id || defaultOKRId || "");
  const [owner, setOwner] = useState(task?.owner || "Simo");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [contextNote, setContextNote] = useState(task?.context_note || "");
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
      status,
      priority,
      progress: task?.progress || 0,
      project: project || null,
      okr_id: okrId || null,
      owner: owner.trim() || null,
      due_date: dueDate || null,
      context_note: contextNote.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (task?.id) {
      await supabase.from("tasks").update(payload).eq("id", task.id);
      toast({ title: "Task updated" });
    } else {
      await supabase.from("tasks").insert({ ...payload, created_at: new Date().toISOString() });
      toast({ title: "Task created" });
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="doing">Doing</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="delegated">Delegated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No project</SelectItem>
                  {SEED_PROJECTS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
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
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Simo"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
              className="h-16"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Context Note</Label>
            <Textarea
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="Why this task matters, what's blocking it..."
              className="h-16"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !title.trim()}>
            {saving ? "Saving..." : task ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
