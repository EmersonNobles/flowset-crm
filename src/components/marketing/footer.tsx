import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display font-bold text-lg tracking-tight">
            Flow<span className="text-primary">Set</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FlowSet. Todos os direitos reservados.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link href="/privacidade" className="hover:text-foreground transition-colors">
            Privacidade
          </Link>
          <Link href="/termos" className="hover:text-foreground transition-colors">
            Termos de uso
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Entrar
          </Link>
        </div>
      </div>
    </footer>
  )
}
