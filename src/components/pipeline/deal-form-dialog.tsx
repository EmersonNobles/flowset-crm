"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PIPELINE_COLUMNS, OWNERS, type DealStage } from "@/lib/mock/deals"
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
  notes: z.string().optional(),
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
}

export function DealFormDialog({ open, onOpenChange, initialStage = "novo_lead" }: DealFormDialogProps) {
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
      stage: initialStage,
      notes: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        value: undefined,
        leadId: "",
        owner: "",
        dueDate: "",
        stage: initialStage,
        notes: "",
      })
    }
  }, [open, initialStage, reset])

  const onSubmit = async (data: DealFormData) => {
    await new Promise((r) => setTimeout(r, 400))
    console.log("Deal criado:", data)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md mx-4 bg-card rounded-xl shadow-2xl border border-border/60 max-h-[90vh] flex flex-col">
        {/* Header */}
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
            {/* Title */}
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

            {/* Value + Stage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Valor estimado (R$) <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("value", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className={fieldClass(!!errors.value)}
                  placeholder="0"
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

            {/* Lead */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Lead vinculado <span className="text-destructive">*</span>
              </label>
              <select {...register("leadId")} className={selectClass}>
                <option value="">Selecione um lead</option>
                {mockLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} — {lead.company}
                  </option>
                ))}
              </select>
              {errors.leadId && <p className="text-xs text-destructive">{errors.leadId.message}</p>}
            </div>

            {/* Owner + Due date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Responsável</label>
                <select {...register("owner")} className={selectClass}>
                  <option value="">Selecione</option>
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {errors.owner && <p className="text-xs text-destructive">{errors.owner.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Prazo</label>
                <input
                  {...register("dueDate")}
                  type="date"
                  className={fieldClass(!!errors.dueDate)}
                />
                {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Observações</label>
              <textarea
                {...register("notes")}
                rows={3}
                className={cn(
                  fieldClass(false),
                  "h-auto resize-none py-2 leading-relaxed"
                )}
                placeholder="Contexto, detalhes relevantes..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border/60 shrink-0">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Negócio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
