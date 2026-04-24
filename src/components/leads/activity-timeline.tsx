import { MessageSquare } from "lucide-react"
import type { ActivityRow } from "@/types/leads"
import { ActivityItem } from "./activity-item"
import { ActivityForm } from "./activity-form"

interface ActivityTimelineProps {
  activities: ActivityRow[]
  leadId: string
  currentUserId: string
}

export function ActivityTimeline({ activities, leadId, currentUserId }: ActivityTimelineProps) {
  return (
    <div className="space-y-5">
      <ActivityForm leadId={leadId} />

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Nenhuma atividade registrada</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use o botão acima para registrar a primeira atividade.
          </p>
        </div>
      ) : (
        <div>
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === activities.length - 1}
              canDelete={activity.author_id === currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
