"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface SidebarCounts {
  blocked_tasks: number;
  reviewing_opps: number;
  unprocessed_inputs: number;
}

export function useSidebarCounts(): SidebarCounts {
  const [counts, setCounts] = useState<SidebarCounts>({
    blocked_tasks: 0,
    reviewing_opps: 0,
    unprocessed_inputs: 0,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchCounts() {
      const [tasksRes, oppsRes, inputsRes] = await Promise.all([
        supabase.from("tasks").select("id", { count: "exact" }).eq("status", "blocked"),
        supabase
          .from("opportunities")
          .select("id", { count: "exact" })
          .in("status", ["captured", "reviewing"]),
        supabase
          .from("inputs")
          .select("id", { count: "exact" })
          .is("extracted_tasks", null),
      ]);

      setCounts({
        blocked_tasks: tasksRes.count || 0,
        reviewing_opps: oppsRes.count || 0,
        unprocessed_inputs: inputsRes.count || 0,
      });
    }

    fetchCounts();

    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return counts;
}
