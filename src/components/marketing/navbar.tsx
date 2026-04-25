"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-background/95 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight" onClick={closeMenu}>
          Flow<span className="text-primary">Set</span>
        </Link>

        {/* Desktop links */}
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

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile: CTA + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/cadastro"
            className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            Começar grátis
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
          <Link href="#funcionalidades" onClick={closeMenu} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
            Funcionalidades
          </Link>
          <Link href="#como-funciona" onClick={closeMenu} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
            Como funciona
          </Link>
          <Link href="#precos" onClick={closeMenu} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
            Preços
          </Link>
          <div className="border-t border-white/5 pt-3">
            <Link href="/login" onClick={closeMenu} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Entrar na conta
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
