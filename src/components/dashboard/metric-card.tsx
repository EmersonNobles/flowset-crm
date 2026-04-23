import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  icon: LucideIcon
  label: string
  value: string
  change?: number
  changeLabel?: string
}

export function MetricCard({ icon: Icon, label, value, change, changeLabel }: MetricCardProps) {
  const positive = (change ?? 0) >= 0

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
          {change !== undefined && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                positive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {positive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {positive ? "+" : ""}{change}%{" "}
              {changeLabel && (
                <span className="font-normal text-muted-foreground">{changeLabel}</span>
              )}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="font-mono text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
