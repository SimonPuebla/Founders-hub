"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2",
            toast.variant === "destructive" && "border-[#ef4444]/30 bg-[#ef4444]/10"
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <p className="text-sm font-medium text-[#f0f0f0]">{toast.title}</p>
            )}
            {toast.description && (
              <p className="text-xs text-[#6b6b6b] mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-[#4a4a4a] hover:text-[#f0f0f0] transition-colors mt-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
