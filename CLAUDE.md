# FlowSet CRM — Briefing do Projeto

Plataforma SaaS multi-empresa de gestão de clientes e vendas para PMEs, freelancers e times comerciais. Oferece pipeline Kanban, gestão de leads, registro de atividades, dashboard de métricas e assinatura via Stripe.

PRD completo: [docs/PRD.md](docs/PRD.md)

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 — App Router |
| Linguagem | TypeScript 5 (strict) |
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Auth + DB | Supabase (PostgreSQL + RLS + Auth) |
| Pagamentos | Stripe (Checkout + Webhooks + Customer Portal) |
| E-mail | Resend |
| Drag-and-drop | @dnd-kit |
| Gráficos | Recharts |
| Deploy | Vercel (frontend) + Supabase (backend/DB) |

---

## Estrutura de Pastas

```
src/
  app/                  # Next.js App Router — rotas e layouts
    (auth)/             # login, cadastro
    (app)/              # área autenticada
      dashboard/
      leads/
      pipeline/
      settings/
    (marketing)/        # landing page pública
  components/
    ui/                 # shadcn/ui primitivos
    crm/                # componentes de domínio (KanbanBoard, LeadCard, ActivityTimeline…)
  lib/
    supabase/           # cliente + tipos gerados
    stripe/             # helpers de checkout e webhooks
    resend/             # templates de e-mail
  hooks/                # React hooks customizados
  types/                # tipos TypeScript globais
docs/                   # PRD e documentação
supabase/
  migrations/           # SQL migrations
  functions/            # Edge Functions (ex: stripe-webhook)
  seed.sql
```

---

## Convenções de Código

- **TypeScript strict** — sempre tipar props, retornos de funções e dados vindos do Supabase
- **Server Components por padrão** — `"use client"` apenas onde houver interatividade ou hooks
- **Tailwind + shadcn/ui** para todo estilo — sem CSS Modules ou styled-components
- **Nomes de arquivos:** kebab-case (`lead-card.tsx`); **componentes:** PascalCase (`LeadCard`)
- **`NEXT_PUBLIC_`** apenas para variáveis seguras de expor ao browser
- Sem comentários óbvios — código legível por si só; comentar apenas lógica não-óbvia

---

## Identidade Visual

- **Referências:** HubSpot CRM (clareza/limpeza) + Pipedrive (pipeline Kanban intuitivo)
- **Paleta:** azul/indigo para ações primárias (`primary`), cinza neutro para backgrounds (`muted`)
- **Tipografia:** Inter (padrão shadcn/ui)
- **Layout:** sidebar lateral fixa com navegação principal e switcher de workspace no topo

---

## Modelo de Dados (Supabase)

| Tabela | Descrição |
|--------|-----------|
| `workspaces` | Empresas/times — unidade de isolamento de dados |
| `workspace_members` | Relação usuário ↔ workspace com `role: admin \| member` |
| `leads` | Contatos/clientes vinculados a um workspace |
| `deals` | Negócios no pipeline, vinculados a lead + workspace |
| `activities` | Interações (ligação, e-mail, reunião, nota) vinculadas a lead |
| `subscriptions` | Plano atual do workspace (`free \| pro`) sincronizado via Stripe webhook |

Toda leitura/escrita usa **RLS** — nenhuma query acontece sem o usuário estar autenticado e pertencer ao workspace correto.

---

## Planos de Assinatura

| Plano | Membros | Leads | Preço |
|-------|---------|-------|-------|
| Free | até 2 | até 50 | R$0 |
| Pro | ilimitados | ilimitados | R$49/mês |

Upgrade via **Stripe Checkout**; gestão via **Stripe Customer Portal**; ativação automática via **Supabase Edge Function** (webhook).

---

## Marcos de Desenvolvimento

1. Setup do projeto (Next.js + Supabase + Auth)
2. Multi-empresa + convite por e-mail (Resend)
3. Gestão de Leads (CRUD + busca/filtros)
4. Pipeline Kanban (@dnd-kit + persistência)
5. Registro de Atividades + Timeline
6. Dashboard de Métricas (Recharts)
7. Monetização com Stripe
8. Landing Page
9. Onboarding do usuário
10. Testes, ajustes e deploy

---

## Comandos Úteis

```bash
npm run dev           # servidor de desenvolvimento
npm run build         # build de produção
npm run lint          # ESLint

npx supabase start    # Supabase local (requer Docker)
npx supabase db push  # aplicar migrations no banco remoto
npx supabase gen types typescript --local > src/types/supabase.ts  # gerar tipos
```
