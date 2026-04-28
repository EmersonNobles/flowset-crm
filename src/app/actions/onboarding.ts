"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { WORKSPACE_COOKIE, getActiveWorkspaceId, getUserWorkspaces } from "@/lib/supabase/workspace"

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function getOnboardingContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/onboarding/workspace")

  return { user, workspaceId }
}

// Step 1 — cria workspace e vai para o próximo passo
export async function createWorkspaceOnboarding(formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  if (!name || name.length < 2) return { error: "Nome deve ter ao menos 2 caracteres" }

  const user = await getAuthUser()
  if (!user) redirect("/login")

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "workspace"

  const { data: workspace, error: wsError } = await adminClient
    .from("workspaces")
    .insert({ name, slug: `${slug}-${Date.now().toString(36)}`, plan: "free" })
    .select("id")
    .single()

  if (wsError || !workspace) return { error: `Erro ao criar workspace: ${wsError?.message ?? "resposta vazia"}` }

  const { error: memberError } = await adminClient
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "admin",
      status: "active",
      invited_email: user.email,
    })

  if (memberError) return { error: `Erro ao configurar permissões: ${memberError.message}` }

  cookies().set(WORKSPACE_COOKIE, workspace.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
  redirect("/onboarding/invite")
}

// Step 2 — convida membro (opcional) e vai para o próximo passo
export async function onboardingInvite(formData: FormData) {
  const { workspaceId } = await getOnboardingContext()
  const email = (formData.get("email") as string)?.trim().toLowerCase()

  if (email) {
    const token = crypto.randomUUID()
    await adminClient.from("workspace_invites").insert({
      workspace_id: workspaceId,
      invited_email: email,
      role: "member",
      token,
    })
  }

  redirect("/onboarding/lead")
}

// Step 3 — cria o primeiro lead e vai para o próximo passo
export async function onboardingCreateLead(formData: FormData) {
  const { user, workspaceId } = await getOnboardingContext()

  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  if (!name) return { error: "Nome é obrigatório" }
  if (!email) return { error: "E-mail é obrigatório" }

  const { data: lead, error } = await adminClient
    .from("leads")
    .insert({
      name,
      email,
      company: (formData.get("company") as string)?.trim() || null,
      status: "novo",
      owner_id: user.id,
      workspace_id: workspaceId,
    })
    .select("id")
    .single()

  if (error || !lead) return { error: error?.message ?? "Erro ao criar lead" }

  redirect(`/onboarding/deal?leadId=${lead.id}&leadName=${encodeURIComponent(name)}`)
}

// Step 4 — cria o primeiro deal e finaliza o onboarding
export async function onboardingCreateDeal(formData: FormData) {
  const { user, workspaceId } = await getOnboardingContext()

  const title = (formData.get("title") as string)?.trim()
  if (!title) return { error: "Título é obrigatório" }

  const { error } = await adminClient.from("deals").insert({
    title,
    value: Number(formData.get("value")) || 0,
    lead_id: (formData.get("leadId") as string) || null,
    owner_id: user.id,
    stage: "contato_realizado",
    workspace_id: workspaceId,
  })

  if (error) return { error: error.message }

  redirect("/dashboard")
}
