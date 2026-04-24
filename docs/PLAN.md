# FlowSet CRM — Plano de Execução

> **Estratégia:** UI-first — construímos todas as telas com dados mock antes de conectar qualquer backend. Isso permite validar a experiência visual rapidamente e desenvolver frontend e backend de forma independente.

---

## Visão Geral das Fases

| Fase | Foco | Milestones |
|------|------|-----------|
| 1 | Fundação | M0 — Setup, M1 — Design System |
| 2 | Interface (UI-First) | M2 — Layout App, M3 — Leads UI, M4 — Pipeline UI, M5 — Dashboard UI |
| 3 | Backend & Auth | M6 — Auth + Supabase, M7 — Schema + RLS, M8 — Multi-empresa |
| 4 | Conectar Frontend ao Backend | M9 — Leads real, M10 — Pipeline real, M11 — Atividades, M12 — Dashboard real |
| 5 | Monetização & E-mail | M13 — Stripe, M14 — Resend |
| 6 | Produto Completo | M15 — Landing Page, M16 — Onboarding, M17 — Deploy |

---

## FASE 1 — Fundação

---

### M0 — Setup do Projeto

**Branch:** `setup/project-base`

**Objetivo:** Repositório funcional com Next.js 14, TypeScript, Tailwind e shadcn/ui configurados. Base de desenvolvimento pronta antes de escrever qualquer feature.

**Entregas:**
- [x] Inicializar Next.js 14 com App Router e TypeScript strict
- [x] Configurar Tailwind CSS v3
- [x] Instalar e inicializar shadcn/ui (tema padrão, cor: indigo)
- [x] Criar estrutura de pastas conforme `CLAUDE.md` (`src/app`, `src/components`, `src/lib`, `src/hooks`, `src/types`)
- [x] Configurar ESLint + Prettier com regras do projeto
- [x] Criar `.env.example` com todas as variáveis necessárias
- [x] Criar `.env.local` (ignorado pelo git) para desenvolvimento
- [x] Configurar `tsconfig.json` com path aliases (`@/` → `src/`)
- [x] Validar `npm run dev`, `npm run build` e `npm run lint` sem erros

**Commit final:**
```
chore: setup inicial do projeto — Next.js 14, TypeScript, Tailwind, shadcn/ui
```

---

### M1 — Design System & Layout Base

**Branch:** `feat/design-system`

**Objetivo:** Definir tokens visuais e construir o shell da aplicação (sidebar + header) que vai envolver todas as páginas da área autenticada.

**Entregas:**
- [x] Definir paleta de cores no `tailwind.config.ts` (primary: indigo-600, background: slate-50, muted: slate-100)
- [x] Configurar fonte Inter via `next/font`
- [x] Criar componente `Sidebar` com links de navegação (Dashboard, Leads, Pipeline, Configurações)
- [x] Criar componente `Header` com área de workspace switcher (mock por agora)
- [x] Criar layout `src/app/(app)/layout.tsx` com sidebar + header + conteúdo
- [x] Criar layout `src/app/(auth)/layout.tsx` centralizado
- [x] Criar componente `EmptyState` reutilizável (ícone + título + descrição + CTA)
- [x] Criar componente `PageHeader` reutilizável (título + subtítulo + botão de ação)
- [x] Verificar responsividade básica no mobile (sidebar colapsável)

**Commit final:**
```
feat: design system base — paleta, tipografia, sidebar, header e layouts
```

---

## FASE 2 — Interface (UI-First com Dados Mock)

> Todas as telas desta fase usam dados estáticos em TypeScript (`src/lib/mock-data.ts`). Nenhuma chamada real ao banco.

---

### M2 — Tela de Login e Cadastro (UI)

**Branch:** `feat/auth-ui`

**Objetivo:** Telas de autenticação visualmente completas, prontas para receber a lógica do Supabase Auth na Fase 3.

