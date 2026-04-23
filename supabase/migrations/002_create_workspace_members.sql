CREATE TABLE IF NOT EXISTS workspace_members (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id   uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id        uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  role           text        NOT NULL DEFAULT 'member',
  invited_email  text,
  status         text        NOT NULL DEFAULT 'active',
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workspace_members_role_check   CHECK (role   IN ('admin', 'member')),
  CONSTRAINT workspace_members_status_check CHECK (status IN ('active', 'pending')),
  UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members (workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id      ON workspace_members (user_id);
