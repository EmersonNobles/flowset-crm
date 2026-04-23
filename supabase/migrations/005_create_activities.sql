CREATE TABLE IF NOT EXISTS activities (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       uuid        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  workspace_id  uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  type          text        NOT NULL,
  description   text        NOT NULL,
  author_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT activities_type_check CHECK (
    type IN ('ligacao', 'email', 'reuniao', 'nota')
  )
);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id      ON activities (lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_workspace_id ON activities (workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_author_id    ON activities (author_id);
