import {
  Users,
  Kanban,
  BarChart3,
  Building2,
  MessageSquare,
  CreditCard,
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Gestão de Leads",
    description:
      "Cadastre, filtre e acompanhe todos os seus contatos em um só lugar. Busca rápida, status personalizados e histórico completo.",
  },
  {
    icon: Kanban,
    title: "Pipeline Kanban",
    description:
      "Visualize e mova seus negócios entre etapas com drag-and-drop. Do primeiro contato ao fechamento, tudo sob controle.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Métricas",
    description:
      "Funil de vendas, taxa de conversão e valor do pipeline em tempo real. Tome decisões com dados, não com achismos.",
  },
  {
    icon: Building2,
    title: "Multi-empresa",
    description:
      "Crie workspaces separados para cada cliente ou empresa. Convide membros do time e defina permissões por papel.",
  },
  {
    icon: MessageSquare,
    title: "Registro de Atividades",
    description:
      "Documente ligações, reuniões, e-mails e notas em uma timeline cronológica por lead. Nunca perca o contexto.",
  },
  {
    icon: CreditCard,
    title: "Planos Flexíveis",
    description:
      "Comece grátis com até 50 leads e 2 membros. Faça upgrade para o Pro quando seu negócio crescer.",
  },
]

export function Features() {
  return (
    <section id="funcionalidades" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Tudo que você precisa para vender mais
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sem complexidade desnecessária. Cada funcionalidade foi desenhada para ajudar você a fechar negócios mais rápido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-primary/30 rounded-xl p-6 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
