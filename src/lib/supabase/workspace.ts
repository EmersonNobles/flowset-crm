import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"

export const WORKSPACE_COOKIE = "active_workspace_id"

export type WorkspaceBasic = {
  id: string
  name: string
  slug: string
  plan: string
}

/** Todos os workspaces do usuário autenticado (membro ativo). */
export async function getUserWorkspaces(): Promise<WorkspaceBasic[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await adminClient
    .from("workspace_members")
    .select("workspaces(id, name, slug, plan)")
    .eq("user_id", user.id)
    .eq("status", "active")

  if (!data) return []
  return data
    .map((row) => row.workspaces as unknown as WorkspaceBasic | null)
    .filter(Boolean) as WorkspaceBasic[]
}

/** Retorna o workspace_id ativo: valida o cookie ou cai no primeiro disponível. */
export function getActiveWorkspaceId(workspaces: WorkspaceBasic[]): string | null {
  if (workspaces.length === 0) return null
  const cookieStore = cookies()
  const saved = cookieStore.get(WORKSPACE_COOKIE)?.value
  const valid = saved && workspaces.some((w) => w.id === saved)
  return valid ? saved : workspaces[0].id
}

/** Papel do usuário autenticado no workspace. */
export async function getMyRole(workspaceId: string): Promise<"admin" | "member" | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await adminClient
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  return (data?.role as "admin" | "member") ?? null
}

/** Contagem de membros ativos no workspace (para limite do plano Free). */
export async function getActiveMemberCount(workspaceId: string): Promise<number> {
  const { count } = await adminClient
    .from("workspace_members")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .eq("status", "active")

  return count ?? 0
}
