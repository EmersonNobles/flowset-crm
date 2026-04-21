import { MessageSquare } from "lucide-react"
import type { Activity } from "@/lib/mock/leads"
import { ActivityItem } from "./activity-item"

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Nenhuma atividade registrada</p>
        <p className="mt-1 text-xs text-muted-foreground">
          As atividades deste lead aparecerão aqui.
        </p>
      </div>
    )
  }

  return (
    <div>
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}
    </div>
  )
}
