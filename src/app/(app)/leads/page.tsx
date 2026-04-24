import { redirect } from "next/navigation"
import { Suspense } from "react"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import { PageHeader } from "@/components/crm/page-header"
import { LeadsFilters } from "@/components/leads/leads-filters"
import { LeadsTable } from "@/components/leads/leads-table"
import { LeadsCreateButton } from "@/components/leads/leads-create-button"
import { UpgradeBanner } from "@/components/crm/upgrade-banner"
import type { LeadRow, MemberOption } from "@/types/leads"

const FREE_LEAD_LIMIT = 50

interface LeadsPageProps {
  searchParams: { q?: string; status?: string; owner?: string }
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/onboarding/workspace")

  const { q, status, owner } = searchParams

  let query = adminClient
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (q) query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,email.ilike.%${q}%`)
  if (status && status !== "all") query = query.eq("status", status)
  if (owner && owner !== "all") query = query.eq("owner_id", owner)

  const [{ data: leads }, { data: membersData }, { data: workspaceRow }, { count: totalLeadCount }] = await Promise.all([
    query,
    adminClient
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", workspaceId)
      .eq("status", "active"),
    adminClient
      .from("workspaces")
      .select("plan")
      .eq("id", workspaceId)
      .single(),
    adminClient
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
  ])

  const isFree = (workspaceRow?.plan ?? "free") === "free"
  const totalLeads = totalLeadCount ?? 0

  const { data: { users } } = await adminClient.auth.admin.listUsers()
  const userEmailMap = new Map(users.map((u) => [u.id, u.email ?? u.id]))

  const owners: MemberOption[] = (membersData ?? [])
    .filter((m) => m.user_id)
    .map((m) => ({
      id: m.user_id!,
      email: userEmailMap.get(m.user_id!) ?? m.invited_email ?? m.user_id!,
    }))

  const leadsWithOwner: LeadRow[] = (leads ?? []).map((l) => ({
    ...l,
    status: l.status as LeadRow["status"],
    owner_email: l.owner_id ? (userEmailMap.get(l.owner_id) ?? null) : null,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Gerencie seus contatos e clientes"
        action={<LeadsCreateButton />}
      />
      {isFree && totalLeads >= FREE_LEAD_LIMIT * 0.9 && (
        <UpgradeBanner current={totalLeads} limit={FREE_LEAD_LIMIT} resource="leads" />
      )}
      <Suspense fallback={null}>
        <LeadsFilters
          owners={owners}
          currentQ={q ?? ""}
          currentStatus={status ?? "all"}
          currentOwner={owner ?? "all"}
        />
      </Suspense>
      <LeadsTable leads={leadsWithOwner} />
    </div>
  )
}
