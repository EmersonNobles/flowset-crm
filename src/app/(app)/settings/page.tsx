import Link from "next/link"
import { PageHeader } from "@/components/crm/page-header"
import { Users, CreditCard, ChevronRight } from "lucide-react"

const items = [
  {
    href: "/settings/team",
    icon: Users,
    label: "Equipe",
    description: "Gerencie membros, papéis e convites",
  },
  {
    href: "/settings/billing",
    icon: CreditCard,
    label: "Assinatura",
    description: "Plano atual, upgrade e faturamento",
  },
]

export default function SettingsPage() {
  return (
    <div className="max-w-lg">
      <PageHeader title="Configurações" subtitle="Gerencie seu workspace" />
      <div className="flex flex-col gap-2 mt-2">
        {items.map(({ href, icon: Icon, label, description }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 hover:bg-accent transition-colors"
          >
            <Icon className="size-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
