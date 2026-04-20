import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#f0f0f0] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc] focus:border-[#7c5cfc] disabled:cursor-not-allowed disabled:opacity-40 resize-none transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
