CREATE TABLE IF NOT EXISTS workspaces (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  plan        text        NOT NULL DEFAULT 'free',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workspaces_plan_check CHECK (plan IN ('free', 'pro'))
);

CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces (slug);
