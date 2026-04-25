import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId, getMyRole, getActiveMemberCount } from "@/lib/supabase/workspace"
import { PageHeader } from "@/components/crm/page-header"
import { InviteForm } from "./invite-form"
import { MemberRow } from "./member-row"
import { InviteRow } from "./invite-row"
import { Users, Mail, Crown } from "lucide-react"

const FREE_MEMBER_LIMIT = 2

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/workspace")

  const activeWorkspace = workspaces.find((w) => w.id === workspaceId)!
  const myRole = await getMyRole(workspaceId)
  const isAdmin = myRole === "admin"

  // Membros ativos
  const { data: members } = await adminClient
    .from("workspace_members")
    .select("id, user_id, invited_email, role, status, created_at")
    .eq("workspace_id", workspaceId)
    .eq("status", "active")
    .order("created_at", { ascending: true })

  // Convites pendentes
  const { data: invites } = await adminClient
    .from("workspace_invites")
    .select("id, invited_email, role, expires_at, created_at")
    .eq("workspace_id", workspaceId)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  const memberCount = await getActiveMemberCount(workspaceId)
  const atLimit = activeWorkspace.plan === "free" && memberCount >= FREE_MEMBER_LIMIT

  return (
    <div className="w-full max-w-2xl">
      <PageHeader
        title="Equipe"
        subtitle={`${activeWorkspace.name} · ${memberCount} membro${memberCount !== 1 ? "s" : ""}`}
      />

      {/* Limite do plano Free */}
      {activeWorkspace.plan === "free" && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <Crown className="size-4 text-amber-500 shrink-0" />
          <p className="text-sm text-muted-foreground flex-1">
            Plano Free: <strong className="text-foreground">{memberCount}/{FREE_MEMBER_LIMIT}</strong> membros.{" "}
            {atLimit && (
              <span className="text-amber-600 font-medium">
                Limite atingido. Faça upgrade para o Pro para adicionar mais membros.
              </span>
            )}
          </p>
        </div>
      )}

      {/* Formulário de convite */}
      {isAdmin && !atLimit && (
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Convidar por e-mail</h2>
          </div>
          <InviteForm />
        </div>
      )}

      {/* Lista de membros */}
      <div className="rounded-lg border border-border bg-card overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
          <Users className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Membros ativos ({memberCount})
          </h2>
        </div>
        <div className="divide-y divide-border">
          {(members ?? []).map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              currentUserId={user.id}
              isAdmin={isAdmin}
            />
          ))}
          {(!members || members.length === 0) && (
            <p className="px-5 py-6 text-sm text-muted-foreground text-center">Nenhum membro encontrado.</p>
          )}
        </div>
      </div>

      {/* Convites pendentes */}
      {isAdmin && invites && invites.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <Mail className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Convites pendentes ({invites.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {invites.map((inv) => (
              <InviteRow key={inv.id} invite={inv} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
