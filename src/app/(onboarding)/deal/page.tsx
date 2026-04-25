"use client"

import { useState, useTransition, Suspense } from "react"
import { Loader2, Kanban } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { onboardingCreateDeal } from "@/app/actions/onboarding"
import { Stepper } from "@/components/onboarding/stepper"

function DealForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useSearchParams()

  const leadId = params.get("leadId") ?? ""
  const leadName = params.get("leadName") ?? ""
  const defaultTitle = leadName ? `Proposta para ${leadName}` : ""

  function handleSubmit(formData: FormData) {
    setError(null)
    if (leadId) formData.set("leadId", leadId)
    startTransition(async () => {
      const result = await onboardingCreateDeal(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Nome do negócio <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Ex: Proposta comercial Q2"
          defaultValue={defaultTitle}
          required
          disabled={isPending}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="value" className="text-sm font-medium text-foreground">
          Valor estimado{" "}
          <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
            R$
          </span>
          <input
            id="value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-muted-foreground">
        Este negócio será criado na etapa{" "}
        <span className="text-foreground font-medium">Contato Realizado</span> do seu pipeline.
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
          "Criar negócio e ir para o dashboard →"
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
  )
}

export default function OnboardingDealPage() {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <Stepper current={4} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <Kanban className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground mb-0.5">
            Adicione ao pipeline
          </h1>
          <p className="text-sm text-muted-foreground">Crie seu primeiro negócio e comece a vender.</p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <DealForm />
      </Suspense>
    </div>
  )
}
