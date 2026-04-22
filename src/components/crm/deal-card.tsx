"use client"

import { useState, useEffect, useRef } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, AlertCircle, MoreHorizontal, Pencil, ArrowRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { STAGE_COLORS, PIPELINE_COLUMNS, type Deal } from "@/lib/mock/deals"

const OVERDUE_HEX = "#FF4757"

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

function ActionMenu({ stageHex }: { stageHex: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const actions = [
    { icon: Pencil,     label: "Editar",    onClick: () => {} },
    { icon: ArrowRight, label: "Mover para", onClick: () => {} },
    { icon: Trash2,     label: "Excluir",   onClick: () => {}, destructive: true },
  ]

  return (
    <div
      ref={ref}
      className="relative"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-white/10 text-muted-foreground hover:text-foreground"
        )}
      >
        <MoreHorizontal className="size-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-20 w-36 rounded-lg border border-border bg-card shadow-xl py-1">
          {actions.map(({ icon: Icon, label, onClick, destructive }) => (
            <button
              key={label}
              onClick={() => { onClick(); setOpen(false) }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors",
                destructive
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-foreground hover:bg-white/5"
              )}
            >
              <Icon className="size-3" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
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
  const stageHex = STAGE_COLORS[deal.stage].hex
  const dueDateColor = overdue ? OVERDUE_HEX : undefined

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onCardClick(deal)}
      className={cn(
        "group relative bg-card border border-border/60 rounded-lg p-3 cursor-pointer select-none",
        "transition-all duration-150",
        "hover:border-border hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
        isDragging && "opacity-30",
        isOverlay && "cursor-grabbing"
      )}
      style={{
        transform: isOverlay
          ? "rotate(1.5deg) scale(1.04)"
          : CSS.Transform.toString(transform) ?? undefined,
        transition,
        boxShadow: isOverlay
          ? `0 20px 40px rgba(0,0,0,0.5), inset 0 2px 0 0 ${stageHex}`
          : `inset 0 2px 0 0 ${stageHex}`,
      }}
    >
      {/* Title row + action menu */}
      <div className="flex items-start justify-between gap-1 mb-2.5">
        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 flex-1">
          {deal.title}
        </p>
        {!isOverlay && <ActionMenu stageHex={stageHex} />}
      </div>

      {/* Lead avatar + name */}
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="flex size-4 shrink-0 items-center justify-center rounded-sm text-[8px] font-bold"
          style={{ backgroundColor: stageHex + "22", color: stageHex }}
        >
          {getInitials(deal.leadName)}
        </span>
        <span className="text-[11px] text-muted-foreground truncate">
          {deal.leadName}
          <span className="opacity-50 mx-1">·</span>
          {deal.leadCompany}
        </span>
      </div>

      {/* Value — IBM Plex Mono, stage color */}
      <p
        className="font-mono text-sm font-semibold mb-2.5 tabular-nums leading-none"
        style={{ color: stageHex }}
      >
        {formatCurrency(deal.value)}
      </p>

      {/* Footer: owner + due date */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">
          {deal.owner}
        </span>

        <div
          className="flex items-center gap-1 text-[11px] tabular-nums shrink-0"
          style={{ color: dueDateColor ?? "rgb(var(--muted-foreground) / 1)" }}
        >
          {overdue ? (
            <>
              <AlertCircle className="size-3 shrink-0" />
              <span>{formatDate(deal.dueDate)}</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none"
                style={{ backgroundColor: OVERDUE_HEX + "22", color: OVERDUE_HEX }}
              >
                Vencido
              </span>
            </>
          ) : (
            <>
              <Calendar className="size-3 shrink-0" />
              <span>{formatDate(deal.dueDate)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
