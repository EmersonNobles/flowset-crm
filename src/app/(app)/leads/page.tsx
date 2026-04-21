"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { mockLeads } from "@/lib/mock/leads"
import { PageHeader } from "@/components/crm/page-header"
import { LeadsFilters } from "@/components/leads/leads-filters"
import { LeadsTable } from "@/components/leads/leads-table"
import { LeadFormDialog } from "@/components/leads/lead-form-dialog"
import { Button } from "@/components/ui/button"

const allOwners = [...new Set(mockLeads.map((l) => l.owner))].sort()

export default function LeadsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = mockLeads.filter((lead) => {
    const q = search.toLowerCase()
    const matchesSearch =
      q === "" ||
      lead.name.toLowerCase().includes(q) ||
      lead.company.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesOwner = ownerFilter === "all" || lead.owner === ownerFilter
    return matchesSearch && matchesStatus && matchesOwner
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Gerencie seus contatos e clientes"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            Novo Lead
          </Button>
        }
      />

      <LeadsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        ownerFilter={ownerFilter}
        onOwnerFilterChange={setOwnerFilter}
        owners={allOwners}
      />

      <LeadsTable
        key={`${search}-${statusFilter}-${ownerFilter}`}
        leads={filtered}
      />

      <LeadFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
