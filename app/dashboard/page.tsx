"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { OppBacklogWidget } from "@/components/dashboard/OppBacklogWidget";
import { TasksOverviewWidget } from "@/components/dashboard/TasksOverviewWidget";
import { MainTasksWidget } from "@/components/dashboard/MainTasksWidget";
import { OKRSnapshotWidget } from "@/components/dashboard/OKRSnapshotWidget";
import { KPIFundraisingWidget } from "@/components/dashboard/KPIFundraisingWidget";
import { ActiveProjectWidget } from "@/components/dashboard/ActiveProjectWidget";
import { UpcomingTripsWidget } from "@/components/dashboard/UpcomingTripsWidget";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import type { OKR, Task, Opportunity } from "@/types";

export default function DashboardPage() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    async function loadAll() {
      const [okrRes, taskRes, oppRes, settingsRes] = await Promise.all([
        supabase.from("okrs").select("*, kpis(*)").order("created_at"),
        supabase
          .from("tasks")
          .select("*, okr:okrs(id,title,status)")
          .not("status", "in", '("done")')
          .order("priority", { ascending: true })
          .order("due_date", { ascending: true }),
        supabase
          .from("opportunities")
          .select("*, okr:okrs(id,title)")
          .in("status", ["active", "reviewing", "captured"])
          .order("urgency"),
        supabase.from("settings").select("weekly_focus").single(),
      ]);

      setOkrs((okrRes.data as OKR[]) || []);
      setTasks((taskRes.data as Task[]) || []);
      setOpps((oppRes.data as Opportunity[]) || []);

      if (settingsRes.data?.weekly_focus) {
        try {
          const parsed = JSON.parse(settingsRes.data.weekly_focus);
          setPriorities(Array.isArray(parsed) ? parsed : [settingsRes.data.weekly_focus]);
        } catch {
          setPriorities([settingsRes.data.weekly_focus]);
        }
      }

      setLoading(false);
    }

    loadAll();
  }, []);

  const todayTasks = tasks.filter(
    (t) => !t.due_date || t.due_date === todayStr || t.due_date < todayStr
  );
  const blockedTasks = tasks.filter((t) => t.status === "blocked");
  const inProgressTasks = tasks.filter(
    (t) => t.status === "doing" || (t.status as string) === "in_progress"
  );

  const seedOKR = okrs.find(
    (o) =>
      o.title.toLowerCase().includes("ronda") ||
      o.title.toLowerCase().includes("seed") ||
      o.title.toLowerCase().includes("fund")
  );
  const seedKPI = seedOKR?.kpis?.find(
    (k) => k.unit === "USD" || k.title.toLowerCase().includes("capital")
  );

  const topOpp = opps.find((o) => o.urgency === "immediate") || opps[0];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">

        {/* HERO */}
        <HeroCard
          priorities={priorities}
          inProgress={inProgressTasks.length}
          blocked={blockedTasks.length}
          topOpp={topOpp}
          loading={loading}
        />

        {/* MAIN GRID: Left | Center | Right */}
        <div className="grid grid-cols-[200px_1fr_260px] gap-4">

          {/* LEFT COLUMN */}
          <OppBacklogWidget opps={opps} loading={loading} />

          {/* CENTER: Overview chart + task list */}
          <div className="space-y-4">
            <TasksOverviewWidget tasks={tasks} loading={loading} />
            <MainTasksWidget tasks={todayTasks} loading={loading} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <OKRSnapshotWidget okrs={okrs} loading={loading} />
            <KPIFundraisingWidget okr={seedOKR} kpi={seedKPI} loading={loading} />
            <UpcomingTripsWidget />
            <ActiveProjectWidget tasks={tasks} loading={loading} />
          </div>
        </div>

        {/* BOTTOM: Quick Actions */}
        <QuickActionsBar />
      </div>
    </div>
  );
}
