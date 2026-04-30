"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { WORKSPACE_COOKIE, getActiveWorkspaceId, getUserWorkspaces, getActiveMemberCount } from "@/lib/supabase/workspace"
import { sendInviteEmail } from "@/lib/resend/send-invite"

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
  if (!workspaceId) redirect("/workspace")

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
  redirect("/invite")
}

const FREE_MEMBER_LIMIT = 2

// Step 2 — convida membro (opcional) e vai para o próximo passo
export async function onboardingInvite(formData: FormData) {
  const { user, workspaceId } = await getOnboardingContext()
  const email = (formData.get("email") as string)?.trim().toLowerCase()

  if (email) {
    // Valida formato básico de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "E-mail inválido." }
    }

    const { data: workspace } = await adminClient
      .from("workspaces")
      .select("name, plan")
      .eq("id", workspaceId)
      .single()

    if (workspace?.plan === "free") {
      const count = await getActiveMemberCount(workspaceId)
      if (count >= FREE_MEMBER_LIMIT) {
        return { error: `O plano Free suporta até ${FREE_MEMBER_LIMIT} membros.` }
      }
    }

    const { data: pendingInvite } = await adminClient
      .from("workspace_invites")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("invited_email", email)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle()

    if (!pendingInvite) {
      const token = crypto.randomUUID()
      const { error: inviteError } = await adminClient
        .from("workspace_invites")
        .insert({ workspace_id: workspaceId, invited_email: email, role: "member", token })

      if (inviteError) {
        console.error("[onboardingInvite]", inviteError)
        return { error: "Erro ao criar convite. Tente novamente." }
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
      await sendInviteEmail({
        to: email,
        workspaceName: workspace?.name ?? "seu workspace",
        invitedByEmail: user.email ?? "um administrador",
        acceptUrl: `${appUrl}/invite/${token}`,
        role: "member",
      })
    }
  }

  redirect("/lead")
}

const FREE_LEAD_LIMIT = 50

// Step 3 — cria o primeiro lead e vai para o próximo passo
export async function onboardingCreateLead(formData: FormData) {
  const { user, workspaceId } = await getOnboardingContext()

  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  if (!name) return { error: "Nome é obrigatório" }
  if (!email) return { error: "E-mail é obrigatório" }

  const { data: workspace } = await adminClient
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId)
    .single()

  if ((workspace?.plan ?? "free") === "free") {
    const { count } = await adminClient
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)

    if ((count ?? 0) >= FREE_LEAD_LIMIT) {
      return { error: `O plano Free suporta até ${FREE_LEAD_LIMIT} leads.`, limitReached: true }
    }
  }

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

  redirect(`/deal?leadId=${lead.id}&leadName=${encodeURIComponent(name)}`)
}

// Step 4 — cria o primeiro deal e finaliza o onboarding
export async function onboardingCreateDeal(formData: FormData) {
  const { user, workspaceId } = await getOnboardingContext()

  const title = (formData.get("title") as string)?.trim()
  if (!title) return { error: "Título é obrigatório" }

  const rawValue = formData.get("value")
  const value = rawValue
    ? parseFloat(String(rawValue).replace(/\./g, "").replace(",", ".")) || 0
    : 0

  const { error } = await adminClient.from("deals").insert({
    title,
    value,
    lead_id: (formData.get("leadId") as string) || null,
    owner_id: user.id,
    stage: "contato_realizado",
    workspace_id: workspaceId,
  })

  if (error) return { error: error.message }

  redirect("/dashboard")
}
