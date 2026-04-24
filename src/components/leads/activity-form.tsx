"use client"

import { useTransition, useState, useRef } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createActivity } from "@/app/actions/activities"
import type { ActivityType } from "@/types/leads"

const TYPES: { value: ActivityType; label: string }[] = [
  { value: "ligacao",  label: "Ligação"  },
  { value: "email",    label: "E-mail"   },
  { value: "reuniao",  label: "Reunião"  },
  { value: "nota",     label: "Nota"     },
]

const selectClass = cn(
  "h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground",
  "outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all cursor-pointer"
)

interface ActivityFormProps {
  leadId: string
}

export function ActivityForm({ leadId }: ActivityFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await createActivity(leadId, formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      setOpen(false)
      if (textareaRef.current) textareaRef.current.value = ""
      if (typeRef.current) typeRef.current.value = "ligacao"
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors">
          <Plus className="size-4" />
        </span>
        Registrar atividade
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-muted-foreground shrink-0">Tipo</label>
        <select ref={typeRef} name="type" defaultValue="ligacao" className={selectClass}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <textarea
        ref={textareaRef}
        name="description"
        required
        rows={3}
        placeholder="Descreva a atividade..."
        className={cn(
          "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
          "placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-all"
        )}
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => { setOpen(false); setError(null) }}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Salvando..." : "Registrar"}
        </Button>
      </div>
    </form>
  )
}