**Entregas:**
- [x] Tela `/login` — campos e-mail + senha, link "esqueci minha senha", link para cadastro
- [x] Tela `/cadastro` — campos nome, e-mail, senha + confirmar senha
- [x] Tela `/recuperar-senha` — campo e-mail, mensagem de confirmação
- [x] Componente `AuthCard` reutilizável para envolver os formulários
- [x] Validação de formulário com `react-hook-form` + `zod` (sem submit real)
- [x] Feedback visual de loading state nos botões

**Commit final:**
```
feat: telas de autenticação (UI) — login, cadastro e recuperação de senha
```

---

### M3 — Gestão de Leads (UI)

**Branch:** `feat/leads-ui`

**Objetivo:** Telas completas de listagem e detalhe de leads com dados mock, incluindo busca, filtros e formulário de criação.

**Entregas:**
- [x] Criar mock data de leads em `src/lib/mock/leads.ts`
- [x] Tela `/leads` — tabela de leads com colunas: nome, empresa, e-mail, status, responsável, data
- [x] Componente `LeadStatusBadge` com cores por status (Novo, Contato, Proposta, Negociação, Ganho, Perdido)
- [x] Componente `LeadsFilters` — busca (input com ícone) + filtros por status e responsável em um único componente
- [x] Componente `LeadFormDialog` — formulário de criar, editar e deletar lead (nome, e-mail, telefone, empresa, cargo, status)
- [x] Tela `/leads/[id]` — perfil completo do lead com `LeadProfileCard` lateral + seção de atividades
- [x] Componente `LeadProfileCard` — card lateral no detalhe do lead com todos os dados
- [x] Componente `ActivityTimeline` — timeline estática com atividades mock no detalhe do lead
- [x] Componente `ActivityItem` — item individual da timeline (ícone por tipo, autor, data relativa)

**Commit final:**
```
feat: gestão de leads (UI) — listagem, filtros, detalhe e modal de criação
```

---

### M4 — Pipeline Kanban (UI)

**Branch:** `feat/pipeline-ui` → refinamento visual em `feat/brand-identity-v2`

**Objetivo:** Board Kanban visual e funcional com drag-and-drop entre colunas, usando dados mock. A lógica de persistência vem na Fase 4.

**Entregas:**
- [x] Instalar `@dnd-kit/core` e `@dnd-kit/sortable`
- [x] Criar mock data de deals em `src/lib/mock/deals.ts` com `STAGE_COLORS` por etapa
- [x] Tela `/pipeline` — board horizontal com 6 colunas: Novo Lead, Contato Realizado, Proposta Enviada, Negociação, Fechado Ganho, Fechado Perdido
- [x] Componente `KanbanColumn` — cabeçalho colorido por etapa, contador, valor total, botão "+" para criar deal na etapa
- [x] Componente `DealCard` — accent line via `inset box-shadow`, valor em IBM Plex Mono, badge "Vencido", `ActionMenu` (⋮)
- [x] Drag-and-drop funcional entre colunas (`PointerSensor` + `TouchSensor` para mobile)
- [x] `DragOverlay` com card rotacionado (`rotate(1.5deg) scale(1.04)`) e cor por etapa
- [x] `DealFormDialog` em `src/components/pipeline/` — campos: título, valor, lead, responsável, prazo, etapa, observações
- [x] Pre-seleção de etapa ao clicar no "+" da coluna
- [x] Sidebar deslizante `DealDetailSheet` ao clicar no card — exibe todos os dados do deal
- [x] Identidade visual v2: fontes Syne + DM Sans + IBM Plex Mono, chartreuse `#CAFF33` como primary, noise texture

**Commits:**
```
feat: pipeline kanban (UI) — board com drag-and-drop, deal cards e modais
feat(brand): identidade visual v2 — fontes, stage colors e pipeline redesign
```

---

### M5 — Dashboard de Métricas (UI)

