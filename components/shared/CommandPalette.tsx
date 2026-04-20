"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Zap,
  FileText,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { QuickCaptureTab } from "@/lib/store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface ActionItem {
  label: string;
  icon: React.ElementType;
  tab: QuickCaptureTab;
}

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setQuickCaptureOpen,
    setQuickCaptureTab,
  } = useAppStore();

  // Cmd+K / Ctrl+K toggle — also handled globally in KeyboardShortcuts,
  // but kept here as a fallback so the palette works standalone.
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Strategy", href: "/strategy", icon: Target },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Opportunities", href: "/opportunities", icon: Zap },
    { label: "Inputs", href: "/inputs", icon: FileText },
    { label: "People", href: "/people", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const actionItems: ActionItem[] = [
    { label: "New Task", icon: PlusCircle, tab: "task" },
    { label: "New Opportunity", icon: PlusCircle, tab: "opportunity" },
    { label: "New Input", icon: PlusCircle, tab: "input" },
  ];

  const groupHeadingClasses = cn(
    "[&_[cmdk-group-heading]]:font-mono",
    "[&_[cmdk-group-heading]]:text-[10px]",
    "[&_[cmdk-group-heading]]:text-[#4a4a4a]",
    "[&_[cmdk-group-heading]]:uppercase",
    "[&_[cmdk-group-heading]]:tracking-wider",
    "[&_[cmdk-group-heading]]:px-2",
    "[&_[cmdk-group-heading]]:py-1.5"
  );

  const itemClasses = cn(
    "flex cursor-pointer items-center gap-2.5 rounded px-2 py-2 text-sm text-[#c0c0c0]",
    "transition-colors outline-none",
    "aria-selected:bg-[#1a1a1a] aria-selected:text-[#f0f0f0]",
    "data-[selected=true]:bg-[#1a1a1a] data-[selected=true]:text-[#f0f0f0]"
  );

  return (
    <Dialog.Root open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0" />

        {/* Modal */}
        <Dialog.Content
          className="fixed left-1/2 top-[20%] z-50 w-full max-w-[560px] -translate-x-1/2 outline-none"
          aria-label="Command palette"
        >
          <Command
            className={cn(
              "w-full overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111111]",
              "shadow-2xl shadow-black/60"
            )}
            loop
          >
            {/* Search input row */}
            <div className="flex items-center border-b border-[#2a2a2a] px-3">
              <svg
                className="mr-2 h-4 w-4 shrink-0 text-[#4a4a4a]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <Command.Input
                placeholder="Type a command or search..."
                className={cn(
                  "h-11 w-full bg-transparent py-3 text-sm text-[#f0f0f0]",
                  "placeholder:text-[#4a4a4a] outline-none"
                )}
              />
              <kbd className="ml-2 hidden select-none items-center gap-1 rounded border border-[#2a2a2a] bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[10px] text-[#4a4a4a] sm:flex">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <Command.List className="max-h-[340px] overflow-y-auto overflow-x-hidden p-1.5">
              <Command.Empty className="py-6 text-center font-mono text-xs text-[#4a4a4a]">
                No results found.
              </Command.Empty>

              {/* Navigation group */}
              <Command.Group heading="Navigation" className={groupHeadingClasses}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => {
                        router.push(item.href);
                        setCommandPaletteOpen(false);
                      }}
                      className={itemClasses}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#7c5cfc]" />
                      <span className="font-mono text-xs tracking-wide">{item.label}</span>
                    </Command.Item>
                  );
                })}
              </Command.Group>

              <Command.Separator className="my-1 h-px bg-[#2a2a2a]" />

              {/* Quick Actions group */}
              <Command.Group heading="Quick Actions" className={groupHeadingClasses}>
                {actionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.label}
                      value={item.label}
                      onSelect={() => {
                        setCommandPaletteOpen(false);
                        setQuickCaptureTab(item.tab);
                        setQuickCaptureOpen(true);
                      }}
                      className={itemClasses}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#4a9eff]" />
                      <span className="font-mono text-xs tracking-wide">{item.label}</span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            </Command.List>

            {/* Footer hint */}
            <div className="flex items-center justify-end gap-3 border-t border-[#2a2a2a] px-3 py-2">
              <span className="font-mono text-[10px] text-[#3a3a3a]">
                ↑↓ navigate · ↵ select · esc close
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
