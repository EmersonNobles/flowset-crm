"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const PERIODS = [
  { label: "Esta semana", value: "week" },
  { label: "Este mês",    value: "month" },
  { label: "Este trimestre", value: "quarter" },
] as const

type PeriodValue = (typeof PERIODS)[number]["value"]

export function PeriodSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selected = (searchParams.get("period") as PeriodValue) ?? "month"

  function select(value: PeriodValue) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => select(period.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            selected === period.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
