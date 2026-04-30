"use client"

import Link from "next/link"
import { Zap, X } from "lucide-react"
import { useState } from "react"

type Props = {
  current: number
  limit: number
  resource: "leads" | "membros"
}

export function UpgradeBanner({ current, limit, resource }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const pct = Math.round((current / limit) * 100)
  const isAtLimit = current >= limit
  const label = resource === "leads" ? "leads" : "membros"

  return (
    <div
      className={`flex items-start gap-3 rounded-[14px] border px-4 py-3 text-sm ${
        isAtLimit
          ? "border-destructive/30 bg-destructive/10 text-brand-creme"
          : "border-primary/30 bg-primary/10 text-brand-creme"
      }`}
    >
      <Zap className={`size-4 shrink-0 mt-0.5 ${isAtLimit ? "text-destructive" : "text-primary"}`} />
      <div className="flex-1 min-w-0">
        {isAtLimit ? (
          <span>
            Você atingiu o limite de <strong>{limit} {label}</strong> do plano Free.{" "}
            <Link href="/settings/billing" className="underline font-semibold hover:opacity-80">
              Faça upgrade para o Pro
            </Link>{" "}
            para continuar adicionando.
          </span>
        ) : (
          <span>
            Você está usando <strong>{current} de {limit} {label}</strong> ({pct}%) do plano Free.{" "}
            <Link href="/settings/billing" className="underline font-semibold hover:opacity-80">
              Faça upgrade
            </Link>{" "}
            para ter {label} ilimitados.
          </span>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fechar"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
