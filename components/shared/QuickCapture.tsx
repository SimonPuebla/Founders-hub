"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  OPP_TYPE_LABELS,
  SEED_PROJECTS,
  type OpportunityType,
  type OpportunityUrgency,
  type TaskPriority,
  type InputType,
} from "@/types";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── helpers ────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function quickNoteTitle() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `Nota rápida - ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#4a4a4a] mb-1">
      {children}
    </label>
  );
}

// ─── Task Tab ────────────────────────────────────────────────────────────────

function TaskTab({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState<TaskPriority>("medium");
  const [project, setProject] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: sbError } = await supabase.from("tasks").insert({
        title: title.trim(),
        priority,
        project: project || null,
        status: "todo",
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (sbError) throw sbError;
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <div>
        <FieldLabel>Title *</FieldLabel>
        <Input
          autoFocus
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Priority</FieldLabel>
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

        <div>
          <FieldLabel>Project</FieldLabel>
          <Select value={project} onValueChange={setProject}>
            <SelectTrigger>
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {SEED_PROJECTS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className={cn(
          "mt-1 flex items-center justify-center gap-2 rounded px-4 py-2",
          "bg-[#7c5cfc] font-mono text-xs text-white tracking-wide",
          "hover:bg-[#6b4ef0] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Task
      </button>
    </form>
  );
}

// ─── Opportunity Tab ─────────────────────────────────────────────────────────

function OpportunityTab({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<OpportunityType>("other");
  const [urgency, setUrgency] = React.useState<OpportunityUrgency>("this_month");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const urgencyLabels: Record<OpportunityUrgency, string> = {
    immediate: "Inmediata",
    this_month: "Este mes",
    this_quarter: "Este trimestre",
    no_rush: "Sin urgencia",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: sbError } = await supabase.from("opportunities").insert({
        title: title.trim(),
        type,
        urgency,
        status: "captured",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (sbError) throw sbError;
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving opportunity");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <div>
        <FieldLabel>Title *</FieldLabel>
        <Input
          autoFocus
          placeholder="Opportunity title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Type</FieldLabel>
          <Select value={type} onValueChange={(v) => setType(v as OpportunityType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(OPP_TYPE_LABELS) as OpportunityType[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {OPP_TYPE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <FieldLabel>Urgency</FieldLabel>
          <Select value={urgency} onValueChange={(v) => setUrgency(v as OpportunityUrgency)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(urgencyLabels) as OpportunityUrgency[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {urgencyLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className={cn(
          "mt-1 flex items-center justify-center gap-2 rounded px-4 py-2",
          "bg-[#7c5cfc] font-mono text-xs text-white tracking-wide",
          "hover:bg-[#6b4ef0] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Opportunity
      </button>
    </form>
  );
}

// ─── Input Tab ───────────────────────────────────────────────────────────────

function InputTab({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<InputType>("note");
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const inputTypeLabels: Record<InputType, string> = {
    meeting: "Meeting",
    note: "Note",
    transcript: "Transcript",
    voice_note: "Voice Note",
    quick_idea: "Quick Idea",
    day_update: "Day Update",
    weekly_recap: "Weekly Recap",
  };

  // Only expose the 4 types requested in the spec
  const allowedTypes: InputType[] = ["meeting", "note", "quick_idea", "day_update"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: sbError } = await supabase.from("inputs").insert({
        title: title.trim() || `${inputTypeLabels[type]} - ${todayISO()}`,
        type,
        category: "other",
        content: content.trim() || null,
        date: todayISO(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (sbError) throw sbError;
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving input");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <Input
          autoFocus
          placeholder="Input title (optional)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <FieldLabel>Type</FieldLabel>
        <Select value={type} onValueChange={(v) => setType(v as InputType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allowedTypes.map((key) => (
              <SelectItem key={key} value={key}>
                {inputTypeLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel>Content</FieldLabel>
        <Textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "mt-1 flex items-center justify-center gap-2 rounded px-4 py-2",
          "bg-[#7c5cfc] font-mono text-xs text-white tracking-wide",
          "hover:bg-[#6b4ef0] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Input
      </button>
    </form>
  );
}

// ─── Note Tab ────────────────────────────────────────────────────────────────

function NoteTab({ onSuccess }: { onSuccess: () => void }) {
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: sbError } = await supabase.from("inputs").insert({
        title: quickNoteTitle(),
        type: "quick_idea" as InputType,
        category: "other",
        content: content.trim(),
        date: todayISO(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (sbError) throw sbError;
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving note");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <div>
        <p className="font-mono text-[10px] text-[#4a4a4a] mb-2">
          Title: <span className="text-[#6b6b6b]">{quickNoteTitle()}</span>
        </p>
        <FieldLabel>Note *</FieldLabel>
        <Textarea
          autoFocus
          placeholder="Quick thought..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className={cn(
          "mt-1 flex items-center justify-center gap-2 rounded px-4 py-2",
          "bg-[#7c5cfc] font-mono text-xs text-white tracking-wide",
          "hover:bg-[#6b4ef0] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Note
      </button>
    </form>
  );
}

// ─── Success overlay ─────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <CheckCircle className="h-8 w-8 text-[#7c5cfc]" />
      <p className="font-mono text-xs text-[#c0c0c0]">Saved successfully</p>
    </div>
  );
}

// ─── Main QuickCapture component ─────────────────────────────────────────────

export function QuickCapture() {
  const {
    quickCaptureOpen,
    setQuickCaptureOpen,
    quickCaptureTab,
    setQuickCaptureTab,
  } = useAppStore();

  const [success, setSuccess] = React.useState(false);

  // Reset success state when modal opens/closes
  React.useEffect(() => {
    if (!quickCaptureOpen) {
      // Small delay so the animation can play
      const t = setTimeout(() => setSuccess(false), 200);
      return () => clearTimeout(t);
    }
  }, [quickCaptureOpen]);

  // Close on Escape (Dialog handles this natively, but kept explicit)
  React.useEffect(() => {
    if (!quickCaptureOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuickCaptureOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickCaptureOpen, setQuickCaptureOpen]);

  function handleSuccess() {
    setSuccess(true);
    setTimeout(() => {
      setQuickCaptureOpen(false);
      // Reload to reflect new data in the current page
      window.location.reload();
    }, 900);
  }

  return (
    <Dialog.Root open={quickCaptureOpen} onOpenChange={setQuickCaptureOpen}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />

        {/* Floating modal — not full screen */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-[480px]",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-[#2a2a2a] bg-[#111111]",
            "shadow-2xl shadow-black/60",
            "outline-none",
            "animate-in fade-in-0 zoom-in-95"
          )}
          aria-label="Quick capture"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#4a4a4a]">
              Quick Capture
            </span>
            <button
              type="button"
              onClick={() => setQuickCaptureOpen(false)}
              className="rounded p-1 text-[#4a4a4a] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {success ? (
            <SuccessState />
          ) : (
            <Tabs
              value={quickCaptureTab}
              onValueChange={(v) =>
                setQuickCaptureTab(v as typeof quickCaptureTab)
              }
            >
              <TabsList className="px-4 pt-3">
                <TabsTrigger value="task">Task</TabsTrigger>
                <TabsTrigger value="opportunity">Opportunity</TabsTrigger>
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="note">Note</TabsTrigger>
              </TabsList>

              <TabsContent value="task">
                <TaskTab onSuccess={handleSuccess} />
              </TabsContent>
              <TabsContent value="opportunity">
                <OpportunityTab onSuccess={handleSuccess} />
              </TabsContent>
              <TabsContent value="input">
                <InputTab onSuccess={handleSuccess} />
              </TabsContent>
              <TabsContent value="note">
                <NoteTab onSuccess={handleSuccess} />
              </TabsContent>
            </Tabs>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
