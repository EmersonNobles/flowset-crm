import { Resend } from "resend"

const FROM = process.env.RESEND_FROM_EMAIL ?? "FlowSet CRM <onboarding@resend.dev>"

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ error: string } | null> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[resend] RESEND_API_KEY não configurada — e-mail não enviado")
    return { error: "RESEND_API_KEY não configurada" }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({ from: FROM, to, subject, html })

  if (error) {
    console.error("[sendEmail] Resend error:", error)
    return { error: error.message }
  }

  return null
}
