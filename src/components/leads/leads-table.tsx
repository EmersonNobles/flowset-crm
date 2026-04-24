"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadRow } from "@/types/leads"
import { LeadStatusBadge } from "./lead-status-badge"

const PAGE_SIZE = 8

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

interface LeadsTableProps {
  leads: LeadRow[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedLeads = leads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-foreground">Nenhum lead encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tente ajustar os filtros ou crie um novo lead.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                <span className="flex items-center gap-1">
                  Nome <ArrowUpDown className="size-3" />
                </span>
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                Empresa
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                E-mail
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                Status
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                Responsável
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                <span className="flex items-center gap-1">
                  Data <ArrowUpDown className="size-3" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className={cn(
                  "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                  index % 2 !== 0 && "bg-muted/10"
                )}
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="text-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                  >
                    {lead.name}
                  </Link>
                  {lead.role && (
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">{lead.role}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">{lead.company ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">
                  {lead.owner_email ? (
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                        {getInitials(lead.owner_email)}
                      </span>
                      <span className="text-sm text-foreground truncate max-w-[140px]">
                        {lead.owner_email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(lead.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {leads.length} lead{leads.length !== 1 ? "s" : ""} · Página {currentPage} de{" "}
          {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "flex size-7 items-center justify-center rounded-md text-sm transition-colors",
                p === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
