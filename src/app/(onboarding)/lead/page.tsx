"use client"

import { useState, useTransition } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { onboardingCreateLead } from "@/app/actions/onboarding"
import { Stepper } from "@/components/onboarding/stepper"

export default function OnboardingLeadPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await onboardingCreateLead(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <Stepper current={3} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <UserPlus className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground mb-0.5">Crie seu primeiro lead</h1>
          <p className="text-sm text-muted-foreground">Um contato ou cliente em potencial.</p>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="João Silva"
            required
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="joao@empresa.com"
            required
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-sm font-medium text-foreground">
            Empresa{" "}
            <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Empresa Ltda"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar lead e continuar →"
          )}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => router.push("/dashboard")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center disabled:opacity-50 py-1"
        >
          Pular esta etapa
        </button>
      </form>
    </div>
  )
}
