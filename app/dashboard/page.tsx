"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FocusWidget } from "@/components/dashboard/FocusWidget";
import { OKRWidget } from "@/components/dashboard/OKRWidget";
import { TasksTodayWidget } from "@/components/dashboard/TasksTodayWidget";
import { FundraisingWidget } from "@/components/dashboard/FundraisingWidget";
import { OppsWidget } from "@/components/dashboard/OppsWidget";
import { InputsWidget } from "@/components/dashboard/InputsWidget";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { OKR, Task, Opportunity, Input, CalendarEvent } from "@/types";

export default function DashboardPage() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    async function loadAll() {
      const [okrRes, taskRes, oppRes, inputRes] = await Promise.all([
        supabase.from("okrs").select("*, kpis(*)").order("created_at"),
        supabase
          .from("tasks")
          .select("*, okr:okrs(id,title,status)")
          .not("status", "in", '("done","delegated")')
          .order("due_date", { ascending: true }),
        supabase
          .from("opportunities")
          .select("*, okr:okrs(id,title)")
          .in("status", ["active", "reviewing"])
          .order("urgency"),
        supabase
          .from("inputs")
          .select("*")
          .is("extracted_tasks", null)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      setOkrs((okrRes.data as OKR[]) || []);
      setTasks((taskRes.data as Task[]) || []);
      setOpps((oppRes.data as Opportunity[]) || []);
      setInputs((inputRes.data as Input[]) || []);

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
  const seedOKR = okrs.find((o) =>
    o.title.toLowerCase().includes("ronda") || o.title.toLowerCase().includes("seed")
  );
  const seedKPI = seedOKR?.kpis?.find((k) =>
    k.unit === "USD" || k.title.toLowerCase().includes("capital")
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-8 pt-8 pb-6 border-b border-[#1e1e1e]">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold text-[#f0f0f0]">
            {format(today, "EEEE d", { locale: es })}
          </h1>
          <span className="font-mono text-xs text-[#4a4a4a]">
            {format(today, "MMMM yyyy", { locale: es })}
          </span>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-5 gap-5">
        <div className="col-span-3 space-y-4">
          <FocusWidget />
          <CalendarWidget
            events={calendarEvents}
            loading={loading}
          />
          <TasksTodayWidget
            todayTasks={todayTasks}
            blockedTasks={blockedTasks}
            loading={loading}
          />
        </div>

        <div className="col-span-2 space-y-4">
          <FundraisingWidget
            okr={seedOKR}
            kpi={seedKPI}
            loading={loading}
          />
          <OKRWidget okrs={okrs} loading={loading} />
          <OppsWidget opps={opps.slice(0, 3)} loading={loading} />
          <InputsWidget inputs={inputs} loading={loading} />
        </div>
      </div>
    </div>
  );
}
