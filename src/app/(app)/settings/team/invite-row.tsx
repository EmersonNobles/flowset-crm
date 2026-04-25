"use client"

import { useTransition } from "react"
import { Loader2, X, Clock } from "lucide-react"
import { revokeInvite } from "@/app/actions/workspace"

type Invite = {
  id: string
  invited_email: string
  role: string
  expires_at: string
  created_at: string
}

interface Props {
  invite: Invite
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function InviteRow({ invite }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleRevoke(formData: FormData) {
    if (!confirm(`Revogar convite de ${invite.invited_email}?`)) return
    startTransition(async () => { await revokeInvite(formData) })
  }

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold uppercase">
        {invite.invited_email[0]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{invite.invited_email}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock className="size-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Expira em {daysUntil(invite.expires_at)} dia{daysUntil(invite.expires_at) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">
        {invite.role === "admin" ? "Admin" : "Membro"}
      </span>

      <form action={handleRevoke}>
        <input type="hidden" name="invite_id" value={invite.id} />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
          title="Revogar convite"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
        </button>
      </form>
    </div>
  )
}
