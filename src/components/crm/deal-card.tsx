"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Deal } from "@/lib/mock/deals"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
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

interface DealCardProps {
  deal: Deal
  onCardClick: (deal: Deal) => void
  isOverlay?: boolean
}

export function DealCard({ deal, onCardClick, isOverlay }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const overdue = isOverdue(deal.dueDate)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onCardClick(deal)}
      className={cn(
        "group relative bg-background border rounded-lg p-3 cursor-pointer select-none",
        "hover:shadow-md transition-all duration-150",
        "border-border hover:border-primary/30",
        isDragging && "opacity-40 shadow-none",
        isOverlay && "shadow-xl border-primary/40 rotate-[1.5deg] scale-[1.02]"
      )}
    >
      {/* Title */}
      <p className="text-xs font-semibold text-foreground leading-snug mb-2.5 line-clamp-2 pr-1">
        {deal.title}
      </p>

      {/* Value — Pipedrive-style destaque */}
      <p className="text-sm font-bold text-primary mb-2 tabular-nums">
        {formatCurrency(deal.value)}
      </p>

      {/* Lead name + company */}
      <p className="text-[11px] text-muted-foreground truncate mb-2.5">
        {deal.leadName}
        <span className="mx-1 opacity-50">·</span>
        {deal.leadCompany}
      </p>

      {/* Footer: prazo + owner avatar */}
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex items-center gap-1 text-[11px]",
            overdue ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {overdue ? (
            <AlertCircle className="size-3 shrink-0" />
          ) : (
            <Calendar className="size-3 shrink-0" />
          )}
          <span className="tabular-nums">{formatDate(deal.dueDate)}</span>
        </div>

        <span
          title={deal.owner}
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[9px] font-bold ring-1 ring-primary/20"
        >
          {getInitials(deal.owner)}
        </span>
      </div>
    </div>
  )
}
