# FlowSet CRM

Plataforma SaaS multi-empresa de gestão de clientes e vendas para PMEs, freelancers e times comerciais.

## Funcionalidades

- Pipeline Kanban com drag-and-drop
- Gestão de leads com busca e filtros
- Registro de atividades e timeline
- Dashboard de métricas
- Multi-empresa com convite por e-mail
- Assinatura via Stripe (plano Free e Pro)

## Stack

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript 5 (strict)
- **UI:** React 18 + Tailwind CSS + shadcn/ui
- **Auth + DB:** Supabase (PostgreSQL + RLS)
- **Pagamentos:** Stripe
- **E-mail:** Resend
- **Deploy:** Vercel + Supabase

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta no [Supabase](https://supabase.com) (ou Docker para rodar local)

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Preencha os valores no .env.local

# Rodar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Comandos úteis

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção
npm run lint      # verificar erros de lint
npm run format    # formatar código com Prettier

npx supabase start          # Supabase local (requer Docker)
npx supabase db push        # aplicar migrations no banco remoto
npx supabase gen types typescript --local > src/types/supabase.ts
```

## Variáveis de ambiente

Veja o arquivo [`.env.example`](.env.example) para a lista completa de variáveis necessárias.

## Estrutura do projeto

```
src/
  app/
    (auth)/       # login, cadastro, recuperar senha
    (app)/        # área autenticada (dashboard, leads, pipeline, settings)
    (marketing)/  # landing page pública
  components/
    ui/           # componentes shadcn/ui
    crm/          # componentes de domínio
  lib/            # supabase, stripe, resend, utils
  hooks/          # React hooks customizados
  types/          # tipos TypeScript globais
supabase/
  migrations/     # SQL migrations
  functions/      # Edge Functions
```

## Planos

| Plano | Membros | Leads | Preço |
|-------|---------|-------|-------|
| Free  | até 2   | até 50 | R$0 |
| Pro   | ilimitados | ilimitados | R$49/mês |
