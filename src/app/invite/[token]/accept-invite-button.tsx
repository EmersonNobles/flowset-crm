"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { acceptInvite } from "@/app/actions/workspace"

export function AcceptInviteButton({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handle() {
    startTransition(async () => {
      try {
        await acceptInvite(token)
      } catch {
        setError("Erro ao aceitar convite. Tente novamente.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
      )}
      <button
        onClick={handle}
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Aceitando...
          </>
        ) : (
          "Aceitar convite"
        )}
      </button>
    </div>
  )
}
