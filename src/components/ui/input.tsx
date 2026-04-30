import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-9 w-full rounded-[10px] border bg-background px-3 text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "outline-none transition-all",
        "focus:ring-3 focus:ring-ring/50 focus:border-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        hasError
          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
          : "border-border",
        className
      )}
      {...props}
    />
  )
}

export { Input }
