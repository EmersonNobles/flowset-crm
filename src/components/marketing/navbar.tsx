"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          Flow<span className="text-primary">Set</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="#funcionalidades" className="hover:text-foreground transition-colors">
            Funcionalidades
          </Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">
            Como funciona
          </Link>
          <Link href="#precos" className="hover:text-foreground transition-colors">
            Preços
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            Começar grátis
          </Link>
        </div>
      </nav>
    </header>
  )
}
