"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Calendar, Database, RefreshCw, Zap, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedingSimo, setSeedingSimo] = useState(false);
  const [seedingMeetings, setSeedingMeetings] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("settings")
      .select("google_connected, google_refresh_token")
      .single()
      .then(({ data }) => {
        if (data) {
          setGoogleConnected(data.google_connected || !!data.google_refresh_token);
        }
        setLoading(false);
      });
  }, []);

  async function connectGoogle() {
    const res = await fetch("/api/auth/google");
    const { url } = await res.json();
    window.location.href = url;
  }

  async function disconnectGoogle() {
    await supabase
      .from("settings")
      .upsert({ id: "default", google_connected: false, google_refresh_token: null, updated_at: new Date().toISOString() });
    setGoogleConnected(false);
    toast({ title: "Google Calendar disconnected" });
  }

  async function runSeedMeetings() {
    setSeedingMeetings(true);
    try {
      const res = await fetch("/api/seed-meetings", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Meeting tasks loaded", description: `${data.inserted} tareas de reuniones Apr 7–20 cargadas.` });
      } else {
        toast({ title: "Seed failed", description: String(data.error), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
    setSeedingMeetings(false);
  }

  async function runSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Seed data loaded", description: "Andén base data seeded." });
      } else {
        toast({ title: "Seed failed", description: String(data.error), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
    setSeeding(false);
  }

  async function runSeedSimo() {
    setSeedingSimo(true);
    try {
      const res = await fetch("/api/seed-simo", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Simo data loaded",
          description: `${data.inserted.okrs} OKRs, ${data.inserted.kpis} KRs, ${data.inserted.tasks} tasks, ${data.inserted.opportunities} opportunities.`,
        });
      } else {
        toast({ title: "Seed failed", description: String(data.error), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
    setSeedingSimo(false);
  }

  return (
    <div className="px-8 pt-8 pb-6 max-w-2xl">
      <h1 className="text-lg font-semibold text-[#111827] mb-1">Settings</h1>
      <p className="text-xs text-[#9CA3AF] mb-8">Founders Hub — Andén</p>

      <div className="space-y-4">
        {/* Google Calendar */}
        <section className="bg-white border border-[#E6E8EB] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6E8EB]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-semibold text-[#111827]">Google Calendar</h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Sync your calendar to see today&apos;s events and log meetings directly.
            </p>
          </div>
          <div className="px-5 py-4">
            {loading ? (
              <div className="h-8 w-40 bg-[#F3F4F6] rounded animate-pulse" />
            ) : googleConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span className="text-sm font-medium text-[#16A34A]">Connected</span>
                </div>
                <Button variant="ghost" size="sm" onClick={disconnectGoogle} className="text-[#6B7280]">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectGoogle} className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
                <ExternalLink className="w-3.5 h-3.5" />
                Connect Google Calendar
              </Button>
            )}
          </div>
        </section>

        {/* Simo's data */}
        <section className="bg-white border border-[#E6E8EB] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6E8EB]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-semibold text-[#111827]">Load Current Data (Simo)</h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Carga las tareas, OKRs 2026 y oportunidades actuales de Simo — Hedera, Ronda, Producto, Outreach, Institucional.
            </p>
          </div>
          <div className="px-5 py-4">
            <Button
              onClick={runSeedSimo}
              disabled={seedingSimo}
              className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seedingSimo ? "animate-spin" : ""}`} />
              {seedingSimo ? "Cargando datos..." : "Cargar mis datos"}
            </Button>
            <p className="text-xs text-[#9CA3AF] mt-2">
              Ejecutar una sola vez. Inserta ~23 tareas, 3 OKRs, 5 oportunidades.
            </p>
          </div>
        </section>

        {/* Meeting tasks seed */}
        <section className="bg-white border border-[#E6E8EB] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6E8EB]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-semibold text-[#111827]">Tareas de Reuniones (Apr 7–20)</h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Carga las tareas extraídas de reuniones: Lore, Gago, Seba BD, Camila Russo, Midnight, Ecosystem.
            </p>
          </div>
          <div className="px-5 py-4">
            <Button
              onClick={runSeedMeetings}
              disabled={seedingMeetings}
              className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seedingMeetings ? "animate-spin" : ""}`} />
              {seedingMeetings ? "Cargando..." : "Cargar tareas de reuniones"}
            </Button>
            <p className="text-xs text-[#9CA3AF] mt-2">
              30 tareas desde reuniones Apr 7–20, 2026.
            </p>
          </div>
        </section>

        {/* Base seed */}
        <section className="bg-white border border-[#E6E8EB] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6E8EB]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#9CA3AF]" />
              <h2 className="text-sm font-semibold text-[#111827]">Base Seed Data</h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Load initial OKRs, KPIs, team, and projects. Run once after setting up the database.
            </p>
          </div>
          <div className="px-5 py-4">
            <Button
              variant="outline"
              onClick={runSeed}
              disabled={seeding}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Loading..." : "Load Base Data"}
            </Button>
          </div>
        </section>

        {/* Environment */}
        <section className="bg-white border border-[#E6E8EB] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6E8EB]">
            <h2 className="text-sm font-semibold text-[#111827]">Environment</h2>
          </div>
          <div className="px-5 py-4 space-y-2">
            {[
              { key: "Supabase URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
              { key: "Google OAuth", value: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Credentials loaded" : "Not configured" },
            ].map(({ key, value }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">{key}</span>
                <span className="text-xs text-[#6B7280] max-w-xs truncate font-mono">
                  {value || "Not set"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
