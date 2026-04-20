"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import type { QuickCaptureTab } from "@/lib/store";

/**
 * KeyboardShortcuts
 *
 * Mounts a single global keydown listener that drives the app-wide shortcut
 * system.  Renders nothing — returns null.
 *
 * Shortcuts:
 *   Cmd/Ctrl + K  → toggle CommandPalette
 *   N             → open QuickCapture on the Task tab
 *   O             → open QuickCapture on the Opportunity tab
 *   I             → open QuickCapture on the Input tab
 *   Escape        → close both modals
 *
 * The N / O / I shortcuts are suppressed when focus is inside an
 * <input>, <textarea>, or any element with contentEditable.
 */
export function KeyboardShortcuts() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    quickCaptureOpen,
    setQuickCaptureOpen,
    setQuickCaptureTab,
  } = useAppStore();

  React.useEffect(() => {
    function isTypingContext(e: KeyboardEvent): boolean {
      const target = e.target as HTMLElement | null;
      if (!target) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function openCapture(tab: QuickCaptureTab) {
      setQuickCaptureTab(tab);
      setQuickCaptureOpen(true);
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K / Ctrl+K — toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        return;
      }

      // Escape — close both modals
      if (e.key === "Escape") {
        if (commandPaletteOpen) setCommandPaletteOpen(false);
        if (quickCaptureOpen) setQuickCaptureOpen(false);
        return;
      }

      // Single-letter shortcuts — skip when user is typing
      if (isTypingContext(e)) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          openCapture("task");
          break;
        case "o":
        case "O":
          e.preventDefault();
          openCapture("opportunity");
          break;
        case "i":
        case "I":
          e.preventDefault();
          openCapture("input");
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    commandPaletteOpen,
    setCommandPaletteOpen,
    quickCaptureOpen,
    setQuickCaptureOpen,
    setQuickCaptureTab,
  ]);

  return null;
}
