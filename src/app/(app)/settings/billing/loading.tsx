import { Skeleton } from "@/components/crm/loading-skeleton"

export default function BillingLoading() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3.5 w-32" />
        <div className="border-t border-border pt-4 space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full shrink-0" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
