"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { sendInviteEmail } from "@/lib/resend/send-invite"
import { WORKSPACE_COOKIE, getActiveMemberCount, getMyRole } from "@/lib/supabase/workspace"

const FREE_MEMBER_LIMIT = 2

// ── Criar workspace ────────────────────────────────────────────────

export async function createWorkspace(formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  if (!name || name.length < 2) return { error: "Nome deve ter ao menos 2 caracteres" }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({ name, slug: `${slug}-${Date.now().toString(36)}`, plan: "free" })
    .select("id")
    .single()

  if (wsError || !workspace) return { error: "Erro ao criar workspace. Tente novamente." }

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "admin",
      status: "active",
      invited_email: user.email,
    })

  if (memberError) return { error: "Erro ao configurar permissões." }

  cookies().set(WORKSPACE_COOKIE, workspace.id, { path: "/", maxAge: 60 * 60 * 24 * 365 })
  redirect("/dashboard")
}

// ── Trocar workspace ───────────────────────────────────────────────

export async function switchWorkspace(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!data) return { error: "Workspace não encontrado." }

  cookies().set(WORKSPACE_COOKIE, workspaceId, { path: "/", maxAge: 60 * 60 * 24 * 365 })
  redirect("/dashboard")
}

// ── Convidar membro ────────────────────────────────────────────────

export async function inviteMember(formData: FormData) {
  const workspaceId = formData.get("workspace_id") as string
  const email       = (formData.get("email") as string)?.trim().toLowerCase()
  const role        = (formData.get("role") as string) ?? "member"

  if (!email || !workspaceId) return { error: "Dados inválidos." }
  if (!["admin", "member"].includes(role)) return { error: "Papel inválido." }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Verificar se o usuário atual é admin
  const myRole = await getMyRole(workspaceId)
  if (myRole !== "admin") return { error: "Apenas administradores podem convidar membros." }

  // Verificar limite do plano Free
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("name, plan")
    .eq("id", workspaceId)
    .single()

  if (!workspace) return { error: "Workspace não encontrado." }

  if (workspace.plan === "free") {
    const memberCount = await getActiveMemberCount(workspaceId)
    if (memberCount >= FREE_MEMBER_LIMIT) {
      return {
        error: `O plano Free suporta até ${FREE_MEMBER_LIMIT} membros. Faça upgrade para o Pro para adicionar mais.`,
      }
    }
  }

  // Verificar se já é membro ativo
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invited_email", email)
    .eq("status", "active")
    .maybeSingle()

  if (existing) return { error: "Este e-mail já é membro do workspace." }

  // Verificar convite pendente
  const { data: pendingInvite } = await supabase
    .from("workspace_invites")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invited_email", email)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle()

  if (pendingInvite) return { error: "Já existe um convite pendente para este e-mail." }

  // Criar convite
  const token = crypto.randomUUID()
  const { error: inviteError } = await supabase
    .from("workspace_invites")
    .insert({
      workspace_id:  workspaceId,
      invited_email: email,
      role,
      token,
      invited_by: user.id,
    })

  if (inviteError) return { error: "Erro ao criar convite." }

  // Enviar e-mail
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  await sendInviteEmail({
    to:            email,
    workspaceName: workspace.name,
    invitedByEmail: user.email ?? "um administrador",
    acceptUrl:     `${appUrl}/invite/${token}`,
    role,
  })

  revalidatePath("/settings/team")
  return { success: true }
}

// ── Remover membro ─────────────────────────────────────────────────

export async function removeMember(formData: FormData) {
  const workspaceId = formData.get("workspace_id") as string
  const memberId    = formData.get("member_id")    as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const myRole = await getMyRole(workspaceId)
  if (myRole !== "admin") return { error: "Apenas administradores podem remover membros." }

  // Não pode remover a si mesmo se for o único admin
  const { data: target } = await supabase
    .from("workspace_members")
    .select("user_id, role")
    .eq("id", memberId)
    .single()

  if (!target) return { error: "Membro não encontrado." }
  if (target.user_id === user.id) return { error: "Você não pode remover a si mesmo." }

  const { error: deleteError } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId)
    .eq("workspace_id", workspaceId)

  if (deleteError) return { error: "Erro ao remover membro." }

  revalidatePath("/settings/team")
  return { success: true }
}

// ── Revogar convite ────────────────────────────────────────────────

export async function revokeInvite(formData: FormData) {
  const workspaceId = formData.get("workspace_id") as string
  const inviteId    = formData.get("invite_id")    as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const myRole = await getMyRole(workspaceId)
  if (myRole !== "admin") return { error: "Apenas administradores podem revogar convites." }

  await supabase
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId)
    .eq("workspace_id", workspaceId)

  revalidatePath("/settings/team")
  return { success: true }
}

// ── Aceitar convite ────────────────────────────────────────────────

export async function acceptInvite(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/invite/${token}`)

  // Buscar o convite via admin client (bypassa RLS — usuário ainda não é membro)
  const { data: invite, error } = await adminClient
    .from("workspace_invites")
    .select("id, workspace_id, invited_email, role, expires_at, used_at")
    .eq("token", token)
    .single()

  if (error || !invite) redirect("/dashboard?invite=invalid")
  if (invite.used_at) redirect("/dashboard?invite=used")
  if (new Date(invite.expires_at) < new Date()) redirect("/dashboard?invite=expired")

  // Verificar se já é membro
  const { data: alreadyMember } = await adminClient
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", invite.workspace_id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  if (!alreadyMember) {
    await adminClient.from("workspace_members").insert({
      workspace_id:  invite.workspace_id,
      user_id:       user.id,
      invited_email: invite.invited_email,
      role:          invite.role,
      status:        "active",
    })
  }

  // Marcar convite como usado
  await adminClient
    .from("workspace_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id)

  // Ativar o workspace aceito
  cookies().set(WORKSPACE_COOKIE, invite.workspace_id, { path: "/", maxAge: 60 * 60 * 24 * 365 })
  redirect("/dashboard?invite=accepted")
}
