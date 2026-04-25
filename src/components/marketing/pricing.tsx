import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "R$0",
    period: "para sempre",
    description: "Para freelancers e quem está começando.",
    highlight: false,
    cta: "Começar grátis",
    ctaHref: "/cadastro",
    features: [
      "Até 2 membros no workspace",
      "Até 50 leads",
      "Pipeline Kanban",
      "Registro de atividades",
      "Dashboard básico",
    ],
  },
  {
    name: "Pro",
    price: "R$49",
    period: "por mês",
    description: "Para times que querem crescer sem limites.",
    highlight: true,
    badge: "Mais popular",
    cta: "Assinar Pro",
    ctaHref: "/cadastro?plan=pro",
    features: [
      "Membros ilimitados",
      "Leads ilimitados",
      "Pipeline Kanban",
      "Registro de atividades",
      "Dashboard completo com métricas",
      "Múltiplos workspaces",
      "Suporte prioritário",
    ],
  },
]

export function Pricing() {
  return (
    <section id="precos" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Preço simples, sem surpresas
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Comece grátis e faça upgrade quando precisar. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all ${
                plan.highlight
                  ? "mt-4 md:mt-0 bg-primary/10 border-primary/40 shadow-lg shadow-primary/10"
                  : "bg-white/[0.03] border-white/[0.07]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="font-display font-bold text-lg mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display font-extrabold text-4xl">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        plan.highlight ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className={plan.highlight ? "text-foreground" : "text-muted-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`block text-center font-semibold text-sm py-3 rounded-lg transition-opacity hover:opacity-90 ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
