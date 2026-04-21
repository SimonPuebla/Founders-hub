import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MEETING_TASKS = [
  // Apr 20 — Producto / Legal (Lore)
  { title: "Sync call con Lore — product update y próximos pasos", project: "Producto / Plataforma", priority: "high" as const, status: "todo" as const },
  { title: "Legal review del copy de producto (términos, disclaimers)", project: "Producto / Plataforma", priority: "high" as const, status: "todo" as const },
  { title: "Brand guidelines — actualizar con nuevo lenguaje visual", project: "Producto / Plataforma", priority: "medium" as const, status: "todo" as const },
  { title: "Armar target company list (~70-80 clientes ideales)", project: "BD Empresas", priority: "high" as const, status: "todo" as const },
  { title: "Propuestas personalizadas por tipo de empresa (basado en target list)", project: "BD Empresas", priority: "medium" as const, status: "waiting" as const },

  // Apr 20 — DEZ / Mariana Kotik
  { title: "Preparar use case: on-chain constitution con Seba (intro Mariana Kotik)", project: "DEZ / Institucional", priority: "high" as const, status: "todo" as const },

  // Apr 20 — Andén Weekly / Ecosystem
  { title: "Contactar Steven re ETH LATAM — coordinar participación Andén", project: "Ecosystem", priority: "high" as const, status: "todo" as const },
  { title: "Agendar call Próspera / Tools for Commons", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },

  // Apr 17 — Gago / Automation
  { title: "Definir casos de uso de automatización con Gago (sesión de trabajo)", project: "Automation / AI", priority: "high" as const, status: "todo" as const },
  { title: "Estudiar metodología de definición de use cases para engineers", project: "Automation / AI", priority: "medium" as const, status: "todo" as const },

  // Apr 17 — Camila Russo / PR Media
  { title: "The Defiant — coordinar feature exclusivo (agencia PR Camila Russo)", project: "PR / Media", priority: "high" as const, status: "todo" as const },
  { title: "Confirmar participación en Consensus Miami", project: "PR / Media", priority: "high" as const, status: "todo" as const },

  // Apr 17 — BD Empresas / Seba
  { title: "Validación fiscal con contador — casos de uso Andén (con Seba)", project: "BD Empresas", priority: "high" as const, status: "todo" as const },
  { title: "Outreach a Rama — explorar fit como cliente o partner", project: "BD Empresas", priority: "medium" as const, status: "todo" as const },
  { title: "Crear 5 storyboards de implementación por tipo de empresa", project: "BD Empresas", priority: "high" as const, status: "todo" as const },
  { title: "Activar perks Protocol Labs para empresas Andén", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },
  { title: "Test de pricing con Wootic — piloto y feedback", project: "BD Empresas", priority: "medium" as const, status: "todo" as const },
  { title: "Definir agencia de lead-gen automatizado — brief y selección", project: "Outreach comercial", priority: "high" as const, status: "todo" as const },

  // Apr 17 — Protocol Labs
  { title: "Preparar tabla de criterios para decisión Partnership Protocol Labs", project: "Partnerships / Expansión", priority: "high" as const, status: "todo" as const },

  // Apr 17 — Edwin Rager
  { title: "Follow-up Edwin Rager — info partnership y próximos pasos", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },

  // Apr 17 — Ale / Ecosystem
  { title: "Loopear a Ale en coordinación ETH LATAM", project: "Ecosystem", priority: "medium" as const, status: "todo" as const },

  // Apr 17 — Olly / Pricing / Lisbon
  { title: "Paquetes de precios en español — alinear con Olly", project: "Producto / Plataforma", priority: "medium" as const, status: "todo" as const },
  { title: "Configurar canal PR para Protocol Labs", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },
  { title: "Confirmar agenda y asistencia Lisbon meetup (29-30 Apr)", project: "Partnerships / Expansión", priority: "high" as const, status: "todo" as const },

  // Apr 17 — María José Rubio
  { title: "Follow-up María José Rubio — pedir intro a contactos clave", project: "Partnerships / Expansión", priority: "medium" as const, status: "todo" as const },

  // Apr 17 — Fede Morabito
  { title: "Call post-firma con Fede Morabito — alinear próximos pasos", project: "Fundraising", priority: "high" as const, status: "todo" as const },

  // Apr 8 — Midnight
  { title: "Configurar group chat PR con Midnight", project: "Fundraising", priority: "high" as const, status: "todo" as const },
  { title: "Abogados: revisar SAFE + side letter Midnight", project: "Fundraising", priority: "critical" as const, status: "todo" as const },
  { title: "Coordinar timing del anuncio Midnight con todas las partes", project: "Fundraising", priority: "high" as const, status: "todo" as const },
  { title: "Redactar y programar post Twitter sobre producto", project: "PR / Media", priority: "medium" as const, status: "todo" as const },
];

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date().toISOString();

    // Fetch existing OKRs to link tasks
    const { data: okrs } = await supabase.from("okrs").select("id, title");

    const taskRows = MEETING_TASKS.map((t) => {
      const okr = okrs?.find((o: { title: string }) => {
        if (t.project === "Fundraising") return o.title.includes("OBJ 4");
        if (t.project === "Producto / Plataforma") return o.title.includes("OBJ 2");
        if (t.project === "Partnerships / Expansión") return o.title.includes("OBJ 3");
        if (t.project === "BD Empresas") return o.title.includes("OBJ 2");
        if (t.project === "DEZ / Institucional") return o.title.includes("OBJ 3");
        if (t.project === "Ecosystem") return o.title.includes("OBJ 3");
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

    const { error } = await supabase.from("tasks").insert(taskRows);
    if (error) throw error;

    return NextResponse.json({ success: true, inserted: taskRows.length });
  } catch (error) {
    console.error("Seed-meetings error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
