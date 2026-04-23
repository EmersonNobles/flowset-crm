CREATE TABLE IF NOT EXISTS deals (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid          NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id       uuid          REFERENCES leads(id) ON DELETE SET NULL,
  title         text          NOT NULL,
  value         numeric(12,2) NOT NULL DEFAULT 0,
  stage         text          NOT NULL DEFAULT 'novo_lead',
  owner_id      uuid          REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date      date,
  notes         text,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT deals_stage_check CHECK (
    stage IN (
      'novo_lead', 'contato_realizado', 'proposta_enviada',
      'negociacao', 'fechado_ganho', 'fechado_perdido'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_deals_workspace_id ON deals (workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id      ON deals (lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_owner_id     ON deals (owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage        ON deals (stage);
CREATE INDEX IF NOT EXISTS idx_deals_due_date     ON deals (due_date);
