export type LeadStatus =
  | "novo"
  | "contato"
  | "proposta"
  | "negociacao"
  | "ganho"
  | "perdido"

export type ActivityType = "ligacao" | "email" | "reuniao" | "nota"

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  owner: string
  createdAt: string
}

export type Activity = {
  id: string
  leadId: string
  type: ActivityType
  description: string
  author: string
  createdAt: string
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Ana Souza",
    email: "ana.souza@alphatech.com.br",
    phone: "(11) 99123-4567",
    company: "Alpha Tech",
    role: "Diretora Comercial",
    status: "proposta",
    owner: "João Silva",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Bruno Lima",
    email: "bruno@betasolutions.com.br",
    phone: "(21) 98765-4321",
    company: "Beta Solutions",
    role: "CEO",
    status: "negociacao",
    owner: "Maria Santos",
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    name: "Carla Mendes",
    email: "carla.mendes@gammacorp.com.br",
    phone: "(31) 97654-3210",
    company: "Gamma Corp",
    role: "Gerente de Compras",
    status: "contato",
    owner: "João Silva",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Diego Ferreira",
    email: "diego@deltainc.com.br",
    phone: "(41) 96543-2109",
    company: "Delta Inc",
    role: "CTO",
    status: "novo",
    owner: "Carlos Lima",
    createdAt: "2024-01-22",
  },
  {
    id: "5",
    name: "Elena Rocha",
    email: "elena.rocha@epsilonltda.com.br",
    phone: "(51) 95432-1098",
    company: "Epsilon Ltda",
    role: "Diretora de TI",
    status: "ganho",
    owner: "Maria Santos",
    createdAt: "2024-01-25",
  },
  {
    id: "6",
    name: "Fábio Costa",
    email: "fabio@zetagrupo.com.br",
    phone: "(61) 94321-0987",
    company: "Zeta Grupo",
    role: "Sócio Fundador",
    status: "perdido",
    owner: "João Silva",
    createdAt: "2024-01-28",
  },
  {
    id: "7",
    name: "Gabriela Santos",
    email: "g.santos@etaservicos.com.br",
    phone: "(71) 93210-9876",
    company: "Eta Serviços",
    role: "Coordenadora de Projetos",
    status: "proposta",
    owner: "Carlos Lima",
    createdAt: "2024-02-01",
  },
  {
    id: "8",
    name: "Henrique Alves",
    email: "henrique@thetaconsult.com.br",
    phone: "(81) 92109-8765",
    company: "Theta Consulting",
    role: "Consultor Sênior",
    status: "contato",
    owner: "Maria Santos",
    createdAt: "2024-02-05",
  },
  {
    id: "9",
    name: "Isabela Nunes",
    email: "isabela.nunes@iotalabs.com.br",
    phone: "(91) 91098-7654",
    company: "Iota Labs",
    role: "Head de Marketing",
    status: "novo",
    owner: "Carlos Lima",
    createdAt: "2024-02-08",
  },
  {
    id: "10",
    name: "João Martins",
    email: "j.martins@kappasystems.com.br",
    phone: "(11) 90987-6543",
    company: "Kappa Systems",
    role: "Analista de Negócios",
    status: "negociacao",
    owner: "João Silva",
    createdAt: "2024-02-10",
  },
]

export const mockActivities: Activity[] = [
  {
    id: "act1",
    leadId: "1",
    type: "ligacao",
    description:
      "Primeiro contato realizado. Lead demonstrou interesse no plano Pro. Agendada demo para próxima semana.",
    author: "João Silva",
    createdAt: "2024-01-16T10:30:00Z",
  },
  {
    id: "act2",
    leadId: "1",
    type: "reuniao",
    description:
      "Demo apresentada para o time comercial. Boa recepção. Aguardando aprovação da diretoria.",
    author: "João Silva",
    createdAt: "2024-01-23T14:00:00Z",
  },
  {
    id: "act3",
    leadId: "1",
    type: "email",
    description:
      "Proposta formal enviada por e-mail com desconto de 10% para contrato anual.",
    author: "João Silva",
    createdAt: "2024-01-30T09:15:00Z",
  },
  {
    id: "act4",
    leadId: "2",
    type: "email",
    description:
      "E-mail de apresentação enviado com link para landing page e casos de sucesso.",
    author: "Maria Santos",
    createdAt: "2024-01-19T11:00:00Z",
  },
  {
    id: "act5",
    leadId: "2",
    type: "ligacao",
    description:
      "Ligação de follow-up. CEO interessado, quer ver comparativo com concorrente.",
    author: "Maria Santos",
    createdAt: "2024-01-25T16:30:00Z",
  },
  {
    id: "act6",
    leadId: "3",
    type: "nota",
    description:
      "Lead indicado por cliente atual (Elena Rocha). Tem urgência para implementar solução até Q2.",
    author: "João Silva",
    createdAt: "2024-01-21T08:00:00Z",
  },
  {
    id: "act7",
    leadId: "7",
    type: "ligacao",
    description: "Contato inicial realizado. Marcada reunião de apresentação para a próxima segunda.",
    author: "Carlos Lima",
    createdAt: "2024-02-02T10:00:00Z",
  },
  {
    id: "act8",
    leadId: "7",
    type: "reuniao",
    description: "Apresentação realizada. Time aprovou o produto. Enviando proposta formal.",
    author: "Carlos Lima",
    createdAt: "2024-02-06T15:30:00Z",
  },
]
