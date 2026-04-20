import { create } from "zustand";
import type { CalendarEvent } from "@/types";

export type QuickCaptureTab = "task" | "opportunity" | "input" | "note";

interface AppStore {
  calendarEvents: CalendarEvent[];
  setCalendarEvents: (events: CalendarEvent[]) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
  quickCaptureTab: QuickCaptureTab;
  setQuickCaptureTab: (tab: QuickCaptureTab) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  calendarEvents: [],
  setCalendarEvents: (events) => set({ calendarEvents: events }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  quickCaptureOpen: false,
  setQuickCaptureOpen: (open) => set({ quickCaptureOpen: open }),
  quickCaptureTab: "task",
  setQuickCaptureTab: (tab) => set({ quickCaptureTab: tab }),
}));
