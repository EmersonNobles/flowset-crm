"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Lead, LeadStatus } from "@/lib/mock/leads"

const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(["novo", "contato", "proposta", "negociacao", "ganho", "perdido"]),
})

type LeadFormData = z.infer<typeof leadSchema>

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contato", label: "Contato" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "ganho", label: "Ganho" },
  { value: "perdido", label: "Perdido" },
]

export type LeadFormDialogMode = "create" | "edit" | "delete"

interface LeadFormDialogProps {
  mode: LeadFormDialogMode
  lead?: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

const inputClass = (hasError: boolean) =>
  cn(
    "h-8 w-full rounded-lg border bg-background px-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-3 focus:ring-ring/50 transition-all",
    hasError
      ? "border-destructive focus:border-destructive"
      : "border-border focus:border-ring"
  )

export function LeadFormDialog({ mode, lead, open, onOpenChange }: LeadFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", role: "", status: "novo" },
  })

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        role: lead.role,
        status: lead.status,
      })
    } else if (mode === "create") {
      reset({ name: "", email: "", phone: "", company: "", role: "", status: "novo" })
    }
  }, [open, mode, lead, reset])

  const onSubmit = async (data: LeadFormData) => {
    await new Promise((r) => setTimeout(r, 400))
    console.log("Lead salvo:", data)
    onOpenChange(false)
  }

  const onDelete = async () => {
    await new Promise((r) => setTimeout(r, 400))
    console.log("Lead excluído:", lead?.id)
    onOpenChange(false)
  }

  const title = { create: "Novo Lead", edit: "Editar Lead", delete: "Excluir Lead" }[mode]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md mx-4 bg-background rounded-xl shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {mode === "delete" ? (
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir o lead{" "}
              <span className="font-medium text-foreground">{lead?.name}</span>? Esta ação não
              pode ser desfeita.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                Excluir
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Nome <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("name")}
                  className={inputClass(!!errors.name)}
                  placeholder="Nome completo"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  E-mail <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={inputClass(!!errors.email)}
                  placeholder="email@empresa.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <input
                    {...register("phone")}
                    className={inputClass(false)}
                    placeholder="(11) 99999-0000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Empresa</label>
                  <input
                    {...register("company")}
                    className={inputClass(false)}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Cargo</label>
                  <input
                    {...register("role")}
                    className={inputClass(false)}
                    placeholder="CEO, Gerente..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select
                    {...register("status")}
                    className="h-8 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : mode === "create" ? "Criar Lead" : "Salvar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
