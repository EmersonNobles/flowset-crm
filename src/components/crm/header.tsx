"use client"

import { useState, useTransition } from "react"
import { ChevronDown, Building2, LogOut, Settings, Check, Plus, User } from "lucide-react"
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
  userEmail: string
  userName: string | null
}

export function Header({ workspaces, activeWorkspaceId, userEmail, userName }: HeaderProps) {
  const router = useRouter()
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0]
  const displayName = userName || userEmail
  const initial = displayName[0].toUpperCase()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function handleSwitch(workspaceId: string) {
    if (workspaceId === activeWorkspaceId) { setWorkspaceOpen(false); return }
    setWorkspaceOpen(false)
    startTransition(async () => { await switchWorkspace(workspaceId) })
  }

  return (
    <header className="h-14 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between shrink-0">

      {/* Workspace switcher */}
      <div className="relative ml-10 md:ml-0">
        <button
          onClick={() => setWorkspaceOpen((p) => !p)}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
        >
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-foreground max-w-[140px] truncate">{activeWorkspace?.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>

        {workspaceOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setWorkspaceOpen(false)} />
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
                  onClick={() => setWorkspaceOpen(false)}
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Plus className="size-3.5" />
                  Criar novo workspace
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Perfil do usuário */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
        >
          {/* Avatar */}
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {initial}
          </div>
          <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
            {displayName}
          </span>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-60 bg-card border border-border rounded-md shadow-lg z-20 py-1">
              {/* Info do usuário */}
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-xs font-medium text-foreground truncate">
                  {userName || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>

              <div className="py-1">
                <a
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Configurações
                </a>
                <a
                  href="/settings/team"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <User className="size-4 text-muted-foreground" />
                  Equipe
                </a>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-destructive transition-colors"
                >
                  <LogOut className="size-4 text-muted-foreground" />
                  Sair
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
