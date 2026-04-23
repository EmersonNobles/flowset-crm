CREATE TABLE IF NOT EXISTS workspace_invites (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  invited_email text        NOT NULL,
  role          text        NOT NULL DEFAULT 'member',
  token         text        NOT NULL UNIQUE,
  invited_by    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at    timestamptz NOT NULL DEFAULT now() + interval '7 days',
  used_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workspace_invites_role_check CHECK (role IN ('admin', 'member'))
);

CREATE INDEX IF NOT EXISTS idx_workspace_invites_workspace_id ON workspace_invites (workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_token        ON workspace_invites (token);
