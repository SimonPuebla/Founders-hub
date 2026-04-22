import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded border px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors placeholder:text-[var(--text-muted)]",
          className
        )}
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--text-primary)",
          ...style,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
