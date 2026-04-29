import { redirect } from "next/navigation"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import { KanbanBoard } from "@/components/crm/kanban-board"
import { PIPELINE_COLUMNS, type Deal, type DealStage } from "@/lib/mock/deals"

export default async function PipelinePage() {
  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/workspace")

  const [{ data: dealsData }, { data: leadsData }] = await Promise.all([
    adminClient
      .from("deals")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true }),
    adminClient
      .from("leads")
      .select("id, name, company")
      .eq("workspace_id", workspaceId)
      .order("name"),
  ])

  const ownerIds = [...new Set((dealsData ?? []).map((d) => d.owner_id).filter(Boolean) as string[])]
  const userEmailMap = new Map<string, string>()
  await Promise.all(
    ownerIds.map(async (id) => {
      const { data } = await adminClient.auth.admin.getUserById(id)
      if (data.user) userEmailMap.set(id, data.user.email ?? id)
    })
  )

  const leadInfoMap = new Map(
    (leadsData ?? []).map((l) => [l.id, { name: l.name, company: l.company ?? "" }])
  )

  const deals: Deal[] = (dealsData ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value ?? 0,
    leadId: d.lead_id ?? "",
    leadName: d.lead_id ? (leadInfoMap.get(d.lead_id)?.name ?? "—") : "—",
    leadCompany: d.lead_id ? (leadInfoMap.get(d.lead_id)?.company ?? "—") : "—",
    owner: d.owner_id ? (userEmailMap.get(d.owner_id) ?? "—") : "—",
    stage: d.stage as DealStage,
    dueDate: d.due_date ?? "",
    createdAt: d.created_at,
  }))

  // Ensure all stages exist in the column map even if empty
  const stageIds = new Set(PIPELINE_COLUMNS.map((c) => c.id))
  const validDeals = deals.filter((d) => stageIds.has(d.stage))

  const availableLeads = (leadsData ?? []).map((l) => ({
    id: l.id,
    name: l.name,
    company: l.company ?? "",
  }))

  return (
    <div className="flex flex-col h-full -m-4 md:-m-6">
      <KanbanBoard initialDeals={validDeals} availableLeads={availableLeads} />
    </div>
  )
}
