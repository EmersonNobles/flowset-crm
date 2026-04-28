"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { STAGE_COLORS, type Deal, type ColumnConfig } from "@/lib/mock/deals"
import { DealCard } from "./deal-card"

const CHARTREUSE = "#CAFF33"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface KanbanColumnProps {
  column: ColumnConfig
  deals: Deal[]
  onCardClick: (deal: Deal) => void
  onAddDeal: (stage: ColumnConfig["id"]) => void
}

export function KanbanColumn({ column, deals, onCardClick, onAddDeal }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const stageHex = STAGE_COLORS[column.id].hex
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const dealIds = deals.map((d) => d.id)

  return (
    <div
      className={cn(
        "flex flex-col w-[240px] sm:w-[272px] shrink-0 rounded-xl border bg-card/50 overflow-hidden",
        "transition-all duration-150"
      )}
      style={{
        borderColor: isOver ? CHARTREUSE : "rgb(255 255 255 / 0.08)",
        boxShadow: isOver ? `0 0 0 1px ${CHARTREUSE}44` : undefined,
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b"
        style={{
          borderBottomColor: "rgb(255 255 255 / 0.07)",
          borderTopWidth: 2,
          borderTopStyle: "solid",
          borderTopColor: stageHex,
        }}
      >
        <span
          className="text-xs font-display font-semibold flex-1 truncate"
          style={{ color: stageHex }}
        >
          {column.label}
        </span>

        <span
          className="flex items-center justify-center rounded text-[10px] font-bold px-1.5 min-w-[20px] h-5 tabular-nums"
          style={{
            backgroundColor: stageHex + "18",
            color: stageHex,
          }}
        >
          {deals.length}
        </span>

        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
          {formatCurrency(totalValue)}
        </span>

        <button
          onClick={() => onAddDeal(column.id)}
          className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-white/10 shrink-0"
          title={`Novo deal em ${column.label}`}
        >
          <Plus className="size-3.5" />
        </button>
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
          <div className="flex items-center justify-center h-16 rounded-lg border border-dashed border-white/10">
            <p className="text-[11px] text-muted-foreground/40">Arraste um deal aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
