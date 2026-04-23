-- RLS para workspace_invites
-- Leitura e escrita restritas a admins do workspace.
-- O fluxo de aceite de convite usa service_role (admin client) para validar o token.

ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins: select workspace_invites"
  ON workspace_invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invites.workspace_id
        AND workspace_members.user_id      = auth.uid()
        AND workspace_members.role         = 'admin'
        AND workspace_members.status       = 'active'
    )
  );

CREATE POLICY "admins: insert workspace_invites"
  ON workspace_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invites.workspace_id
        AND workspace_members.user_id      = auth.uid()
        AND workspace_members.role         = 'admin'
        AND workspace_members.status       = 'active'
    )
  );

CREATE POLICY "admins: delete workspace_invites"
  ON workspace_invites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invites.workspace_id
        AND workspace_members.user_id      = auth.uid()
        AND workspace_members.role         = 'admin'
        AND workspace_members.status       = 'active'
    )
  );
