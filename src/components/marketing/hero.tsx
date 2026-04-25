import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Grátis para começar · Sem cartão de crédito
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
          CRM que acompanha
          <br />
          <span className="text-primary">o ritmo do seu negócio</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Gerencie leads, acompanhe negócios no pipeline Kanban e feche mais vendas.
          Simples o suficiente para freelancers, poderoso o suficiente para times.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cadastro"
            className="group flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#como-funciona"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-3.5"
          >
            <Play className="w-4 h-4" />
            Ver como funciona
          </Link>
        </div>

        {/* App screenshot mockup */}
        <div className="relative mt-16 md:mt-20 max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            {/* Window chrome */}
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-md h-5 text-xs text-muted-foreground flex items-center justify-center">
                app.flowset.com.br/pipeline
              </div>
            </div>

            {/* Mock pipeline UI — scrollável em mobile */}
            <div className="bg-background p-4 md:p-6 h-56 sm:h-72 md:h-96 overflow-x-auto overflow-y-hidden">
              <div className="flex gap-3 md:gap-4 h-full min-w-[560px]">
                {[
                  { label: "Novo Lead", color: "#6366f1", count: 4 },
                  { label: "Proposta Enviada", color: "#CAFF33", count: 2 },
                  { label: "Negociação", color: "#f59e0b", count: 3 },
                  { label: "Fechado Ganho", color: "#22c55e", count: 5 },
                ].map((col) => (
                  <div key={col.label} className="flex-1 min-w-[130px]">
                    <div
                      className="text-xs font-semibold mb-3 pb-2 border-b truncate"
                      style={{ color: col.color, borderColor: `${col.color}30` }}
                    >
                      {col.label}
                      <span className="ml-1.5 text-muted-foreground font-normal">({col.count})</span>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: Math.min(col.count, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-lg p-2.5 md:p-3 text-xs"
                          style={{
                            background: `${col.color}08`,
                            boxShadow: `inset 3px 0 0 ${col.color}`,
                          }}
                        >
                          <div className="font-medium text-foreground/80 mb-1 truncate">
                            {["Renovação Anual", "Consultoria Q2", "Expansão de Licenças", "Novo Projeto"][i % 4]}
                          </div>
                          <div className="font-mono text-muted-foreground">
                            {["R$ 8.400", "R$ 15.000", "R$ 22.000", "R$ 5.500"][i % 4]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow under screenshot */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/20 blur-2xl rounded-full" />
        </div>
      </div>
    </section>
  )
}
