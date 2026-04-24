import { redirect } from "next/navigation"
import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import { PageHeader } from "@/components/crm/page-header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { FunnelChart, type FunnelDataPoint } from "@/components/dashboard/funnel-chart"
import { UpcomingDeals } from "@/components/dashboard/upcoming-deals"
import { PeriodSelector } from "@/components/dashboard/period-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PIPELINE_COLUMNS, STAGE_COLORS, type Deal, type DealStage } from "@/lib/mock/deals"

const CLOSED = new Set(["fechado_ganho", "fechado_perdido"])

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

function periodStart(period: string): string {
  const now = new Date()
  if (period === "week") {
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.getFullYear(), now.getMonth(), diff).toISOString()
  }
  if (period === "quarter") {
    const q = Math.floor(now.getMonth() / 3)
    return new Date(now.getFullYear(), q * 3, 1).toISOString()
  }
  // month (default)
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/onboarding/workspace")

  const period = searchParams.period ?? "month"
  const since = periodStart(period)

  const [{ data: dealsData }, { data: leadsData, count: leadsCount }] = await Promise.all([
    adminClient
      .from("deals")
      .select("*")
      .eq("workspace_id", workspaceId)
      .gte("created_at", since),
    adminClient
      .from("leads")
      .select("id, name, company", { count: "exact" })
      .eq("workspace_id", workspaceId)
      .gte("created_at", since),
  ])

  const deals = dealsData ?? []
  const openDeals = deals.filter((d) => !CLOSED.has(d.stage))
  const wonDeals = deals.filter((d) => d.stage === "fechado_ganho")

  const totalLeads = leadsCount ?? 0
  const openCount = openDeals.length
  const pipelineValue = openDeals.reduce((sum, d) => sum + (d.value ?? 0), 0)
  const conversionRate =
    deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 1000) / 10 : 0

  const funnelData: FunnelDataPoint[] = PIPELINE_COLUMNS.map((col) => {
    const stageDeals = deals.filter((d) => d.stage === col.id)
    return {
      label: col.label,
      count: stageDeals.length,
      color: STAGE_COLORS[col.id].hex,
      percent: deals.length > 0 ? Math.round((stageDeals.length / deals.length) * 100) : 0,
      totalValue: stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
    }
  })

  const leadInfoMap = new Map(
    (leadsData ?? []).map((l) => [l.id, { name: l.name, company: l.company ?? "" }])
  )

  const today = new Date().toISOString().slice(0, 10)

  const upcomingDeals: Deal[] = [...openDeals]
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
    .slice(0, 5)
    .map((d) => ({
      id: d.id,
      title: d.title,
      value: d.value ?? 0,
      leadId: d.lead_id ?? "",
      leadName: d.lead_id ? (leadInfoMap.get(d.lead_id)?.name ?? "—") : "—",
      leadCompany: d.lead_id ? (leadInfoMap.get(d.lead_id)?.company ?? "—") : "—",
      owner: "",
      stage: d.stage as DealStage,
      dueDate: d.due_date ?? "",
      createdAt: d.created_at,
    }))

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu pipeline e métricas"
        action={<PeriodSelector />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Users} label="Total de Leads" value={String(totalLeads)} />
        <MetricCard icon={Briefcase} label="Negócios Abertos" value={String(openCount)} />
        <MetricCard icon={DollarSign} label="Valor do Pipeline" value={formatBRL(pipelineValue)} />
        <MetricCard icon={TrendingUp} label="Taxa de Conversão" value={`${conversionRate}%`} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Funil de Vendas</CardTitle>
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
