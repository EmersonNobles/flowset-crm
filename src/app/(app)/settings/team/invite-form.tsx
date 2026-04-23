"use client"

import { useState, useTransition, useRef } from "react"
import { Loader2, Send } from "lucide-react"
import { inviteMember } from "@/app/actions/workspace"

export function InviteForm({ workspaceId }: { workspaceId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailWarning, setEmailWarning] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    setEmailWarning(null)
    startTransition(async () => {
      const result = await inviteMember(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        if (result?.emailWarning) setEmailWarning(result.emailWarning)
        formRef.current?.reset()
        setTimeout(() => { setSuccess(false); setEmailWarning(null) }, 6000)
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="workspace_id" value={workspaceId} />

      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="colaborador@empresa.com"
          required
          disabled={isPending}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        <select
          name="role"
          disabled={isPending}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          <option value="member">Membro</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Send className="size-3.5" />
              Convidar
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
      )}
      {success && !emailWarning && (
        <p className="text-sm text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-md px-3 py-2">
          Convite enviado com sucesso!
        </p>
      )}
      {emailWarning && (
        <p className="text-sm text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 rounded-md px-3 py-2">
          {emailWarning}
        </p>
      )}
    </form>
  )
}
