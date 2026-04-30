export type DealStage =
  | "novo_lead"
  | "contato_realizado"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido"

export type Deal = {
  id: string
  title: string
  value: number
  leadId: string
  leadName: string
  leadCompany: string
  owner: string
  stage: DealStage
  dueDate: string
  createdAt: string
  notes?: string
}

export type StageColor = {
  hex: string
  label: string
}

export const STAGE_COLORS: Record<DealStage, StageColor> = {
  novo_lead:         { hex: "#3B82F6", label: "Novo Lead"           },
  contato_realizado: { hex: "#06B6D4", label: "Contato Realizado"   },
  proposta_enviada:  { hex: "#4AE68A", label: "Proposta Enviada"    },
  negociacao:        { hex: "#F97316", label: "Negociação"          },
  fechado_ganho:     { hex: "#22C55E", label: "Fechado Ganho"       },
  fechado_perdido:   { hex: "#FF4757", label: "Fechado Perdido"     },
}

export type ColumnVariant = "default" | "success" | "danger"

export type ColumnConfig = {
  id: DealStage
  label: string
  variant: ColumnVariant
}

export const PIPELINE_COLUMNS: ColumnConfig[] = [
  { id: "novo_lead",         label: "Novo Lead",           variant: "default" },
  { id: "contato_realizado", label: "Contato Realizado",   variant: "default" },
  { id: "proposta_enviada",  label: "Proposta Enviada",    variant: "default" },
  { id: "negociacao",        label: "Negociação",          variant: "default" },
  { id: "fechado_ganho",     label: "Fechado Ganho",       variant: "success" },
  { id: "fechado_perdido",   label: "Fechado Perdido",     variant: "danger"  },
]

export const OWNERS = ["João Silva", "Maria Santos", "Carlos Lima"] as const

