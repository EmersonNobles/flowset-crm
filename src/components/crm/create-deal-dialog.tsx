"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PIPELINE_COLUMNS, OWNERS } from "@/lib/mock/deals"
import { mockLeads } from "@/lib/mock/leads"

const dealSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.number().min(1, "Valor deve ser maior que zero"),
  leadId: z.string().min(1, "Selecione um lead"),
  owner: z.string().min(1, "Selecione um responsável"),
  dueDate: z.string().min(1, "Prazo é obrigatório"),
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

const inputClass = (hasError: boolean) =>
  cn(
    "h-8 w-full rounded-lg border bg-background px-2.5 text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none focus:ring-3 focus:ring-ring/50 transition-all",
    hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-ring"
  )

const selectClass = cn(
  "h-8 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground",
  "outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all cursor-pointer"
)

interface CreateDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDealDialog({ open, onOpenChange }: CreateDealDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      value: undefined,
      leadId: "",
      owner: "",
      dueDate: "",
      stage: "novo_lead",
    },
  })

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  const onSubmit = async (data: DealFormData) => {
    await new Promise((r) => setTimeout(r, 400))
    console.log("Deal criado:", data)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md mx-4 bg-background rounded-xl shadow-xl border border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Novo Deal</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Título <span className="text-destructive">*</span>
              </label>
              <input
                {...register("title")}
                className={inputClass(!!errors.title)}
                placeholder="Ex: Licença Enterprise — Empresa X"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Value + Stage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Valor (R$) <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("value", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className={inputClass(!!errors.value)}
                  placeholder="0"
                />
                {errors.value && (
                  <p className="text-xs text-destructive">{errors.value.message}</p>
                )}
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

            {/* Lead */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Lead <span className="text-destructive">*</span>
              </label>
              <select {...register("leadId")} className={selectClass}>
                <option value="">Selecione um lead</option>
                {mockLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} — {lead.company}
                  </option>
                ))}
              </select>
              {errors.leadId && (
                <p className="text-xs text-destructive">{errors.leadId.message}</p>
              )}
            </div>

            {/* Owner + Due date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Responsável <span className="text-destructive">*</span>
                </label>
                <select {...register("owner")} className={selectClass}>
                  <option value="">Selecione</option>
                  {OWNERS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
                {errors.owner && (
                  <p className="text-xs text-destructive">{errors.owner.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Prazo <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("dueDate")}
                  type="date"
                  className={inputClass(!!errors.dueDate)}
                />
                {errors.dueDate && (
                  <p className="text-xs text-destructive">{errors.dueDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
