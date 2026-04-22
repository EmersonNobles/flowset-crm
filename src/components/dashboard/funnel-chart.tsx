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
}

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: FunnelDataPoint }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow ring-1 ring-foreground/10">
      <p className="font-medium">{d.payload.label}</p>
      <p className="mt-0.5 text-muted-foreground">
        {d.value} negócio{d.value !== 1 ? "s" : ""} · {d.payload.percent}% do total
      </p>
    </div>
  )
}

type FunnelChartProps = {
  data: FunnelDataPoint[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        barCategoryGap="28%"
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={148}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
