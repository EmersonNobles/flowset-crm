import { Building2, UserPlus, TrendingUp } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Crie seu workspace",
    description:
      "Cadastre-se, crie seu workspace com o nome da sua empresa e convide seu time em menos de 2 minutos.",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Adicione seus leads",
    description:
      "Importe contatos existentes ou adicione manualmente. Registre atividades e mantenha o histórico organizado.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Feche negócios",
    description:
      "Mova deals pelo Kanban, acompanhe métricas no dashboard e tome decisões baseadas em dados reais.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-28 px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Do cadastro ao fechamento em 3 passos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Configuração mínima, resultados rápidos. Você começa a usar de verdade no primeiro dia.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-9 h-9 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-background border border-white/10 flex items-center justify-center">
                      <span className="font-mono text-[10px] font-bold text-primary">{i + 1}</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-primary/60 mb-2">{step.number}</div>
                  <h3 className="font-display font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
