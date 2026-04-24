"use client"

import { useEffect, useState, useTransition } from "react"
import {
  X,
  Calendar,
  User,
  Building2,
  Tag,
  FileText,
  AlertCircle,
  TrendingUp,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PIPELINE_COLUMNS, type Deal, type DealStage } from "@/lib/mock/deals"
import { updateDeal } from "@/app/actions/deals"
import type { AvailableLead } from "@/components/crm/kanban-board"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isOverdue(dateString: string): boolean {
  return new Date(dateString + "T23:59:59") < new Date()
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const fieldClass = (hasError?: boolean) =>
  cn(
    "h-8 w-full rounded-lg border bg-background px-2.5 text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none focus:ring-3 focus:ring-ring/50 transition-all",
    hasError ? "border-destructive" : "border-border focus:border-ring"
  )

const selectClass = cn(
  "h-8 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground",
  "outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all cursor-pointer"
)

interface DealDetailSheetProps {
  deal: Deal | null
  open: boolean
  onClose: () => void
  availableLeads: AvailableLead[]
  onUpdate: (updated: Deal) => void
}

export function DealDetailSheet({
  deal,
  open,
  onClose,
  availableLeads,
  onUpdate,
}: DealDetailSheetProps) {
  const [editing, setEditing] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // form state mirrors the deal fields
  const [form, setForm] = useState({
    title: "",
    value: 0,
    leadId: "",
    dueDate: "",
    stage: "novo_lead" as DealStage,
  })

  useEffect(() => {
    if (deal) {
      setForm({
        title: deal.title,
        value: deal.value,
        leadId: deal.leadId ?? "",
        dueDate: deal.dueDate ?? "",
        stage: deal.stage,
      })
    }
    setEditing(false)
    setServerError(null)
  }, [deal])

  function handleSave() {
    if (!deal) return
    const formData = new FormData()
    formData.set("title", form.title)
    formData.set("value", String(form.value))
    formData.set("leadId", form.leadId)
    formData.set("dueDate", form.dueDate)
    formData.set("stage", form.stage)

    startTransition(async () => {
      const result = await updateDeal(deal.id, formData)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      const leadInfo = availableLeads.find((l) => l.id === form.leadId)
      onUpdate({
        ...deal,
        title: form.title,
        value: form.value,
        leadId: form.leadId,
        leadName: leadInfo?.name ?? deal.leadName,
        leadCompany: leadInfo?.company ?? deal.leadCompany,
        dueDate: form.dueDate,
        stage: form.stage,
      })
      setEditing(false)
    })
  }

  const stageConfig = PIPELINE_COLUMNS.find((c) => c.id === deal?.stage)
  const overdue = deal?.dueDate ? isOverdue(deal.dueDate) : false

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[360px] flex-col bg-background border-l border-border shadow-2xl",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {deal && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-border shrink-0">
              <div className="min-w-0">
                {stageConfig && !editing && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        stageConfig.variant === "success" ? "bg-green-500" :
                        stageConfig.variant === "danger"  ? "bg-slate-400" :
                        "bg-primary"
                      )}
                    />
                    <span className="text-xs text-muted-foreground">{stageConfig.label}</span>
                  </div>
                )}
                <h2 className="text-sm font-semibold text-foreground leading-snug">
                  {editing ? "Editar Negócio" : deal.title}
                </h2>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {editing ? (
              /* ── Edit mode ─────────────────────────────────────── */
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Título *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className={fieldClass(!form.title)}
                      placeholder="Título do negócio"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Valor (R$)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.value}
                        onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                        className={fieldClass()}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Etapa</label>
                      <select
                        value={form.stage}
                        onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as DealStage }))}
                        className={selectClass}
                      >
                        {PIPELINE_COLUMNS.map((col) => (
                          <option key={col.id} value={col.id}>{col.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Lead vinculado</label>
                    <select
                      value={form.leadId}
                      onChange={(e) => setForm((f) => ({ ...f, leadId: e.target.value }))}
                      className={selectClass}
                    >
                      <option value="">Nenhum lead vinculado</option>
                      {availableLeads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name}{lead.company ? ` — ${lead.company}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Prazo</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                      className={fieldClass()}
                    />
                  </div>

                  {serverError && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                      {serverError}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditing(false); setServerError(null) }}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isPending || !form.title}>
                    {isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            ) : (
              /* ── View mode ─────────────────────────────────────── */
              <>
                <div className="px-5 py-4 border-b border-border shrink-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <TrendingUp className="size-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">Valor do negócio</span>
                  </div>
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {formatCurrency(deal.value)}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <SheetRow
                    icon={User}
                    label="Lead"
                    value={
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[9px] font-bold">
                          {getInitials(deal.leadName)}
                        </span>
                        {deal.leadName}
                      </div>
                    }
                  />

                  <SheetRow icon={Building2} label="Empresa" value={deal.leadCompany} />

                  <SheetRow
                    icon={User}
                    label="Responsável"
                    value={
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-foreground text-[9px] font-bold">
                          {getInitials(deal.owner)}
                        </span>
                        {deal.owner}
                      </div>
                    }
                  />

                  <SheetRow
                    icon={Tag}
                    label="Etapa"
                    value={stageConfig?.label ?? deal.stage}
                  />

                  {deal.dueDate && (
                    <SheetRow
                      icon={overdue ? AlertCircle : Calendar}
                      label="Prazo"
                      value={
                        <span className={cn(overdue && "text-destructive")}>
                          {formatDate(deal.dueDate)}
                          {overdue && (
                            <span className="ml-1.5 text-[11px] font-medium bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full">
                              Vencido
                            </span>
                          )}
                        </span>
                      }
                      iconClassName={overdue ? "text-destructive" : undefined}
                    />
                  )}

                  {deal.notes && (
                    <div className="pt-1 border-t border-border">
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="size-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Notas</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg px-3 py-2.5">
                        {deal.notes}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

function SheetRow({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  iconClassName?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className={cn("size-4 text-muted-foreground mt-0.5 shrink-0", iconClassName)} />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  )
}
