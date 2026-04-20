import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#1e1e1e] text-[#6b6b6b]",
        purple: "bg-[#7c5cfc]/15 text-[#7c5cfc]",
        green: "bg-[#22c55e]/15 text-[#22c55e]",
        amber: "bg-[#f59e0b]/15 text-[#f59e0b]",
        red: "bg-[#ef4444]/15 text-[#ef4444]",
        blue: "bg-[#3b82f6]/15 text-[#3b82f6]",
        coral: "bg-[#f97316]/15 text-[#f97316]",
        outline: "border border-[#2a2a2a] text-[#6b6b6b]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
