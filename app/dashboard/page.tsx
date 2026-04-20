"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FocusWidget } from "@/components/dashboard/FocusWidget";
import { ExecutionPulseWidget } from "@/components/dashboard/ExecutionPulseWidget";
import { VoiceCTAWidget } from "@/components/dashboard/VoiceCTAWidget";
import { OKRWidget } from "@/components/dashboard/OKRWidget";
import { TasksTodayWidget } from "@/components/dashboard/TasksTodayWidget";
import { BlockedRisksWidget } from "@/components/dashboard/BlockedRisksWidget";
import { FundraisingWidget } from "@/components/dashboard/FundraisingWidget";
import { OppsWidget } from "@/components/dashboard/OppsWidget";
import { InputsWidget } from "@/components/dashboard/InputsWidget";
import { ActivityFeedWidget } from "@/components/dashboard/ActivityFeedWidget";
import { ParkedOppsWidget } from "@/components/dashboard/ParkedOppsWidget";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { OKR, Task, Opportunity, Input, CalendarEvent } from "@/types";

export default function DashboardPage() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [parkedOpps, setParkedOpps] = useState<Opportunity[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [recentInputs, setRecentInputs] = useState<Input[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekAgoStr = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    async function loadAll() {
      const [okrRes, taskRes, weekTaskRes, oppRes, parkedRes, inputRes, recentInputRes] =
        await Promise.all([
          supabase.from("okrs").select("*, kpis(*)").order("created_at"),
          supabase
            .from("tasks")
            .select("*, okr:okrs(id,title,status)")
            .not("status", "in", '("done","delegated")')
            .order("due_date", { ascending: true }),
          supabase
            .from("tasks")
            .select("id, status, due_date, updated_at")
            .gte("updated_at", weekAgoStr),
          supabase
            .from("opportunities")
            .select("*, okr:okrs(id,title)")
            .in("status", ["active", "reviewing"])
            .order("urgency"),
          supabase
            .from("opportunities")
            .select("*, okr:okrs(id,title)")
            .in("status", ["parked", "on_hold"]),
          supabase
            .from("inputs")
            .select("*")
            .is("extracted_tasks", null)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("inputs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);

      setOkrs((okrRes.data as OKR[]) || []);
      setTasks((taskRes.data as Task[]) || []);
      setWeekTasks((weekTaskRes.data as Task[]) || []);
      setOpps((oppRes.data as Opportunity[]) || []);
      setParkedOpps((parkedRes.data as Opportunity[]) || []);
      setInputs((inputRes.data as Input[]) || []);
      setRecentInputs((recentInputRes.data as Input[]) || []);

      const eventsRes = await fetch("/api/calendar/events");
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setCalendarEvents(data.events || []);
      }

      setLoading(false);
    }

    loadAll();
  }, []);

  const todayTasks = tasks.filter(
    (t) => t.due_date === todayStr || (t.due_date && t.due_date < todayStr)
  );
  const blockedTasks = tasks.filter((t) => t.status === "blocked");
  const inProgressTasks = tasks.filter(
    (t) => t.status === "doing" || (t.status as string) === "in_progress"
  );
  const delegatedTasks = tasks.filter(
    (t) => t.status === "delegated" || t.status === "waiting"
  );
  const doneTasks = weekTasks.filter((t) => t.status === "done");
  const completedPct =
    weekTasks.length > 0
      ? Math.round((doneTasks.length / weekTasks.length) * 100)
      : 0;

  const seedOKR = okrs.find(
    (o) =>
      o.title.toLowerCase().includes("ronda") ||
      o.title.toLowerCase().includes("seed")
  );
  const seedKPI = seedOKR?.kpis?.find(
    (k) => k.unit === "USD" || k.title.toLowerCase().includes("capital")
  );

  return (
    <div className="h-full overflow-y-auto bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6E8EB] px-8 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#111827] capitalize">
              {format(today, "EEEE d", { locale: es })}
            </h1>
            <p className="text-sm text-[#6B7280] capitalize">
              {format(today, "MMMM yyyy", { locale: es })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {blockedTasks.length > 0 && (
              <span className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 rounded-md">
                {blockedTasks.length} blocked
              </span>
            )}
            {inputs.length > 0 && (
              <span className="text-xs font-medium text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-md">
                {inputs.length} to process
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 py-6 space-y-5">
        {/* TOP ROW: Focus | Pulse | Voice */}
        <div className="grid grid-cols-3 gap-4">
          <FocusWidget />
          <ExecutionPulseWidget
            inProgress={inProgressTasks.length}
            blocked={blockedTasks.length}
            completedPct={completedPct}
            delegated={delegatedTasks.length}
            loading={loading}
          />
          <VoiceCTAWidget />
        </div>

        {/* MAIN + SIDEBAR */}
        <div className="grid grid-cols-3 gap-4">
          {/* Main (2 cols) */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TasksTodayWidget todayTasks={todayTasks} loading={loading} />
              <BlockedRisksWidget
                blockedTasks={blockedTasks}
                opps={opps}
                loading={loading}
                todayStr={todayStr}
              />
            </div>

            <OppsWidget opps={opps} okrs={okrs} loading={loading} />

            <CalendarWidget events={calendarEvents} loading={loading} />

            <div className="grid grid-cols-2 gap-4">
              <ActivityFeedWidget inputs={recentInputs} loading={loading} />
              <ParkedOppsWidget opps={parkedOpps} loading={loading} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <FundraisingWidget okr={seedOKR} kpi={seedKPI} loading={loading} />
            <OKRWidget okrs={okrs} tasks={tasks} loading={loading} />
            <InputsWidget inputs={inputs} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
