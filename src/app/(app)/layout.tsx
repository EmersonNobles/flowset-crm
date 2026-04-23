import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"
import { Sidebar } from "@/components/crm/sidebar"
import { Header } from "@/components/crm/header"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()

  if (workspaces.length === 0) {
    redirect("/workspace")
  }

  const activeWorkspaceId = getActiveWorkspaceId(workspaces)!
  const userName = (user.user_metadata?.name as string | undefined) ?? null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          userEmail={user.email ?? ""}
          userName={userName}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
