"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadFormDialog } from "./lead-form-dialog"

export function LeadsCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Novo Lead
      </Button>
      <LeadFormDialog mode="create" open={open} onOpenChange={setOpen} />
    </>
  )
}
