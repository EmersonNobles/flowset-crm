"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { AuthCard } from "@/components/crm/auth-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const schema = z
  .object({
    password: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
    confirm: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  })

type FormData = z.infer<typeof schema>

export default function NovaSenhaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError("Link de recuperação inválido ou expirado. Solicite um novo link.")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  if (done) {
    return (
      <AuthCard title="Senha atualizada!" description="Sua nova senha foi salva com sucesso">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
            <CheckCircle2 className="size-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Redirecionando para o login…
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Redefinir senha"
      description="Escolha uma nova senha para a sua conta"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Nova senha</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Confirmar senha</label>
          <input
            type="password"
            placeholder="Repita a nova senha"
            disabled={loading}
            {...register("confirm")}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
              errors.confirm ? "border-destructive focus:ring-destructive/40" : "border-border"
            )}
          />
          {errors.confirm && (
            <p className="text-xs text-destructive">{errors.confirm.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-1 h-9">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Salvar nova senha"}
        </Button>
      </form>
    </AuthCard>
  )
}
