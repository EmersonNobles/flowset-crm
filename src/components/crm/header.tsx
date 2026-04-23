"use client"

import { useState, useTransition } from "react"
import { ChevronDown, Building2, LogOut, User, Check, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { switchWorkspace } from "@/app/actions/workspace"
import { cn } from "@/lib/utils"

type WorkspaceBasic = {
  id: string
  name: string
  slug: string
  plan: string
}

interface HeaderProps {
  workspaces: WorkspaceBasic[]
  activeWorkspaceId: string
}

export function Header({ workspaces, activeWorkspaceId }: HeaderProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function handleSwitch(workspaceId: string) {
    if (workspaceId === activeWorkspaceId) {
      setDropdownOpen(false)
      return
    }
    setDropdownOpen(false)
    startTransition(async () => {
      await switchWorkspace(workspaceId)
    })
  }

  return (
    <header className="h-14 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between shrink-0">
      {/* Workspace switcher */}
      <div className="relative ml-10 md:ml-0">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
        >
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-foreground max-w-[140px] truncate">{activeWorkspace?.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute left-0 top-full mt-1 w-56 bg-card border border-border rounded-md shadow-lg z-20 py-1">
              <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Workspaces
              </p>
              {workspaces.map((ws) => {
                const isActive = ws.id === activeWorkspaceId
                return (
                  <button
                    key={ws.id}
                    onClick={() => handleSwitch(ws.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2",
                      isActive ? "text-primary font-medium" : "text-foreground"
                    )}
                  >
                    <span className="flex-1 truncate">{ws.name}</span>
                    {isActive && <Check className="size-3.5 text-primary shrink-0" />}
                    {ws.plan === "pro" && (
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
                        Pro
                      </span>
                    )}
                  </button>
                )
              })}
              <div className="border-t border-border mt-1 pt-1">
                <a
                  href="/workspace"
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors flex items-center gap-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Plus className="size-3.5" />
                  Criar novo workspace
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User area */}
      <div className="flex items-center gap-2">
        <a
          href="/settings/team"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Equipe</span>
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  )
}
