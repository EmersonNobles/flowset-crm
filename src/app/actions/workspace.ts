"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { sendInviteEmail } from "@/lib/resend/send-invite"
import { WORKSPACE_COOKIE, getActiveMemberCount, getMyRole, getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"

const FREE_MEMBER_LIMIT = 2

// ── helpers internos ───────────────────────────────────────────────

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Criar workspace ────────────────────────────────────────────────

export async function createWorkspace(formData: FormData) {
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

  if (wsError || !workspace) {
    console.error("[createWorkspace] wsError:", wsError)
    return { error: `Erro ao criar workspace: ${wsError?.message ?? "resposta vazia"}` }
  }

  const { error: memberError } = await adminClient
    .from("workspace_members")
    .insert({
      workspace_id:  workspace.id,
      user_id:       user.id,
      role:          "admin",
      status:        "active",
      invited_email: user.email,
    })

  if (memberError) {
    console.error("[createWorkspace] memberError:", memberError)
    return { error: `Erro ao configurar permissões: ${memberError.message}` }
  }

  cookies().set(WORKSPACE_COOKIE, workspace.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
  redirect("/dashboard")
}

// ── Trocar workspace ───────────────────────────────────────────────

export async function switchWorkspace(workspaceId: string) {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  const { data } = await adminClient
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  if (!data) return { error: "Workspace não encontrado." }

  cookies().set(WORKSPACE_COOKIE, workspaceId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
  redirect("/dashboard")
}

// ── Convidar membro ────────────────────────────────────────────────

export async function inviteMember(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const role  = (formData.get("role") as string) ?? "member"

  if (!email) return { error: "Dados inválidos." }
  if (!["admin", "member"].includes(role)) return { error: "Papel inválido." }

  const user = await getAuthUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) return { error: "Workspace não encontrado." }

  const myRole = await getMyRole(workspaceId)
  if (myRole !== "admin") return { error: "Apenas administradores podem convidar membros." }

  const { data: workspace } = await adminClient
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

  const { data: existing } = await adminClient
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invited_email", email)
    .eq("status", "active")
    .maybeSingle()

  if (existing) return { error: "Este e-mail já é membro do workspace." }

  const { data: pendingInvite } = await adminClient
    .from("workspace_invites")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invited_email", email)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle()

  if (pendingInvite) return { error: "Já existe um convite pendente para este e-mail." }

  const token = crypto.randomUUID()
  const { error: inviteError } = await adminClient
    .from("workspace_invites")
    .insert({
      workspace_id:  workspaceId,
      invited_email: email,
      role,
      token,
      invited_by:    user.id,
    })

  if (inviteError) {
    console.error("[inviteMember] inviteError:", inviteError)
    return { error: `Erro ao criar convite: ${inviteError.message}` }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const emailResult = await sendInviteEmail({
    to:             email,
    workspaceName:  workspace.name,
    invitedByEmail: user.email ?? "um administrador",
    acceptUrl:      `${appUrl}/invite/${token}`,
    role,
  })

  revalidatePath("/settings/team")

  if (emailResult?.error) {
    // Convite criado mas e-mail falhou — informar sem bloquear
    return { success: true, emailWarning: `Convite criado, mas o e-mail não foi enviado: ${emailResult.error}` }
  }

  return { success: true }
}

// ── Remover membro ─────────────────────────────────────────────────

export async function removeMember(formData: FormData) {
  const memberId = formData.get("member_id") as string

  const user = await getAuthUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) return { error: "Workspace não encontrado." }

  const myRole = await getMyRole(workspaceId)
  if (myRole !== "admin") return { error: "Apenas administradores podem remover membros." }

  const { data: target } = await adminClient
    .from("workspace_members")
    .select("user_id, role")
    .eq("id", memberId)
    .single()

  if (!target) return { error: "Membro não encontrado." }
  if (target.user_id === user.id) return { error: "Você não pode remover a si mesmo." }

  const { error: deleteError } = await adminClient
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
  const inviteId = formData.get("invite_id") as string

  const user = await getAuthUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) return { error: "Workspace não encontrado." }

  const myRole = await getMyRole(workspaceId)
  if (myRole !== "admin") return { error: "Apenas administradores podem revogar convites." }

  await adminClient
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId)
    .eq("workspace_id", workspaceId)

  revalidatePath("/settings/team")
  return { success: true }
}

// ── Aceitar convite ────────────────────────────────────────────────

export async function acceptInvite(
  token: string
): Promise<{ error: string } | { ok: true }> {
  const user = await getAuthUser()
  if (!user) return { error: "Você precisa estar logado para aceitar o convite." }

  const { data: invite, error } = await adminClient
    .from("workspace_invites")
    .select("id, workspace_id, invited_email, role, expires_at, used_at")
    .eq("token", token)
    .single()

  if (error || !invite) return { error: "Convite inválido ou não encontrado." }
  if (invite.used_at)   return { error: "Este convite já foi utilizado." }
  if (new Date(invite.expires_at) < new Date()) return { error: "Este convite expirou." }
  if (user.email?.toLowerCase() !== invite.invited_email.toLowerCase()) {
    return { error: "Este convite foi enviado para outro endereço de e-mail." }
  }

  const { data: alreadyMember } = await adminClient
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", invite.workspace_id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  if (!alreadyMember) {
    const { error: insertError } = await adminClient
      .from("workspace_members")
      .insert({
        workspace_id:  invite.workspace_id,
        user_id:       user.id,
        invited_email: invite.invited_email,
        role:          invite.role,
        status:        "active",
      })
    if (insertError) {
      console.error("[acceptInvite] insertError:", insertError)
      return { error: "Erro ao entrar no workspace. Tente novamente." }
    }
  }

  await adminClient
    .from("workspace_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id)

  cookies().set(WORKSPACE_COOKIE, invite.workspace_id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
  return { ok: true }
}
