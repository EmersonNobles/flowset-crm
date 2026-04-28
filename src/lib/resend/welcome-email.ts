import { sendEmail } from "./send-email"

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string
  name: string
}): Promise<{ error: string } | null> {
  const displayName = name || to.split("@")[0]

  return sendEmail({
    to,
    subject: "Bem-vindo ao FlowSet CRM!",
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e4e4e7;overflow:hidden">
        <!-- Header -->
        <tr>
          <td style="background:#18181b;padding:24px 32px">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.5px">FlowSet CRM</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 8px;font-size:22px;color:#18181b;font-weight:700">Bem-vindo, ${esc(displayName)}!</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.6">
              Sua conta no FlowSet CRM está ativa. Agora você pode criar seu workspace e começar a gerenciar seus leads e negócios.
            </p>
            <!-- Feature list -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f4f4f5">
                  <span style="font-size:14px;color:#18181b;font-weight:600">📋 Gestão de Leads</span>
                  <p style="margin:2px 0 0;font-size:13px;color:#71717a">Cadastre e acompanhe todos os seus contatos</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f4f4f5">
                  <span style="font-size:14px;color:#18181b;font-weight:600">🗂️ Pipeline Kanban</span>
                  <p style="margin:2px 0 0;font-size:13px;color:#71717a">Visualize e mova negócios entre etapas com drag-and-drop</p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0">
                  <span style="font-size:14px;color:#18181b;font-weight:600">📊 Dashboard de Métricas</span>
                  <p style="margin:2px 0 0;font-size:13px;color:#71717a">Acompanhe conversão, valor do pipeline e prazos</p>
                </td>
              </tr>
            </table>
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/onboarding/workspace"
               style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600">
              Criar meu workspace
            </a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #e4e4e7">
            <p style="margin:0;font-size:12px;color:#a1a1aa">
              FlowSet CRM — Gestão de clientes e vendas para times
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}