**Branch:** `feat/dashboard-ui`

**Objetivo:** Dashboard com todos os cards e gráficos preenchidos com dados mock, prontos para receber dados reais na Fase 4.

**Entregas:**
- [x] Instalar `recharts`
- [x] Tela `/dashboard` como página inicial da área autenticada
- [x] Componente `MetricCard` — ícone, label, valor principal, variação percentual (↑↓)
- [x] 4 cards de métricas: Total de Leads, Negócios Abertos, Valor do Pipeline (R$), Taxa de Conversão (%)
- [x] Gráfico de funil de vendas com Recharts (BarChart vertical, barras coloridas por stage, tooltip com contagem e valor total)
- [x] Seção "Prazos Próximos" — tabela com colunas Negócio / Lead / Etapa / Prazo / Valor, deals vencidos em vermelho, clique no negócio vai para `/pipeline`
- [x] Seletor de período (Esta semana / Este mês / Este trimestre) — visual apenas

**Commits:**
```
feat: dashboard de métricas (UI) — cards, gráfico de funil e deals próximos
refactor(dashboard): gráfico com barras verticais full-width, prazos abaixo
feat(dashboard): labels horizontais, tooltip com valor por etapa e tabela de prazos
feat(dashboard): link no nome do negócio direciona para /pipeline
```

---

## FASE 3 — Backend & Autenticação

---

### M6 — Supabase Auth

**Branch:** `feat/supabase-auth`

**Objetivo:** Autenticação real com Supabase conectada às telas da Fase 2. Usuário consegue criar conta, fazer login e ter sessão persistida.

**Entregas:**
- [x] Criar projeto no Supabase (ou configurar local com Docker)
- [x] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [x] Criar clientes Supabase: `src/lib/supabase/client.ts` (browser, lazy singleton) e `src/lib/supabase/server.ts` (RSC/actions, async)
- [x] Criar `src/middleware.ts` para proteger rotas da área `(app)` e redirecionar para `/login`
- [x] Conectar formulário de cadastro ao `supabase.auth.signUp()`
- [x] Conectar formulário de login ao `supabase.auth.signInWithPassword()`
- [x] Conectar recuperação de senha ao `supabase.auth.resetPasswordForEmail()`
- [x] Criar rota de callback `/auth/callback` para confirmar e-mail
- [x] Botão de logout no header conectado ao `supabase.auth.signOut()`
- [ ] Gerar tipos TypeScript: `npx supabase gen types typescript` (pendente — aguarda M7 criar as tabelas)

**Commit final:**
```
feat: autenticação real com Supabase — login, cadastro, logout e proteção de rotas
```

---

### M7 — Schema do Banco + RLS

**Branch:** `feat/database-schema`

**Objetivo:** Todas as tabelas criadas via migrations com políticas RLS garantindo isolamento por workspace.

