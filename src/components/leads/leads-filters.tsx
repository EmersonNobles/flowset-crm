"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import type { MemberOption } from "@/types/leads"

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "novo", label: "Novo" },
  { value: "contato", label: "Contato" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "ganho", label: "Ganho" },
  { value: "perdido", label: "Perdido" },
]

interface LeadsFiltersProps {
  owners: MemberOption[]
  currentQ: string
  currentStatus: string
  currentOwner: string
}

export function LeadsFilters({ owners, currentQ, currentStatus, currentOwner }: LeadsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(currentQ)
  const hasActiveFilters = search !== "" || currentStatus !== "all" || currentOwner !== "all"

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") params.delete(key)
      else params.set(key, value)
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  // Debounce search input → URL
  useEffect(() => {
    const timer = setTimeout(() => pushParams({ q: search }), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const selectClass =
    "h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all cursor-pointer"

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por nome, empresa ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all"
        />
      </div>

      <select
        value={currentStatus}
        onChange={(e) => pushParams({ status: e.target.value })}
        className={selectClass}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={currentOwner}
        onChange={(e) => pushParams({ owner: e.target.value })}
        className={selectClass}
      >
        <option value="all">Todos os responsáveis</option>
        {owners.map((m) => (
          <option key={m.id} value={m.id}>
            {m.email}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={() => {
            setSearch("")
            pushParams({ q: "", status: "", owner: "" })
          }}
          className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
          Limpar
        </button>
      )}
    </div>
  )
}
