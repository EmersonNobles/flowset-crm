"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const PERIODS = ["Esta semana", "Este mês", "Este trimestre"] as const
type Period = (typeof PERIODS)[number]

export function PeriodSelector() {
  const [selected, setSelected] = useState<Period>("Este mês")

  return (
    <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
      {PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => setSelected(period)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            selected === period
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {period}
        </button>
      ))}
    </div>
  )
}
