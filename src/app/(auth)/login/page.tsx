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

const inputBase =
  "h-9 w-full rounded-[10px] border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-3 focus:ring-ring/50 transition-all disabled:opacity-50"

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

    const next = new URLSearchParams(window.location.search).get("next") ?? ""
    const destination = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"
    router.push(destination)
    router.refresh()
  }

  return (
    <AuthCard title="Entrar" description="Acesse sua conta FlowSet">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">E-mail</label>
          <input
            type="email"
            placeholder="voce@empresa.com"
            disabled={loading}
            {...register("email")}
            className={cn(
              inputBase,
              errors.email
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border focus:border-ring"
            )}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
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
              inputBase,
              errors.password
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border focus:border-ring"
            )}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-[10px] px-3 py-2 text-center">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1">
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
