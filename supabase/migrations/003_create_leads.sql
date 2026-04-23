CREATE TABLE IF NOT EXISTS leads (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          text        NOT NULL,
  email         text,
  phone         text,
  company       text,
  role          text,
  status        text        NOT NULL DEFAULT 'novo',
  owner_id      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_status_check CHECK (
    status IN ('novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido')
  )
);

CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON leads (workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id     ON leads (owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON leads (status);
