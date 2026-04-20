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
    <aside className="w-[220px] h-screen flex flex-col bg-white border-r border-[#E6E8EB] shrink-0">
      <div className="px-5 pt-6 pb-5 border-b border-[#E6E8EB]">
        <Link href="/dashboard">
          <h1 className="text-sm font-bold tracking-tight text-[#111827]">
            ANDÉN
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Founders Hub
          </p>
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
                "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group",
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-[#2563EB]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"
                  )}
                />
                <span className={cn("text-sm", isActive ? "font-medium" : "font-normal")}>
                  {item.label}
                </span>
              </div>
              {count > 0 && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-medium",
                    item.countKey === "blocked_tasks"
                      ? "bg-[#FEF2F2] text-[#DC2626]"
                      : "bg-[#F3F4F6] text-[#6B7280]"
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-[#E6E8EB] pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === "/settings"
              ? "bg-[#EFF6FF] text-[#2563EB]"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
          )}
        >
          <Settings className={cn("w-4 h-4 shrink-0", pathname === "/settings" ? "text-[#2563EB]" : "text-[#9CA3AF]")} />
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
