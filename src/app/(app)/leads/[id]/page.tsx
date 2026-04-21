import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { mockLeads, mockActivities } from "@/lib/mock/leads"
import { LeadProfileCard } from "@/components/leads/lead-profile-card"
import { ActivityTimeline } from "@/components/leads/activity-timeline"

interface LeadDetailPageProps {
  params: { id: string }
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const lead = mockLeads.find((l) => l.id === params.id)
  if (!lead) notFound()

  const activities = mockActivities
    .filter((a) => a.leadId === params.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Voltar para Leads
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <LeadProfileCard lead={lead} />

        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">
            Atividades
            {activities.length > 0 && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {activities.length}
              </span>
            )}
          </h3>
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  )
}
