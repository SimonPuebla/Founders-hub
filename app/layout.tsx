import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { QuickCapture } from "@/components/shared/QuickCapture";
import { KeyboardShortcuts } from "@/components/shared/KeyboardShortcuts";
import { Toaster } from "@/components/ui/toaster";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600", "700"],
});

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
    <html lang="es">
      <body className={`antialiased ${jost.variable}`}>
        <div className="flex h-screen overflow-hidden">
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
