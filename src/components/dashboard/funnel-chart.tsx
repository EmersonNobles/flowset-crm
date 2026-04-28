"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export type FunnelDataPoint = {
  label: string
  count: number
  color: string
  percent: number
  totalValue: number
}

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: FunnelDataPoint }>
}

function formatBRLShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace(".", ",")} mi`
  if (value >= 1_000) return `R$ ${Math.round(value / 1_000)} mil`
  return `R$ ${value}`
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/10">
      <p className="font-semibold">{d.payload.label}</p>
      <p className="mt-1 text-muted-foreground">
        {d.value} negócio{d.value !== 1 ? "s" : ""}
      </p>
      <p className="text-muted-foreground">
        Valor: <span className="font-medium text-foreground">{formatBRLShort(d.payload.totalValue)}</span>
      </p>
    </div>
  )
}

type FunnelChartProps = {
  data: FunnelDataPoint[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  const hasData = data.some((d) => d.count > 0)

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-[260px] text-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">Nenhum negócio no período</p>
        <p className="text-xs text-muted-foreground/60">Crie deals no Pipeline para ver o funil.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        barCategoryGap="28%"
        margin={{ top: 8, right: 8, bottom: 32, left: 0 }}
      >
        <XAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
