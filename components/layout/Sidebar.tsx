"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Target, CheckSquare, Zap, FileText, Users, Settings } from "lucide-react";
import { useSidebarCounts } from "@/hooks/useSidebarCounts";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/strategy", label: "Strategy", icon: Target },
  { href: "/tasks", label: "Tasks", icon: CheckSquare, countKey: "blocked_tasks" },
  { href: "/opportunities", label: "Opportunities", icon: Zap, countKey: "reviewing_opps" },
  { href: "/inputs", label: "Inputs", icon: FileText, countKey: "unprocessed_inputs" },
  { href: "/people", label: "People", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const counts = useSidebarCounts();

  return (
    <aside
      className="w-[200px] h-screen flex flex-col shrink-0 bg-white"
      style={{ borderRight: "1px solid var(--border)" }}
    >
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link href="/dashboard">
          <h1 className="text-[13px] font-bold tracking-widest text-[#111827]" style={{ letterSpacing: "0.12em" }}>ANDÉN</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Founders Hub</p>
        </Link>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const count = item.countKey ? counts[item.countKey as keyof typeof counts] : 0;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-2.5 py-[7px] rounded-lg text-[13px] transition-colors",
                isActive
                  ? "bg-[var(--blue-light)] text-[var(--blue)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg)]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn("w-[15px] h-[15px] shrink-0", isActive ? "text-[var(--blue)]" : "text-[var(--text-muted)]")}
                />
                <span>{item.label}</span>
              </div>
              {count > 0 && (
                <span
                  className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded-full font-medium tabular-nums",
                    item.countKey === "blocked_tasks"
                      ? "bg-[var(--red-light)] text-[var(--red)]"
                      : "bg-[var(--bg)] text-[var(--text-muted)]"
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2.5 pb-4 pt-2.5" style={{ borderTop: "1px solid var(--border)" }}>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors",
            pathname === "/settings"
              ? "bg-[var(--blue-light)] text-[var(--blue)] font-medium"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg)]"
          )}
        >
          <Settings className={cn("w-[15px] h-[15px] shrink-0", pathname === "/settings" ? "text-[var(--blue)]" : "text-[var(--text-muted)]")} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
