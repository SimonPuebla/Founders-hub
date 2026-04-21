"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { TaskForm } from "@/components/tasks/TaskForm";
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
import type { Task, TaskStatus, TaskPriority } from "@/types";
import { SEED_PROJECTS } from "@/types";

type ViewMode = "all" | "today" | "week";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<ViewMode>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const loadTasks = useCallback(async () => {
    let query = supabase
      .from("tasks")
      .select("*, okr:okrs(id,title,status)")
      .order("created_at", { ascending: false });

    if (view === "today") {
      const today = new Date().toISOString().split("T")[0];
      query = query.lte("due_date", today).not("status", "eq", "done");
    } else if (view === "week") {
      const today = new Date();
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      query = query
        .lte("due_date", weekEnd.toISOString().split("T")[0])
        .not("status", "eq", "done");
    }

    if (filterStatus !== "all") query = query.eq("status", filterStatus);
    if (filterPriority !== "all") query = query.eq("priority", filterPriority);
    if (filterProject !== "all") query = query.eq("project", filterProject);

    const { data } = await query;
    let results = (data as Task[]) || [];

    if (search.trim()) {
      results = results.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTasks(results);
    setLoading(false);
  }, [view, filterStatus, filterPriority, filterProject, search]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function handleEdit(task: Task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingTask(null);
    loadTasks();
  }

  const blockedCount = tasks.filter((t) => t.status === "blocked").length;

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-h-0 ${selectedTask ? "mr-[420px]" : ""}`}>
        <div className="px-8 pt-8 pb-5 border-b border-[#E6E8EB]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-[#111827]">Tasks</h1>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                {tasks.length} tasks
                {blockedCount > 0 && (
                  <span className="text-[#DC2626] ml-1">· {blockedCount} blocked</span>
                )}
              </p>
            </div>
            <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Plus className="w-3.5 h-3.5" />
              New Task
              <span className="text-[10px] opacity-50 ml-1">N</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center border border-[#E6E8EB] rounded-lg overflow-hidden">
              {(["all", "today", "week"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    view === v
                      ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  {v === "all" ? "All" : v === "today" ? "Hoy" : "Esta Semana"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-1">
              <div className="relative flex-1 max-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-7 h-7 text-xs"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px] h-7 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="doing">Doing</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="delegated">Delegated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[120px] h-7 text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-[140px] h-7 text-xs">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {SEED_PROJECTS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TaskList
            tasks={tasks}
            loading={loading}
            selectedId={selectedTask?.id}
            onSelect={(task) => setSelectedTask(selectedTask?.id === task.id ? null : task)}
            onEdit={handleEdit}
            onStatusChange={loadTasks}
          />
        </div>
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => handleEdit(selectedTask)}
          onRefresh={() => { loadTasks(); }}
        />
      )}

      {showForm && (
        <TaskForm
          task={editingTask || undefined}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
