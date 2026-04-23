"use client"

import { useState, useTransition } from "react"
import { Loader2, Building2 } from "lucide-react"
import { createWorkspace } from "@/app/actions/workspace"

export default function CreateWorkspacePage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createWorkspace(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-xl shadow-sm p-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-sm text-primary-foreground leading-none">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">FlowSet CRM</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Crie seu workspace</h1>
            <p className="text-sm text-muted-foreground">Seu espaço para gerenciar clientes e vendas</p>
          </div>
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
            className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar workspace e começar"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
