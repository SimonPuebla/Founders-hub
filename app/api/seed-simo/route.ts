import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OKRS = [
  {
    title: "OBJ 2 — Lanzar Andén OS a product-market fit validado",
    description: "Construir y validar el OS con clientes reales en zonas Andén",
    quarter: "2026",
    status: "on_track" as const,
    progress: 15,
    owner: "Simo",
    krs: [
      { title: "OS v1 con tax & compliance automation — prototipo Q1, v1 live Q3", current_value: 10, target_value: 100, unit: "%" },
      { title: "100+ empresas suscritas a la plataforma", current_value: 0, target_value: 100, unit: "empresas" },
    ],
  },
  {
    title: "OBJ 3 — Construir relaciones institucionales y presencia en Latam",
    description: "Posicionar Andén con jurisdicciones clave en la región",
    quarter: "2026",
    status: "on_track" as const,
    progress: 30,
    owner: "Simo",
    krs: [
      { title: "Cerrar 10 reuniones clave con 10 jurisdicciones (CRM tracked)", current_value: 3, target_value: 10, unit: "reuniones" },
      { title: "Pipeline internacional activo (Uruguay, Paraguay, DR, Panamá)", current_value: 2, target_value: 4, unit: "países" },
    ],
  },
  {
    title: "OBJ 4 — Cerrar ronda pre-seed extension",
    description: "Levantar capital para ejecutar el roadmap 2026",
    quarter: "2026",
    status: "at_risk" as const,
    progress: 20,
    owner: "Simo",
    krs: [
      { title: "$1.5M a $20M post-money cap", current_value: 0, target_value: 1500000, unit: "USD" },
    ],
  },
];

const TASKS = [
  // Hedera / HederaCon
  { title: "Preparar deck específico para Hedera (estado actual + visión + necesidades concretas)", project: "Hedera / HederaCon", priority: "high" as const, status: "todo" as const },
  { title: "Definir rol concreto de Hedera: 3 áreas de aporte (tokenización, enterprise access, gov/institucional)", project: "Hedera / HederaCon", priority: "high" as const, status: "todo" as const },
  { title: 'Preparar narrativa "Hedera como infra layer dentro de zonas Andén"', project: "Hedera / HederaCon", priority: "medium" as const, status: "todo" as const },
  { title: "Planificar objetivo claro para HederaCon (partner / investor / pilot)", project: "Hedera / HederaCon", priority: "high" as const, status: "todo" as const },

  // Ronda — términos
  { title: "Confirmar número oficial de ronda: resolver $1M@$30M vs $1.5M@$20M vs $1M@$25M — un solo número antes de seguir enviando materiales", project: "Fundraising", priority: "critical" as const, status: "todo" as const },
  { title: "Seguimiento ronda: Midnight", project: "Fundraising", priority: "high" as const, status: "todo" as const },
  { title: "Seguimiento ronda: Fractus VC", project: "Fundraising", priority: "high" as const, status: "todo" as const },
  { title: "Seguimiento ronda: Banco Galicia (también inversor estratégico)", project: "Fundraising", priority: "high" as const, status: "todo" as const },
  { title: "Seguimiento ronda: Albit", project: "Fundraising", priority: "medium" as const, status: "todo" as const },
  { title: "Seguimiento ronda: Elenet", project: "Fundraising", priority: "medium" as const, status: "todo" as const },

  // Producto
  { title: "Deck de extensión para Claude Design — brief preparado, pendiente ejecutar con términos confirmados", project: "Producto / Plataforma", priority: "high" as const, status: "waiting" as const },
  { title: "ROI calculator: deployment-ready, pendiente subir a Vercel", project: "Producto / Plataforma", priority: "high" as const, status: "todo" as const },
  { title: "Pricing actualizado: formalizar en deck/web", project: "Producto / Plataforma", priority: "medium" as const, status: "todo" as const },

  // Outreach comercial
  { title: "Agente de outreach: Apollo 403 (free plan) — definir alternativa para scraping de empresas", project: "Outreach comercial", priority: "high" as const, status: "blocked" as const },
  { title: "VP frameworks por tipo de empresa (10 perfiles) — activar envíos", project: "Outreach comercial", priority: "medium" as const, status: "waiting" as const },

  // Partnerships / Expansión
  { title: "Email a Pablo de ProCórdoba sobre Eth Americas — redactado, pendiente enviar", project: "Partnerships / Expansión", priority: "high" as const, status: "todo" as const },
  { title: "Análisis PLVS jurisdiction table — incorporar áreas de mejora en materiales", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },
  { title: "Pipeline soft landing (Latam HQ): construir lista ahora, cierre Q3-Q4", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },

  // Perfil personal
  { title: "Volcano Summit bio: lista, confirmar si enviaste", project: "Perfil personal", priority: "low" as const, status: "todo" as const },
  { title: "LinkedIn: revisar y actualizar para el Summit", project: "Perfil personal", priority: "low" as const, status: "todo" as const },

  // Institucional
  { title: "Zone 1: anuncio pendiente — timing sensible, coordinar comunicación", project: "Institucional", priority: "high" as const, status: "waiting" as const },
  { title: "CABA Distrito IA: posicionamiento como co-diseñador activo", project: "Institucional", priority: "medium" as const, status: "todo" as const },

  // Hiring
  { title: '"Product Everything" generalist — búsqueda abierta', project: "Hiring", priority: "medium" as const, status: "todo" as const },
];

