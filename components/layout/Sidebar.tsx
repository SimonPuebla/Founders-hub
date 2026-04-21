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
      className="w-[200px] h-screen flex flex-col shrink-0"
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Link href="/dashboard">
          <h1 className="text-sm font-bold tracking-tight text-[#111827]">ANDÉN</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Founders Hub</p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const count = item.countKey ? counts[item.countKey as keyof typeof counts] : 0;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-black/5"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-[#2563EB]" : "text-[#9CA3AF]"
                  )}
                />
                <span className={cn("text-sm", isActive ? "font-medium" : "font-normal")}>
                  {item.label}
                </span>
              </div>
              {count > 0 && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-medium",
                    item.countKey === "blocked_tasks"
                      ? "bg-[#FEF2F2] text-[#DC2626]"
                      : "bg-black/6 text-[#6B7280]"
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
            pathname === "/settings"
              ? "bg-[#2563EB]/10 text-[#2563EB]"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-black/5"
          )}
        >
          <Settings className={cn("w-4 h-4 shrink-0", pathname === "/settings" ? "text-[#2563EB]" : "text-[#9CA3AF]")} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
