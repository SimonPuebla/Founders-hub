import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded border border-[#2a2a2a] bg-[#111111] px-3 py-1.5 text-sm text-[#f0f0f0] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-1 focus:ring-[#7c5cfc] focus:border-[#7c5cfc] disabled:cursor-not-allowed disabled:opacity-40 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
