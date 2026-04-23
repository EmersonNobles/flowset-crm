"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, MailCheck } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { AuthCard } from "@/components/crm/auth-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const schema = z
  .object({
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

const inputBase =
  "w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"

export default function CadastroPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback${window.location.search}`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSentEmail(data.email)
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title="Confirme seu e-mail" description="Quase lá!">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
            <MailCheck className="size-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de confirmação para{" "}
            <span className="font-medium text-foreground">{sentEmail}</span>.
          </p>
          <p className="text-xs text-muted-foreground">
            Clique no link para ativar sua conta. Não recebeu? Verifique a pasta de spam.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Ir para o login
          </Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Criar conta" description="Comece a usar o FlowSet gratuitamente">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            disabled={loading}
            {...register("name")}
            className={cn(inputBase, errors.name ? "border-destructive focus:ring-destructive/40" : "border-border")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">E-mail</label>
          <input
            type="email"
            placeholder="voce@empresa.com"
            disabled={loading}
            {...register("email")}
            className={cn(inputBase, errors.email ? "border-destructive focus:ring-destructive/40" : "border-border")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Senha</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            disabled={loading}
            {...register("password")}
            className={cn(inputBase, errors.password ? "border-destructive focus:ring-destructive/40" : "border-border")}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Confirmar senha</label>
          <input
            type="password"
            placeholder="Repita a senha"
            disabled={loading}
            {...register("confirmPassword")}
            className={cn(inputBase, errors.confirmPassword ? "border-destructive focus:ring-destructive/40" : "border-border")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1 h-9">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Criar conta"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  )
}
