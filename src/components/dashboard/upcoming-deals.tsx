import { Calendar, User } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { STAGE_COLORS, type Deal } from "@/lib/mock/deals"
import { cn } from "@/lib/utils"

type UpcomingDeal = Pick<Deal, "id" | "title" | "owner" | "dueDate" | "stage">

type UpcomingDealsProps = {
  deals: UpcomingDeal[]
  today: string
}

export function UpcomingDeals({ deals, today }: UpcomingDealsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Prazos Próximos</CardTitle>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum negócio com prazo próximo.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {deals.map((deal) => {
              const overdue = deal.dueDate < today
              const stage = STAGE_COLORS[deal.stage]
              const dateLabel = new Date(deal.dueDate + "T00:00:00").toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "short" }
              )

              return (
                <div
                  key={deal.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 p-3"
                  style={{ borderTopColor: stage.hex, borderTopWidth: 2 }}
                >
                  <p className="line-clamp-2 text-xs font-semibold leading-snug">
                    {deal.title}
                  </p>

                  <div className="mt-auto flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <User className="size-3 shrink-0" />
                      {deal.owner}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-[11px]",
                        overdue
                          ? "font-semibold text-red-500"
                          : "text-muted-foreground"
                      )}
                    >
                      <Calendar className="size-3 shrink-0" />
                      {dateLabel}
                      {overdue && " · Vencido"}
                    </span>
                  </div>

                  <span
                    className="w-fit rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none"
                    style={{
                      backgroundColor: stage.hex + "22",
                      color: stage.hex,
                    }}
                  >
                    {stage.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
