"use client"

import {
  X,
  Calendar,
  User,
  Building2,
  Tag,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PIPELINE_COLUMNS, type Deal } from "@/lib/mock/deals"

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

interface DealDetailSheetProps {
  deal: Deal | null
  open: boolean
  onClose: () => void
}

export function DealDetailSheet({ deal, open, onClose }: DealDetailSheetProps) {
  const stageConfig = PIPELINE_COLUMNS.find((c) => c.id === deal?.stage)
  const overdue = deal ? isOverdue(deal.dueDate) : false

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
                {stageConfig && (
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
                  {deal.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-0.5"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Value hero */}
            <div className="px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2 mb-0.5">
                <TrendingUp className="size-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Valor do negócio</span>
              </div>
              <p className="text-2xl font-bold text-primary tabular-nums">
                {formatCurrency(deal.value)}
              </p>
            </div>

            {/* Details */}
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