export const mockDeals: Deal[] = [
  // ── Novo Lead ────────────────────────────────────────────────
  {
    id: "deal-1",
    title: "Implementação CRM — Alpha Tech",
    value: 25000,
    leadId: "1",
    leadName: "Ana Souza",
    leadCompany: "Alpha Tech",
    owner: "João Silva",
    stage: "novo_lead",
    dueDate: "2026-06-15",
    createdAt: "2026-04-01",
    notes: "Lead indicado pela diretoria. Alta prioridade para Q2.",
  },
  {
    id: "deal-2",
    title: "Automação de Marketing — Iota Labs",
    value: 12000,
    leadId: "9",
    leadName: "Isabela Nunes",
    leadCompany: "Iota Labs",
    owner: "Carlos Lima",
    stage: "novo_lead",
    dueDate: "2026-07-01",
    createdAt: "2026-04-05",
  },
  {
    id: "deal-3",
    title: "Sistema ERP — Delta Inc",
    value: 18000,
    leadId: "4",
    leadName: "Diego Ferreira",
    leadCompany: "Delta Inc",
    owner: "Carlos Lima",
    stage: "novo_lead",
    dueDate: "2026-06-30",
    createdAt: "2026-04-08",
  },

  // ── Contato Realizado ─────────────────────────────────────────
  {
    id: "deal-4",
    title: "Plano Pro Anual — Beta Solutions",
    value: 28000,
    leadId: "2",
    leadName: "Bruno Lima",
    leadCompany: "Beta Solutions",
    owner: "Maria Santos",
    stage: "contato_realizado",
    dueDate: "2026-05-20",
    createdAt: "2026-03-20",
    notes: "CEO quer comparativo com concorrente antes de decidir.",
  },
  {
    id: "deal-5",
    title: "Integração API — Eta Serviços",
    value: 15000,
    leadId: "7",
    leadName: "Gabriela Santos",
    leadCompany: "Eta Serviços",
    owner: "Carlos Lima",
    stage: "contato_realizado",
    dueDate: "2026-05-28",
    createdAt: "2026-03-25",
  },
  {
    id: "deal-6",
    title: "Consultoria Inicial — Theta Consulting",
    value: 9000,
    leadId: "8",
    leadName: "Henrique Alves",
    leadCompany: "Theta Consulting",
    owner: "Maria Santos",
    stage: "contato_realizado",
    dueDate: "2026-05-15",
    createdAt: "2026-03-28",
  },

  // ── Proposta Enviada ──────────────────────────────────────────
  {
    id: "deal-7",
    title: "Licença Enterprise — Gamma Corp",
    value: 45000,
    leadId: "3",
    leadName: "Carla Mendes",
    leadCompany: "Gamma Corp",
    owner: "João Silva",
    stage: "proposta_enviada",
    dueDate: "2026-05-30",
    createdAt: "2026-03-10",
    notes: "Proposta com desconto de 10% para contrato anual. Aguardando diretoria.",
  },
  {
    id: "deal-8",
    title: "Expansão de Usuários — Alpha Tech",
    value: 18000,
    leadId: "1",
    leadName: "Ana Souza",
    leadCompany: "Alpha Tech",
    owner: "João Silva",
    stage: "proposta_enviada",
    dueDate: "2026-06-10",
    createdAt: "2026-03-15",
  },
  {
    id: "deal-9",
    title: "Software de Gestão — Kappa Systems",
    value: 22000,
    leadId: "10",
    leadName: "João Martins",
    leadCompany: "Kappa Systems",
    owner: "João Silva",
    stage: "proposta_enviada",
    dueDate: "2026-04-10",
    createdAt: "2026-03-01",
    notes: "Prazo vencido. Aguardando retorno do cliente.",
  },

  // ── Negociação ────────────────────────────────────────────────
  {
    id: "deal-10",
    title: "Contrato Anual Pro — Beta Solutions",
    value: 49000,
    leadId: "2",
    leadName: "Bruno Lima",
    leadCompany: "Beta Solutions",
    owner: "Maria Santos",
    stage: "negociacao",
    dueDate: "2026-05-10",
    createdAt: "2026-02-20",
    notes: "Negociando desconto adicional de 5%. Decisão esta semana.",
  },
  {
    id: "deal-11",
    title: "Plano Empresarial — Epsilon Ltda",
    value: 38000,
    leadId: "5",
    leadName: "Elena Rocha",
    leadCompany: "Epsilon Ltda",
    owner: "Maria Santos",
    stage: "negociacao",
    dueDate: "2026-05-05",
    createdAt: "2026-02-25",
  },
  {
    id: "deal-12",
    title: "Pacote Completo — Zeta Grupo",
    value: 28000,
    leadId: "6",
    leadName: "Fábio Costa",
    leadCompany: "Zeta Grupo",
    owner: "João Silva",
    stage: "negociacao",
    dueDate: "2026-04-05",
    createdAt: "2026-02-10",
    notes: "Prazo vencido. Cliente solicitou revisão de escopo.",
  },

  // ── Fechado Ganho ─────────────────────────────────────────────
  {
    id: "deal-13",
    title: "CRM Pro Anual — Epsilon Ltda",
    value: 49000,
    leadId: "5",
    leadName: "Elena Rocha",
    leadCompany: "Epsilon Ltda",
    owner: "Maria Santos",
    stage: "fechado_ganho",
    dueDate: "2026-03-01",
    createdAt: "2026-01-15",
    notes: "Contrato assinado. Onboarding agendado para abril.",
  },
  {
    id: "deal-14",
    title: "Plano Pro — Eta Serviços",
    value: 18000,
    leadId: "7",
    leadName: "Gabriela Santos",
    leadCompany: "Eta Serviços",
    owner: "Carlos Lima",
    stage: "fechado_ganho",
    dueDate: "2026-03-15",
    createdAt: "2026-01-20",
  },

  // ── Fechado Perdido ───────────────────────────────────────────
  {
    id: "deal-15",
    title: "ERP Integration — Zeta Grupo",
    value: 15000,
    leadId: "6",
    leadName: "Fábio Costa",
    leadCompany: "Zeta Grupo",
    owner: "João Silva",
    stage: "fechado_perdido",
    dueDate: "2026-02-28",
    createdAt: "2025-12-10",
    notes: "Cliente optou por solução concorrente.",
  },
  {
    id: "deal-16",
    title: "Sistema de Vendas — Delta Inc",
    value: 12000,
    leadId: "4",
    leadName: "Diego Ferreira",
    leadCompany: "Delta Inc",
    owner: "Carlos Lima",
    stage: "fechado_perdido",
    dueDate: "2026-02-15",
    createdAt: "2025-12-15",
    notes: "Budget cortado no Q1. Reavaliar no próximo ciclo.",
  },
]
