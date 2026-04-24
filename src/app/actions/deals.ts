"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/onboarding/workspace")

  return { user, workspaceId }
}

export async function moveDeal(id: string, stage: string) {
  const { workspaceId } = await getAuthContext()

  const { error } = await adminClient
    .from("deals")
    .update({ stage })
    .eq("id", id)
    .eq("workspace_id", workspaceId)

  if (error) {
    console.error("[moveDeal]", error)
    return { error: error.message }
  }
  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function createDeal(formData: FormData) {
  const { user, workspaceId } = await getAuthContext()

  const title = (formData.get("title") as string)?.trim()
  if (!title) return { error: "Título é obrigatório" }

  const { error } = await adminClient.from("deals").insert({
    title,
    value: Number(formData.get("value")) || 0,
    lead_id: (formData.get("leadId") as string) || null,
    owner_id: user.id,
    stage: (formData.get("stage") as string) || "novo_lead",
    due_date: (formData.get("dueDate") as string) || null,
    workspace_id: workspaceId,
  })

  if (error) return { error: error.message }
  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateDeal(id: string, formData: FormData) {
  const { workspaceId } = await getAuthContext()

  const title = (formData.get("title") as string)?.trim()
  if (!title) return { error: "Título é obrigatório" }

  const { error } = await adminClient
    .from("deals")
    .update({
      title,
      value: Number(formData.get("value")) || 0,
      lead_id: (formData.get("leadId") as string) || null,
      due_date: (formData.get("dueDate") as string) || null,
      stage: formData.get("stage") as string,
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId)

  if (error) return { error: error.message }
  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return { success: true }
}
