"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PIPELINE_COLUMNS, type DealStage } from "@/lib/mock/deals"
import { createDeal } from "@/app/actions/deals"
import type { AvailableLead } from "@/components/crm/kanban-board"

const dealSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.string().min(1, "Valor é obrigatório"),
  leadId: z.string().optional(),
  dueDate: z.string().optional(),
  stage: z.enum([
    "novo_lead",
    "contato_realizado",
    "proposta_enviada",
    "negociacao",
    "fechado_ganho",
    "fechado_perdido",
  ]),
})

type DealFormData = z.infer<typeof dealSchema>

const fieldClass = (hasError: boolean) =>
  cn(
    "h-8 w-full rounded-lg border bg-background px-2.5 text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none focus:ring-3 focus:ring-ring/50 transition-all",
    hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-ring"
  )

const selectClass = cn(
  "h-8 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground",
  "outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all cursor-pointer"
)

interface DealFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStage?: DealStage
  availableLeads: AvailableLead[]
  onSuccess?: () => void
}

export function DealFormDialog({ open, onOpenChange, initialStage = "novo_lead", availableLeads, onSuccess }: DealFormDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: { title: "", value: undefined, leadId: "", dueDate: "", stage: initialStage },
  })

  useEffect(() => {
    if (open) {
      setServerError(null)
      reset({ title: "", value: undefined, leadId: "", dueDate: "", stage: initialStage })
    }
  }, [open, initialStage, reset])

  const onSubmit = (data: DealFormData) => {
    setServerError(null)
    const formData = new FormData()
    formData.set("title", data.title)
    formData.set("value", String(data.value))
    formData.set("leadId", data.leadId ?? "")
    formData.set("dueDate", data.dueDate ?? "")
    formData.set("stage", data.stage)

    startTransition(async () => {
      const result = await createDeal(formData)
      if (result?.error) setServerError(result.error)
      else {
        onOpenChange(false)
        onSuccess?.()
      }
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md mx-4 bg-card rounded-xl shadow-2xl border border-border/60 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
          <h2 className="font-display text-base font-semibold text-foreground">Novo Negócio</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Título <span className="text-destructive">*</span>
              </label>
              <input
                {...register("title")}
                className={fieldClass(!!errors.title)}
                placeholder="Ex: Licença Enterprise — Empresa X"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Valor (R$) <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("value")}
                  type="text"
                  inputMode="decimal"
                  className={fieldClass(!!errors.value)}
                  placeholder="10.000,00"
                />
                {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Etapa <span className="text-destructive">*</span>
                </label>
                <select {...register("stage")} className={selectClass}>
                  {PIPELINE_COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Lead vinculado</label>
              <select {...register("leadId")} className={selectClass}>
                <option value="">Selecione um lead (opcional)</option>
                {availableLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}{lead.company ? ` — ${lead.company}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Prazo</label>
              <input
                {...register("dueDate")}
                type="date"
                className={fieldClass(false)}
              />
            </div>

            {serverError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {serverError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/60 shrink-0">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar Negócio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
