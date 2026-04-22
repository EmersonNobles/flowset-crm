"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import type { Deal, ColumnConfig } from "@/lib/mock/deals"
import { DealCard } from "./deal-card"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const headerStyles: Record<ColumnConfig["variant"], string> = {
  default: "bg-muted/50 border-border",
  success: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900",
  danger:  "bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800",
}

const dotStyles: Record<ColumnConfig["variant"], string> = {
  default: "bg-primary",
  success: "bg-green-500",
  danger:  "bg-slate-400",
}

const labelStyles: Record<ColumnConfig["variant"], string> = {
  default: "text-foreground",
  success: "text-green-800 dark:text-green-300",
  danger:  "text-slate-500 dark:text-slate-400",
}

const columnStyles: Record<ColumnConfig["variant"], string> = {
  default: "border-border",
  success: "border-green-200 dark:border-green-900",
  danger:  "border-slate-200 dark:border-slate-700",
}

interface KanbanColumnProps {
  column: ColumnConfig
  deals: Deal[]
  onCardClick: (deal: Deal) => void
}

export function KanbanColumn({ column, deals, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const dealIds = deals.map((d) => d.id)

  return (
    <div
      className={cn(
        "flex flex-col w-[272px] shrink-0 rounded-xl border bg-muted/20 overflow-hidden",
        "transition-shadow duration-150",
        columnStyles[column.variant],
        isOver && "ring-2 ring-primary/25 shadow-md"
      )}
    >
      {/* Column header */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-3 py-2.5 border-b",
          headerStyles[column.variant]
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn("size-1.5 rounded-full shrink-0", dotStyles[column.variant])} />
          <span className={cn("text-xs font-semibold truncate", labelStyles[column.variant])}>
            {column.label}
          </span>
          <span className="flex items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] tabular-nums shrink-0">
            {deals.length}
          </span>
        </div>
        <span className={cn("text-[11px] font-medium tabular-nums shrink-0 opacity-60", labelStyles[column.variant])}>
          {formatCurrency(totalValue)}
        </span>
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[80px]"
      >
        <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onCardClick={onCardClick} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-border/50">
            <p className="text-[11px] text-muted-foreground/60">Arraste um deal aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
