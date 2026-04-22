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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-display text-sm font-semibold">
          Prazos Próximos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {deals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum negócio com prazo próximo.
          </p>
        ) : (
          <ul className="space-y-4">
            {deals.map((deal) => {
              const overdue = deal.dueDate < today
              const stage = STAGE_COLORS[deal.stage]
              const dateLabel = new Date(deal.dueDate + "T00:00:00").toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "short" }
              )

              return (
                <li key={deal.id} className="flex items-start gap-3">
                  <div
                    className="mt-1.5 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: stage.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-snug">
                      {deal.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        {deal.owner}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          overdue && "font-medium text-red-500"
                        )}
                      >
                        <Calendar className="size-3" />
                        {dateLabel}
                        {overdue && " · Vencido"}
                      </span>
                    </div>
                  </div>
                  <span
                    className="mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none"
                    style={{
                      backgroundColor: stage.hex + "22",
                      color: stage.hex,
                    }}
                  >
                    {stage.label.split(" ")[0]}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
