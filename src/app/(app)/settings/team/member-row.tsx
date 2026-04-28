"use client"

import { useTransition } from "react"
import { Loader2, Trash2, Shield, User } from "lucide-react"
import { removeMember } from "@/app/actions/workspace"

type Member = {
  id: string
  user_id: string | null
  invited_email: string | null
  role: string
  status: string
  created_at: string
}

interface Props {
  member: Member
  currentUserId: string
  isAdmin: boolean
}

export function MemberRow({ member, currentUserId, isAdmin }: Props) {
  const [isPending, startTransition] = useTransition()
  const isMe = member.user_id === currentUserId

  function handleRemove(formData: FormData) {
    if (!confirm(`Remover ${member.invited_email ?? "este membro"} do workspace?`)) return
    startTransition(async () => { await removeMember(formData) })
  }

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold uppercase">
        {(member.invited_email ?? "?")[0]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {member.invited_email ?? "—"}
          {isMe && <span className="ml-1.5 text-xs text-muted-foreground font-normal">(você)</span>}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        {member.role === "admin" ? (
          <Shield className="size-3.5 text-primary" />
        ) : (
          <User className="size-3.5 text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground capitalize">
          {member.role === "admin" ? "Admin" : "Membro"}
        </span>
      </div>

      {isAdmin && !isMe && (
        <form action={handleRemove}>
          <input type="hidden" name="member_id" value={member.id} />
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
            title="Remover membro"
          >
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </button>
        </form>
      )}
    </div>
  )
}
