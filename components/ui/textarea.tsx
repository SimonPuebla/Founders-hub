import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded border px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-40 resize-none transition-colors placeholder:text-[var(--text-muted)]",
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
Textarea.displayName = "Textarea";

export { Textarea };
