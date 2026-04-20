"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Calendar, Database, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [seeding, setSeeding] = useState(false);
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

  async function runSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Seed data loaded", description: "Andén data has been seeded." });
      } else {
        toast({ title: "Seed failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
    setSeeding(false);
  }

  return (
    <div className="px-8 pt-8 pb-6 max-w-2xl">
      <h1 className="text-lg font-semibold text-[#f0f0f0] mb-1">Settings</h1>
      <p className="font-mono text-xs text-[#4a4a4a] mb-8">Founders Hub — Andén</p>

      <div className="space-y-6">
        <section className="rounded border border-[#1e1e1e] bg-[#111111]">
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3b82f6]" />
              <h2 className="text-sm font-medium text-[#f0f0f0]">Google Calendar</h2>
            </div>
            <p className="text-xs text-[#6b6b6b] mt-1">
              Sync your calendar to see today's events on the dashboard and log meetings directly.
            </p>
          </div>
          <div className="px-5 py-4">
            {loading ? (
              <div className="h-8 w-40 bg-[#1e1e1e] rounded animate-pulse" />
            ) : googleConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-sm text-[#22c55e]">Connected</span>
                </div>
                <Button variant="ghost" size="sm" onClick={disconnectGoogle}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectGoogle} className="gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Connect Google Calendar
              </Button>
            )}
          </div>
        </section>

        <section className="rounded border border-[#1e1e1e] bg-[#111111]">
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#7c5cfc]" />
              <h2 className="text-sm font-medium text-[#f0f0f0]">Seed Data</h2>
            </div>
            <p className="text-xs text-[#6b6b6b] mt-1">
              Load Andén's initial OKRs, KPIs, team, and projects. Run once after setting up the database.
            </p>
          </div>
          <div className="px-5 py-4">
            <Button
              variant="secondary"
              onClick={runSeed}
              disabled={seeding}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Loading seed data..." : "Load Seed Data"}
            </Button>
          </div>
        </section>

        <section className="rounded border border-[#1e1e1e] bg-[#111111]">
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <h2 className="text-sm font-medium text-[#f0f0f0]">Environment</h2>
          </div>
          <div className="px-5 py-4 space-y-2">
            {[
              { key: "Supabase URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
              { key: "Google OAuth", value: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Credentials loaded" : "Not configured" },
            ].map(({ key, value }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#4a4a4a]">{key}</span>
                <span className="font-mono text-xs text-[#6b6b6b] max-w-xs truncate">
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
