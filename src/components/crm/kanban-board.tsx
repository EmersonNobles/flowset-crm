"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { PIPELINE_COLUMNS, STAGE_COLORS, type Deal, type DealStage } from "@/lib/mock/deals"
import { moveDeal } from "@/app/actions/deals"
import { PageHeader } from "@/components/crm/page-header"
import { Button } from "@/components/ui/button"
import { KanbanColumn } from "./kanban-column"
import { DealFormDialog } from "@/components/pipeline/deal-form-dialog"
import { DealDetailSheet } from "./deal-detail-sheet"

type ColumnMap = Record<DealStage, Deal[]>

export type AvailableLead = { id: string; name: string; company: string }

function buildColumnMap(deals: Deal[]): ColumnMap {
  const map = {} as ColumnMap
  for (const col of PIPELINE_COLUMNS) {
    map[col.id] = deals.filter((d) => d.stage === col.id)
  }
  return map
}

function findDealStage(columns: ColumnMap, dealId: string): DealStage | undefined {
  for (const [stage, deals] of Object.entries(columns) as [DealStage, Deal[]][]) {
    if (deals.some((d) => d.id === dealId)) return stage
  }
}

function isDealStage(id: string): id is DealStage {
  return PIPELINE_COLUMNS.some((col) => col.id === id)
}

interface KanbanBoardProps {
  initialDeals: Deal[]
  availableLeads: AvailableLead[]
}

export function KanbanBoard({ initialDeals, availableLeads }: KanbanBoardProps) {
  const router = useRouter()
  const [columns, setColumns] = useState<ColumnMap>(() => buildColumnMap(initialDeals))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createStage, setCreateStage] = useState<DealStage>("novo_lead")
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

  // Sincroniza estado local quando o servidor re-renderiza com novos deals
  useEffect(() => {
    setColumns(buildColumnMap(initialDeals))
  }, [initialDeals])

  // Always-fresh ref to avoid stale closure in drag handlers
  const columnsRef = useRef(columns)
  columnsRef.current = columns
  const dragStartStageRef = useRef<DealStage | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeDeal = activeId
    ? Object.values(columns).flat().find((d) => d.id === activeId) ?? null
    : null

  function handleDragStart({ active }: DragStartEvent) {
    const id = active.id as string
    setActiveId(id)
    dragStartStageRef.current = findDealStage(columnsRef.current, id) ?? null
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    setColumns((prev) => {
      const sourceStage = findDealStage(prev, activeId)
      if (!sourceStage) return prev

      const destStage = isDealStage(overId)
        ? overId
        : findDealStage(prev, overId)

      if (!destStage || sourceStage === destStage) return prev

      const deal = prev[sourceStage].find((d) => d.id === activeId)
      if (!deal) return prev

      const destDeals = prev[destStage]
      const overIndex = destDeals.findIndex((d) => d.id === overId)
      const insertAt = overIndex >= 0 ? overIndex : destDeals.length

      return {
        ...prev,
        [sourceStage]: prev[sourceStage].filter((d) => d.id !== activeId),
        [destStage]: [
          ...destDeals.slice(0, insertAt),
          { ...deal, stage: destStage },
          ...destDeals.slice(insertAt),
        ],
      }
    })
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const activeId = active.id as string
    const startStage = dragStartStageRef.current
    dragStartStageRef.current = null
    setActiveId(null)

    if (!over) return

    const overId = over.id as string

    // columnsRef.current has been updated by DragOver — read final stage from it
    const finalStage = findDealStage(columnsRef.current, activeId)

    // Persist cross-column move to DB
    if (startStage && finalStage && finalStage !== startStage) {
      moveDeal(activeId, finalStage).catch(console.error)
      return
    }

    // Same-column reorder
    if (finalStage) {
      setColumns((prev) => {
        const stage = findDealStage(prev, activeId)
        if (!stage) return prev

        const overStage = isDealStage(overId) ? overId : findDealStage(prev, overId)
        if (overStage !== stage) return prev

        const deals = prev[stage]
        const oldIndex = deals.findIndex((d) => d.id === activeId)
        const newIndex = deals.findIndex((d) => d.id === overId)
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev
        return { ...prev, [stage]: arrayMove(deals, oldIndex, newIndex) }
      })
    }
  }

  const totalPipelineValue = Object.values(columns)
    .flat()
    .filter((d) => d.stage !== "fechado_perdido")
    .reduce((sum, d) => sum + d.value, 0)

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(totalPipelineValue)

  return (
    <>
      <div className="shrink-0 px-4 md:px-6 pt-4 md:pt-6">
        <PageHeader
          title="Pipeline"
          subtitle={`${formattedTotal} em negócios ativos`}
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Novo Deal
            </Button>
          }
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 md:px-6 pb-4 md:pb-6 scrollbar-thin">
          <div className="flex gap-2.5 h-full min-w-max py-1" style={{ touchAction: "pan-x" }}>
            {PIPELINE_COLUMNS.map((col) => (
              <SortableContext
                key={col.id}
                items={columns[col.id].map((d) => d.id)}
              >
                <KanbanColumn
                  column={col}
                  deals={columns[col.id]}
                  onCardClick={setSelectedDeal}
                  onAddDeal={(stage) => { setCreateStage(stage); setCreateOpen(true) }}
                />
              </SortableContext>
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
          {activeDeal && (() => {
            const stageHex = STAGE_COLORS[activeDeal.stage].hex
            return (
              <div
                className="bg-card border border-border/60 rounded-lg p-3 w-[272px] select-none cursor-grabbing"
                style={{
                  transform: "rotate(1.5deg) scale(1.04)",
                  boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 2px 0 0 ${stageHex}`,
                }}
              >
                <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mb-2.5">
                  {activeDeal.title}
                </p>
                <p className="font-mono text-sm font-semibold tabular-nums leading-none" style={{ color: stageHex }}>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(activeDeal.value)}
                </p>
              </div>
            )
          })()}
        </DragOverlay>
      </DndContext>

      <DealFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initialStage={createStage}
        availableLeads={availableLeads}
        onSuccess={() => router.refresh()}
      />

      <DealDetailSheet
        deal={selectedDeal}
        open={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        availableLeads={availableLeads}
        onUpdate={(updated) => {
          setSelectedDeal(updated)
          setColumns((prev) => {
            // remove from every column, then insert into the correct one
            const without = {} as ColumnMap
            for (const col of PIPELINE_COLUMNS) {
              without[col.id] = prev[col.id].filter((d) => d.id !== updated.id)
            }
            return {
              ...without,
              [updated.stage]: [...without[updated.stage], updated],
            }
          })
        }}
      />
    </>
  )
}
