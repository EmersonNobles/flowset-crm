"use client"

import { Search, X } from "lucide-react"
import type { LeadStatus } from "@/lib/mock/leads"

const statusOptions: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "novo", label: "Novo" },
  { value: "contato", label: "Contato" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "ganho", label: "Ganho" },
  { value: "perdido", label: "Perdido" },
]

interface LeadsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  ownerFilter: string
  onOwnerFilterChange: (value: string) => void
  owners: string[]
}

export function LeadsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ownerFilter,
  onOwnerFilterChange,
  owners,
}: LeadsFiltersProps) {
  const hasActiveFilters =
    search !== "" || statusFilter !== "all" || ownerFilter !== "all"

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
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className={selectClass}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={ownerFilter}
        onChange={(e) => onOwnerFilterChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Todos os responsáveis</option>
        {owners.map((owner) => (
          <option key={owner} value={owner}>
            {owner}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={() => {
            onSearchChange("")
            onStatusFilterChange("all")
            onOwnerFilterChange("all")
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
