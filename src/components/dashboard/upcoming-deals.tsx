import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { STAGE_COLORS, type Deal } from "@/lib/mock/deals"
import { cn } from "@/lib/utils"

type UpcomingDeal = Pick<
  Deal,
  "id" | "title" | "leadName" | "leadCompany" | "stage" | "dueDate" | "value"
>

type UpcomingDealsProps = {
  deals: UpcomingDeal[]
  today: string
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  })
}

function formatDate(dateString: string): string {
  return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

export function UpcomingDeals({ deals, today }: UpcomingDealsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Prazos Próximos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-1">
            <p className="text-sm font-medium text-muted-foreground">Sem prazos próximos</p>
            <p className="text-xs text-muted-foreground/60">Adicione datas de vencimento aos seus deals.</p>
          </div>
        ) : (
          <>
            {/* ── Mobile: cards ── */}
            <div className="sm:hidden divide-y divide-border">
              {deals.map((deal) => {
                const overdue = deal.dueDate < today
                const stage = STAGE_COLORS[deal.stage]
                return (
                  <Link
                    key={deal.id}
                    href="/pipeline"
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-foreground line-clamp-1">{deal.title}</span>
                        <span
                          className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: stage.hex + "22", color: stage.hex }}
                        >
                          {stage.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{deal.leadName}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={cn(
                          "flex items-center gap-1 text-xs",
                          overdue ? "font-semibold text-red-500" : "text-muted-foreground"
                        )}>
                          {overdue && <AlertCircle className="size-3 shrink-0" />}
                          {deal.dueDate ? formatDate(deal.dueDate) : "—"}
                          {overdue && <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">Vencido</span>}
                        </span>
                        <span className="font-mono text-xs font-semibold" style={{ color: stage.hex }}>
                          {formatBRL(deal.value)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* ── Desktop: tabela ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">Negócio</th>
                    <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">Lead</th>
                    <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">Etapa</th>
                    <th className="h-9 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">Prazo</th>
                    <th className="h-9 px-4 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, index) => {
                    const overdue = deal.dueDate < today
                    const stage = STAGE_COLORS[deal.stage]
                    return (
                      <tr
                        key={deal.id}
                        className={cn(
                          "border-b border-border last:border-0 transition-colors hover:bg-muted/30",
                          index % 2 !== 0 && "bg-muted/10"
                        )}
                      >
                        <td className="px-4 py-3 font-medium">
                          <Link href="/pipeline" className="line-clamp-1 max-w-[200px] hover:text-primary hover:underline underline-offset-4 transition-colors">
                            {deal.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-foreground">{deal.leadName}</span>
                          <p className="mt-0.5 text-xs text-muted-foreground">{deal.leadCompany}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: stage.hex + "22", color: stage.hex }}>
                            {stage.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn("flex items-center gap-1 text-sm", overdue ? "font-semibold text-red-500" : "text-muted-foreground")}>
                            {overdue && <AlertCircle className="size-3.5 shrink-0" />}
                            {formatDate(deal.dueDate)}
                            {overdue && <span className="ml-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-red-500">Vencido</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-mono text-sm font-semibold" style={{ color: stage.hex }}>{formatBRL(deal.value)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
