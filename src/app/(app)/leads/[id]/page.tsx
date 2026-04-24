import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import { LeadProfileCard } from "@/components/leads/lead-profile-card"
import { ActivityTimeline } from "@/components/leads/activity-timeline"
import type { LeadRow, ActivityRow } from "@/types/leads"

interface LeadDetailPageProps {
  params: { id: string }
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/onboarding/workspace")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: leadData }, { data: activitiesData }] = await Promise.all([
    adminClient
      .from("leads")
      .select("*")
      .eq("id", params.id)
      .eq("workspace_id", workspaceId)
      .maybeSingle(),
    adminClient
      .from("activities")
      .select("*")
      .eq("lead_id", params.id)
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false }),
  ])

  if (!leadData) notFound()

  const { data: { users } } = await adminClient.auth.admin.listUsers()
  const userEmailMap = new Map(users.map((u) => [u.id, u.email ?? u.id]))

  const lead: LeadRow = {
    ...leadData,
    status: leadData.status as LeadRow["status"],
    owner_email: leadData.owner_id ? (userEmailMap.get(leadData.owner_id) ?? null) : null,
  }

  const activities: ActivityRow[] = (activitiesData ?? []).map((a) => ({
    ...a,
    type: a.type as ActivityRow["type"],
    author_email: a.author_id ? (userEmailMap.get(a.author_id) ?? null) : null,
  }))

  return (
    <div className="space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Voltar para Leads
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <LeadProfileCard lead={lead} />

        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">
            Atividades
            {activities.length > 0 && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {activities.length}
              </span>
            )}
          </h3>
          <ActivityTimeline
            activities={activities}
            leadId={params.id}
            currentUserId={user?.id ?? ""}
          />
        </div>
      </div>
    </div>
  )
}