const OPPORTUNITIES = [
  {
    title: "Hedera / HederaCon",
    type: "institutional_partner" as const,
    status: "active" as const,
    urgency: "immediate" as const,
    difficulty: "medium" as const,
    person: "Hedera team",
    recommended_action: "Preparar deck + definir objetivo concreto para el evento",
  },
  {
    title: "Banco Galicia — inversor estratégico",
    type: "investor" as const,
    status: "reviewing" as const,
    urgency: "this_month" as const,
    difficulty: "hard" as const,
    person: "Banco Galicia",
    recommended_action: "Follow-up + alinear términos de ronda primero",
  },
  {
    title: "Pipeline Latam HQ — soft landing",
    type: "deal" as const,
    status: "captured" as const,
    urgency: "this_quarter" as const,
    difficulty: "medium" as const,
    recommended_action: "Construir lista Q2, activar cuando rails estén vivos",
  },
  {
    title: "ProCórdoba / Eth Americas — Pablo",
    type: "ecosystem_ally" as const,
    status: "active" as const,
    urgency: "this_month" as const,
    difficulty: "easy" as const,
    person: "Pablo (ProCórdoba)",
    recommended_action: "Enviar email redactado",
  },
  {
    title: "CABA Distrito IA",
    type: "gov_contact" as const,
    status: "reviewing" as const,
    urgency: "this_quarter" as const,
    difficulty: "medium" as const,
    recommended_action: "Posicionarse como co-diseñador activo",
  },
];

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date().toISOString();

    // Insert OKRs
    const okrRows = OKRS.map(({ krs, ...okr }) => ({
      ...okr,
      created_at: now,
      updated_at: now,
    }));

    const { data: insertedOkrs, error: okrErr } = await supabase
      .from("okrs")
      .insert(okrRows)
      .select();

    if (okrErr) throw okrErr;

    // Insert KRs (as KPIs linked to OKRs)
    const kpiRows = OKRS.flatMap(({ title: okrTitle, krs }) => {
      const okr = insertedOkrs?.find((o: { title: string }) => o.title === okrTitle);
      return krs.map((kr) => ({
        okr_id: okr?.id,
        title: kr.title,
        current_value: kr.current_value,
        target_value: kr.target_value,
        unit: kr.unit,
        updated_at: now,
      }));
    }).filter((k) => k.okr_id);

    if (kpiRows.length > 0) {
      const { error: kpiErr } = await supabase.from("kpis").insert(kpiRows);
      if (kpiErr) throw kpiErr;
    }

    // Map tasks to OKRs
    const taskRows = TASKS.map((t) => {
      const okr = insertedOkrs?.find((o: { title: string }) => {
        if (t.project === "Fundraising") return o.title.includes("OBJ 4");
        if (t.project === "Producto / Plataforma") return o.title.includes("OBJ 2");
        if (t.project === "Partnerships / Expansión") return o.title.includes("OBJ 3");
        return false;
      });
      return {
        ...t,
        okr_id: okr?.id || null,
        progress: 0,
        created_at: now,
        updated_at: now,
      };
    });

    const { error: taskErr } = await supabase.from("tasks").insert(taskRows);
    if (taskErr) throw taskErr;

    // Insert opportunities
    const oppRows = OPPORTUNITIES.map((opp) => {
      const okr = insertedOkrs?.find((o: { title: string }) => {
        if (opp.type === "investor") return o.title.includes("OBJ 4");
        if (opp.type === "institutional_partner" || opp.type === "gov_contact") return o.title.includes("OBJ 3");
        return false;
      });
      return {
        ...opp,
        okr_id: okr?.id || null,
        notes: opp.recommended_action,
        created_at: now,
        updated_at: now,
      };
    });

    const { error: oppErr } = await supabase.from("opportunities").insert(oppRows);
    if (oppErr) throw oppErr;

    return NextResponse.json({
      success: true,
      inserted: {
        okrs: insertedOkrs?.length,
        kpis: kpiRows.length,
        tasks: taskRows.length,
        opportunities: oppRows.length,
      },
    });
  } catch (error) {
    console.error("Seed-simo error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
