"use client"

import { useState } from "react"
import { Mail, Phone, Building2, Briefcase, Calendar, User, Edit, Trash2 } from "lucide-react"
import type { Lead } from "@/lib/mock/leads"
import { LeadStatusBadge } from "./lead-status-badge"
import { LeadFormDialog } from "./lead-form-dialog"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
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

interface LeadProfileCardProps {
  lead: Lead
}

export function LeadProfileCard({ lead }: LeadProfileCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="rounded-xl border border-border bg-background p-6">
        {/* Avatar + name + actions */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(lead.name)}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground leading-tight">
                {lead.name}
              </h2>
              <p className="text-sm text-muted-foreground">{lead.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <LeadStatusBadge status={lead.status} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setEditOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Edit className="size-3.5" />
            Editar
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Excluir
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-muted-foreground shrink-0" />
            <a
              href={`mailto:${lead.email}`}
              className="text-foreground hover:text-primary transition-colors truncate"
            >
              {lead.email}
            </a>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{lead.phone}</span>
            </div>
          )}
          {lead.company && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{lead.company}</span>
            </div>
          )}
          {lead.role && (
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{lead.role}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <User className="size-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">Responsável: {lead.owner}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Criado em {formatDate(lead.createdAt)}</span>
          </div>
        </div>
      </div>

      <LeadFormDialog mode="edit" lead={lead} open={editOpen} onOpenChange={setEditOpen} />
      <LeadFormDialog mode="delete" lead={lead} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  )
}
