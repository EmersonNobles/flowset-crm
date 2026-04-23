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

export async function createLead(formData: FormData) {
  const { user, workspaceId } = await getAuthContext()

  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  if (!name) return { error: "Nome é obrigatório" }
  if (!email) return { error: "E-mail é obrigatório" }

  const { error } = await adminClient.from("leads").insert({
    name,
    email,
    phone: (formData.get("phone") as string)?.trim() || null,
    company: (formData.get("company") as string)?.trim() || null,
    role: (formData.get("role") as string)?.trim() || null,
    status: (formData.get("status") as string) || "novo",
    owner_id: user.id,
    workspace_id: workspaceId,
  })

  if (error) return { error: error.message }
  revalidatePath("/leads")
  return { success: true }
}

export async function updateLead(id: string, formData: FormData) {
  const { workspaceId } = await getAuthContext()

  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  if (!name) return { error: "Nome é obrigatório" }
  if (!email) return { error: "E-mail é obrigatório" }

  const { error } = await adminClient
    .from("leads")
    .update({
      name,
      email,
      phone: (formData.get("phone") as string)?.trim() || null,
      company: (formData.get("company") as string)?.trim() || null,
      role: (formData.get("role") as string)?.trim() || null,
      status: (formData.get("status") as string) || "novo",
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId)

  if (error) return { error: error.message }
  revalidatePath("/leads")
  revalidatePath(`/leads/${id}`)
  return { success: true }
}

export async function deleteLead(id: string) {
  const { workspaceId } = await getAuthContext()

  const { error } = await adminClient
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId)

  if (error) return { error: error.message }
  revalidatePath("/leads")
  return { success: true }
}
