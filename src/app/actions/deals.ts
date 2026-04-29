"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"

const VALID_STAGES = [
  "novo_lead",
  "contato_realizado",
  "proposta_enviada",
  "negociacao",
  "fechado_ganho",
  "fechado_perdido",
] as const

type DealStage = (typeof VALID_STAGES)[number]

function assertValidStage(stage: string): stage is DealStage {
  return (VALID_STAGES as readonly string[]).includes(stage)
}

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/workspace")

  return { user, workspaceId }
}

export async function moveDeal(id: string, stage: string) {
  if (!assertValidStage(stage)) return { error: "Etapa inválida" }

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
    stage: assertValidStage(formData.get("stage") as string)
      ? (formData.get("stage") as DealStage)
      : "novo_lead",
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
      stage: assertValidStage(formData.get("stage") as string)
      ? (formData.get("stage") as DealStage)
      : "novo_lead",
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId)

  if (error) return { error: error.message }
  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return { success: true }
}
