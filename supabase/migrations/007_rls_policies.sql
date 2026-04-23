-- ================================================================
-- RLS POLICIES — FlowSet CRM
-- Regra: usuário só acessa dados do workspace onde é membro ativo
-- ================================================================

-- Função auxiliar: verifica se o usuário autenticado é membro ativo
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id      = auth.uid()
      AND status       = 'active'
  );
$$;

-- ── workspaces ───────────────────────────────────────────────────
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members: select workspace"
  ON workspaces FOR SELECT
  USING (is_workspace_member(id));

CREATE POLICY "authenticated: insert workspace"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "admins: update workspace"
  ON workspaces FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
        AND role    = 'admin'
        AND status  = 'active'
    )
  );

CREATE POLICY "admins: delete workspace"
  ON workspaces FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
        AND role    = 'admin'
        AND status  = 'active'
    )
  );

-- ── workspace_members ────────────────────────────────────────────
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members: select workspace_members"
  ON workspace_members FOR SELECT
  USING (is_workspace_member(workspace_id));

-- Permite INSERT pelo próprio criador do workspace (bootstrap M8)
-- e por admins adicionando membros convidados
CREATE POLICY "admins or self: insert workspace_members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role    = 'admin'
        AND wm.status  = 'active'
    )
  );

CREATE POLICY "admins: update workspace_members"
  ON workspace_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role    = 'admin'
        AND wm.status  = 'active'
    )
  );

CREATE POLICY "admins or self: delete workspace_members"
  ON workspace_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role    = 'admin'
        AND wm.status  = 'active'
    )
  );

-- ── leads ────────────────────────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members: all on leads"
  ON leads FOR ALL
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

-- ── deals ────────────────────────────────────────────────────────
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members: all on deals"
  ON deals FOR ALL
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

-- ── activities ───────────────────────────────────────────────────
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members: all on activities"
  ON activities FOR ALL
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

-- ── subscriptions ────────────────────────────────────────────────
-- Apenas SELECT para membros; escrita exclusiva via service_role (Stripe webhook)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members: select subscription"
  ON subscriptions FOR SELECT
  USING (is_workspace_member(workspace_id));
