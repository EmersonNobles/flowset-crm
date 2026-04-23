import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { AcceptInviteButton } from "./accept-invite-button"

interface Props {
  params: { token: string }
}

export default async function InvitePage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Usuário não autenticado → login com returnUrl
  if (!user) {
    redirect(`/login?next=/invite/${params.token}`)
  }

  // Buscar convite (admin client — usuário ainda não é membro do workspace)
  const { data: invite } = await adminClient
    .from("workspace_invites")
    .select("id, invited_email, role, expires_at, used_at, workspaces(name)")
    .eq("token", params.token)
    .single()

  const workspaceName = (invite?.workspaces as { name: string } | null)?.name ?? ""

  if (!invite) {
    return <InviteMessage title="Convite inválido" description="Este link de convite não existe ou foi removido." />
  }

  if (invite.used_at) {
    return <InviteMessage title="Convite já utilizado" description="Este convite já foi aceito anteriormente." />
  }

  if (new Date(invite.expires_at) < new Date()) {
    return <InviteMessage title="Convite expirado" description="Este convite expirou. Peça ao administrador um novo convite." />
  }

  const rolePt = invite.role === "admin" ? "Administrador" : "Membro"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-sm text-primary-foreground">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight">FlowSet CRM</span>
        </div>

        <h1 className="text-xl font-semibold text-foreground mb-2">Você foi convidado!</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Você recebeu um convite para colaborar no workspace{" "}
          <strong className="text-foreground">{workspaceName}</strong> como{" "}
          <strong className="text-foreground">{rolePt}</strong>.
        </p>

        <div className="bg-muted rounded-lg px-4 py-3 mb-6 text-sm">
          <span className="text-muted-foreground">Entrando como: </span>
          <span className="font-medium text-foreground">{user.email}</span>
        </div>

        <AcceptInviteButton token={params.token} />
      </div>
    </div>
  )
}

function InviteMessage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8 text-center">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-sm text-primary-foreground">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight">FlowSet CRM</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
