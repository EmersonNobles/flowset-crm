"use client"

import { useTransition } from "react"
import { Phone, Mail, Calendar, FileText, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { deleteActivity } from "@/app/actions/activities"
import type { ActivityRow, ActivityType } from "@/types/leads"

const typeConfig: Record<
  ActivityType,
  { icon: React.ElementType; label: string; iconClass: string }
> = {
  ligacao: {
    icon: Phone,
    label: "Ligação",
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  email: {
    icon: Mail,
    label: "E-mail",
    iconClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  reuniao: {
    icon: Calendar,
    label: "Reunião",
    iconClass: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  nota: {
    icon: FileText,
    label: "Nota",
    iconClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoje"
  if (diffDays === 1) return "Ontem"
  if (diffDays < 7) return `há ${diffDays} dias`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `há ${weeks} semana${weeks > 1 ? "s" : ""}`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `há ${months} mês${months > 1 ? "es" : ""}`
  }
  const years = Math.floor(diffDays / 365)
  return `há ${years} ano${years > 1 ? "s" : ""}`
}

interface ActivityItemProps {
  activity: ActivityRow
  isLast?: boolean
  canDelete?: boolean
}

export function ActivityItem({ activity, isLast, canDelete }: ActivityItemProps) {
  const config = typeConfig[activity.type]
  const Icon = config.icon
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteActivity(activity.id, activity.lead_id)
    })
  }

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            config.iconClass
          )}
        >
          <Icon className="size-4" />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border min-h-4" />}
      </div>
      <div className={cn("min-w-0 pb-5 flex-1", isLast && "pb-0")}>
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-sm font-medium text-foreground">{config.label}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{activity.author_email ?? "—"}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{formatRelativeDate(activity.created_at)}</span>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="ml-auto opacity-0 group-hover:opacity-100 flex size-5 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
      </div>
    </div>
  )
}
