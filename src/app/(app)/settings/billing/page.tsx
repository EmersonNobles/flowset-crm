import { createCheckoutSession, createPortalSession } from "@/app/actions/billing"
import { adminClient } from "@/lib/supabase/admin"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import { PageHeader } from "@/components/crm/page-header"
import { CheckCircle2, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getBillingData() {
  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) return null

  const { data: sub } = await adminClient
    .from("subscriptions")
    .select("plan, status, current_period_end, stripe_customer_id")
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  return { sub, workspaceId }
}

const PRO_FEATURES = [
  "Leads ilimitados",
  "Membros ilimitados",
  "Pipeline Kanban completo",
  "Dashboard de métricas",
  "Suporte prioritário",
]

const FREE_FEATURES = [
  "Até 50 leads",
  "Até 2 membros",
  "Pipeline Kanban",
  "Dashboard de métricas",
]

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const data = await getBillingData()
  const plan = data?.sub?.plan ?? "free"
  const isPro = plan === "pro"
  const hasPortal = !!data?.sub?.stripe_customer_id

  const periodEnd = data?.sub?.current_period_end
    ? new Date(data.sub.current_period_end).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Configurações
        </Link>
        <PageHeader title="Assinatura" subtitle="Gerencie seu plano e faturamento" />
      </div>

      {searchParams.success === "1" && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="size-4 shrink-0" />
          Assinatura ativada com sucesso! Bem-vindo ao Pro.
        </div>
      )}

      {searchParams.canceled === "1" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O checkout foi cancelado. Seu plano não foi alterado.
        </div>
      )}

      {/* Plano atual */}
      <div className="rounded-lg border border-border bg-card p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
              Plano atual
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {isPro ? "Pro" : "Free"}
              </span>
              {isPro && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  <Zap className="size-3" />
                  Ativo
                </span>
              )}
            </div>
            {isPro && periodEnd && (
              <p className="text-xs text-muted-foreground mt-1">
                Renova em {periodEnd}
              </p>
            )}
            {!isPro && (
              <p className="text-xs text-muted-foreground mt-1">
                Grátis para sempre
              </p>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">
            {isPro ? (
              <>R$49<span className="text-base font-normal text-muted-foreground">/mês</span></>
            ) : "R$0"}
          </p>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <ul className="space-y-2">
            {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ações */}
      {!isPro && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Zap className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Faça upgrade para o Pro</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Leads e membros ilimitados por R$49/mês.
              </p>
            </div>
          </div>
          <form action={createCheckoutSession}>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Assinar Pro — R$49/mês
            </button>
          </form>
        </div>
      )}

      {isPro && hasPortal && (
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-1">Gerenciar assinatura</p>
          <p className="text-xs text-muted-foreground mb-4">
            Altere o método de pagamento, veja faturas ou cancele pelo portal do Stripe.
          </p>
          <form action={createPortalSession}>
            <button
              type="submit"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Abrir portal de faturamento
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
