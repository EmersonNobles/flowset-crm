"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import type { ActivityType } from "@/types/leads"

const VALID_ACTIVITY_TYPES: ActivityType[] = ["ligacao", "email", "reuniao", "nota"]

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/workspace")

  return { user, workspaceId }
}

export async function createActivity(leadId: string, formData: FormData) {
  const { user, workspaceId } = await getAuthContext()

  const type = formData.get("type") as ActivityType
  const description = (formData.get("description") as string)?.trim()

  if (!type || !VALID_ACTIVITY_TYPES.includes(type)) return { error: "Tipo de atividade inválido" }
  if (!description) return { error: "Descrição é obrigatória" }

  const { data: leadCheck } = await adminClient
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("workspace_id", workspaceId)
    .maybeSingle()
  if (!leadCheck) return { error: "Lead inválido." }

  const { error } = await adminClient.from("activities").insert({
    lead_id: leadId,
    workspace_id: workspaceId,
    author_id: user.id,
    type,
    description,
  })

  if (error) return { error: error.message }
  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}

export async function deleteActivity(activityId: string, leadId: string) {
  const { user, workspaceId } = await getAuthContext()

  // only the author or an admin may delete
  const { data: member } = await adminClient
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  const { data: activity } = await adminClient
    .from("activities")
    .select("author_id")
    .eq("id", activityId)
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  if (!activity) return { error: "Atividade não encontrada" }

  const isAuthor = activity.author_id === user.id
  const isAdmin = member?.role === "admin"

  if (!isAuthor && !isAdmin) return { error: "Sem permissão para excluir esta atividade" }

  const { error } = await adminClient
    .from("activities")
    .delete()
    .eq("id", activityId)
    .eq("workspace_id", workspaceId)

  if (error) return { error: error.message }
  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}
