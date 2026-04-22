import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react"

import { PageHeader } from "@/components/crm/page-header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { FunnelChart, type FunnelDataPoint } from "@/components/dashboard/funnel-chart"
import { UpcomingDeals } from "@/components/dashboard/upcoming-deals"
import { PeriodSelector } from "@/components/dashboard/period-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDeals, PIPELINE_COLUMNS, STAGE_COLORS } from "@/lib/mock/deals"
import { mockLeads } from "@/lib/mock/leads"

const CLOSED = new Set(["fechado_ganho", "fechado_perdido"])

export default function DashboardPage() {
  const openDeals = mockDeals.filter((d) => !CLOSED.has(d.stage))
  const wonDeals = mockDeals.filter((d) => d.stage === "fechado_ganho")

  const totalLeads = mockLeads.length
  const openCount = openDeals.length
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0)
  const conversionRate =
    Math.round((wonDeals.length / mockDeals.length) * 1000) / 10

  const funnelData: FunnelDataPoint[] = PIPELINE_COLUMNS.map((col) => {
    const count = mockDeals.filter((d) => d.stage === col.id).length
    return {
      label: col.label,
      count,
      color: STAGE_COLORS[col.id].hex,
      percent: Math.round((count / mockDeals.length) * 100),
    }
  })

  const today = new Date().toISOString().slice(0, 10)
  const upcomingDeals = [...openDeals]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)

  const formatBRL = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    })

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu pipeline e métricas"
        action={<PeriodSelector />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total de Leads"
          value={String(totalLeads)}
          change={12}
          changeLabel="vs. mês anterior"
        />
        <MetricCard
          icon={Briefcase}
          label="Negócios Abertos"
          value={String(openCount)}
          change={8}
          changeLabel="vs. mês anterior"
        />
        <MetricCard
          icon={DollarSign}
          label="Valor do Pipeline"
          value={formatBRL(pipelineValue)}
          change={-3}
          changeLabel="vs. mês anterior"
        />
        <MetricCard
          icon={TrendingUp}
          label="Taxa de Conversão"
          value={`${conversionRate}%`}
          change={2}
          changeLabel="vs. mês anterior"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Funil de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart data={funnelData} />
          </CardContent>
        </Card>

        <UpcomingDeals deals={upcomingDeals} today={today} />
      </div>
    </div>
  )
}