**Entregas:**
- [x] Migration `001_create_workspaces.sql` — tabela `workspaces` (id, name, slug, plan, created_at)
- [x] Migration `002_create_workspace_members.sql` — tabela `workspace_members` (workspace_id, user_id, role, invited_email, status)
- [x] Migration `003_create_leads.sql` — tabela `leads` (id, workspace_id, name, email, phone, company, role, status, owner_id, created_at)
- [x] Migration `004_create_deals.sql` — tabela `deals` (id, workspace_id, lead_id, title, value, stage, owner_id, due_date, created_at)
- [x] Migration `005_create_activities.sql` — tabela `activities` (id, lead_id, workspace_id, type, description, author_id, created_at)
- [x] Migration `006_create_subscriptions.sql` — tabela `subscriptions` (workspace_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
- [x] Políticas RLS em todas as tabelas: usuário só acessa dados do workspace do qual é membro (`007_rls_policies.sql` + função `is_workspace_member`)
- [x] Índices nas colunas mais consultadas (`workspace_id`, `lead_id`, `owner_id`, `status`, `stage`, `due_date`)
- [ ] Arquivo `supabase/seed.sql` com dados de teste para desenvolvimento
- [x] Aplicar migrations: `npx supabase db push` — 7 migrations aplicadas com sucesso
- [x] Gerar tipos TypeScript: `npx supabase gen types typescript` → `src/types/supabase.ts`

**Commit final:**
```
feat: schema completo do banco — migrations, RLS policies e seed de desenvolvimento
```

---

### M8 — Multi-empresa e Workspaces

**Branch:** `feat/multi-empresa`

**Objetivo:** Usuário consegue criar workspace, convidar membros por e-mail (Resend) e alternar entre workspaces.

**Entregas:**
- [x] Instalar `resend`
- [x] Tela `/onboarding/workspace` — criar primeiro workspace após cadastro
- [x] Server Action `createWorkspace` — cria workspace + adiciona criador como admin
- [x] Workspace switcher no header conectado a workspaces reais do usuário
- [x] Tela `/settings/team` — listar membros + botão "Convidar por e-mail"
- [x] Server Action `inviteMember` — cria registro em `workspace_members` com status `pending` e envia e-mail via Resend
- [x] Rota `/invite/[token]` — aceitar convite e ativar membership
- [x] Permissões: apenas `admin` pode convidar e remover membros
- [x] Variáveis: `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`

**Commit final:**
```
feat: multi-empresa — criar workspace, convidar membros via Resend e alternar workspaces
```

---

## FASE 4 — Conectar Frontend ao Backend

---

### M9 — Leads Real

**Branch:** `feat/leads-backend`

**Objetivo:** Substituir mock data de leads por dados reais do Supabase, com CRUD completo.

**Entregas:**
- [x] Server Component em `/leads` fazendo `select` na tabela `leads` com filtro por `workspace_id`
- [x] Server Action `createLead` — insere lead e revalida cache
- [x] Server Action `updateLead` — atualiza campos e revalida
- [x] Server Action `deleteLead` — remove lead do workspace
- [x] Busca e filtros conectados como search params na URL (`?q=&status=&owner=`)
- [x] Tela `/leads/[id]` carregando dados reais do lead pelo `id`
- [x] Tipos migrados de `src/lib/mock/leads.ts` para `src/types/leads.ts`

**Commit final:**
```
feat: leads conectados ao Supabase — CRUD completo, busca e filtros reais
```

---

### M10 — Pipeline Kanban Real

**Branch:** `feat/pipeline-backend`

**Objetivo:** Drag-and-drop persiste mudança de stage no banco. Deals são criados e editados via Server Actions.

**Entregas:**
- [x] Server Component em `/pipeline` carregando deals agrupados por `stage`
- [x] Server Action `moveDeal` — atualiza campo `stage` ao soltar o card na nova coluna
- [x] Server Action `createDeal` — insere deal com lead vinculado
- [x] Server Action `updateDeal` — editar dados do deal no sheet lateral
- [x] Otimistic update no drag-and-drop (UI atualiza imediatamente, persiste via moveDeal)
- [x] `DealDetailSheet` com modo de edição inline (título, valor, etapa, lead, prazo)

**Commit final:**
```
feat: pipeline kanban conectado ao Supabase — drag-and-drop persistido e CRUD de deals
```

---

### M11 — Registro de Atividades

**Branch:** `feat/activities-backend`

**Objetivo:** Timeline de atividades no detalhe do lead funcionando com dados reais.

**Entregas:**
- [x] Componente `ActivityTimeline` em `/leads/[id]` listando atividades em ordem cronológica decrescente
- [x] Componente `ActivityItem` — ícone por tipo (ligação, e-mail, reunião, nota), autor, data relativa
- [x] Formulário inline "Registrar atividade" — tipo (select), descrição (textarea)
- [x] Server Action `createActivity` — insere na tabela `activities`
- [x] Server Action `deleteActivity` — apenas o autor pode excluir (admin também)
- [ ] Skeleton loading enquanto carrega a timeline

**Commit final:**
```
feat: registro de atividades — timeline cronológica e formulário inline no detalhe do lead
```

---

### M12 — Dashboard Real

**Branch:** `feat/dashboard-backend`

**Objetivo:** Todos os cards e gráficos do dashboard usando dados calculados no banco.

**Entregas:**
- [x] Query agregada para Total de Leads (`count` na tabela `leads`)
- [x] Query para Negócios Abertos (`count` com stage fora de fechado_ganho/perdido)
- [x] Query para Valor do Pipeline (`sum(value)` nos deals abertos)
- [x] Cálculo de Taxa de Conversão (`deals ganhos / total de deals × 100`)
- [x] Query para dados do gráfico de funil (contagem por stage)
- [x] Query para Deals com Prazo Próximo (ordenado por `due_date`, top 5)
- [x] Filtro de período funcionando via search params na URL (`?period=week|month|quarter`)

**Commit final:**
```
feat: dashboard conectado ao Supabase — métricas reais, funil e deals próximos
```

---

## FASE 5 — Monetização e E-mail

---

### M13 — Stripe (Assinaturas)

**Branch:** `feat/stripe`

**Objetivo:** Planos Free e Pro funcionando com Stripe Checkout. Workspace bloqueado automaticamente quando limite do Free é atingido.

**Entregas:**
- [ ] Instalar `stripe` e `@stripe/stripe-js`
- [ ] Criar produto e preço no Stripe Dashboard (R$49/mês, recorrente)
- [ ] Server Action `createCheckoutSession` — redireciona para Stripe Checkout
- [ ] Rota `/api/stripe/webhook` — recebe eventos `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Supabase Edge Function `stripe-webhook` ou Route Handler no Next.js para processar webhook e atualizar tabela `subscriptions`
- [ ] Middleware de limite do Free: bloquear criação de lead se `count >= 50` ou membro se `count >= 2`
- [ ] Componente `UpgradeBanner` exibido quando limite está próximo
- [ ] Server Action `createPortalSession` — link para Stripe Customer Portal
- [ ] Tela `/settings/billing` — plano atual, botão upgrade e link para portal
- [ ] Variáveis: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Commit final:**
```
feat: monetização com Stripe — checkout, webhook, planos e limites do Free
```

---

### M14 — E-mails Transacionais (Resend)

**Branch:** `feat/emails`

**Objetivo:** Todos os e-mails do produto enviados via Resend com templates HTML.

**Entregas:**
- [ ] Template `invite-email.tsx` — convite para workspace (nome do convidante, link de aceite)
- [ ] Template `welcome-email.tsx` — boas-vindas após cadastro
- [ ] Template `deal-reminder-email.tsx` — lembrete de deal com prazo próximo (opcional, futuro)
- [ ] Função `sendEmail` utilitária em `src/lib/resend/send-email.ts`
- [ ] Integrar envio de welcome email no fluxo de `signUp`
- [ ] Testar todos os templates no Resend dashboard

**Commit final:**
```
feat: e-mails transacionais via Resend — convite, boas-vindas e templates HTML
```

---

## FASE 6 — Produto Completo

---

### M15 — Landing Page

**Branch:** `feat/landing-page`

**Objetivo:** Página pública de apresentação do FlowSet CRM em `/`, otimizada para conversão.

**Entregas:**
- [ ] Layout `src/app/(marketing)/layout.tsx` — navbar pública com logo e CTA
- [ ] Seção **Hero** — headline, subtítulo, CTA "Comece grátis", screenshot do app (mock ou real)
- [ ] Seção **Funcionalidades** — 6 cards com ícone, título e descrição (Leads, Kanban, Dashboard, Multi-empresa, Atividades, Planos)
- [ ] Seção **Como funciona** — 3 passos (Crie seu workspace → Adicione leads → Feche negócios)
- [ ] Seção **Preços** — 2 cards (Free e Pro) com lista de features e CTA de cada plano
- [ ] Seção **CTA Final** — headline + botão "Criar conta grátis"
- [ ] Footer simples com links
- [ ] SEO básico: `metadata` com título, descrição e OG tags em `layout.tsx`

**Commit final:**
```
feat: landing page — hero, funcionalidades, preços e CTA
```

---

### M16 — Onboarding do Usuário

**Branch:** `feat/onboarding`

**Objetivo:** Fluxo guiado para novos usuários que acabaram de se cadastrar, reduzindo o time-to-value.

**Entregas:**
- [ ] Detectar primeiro acesso (sem workspace criado) e redirecionar para `/onboarding`
- [ ] Step 1 — "Crie seu workspace" (nome da empresa + slug)
- [ ] Step 2 — "Convide seu time" (campo de e-mail opcional, com opção "Fazer sozinho por agora")
- [ ] Step 3 — "Crie seu primeiro lead" (formulário simplificado)
- [ ] Step 4 — "Adicione ao pipeline" (criar primeiro deal e movê-lo para "Contato Realizado")
- [ ] Indicador de progresso visual (stepper no topo)
- [ ] Botão "Pular" em cada etapa após Step 1
- [ ] Redirecionar para `/dashboard` ao concluir

**Commit final:**
```
feat: onboarding — fluxo guiado de 4 etapas para novos usuários
```

---

### M17 — Deploy e Produção

**Branch:** `feat/deploy`

**Objetivo:** Aplicação em produção, estável, com todas as variáveis de ambiente configuradas e CI básico.

**Entregas:**
- [ ] Criar projeto no Vercel e conectar ao repositório GitHub
- [ ] Configurar todas as variáveis de ambiente no Vercel (Supabase, Stripe, Resend)
- [ ] Criar projeto Supabase de produção separado do desenvolvimento
- [ ] Aplicar todas as migrations no banco de produção
- [ ] Configurar webhook do Stripe apontando para a URL de produção
- [ ] Habilitar confirmação de e-mail no Supabase Auth (produção)
- [ ] Teste end-to-end manual: cadastro → criar workspace → criar lead → criar deal → pipeline → upgrade → logout
- [ ] Configurar domínio customizado no Vercel (se disponível)
- [ ] Verificar `npm run build` sem erros ou warnings críticos
- [ ] Criar `main` branch como branch de produção protegida

**Commit final:**
```
chore: configuração de produção — Vercel, Supabase prod, Stripe webhook e domínio
```

---

## Resumo de Branches

| Milestone | Branch | Fase |
|-----------|--------|------|
| M0 | `setup/project-base` | 1 — Fundação |
| M1 | `feat/design-system` | 1 — Fundação |
| M2 | `feat/auth-ui` | 2 — UI-First |
| M3 | `feat/leads-ui` | 2 — UI-First |
| M4 | `feat/pipeline-ui` | 2 — UI-First |
| M5 | `feat/dashboard-ui` | 2 — UI-First |
| M6 | `feat/supabase-auth` | 3 — Backend |
| M7 | `feat/database-schema` | 3 — Backend |
| M8 | `feat/multi-empresa` | 3 — Backend |
| M9 | `feat/leads-backend` | 4 — Conectar |
| M10 | `feat/pipeline-backend` | 4 — Conectar |
| M11 | `feat/activities-backend` | 4 — Conectar |
| M12 | `feat/dashboard-backend` | 4 — Conectar |
| M13 | `feat/stripe` | 5 — Monetização |
| M14 | `feat/emails` | 5 — Monetização |
| M15 | `feat/landing-page` | 6 — Produto |
| M16 | `feat/onboarding` | 6 — Produto |
| M17 | `feat/deploy` | 6 — Produto |
