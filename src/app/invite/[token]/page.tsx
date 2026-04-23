import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { AcceptInviteButton } from "./accept-invite-button"
import { LogIn, UserPlus } from "lucide-react"

interface Props {
  params: { token: string }
}

export default async function InvitePage({ params }: Props) {
  // Buscar o convite primeiro (independente de estar logado)
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

  // Verificar se já está autenticado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const rolePt = invite.role === "admin" ? "Administrador" : "Membro"
  const inviteUrl = `/invite/${params.token}`

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

        {user ? (
          /* Usuário já autenticado — aceitar direto */
          <>
            <div className="bg-muted rounded-lg px-4 py-3 mb-6 text-sm">
              <span className="text-muted-foreground">Entrando como: </span>
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <AcceptInviteButton token={params.token} />
          </>
        ) : (
          /* Usuário não autenticado — opções de login e cadastro */
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Para aceitar o convite, entre na sua conta ou crie uma nova.
            </p>
            <Link
              href={`/cadastro?next=${inviteUrl}`}
              className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="size-4" />
              Criar conta e aceitar
            </Link>
            <Link
              href={`/login?next=${inviteUrl}`}
              className="flex items-center justify-center gap-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <LogIn className="size-4" />
              Já tenho conta — Entrar
            </Link>
          </div>
        )}
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
