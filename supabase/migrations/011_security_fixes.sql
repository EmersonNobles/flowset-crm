-- ================================================================
-- SECURITY FIXES — FlowSet CRM
-- ================================================================

-- A5: Adicionar SET search_path à função is_workspace_member
-- Impede schema poisoning via SECURITY DEFINER sem search_path fixo
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id      = auth.uid()
      AND status       = 'active'
  );
$$;

-- A6: Restringir INSERT em workspaces para forçar plan = 'free'
-- Impede usuários de criar workspaces com plan = 'pro' diretamente
DROP POLICY IF EXISTS "authenticated: insert workspace" ON workspaces;
CREATE POLICY "authenticated: insert workspace"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (plan = 'free');

-- A8: Adicionar WITH CHECK na UPDATE policy de workspace_members
-- Impede admin de mover membro para outro workspace
DROP POLICY IF EXISTS "admins: update workspace_members" ON workspace_members;
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
  )
  WITH CHECK (
    -- impede mudança de workspace_id (cross-tenant member hijacking)
    workspace_id = workspace_members.workspace_id
    AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role    = 'admin'
        AND wm.status  = 'active'
    )
  );
