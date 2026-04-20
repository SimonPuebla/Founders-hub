import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { QuickCapture } from "@/components/shared/QuickCapture";
import { KeyboardShortcuts } from "@/components/shared/KeyboardShortcuts";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Andén — Founders Hub",
  description: "Personal operating system for Simo, co-founder of Andén",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased font-sans">
        <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <CommandPalette />
        <QuickCapture />
        <KeyboardShortcuts />
        <Toaster />
      </body>
    </html>
  );
}
