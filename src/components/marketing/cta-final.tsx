import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaFinal() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-primary/10 blur-3xl rounded-full scale-150" />
          <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.1] mb-6">
            Seu próximo cliente
            <br />
            <span className="text-primary">começa aqui.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
            Junte-se a times que já usam o FlowSet para organizar o caos e vender mais.
          </p>
          <Link
            href="/cadastro"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  )
}
