import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_OKRS, SEED_KPIS, SEED_PEOPLE, SEED_TASKS, SEED_OPPORTUNITIES } from "@/data/seed";

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date().toISOString();

    await supabase.from("settings").upsert({
      id: "default",
      weekly_focus: "Cerrar la ronda seed y lanzar DEZ v1",
      google_connected: false,
      updated_at: now,
    });

    const { data: okrData, error: okrError } = await supabase
      .from("okrs")
      .insert(SEED_OKRS.map((o) => ({ ...o, created_at: now, updated_at: now })))
      .select();

    if (okrError) throw okrError;
    const okrs = okrData || [];

    const kpisToInsert = SEED_KPIS.map((kpi) => {
      const okr = okrs.find((o: { title: string }) => o.title === kpi.okr_title);
      return {
        okr_id: okr?.id,
        title: kpi.title,
        current_value: kpi.current_value,
        target_value: kpi.target_value,
        unit: kpi.unit,
        frequency: kpi.frequency,
        updated_at: now,
      };
    }).filter((k) => k.okr_id);

    if (kpisToInsert.length > 0) {
      await supabase.from("kpis").insert(kpisToInsert);
    }

    await supabase.from("people").insert(
      SEED_PEOPLE.map((p) => ({ ...p, created_at: now }))
    );

    const tasksToInsert = SEED_TASKS.map((t) => {
      const okr = okrs.find((o: { title: string }) =>
        t.project === "Fundraising" ? o.title.toLowerCase().includes("ronda") :
        t.project === "Río Negro" || t.project === "Mendoza" ? o.title.toLowerCase().includes("partnership") :
        t.project === "Startup Pipeline" ? o.title.toLowerCase().includes("startup") :
        t.project === "tKYA" ? o.title.toLowerCase().includes("tkya") :
        false
      );
      return {
        ...t,
        okr_id: okr?.id || null,
        progress: 0,
        created_at: now,
        updated_at: now,
      };
    });

    await supabase.from("tasks").insert(tasksToInsert);

    const oppsToInsert = SEED_OPPORTUNITIES.map((opp) => {
      const okr = okrs.find((o: { title: string }) => o.title === opp.okr_title);
      const { okr_title, ...rest } = opp;
      return {
        ...rest,
        okr_id: okr?.id || null,
        difficulty: "medium" as const,
        created_at: now,
        updated_at: now,
      };
    });

    await supabase.from("opportunities").insert(oppsToInsert);

    return NextResponse.json({ success: true, okrs: okrs.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
