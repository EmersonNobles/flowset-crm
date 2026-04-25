"use client"

import { useTransition } from "react"
import { Loader2, Users } from "lucide-react"
import { onboardingInvite } from "@/app/actions/onboarding"
import { Stepper } from "@/components/onboarding/stepper"

export default function OnboardingInvitePage() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await onboardingInvite(formData)
    })
  }

  function handleSkip() {
    startTransition(async () => {
      await onboardingInvite(new FormData())
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <Stepper current={2} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <Users className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground mb-0.5">Convide seu time</h1>
          <p className="text-sm text-muted-foreground">Opcional — você pode fazer depois.</p>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail de um colega
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="colega@empresa.com"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            Ele receberá um convite por e-mail para entrar no workspace.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar convite e continuar →"
          )}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={handleSkip}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-center disabled:opacity-50 py-1"
        >
          {isPending ? <Loader2 className="size-3 animate-spin" /> : null}
          Fazer sozinho por agora
        </button>
      </form>
    </div>
  )
}
