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
    <aside className="w-[220px] h-screen flex flex-col bg-[#0d0d0d] border-r border-[#1e1e1e] shrink-0">
      <div className="px-5 pt-6 pb-4 border-b border-[#1e1e1e]">
        <Link href="/dashboard">
          <h1 className="font-mono text-sm font-bold tracking-widest text-[#f0f0f0] uppercase">
            ANDÉN
          </h1>
          <p className="font-mono text-[10px] text-[#4a4a4a] mt-0.5 tracking-wider">
            Founders Hub
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const count = item.countKey ? counts[item.countKey as keyof typeof counts] : 0;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded text-sm transition-colors group",
                isActive
                  ? "bg-[#1a1a1a] text-[#f0f0f0]"
                  : "text-[#6b6b6b] hover:text-[#f0f0f0] hover:bg-[#141414]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isActive ? "text-[#7c5cfc]" : "text-[#4a4a4a] group-hover:text-[#6b6b6b]"
                  )}
                />
                <span className={cn("font-mono text-xs tracking-wide", isActive && "text-[#f0f0f0]")}>
                  {item.label}
                </span>
              </div>
              {count > 0 && (
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded min-w-[18px] text-center",
                    item.countKey === "blocked_tasks"
                      ? "bg-[#ef4444]/20 text-[#ef4444]"
                      : "bg-[#1e1e1e] text-[#6b6b6b]"
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-[#1e1e1e] pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors group",
            pathname === "/settings"
              ? "bg-[#1a1a1a] text-[#f0f0f0]"
              : "text-[#4a4a4a] hover:text-[#6b6b6b] hover:bg-[#141414]"
          )}
        >
          <Settings className="w-3.5 h-3.5 shrink-0" />
          <span className="font-mono text-xs tracking-wide">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
