export type LeadStatus = "novo" | "contato" | "proposta" | "negociacao" | "ganho" | "perdido"
export type ActivityType = "ligacao" | "email" | "reuniao" | "nota"

export type LeadRow = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  role: string | null
  status: LeadStatus
  owner_id: string | null
  owner_email: string | null
  workspace_id: string
  created_at: string
}

export type ActivityRow = {
  id: string
  lead_id: string
  type: ActivityType
  description: string
  author_id: string | null
  author_email: string | null
  created_at: string
  workspace_id: string
}

export type MemberOption = {
  id: string
  email: string
}
