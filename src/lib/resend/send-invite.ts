import { sendEmail } from "./send-email"

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

export async function sendInviteEmail({
  to,
  workspaceName,
  invitedByEmail,
  acceptUrl,
  role,
}: {
  to: string
  workspaceName: string
  invitedByEmail: string
  acceptUrl: string
  role: string
}): Promise<{ error: string } | null> {
  const rolePt = role === "admin" ? "Administrador" : "Membro"

  return sendEmail({
    to,
    subject: `Você foi convidado para ${esc(workspaceName)} no FlowSet CRM`,
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
            <h1 style="margin:0 0 8px;font-size:22px;color:#18181b;font-weight:700">Você foi convidado!</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.6">
              <strong style="color:#18181b">${esc(invitedByEmail)}</strong> convidou você para colaborar no workspace
              <strong style="color:#18181b">${esc(workspaceName)}</strong> como <strong style="color:#18181b">${esc(rolePt)}</strong>.
            </p>
            <a href="${acceptUrl}"
               style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600">
              Aceitar convite
            </a>
            <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">
              Este link expira em 7 dias. Se você não esperava este convite, pode ignorar este e-mail.
            </p>
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
