"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { AuthCard } from "@/components/crm/auth-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const schema = z.object({
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError("E-mail ou senha incorretos.")
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <AuthCard title="Entrar" description="Acesse sua conta FlowSet">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">E-mail</label>
          <input
            type="email"
            placeholder="voce@empresa.com"
            disabled={loading}
            {...register("email")}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
              errors.email ? "border-destructive focus:ring-destructive/40" : "border-border"
            )}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Senha</label>
            <Link
              href="/recuperar-senha"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            disabled={loading}
            {...register("password")}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
              errors.password ? "border-destructive focus:ring-destructive/40" : "border-border"
            )}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1 h-9">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Entrar"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-primary font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthCard>
  )
}
