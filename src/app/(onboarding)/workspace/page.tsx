"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { createWorkspaceOnboarding } from "@/app/actions/onboarding"
import { Stepper } from "@/components/onboarding/stepper"

export default function CreateWorkspacePage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createWorkspaceOnboarding(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <Stepper current={1} />

      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-foreground mb-1">Crie seu workspace</h1>
        <p className="text-sm text-muted-foreground">Seu espaço para gerenciar clientes e vendas.</p>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome do workspace
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ex: Minha Empresa Ltda"
            required
            minLength={2}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            Pode ser o nome da sua empresa, time ou projeto.
          </p>
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
            "Continuar →"
          )}
        </button>
      </form>
    </div>
  )
}
