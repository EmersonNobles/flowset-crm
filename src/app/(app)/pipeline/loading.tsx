import { Skeleton } from "@/components/crm/loading-skeleton"
import { PIPELINE_COLUMNS } from "@/lib/mock/deals"

export default function PipelineLoading() {
  return (
    <div className="flex flex-col h-full -m-4 md:-m-6">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-6 pt-4 md:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-9 w-28 shrink-0" />
        </div>
      </div>

      {/* Kanban columns skeleton */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 md:px-6 pb-4 md:pb-6">
        <div className="flex gap-2.5 h-full min-w-max py-1">
          {PIPELINE_COLUMNS.map((col) => (
            <div
              key={col.id}
              className="flex flex-col w-[240px] sm:w-[272px] shrink-0 rounded-xl border border-white/10 bg-card/50 overflow-hidden"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/7">
                <Skeleton className="h-3.5 flex-1" />
                <Skeleton className="h-5 w-7 rounded" />
                <Skeleton className="h-3.5 w-12" />
              </div>
              {/* Cards */}
              <div className="p-2 space-y-2">
                {Array.from({ length: Math.floor(Math.random() * 2) + 1 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border/40 bg-card p-3 space-y-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
