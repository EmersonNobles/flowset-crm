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
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        barCategoryGap="28%"
        margin={{ top: 8, right: 8, bottom: 56, left: 0 }}
      >
        <XAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          angle={-30}
          textAnchor="end"
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
