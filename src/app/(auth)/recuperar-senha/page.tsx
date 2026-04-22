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

const schema = z.object({
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
})

type FormData = z.infer<typeof schema>

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/settings/password`,
      }
    )

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title="E-mail enviado" description="Verifique sua caixa de entrada">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
            <MailCheck className="size-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de recuperação para{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>.
          </p>
          <p className="text-xs text-muted-foreground">Não recebeu? Verifique a pasta de spam.</p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Voltar para o login
          </Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Recuperar senha"
      description="Enviaremos um link para redefinir sua senha"
    >
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

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1 h-9">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Enviar link"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Voltar para o login
        </Link>
      </p>
    </AuthCard>
  )
}
